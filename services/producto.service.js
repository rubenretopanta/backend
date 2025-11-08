import * as schemaProducto from "../schemas/producto.schema.js";

/**
 * Compara y genera diffs para historial.
 * Devuelve: { cambios:[{campo, anterior, nuevo}], imagenesAgregadas:[], imagenesEliminadas:[] }
 */
function generarDiffs(prodActual, payloadNormalizado) {
  const camposSimples = ["nombre", "unidad_medida", "precio", "stock"];
  const cambios = [];

  for (const campo of camposSimples) {
    const antes = prodActual[campo];
    const ahora = payloadNormalizado[campo];
    const cambio = (Array.isArray(antes) || Array.isArray(ahora))
      ? JSON.stringify(antes) !== JSON.stringify(ahora)
      : antes !== ahora;

    if (typeof ahora !== "undefined" && cambio) {
      cambios.push({ campo, anterior: antes, nuevo: ahora });
    }
  }

  // Categorías (array de objetos)
  if (typeof payloadNormalizado.categorias !== "undefined") {
    const antes = prodActual.categorias || [];
    const ahora = payloadNormalizado.categorias || [];
    if (JSON.stringify(antes) !== JSON.stringify(ahora)) {
      cambios.push({ campo: "categorias", anterior: antes, nuevo: ahora });
    }
  }

  // Imágenes (array de URLs)
  let imagenesAgregadas = [];
  let imagenesEliminadas = [];
  if (typeof payloadNormalizado.imagenes !== "undefined") {
    const antes = new Set((prodActual.imagenes || []).filter(Boolean));
    const ahora = new Set((payloadNormalizado.imagenes || []).filter(Boolean));

    imagenesAgregadas = [...ahora].filter(u => !antes.has(u));
    imagenesEliminadas = [...antes].filter(u => !ahora.has(u));

    // registrar cambio si hay diferencia global
    if (imagenesAgregadas.length > 0 || imagenesEliminadas.length > 0) {
      cambios.push({
        campo: "imagenes",
        anterior: [...antes],
        nuevo: [...ahora]
      });
    }
  }

  return { cambios, imagenesAgregadas, imagenesEliminadas };
}

/** Normaliza posibles payloads legacy: imagen1/imagen2 -> imagenes */
function normalizarPayloadImagenes(body) {
  const out = { ...body };
  if (Array.isArray(out.imagenes)) {
    out.imagenes = out.imagenes.filter(Boolean);
  } else {
    const posibles = [out.imagen1, out.imagen2].filter(Boolean);
    if (posibles.length > 0) out.imagenes = posibles;
  }
  return out;
}

export const list = async function() {
  return schemaProducto.findAll();
};

export const findById = async function(id) {
  const prod = await schemaProducto.findById(id);
  if (!prod) throw new Error("Producto no encontrado");
  return prod;
};

export const create = async function(objProducto, usuarioCtx) {
  const normalizado = normalizarPayloadImagenes(objProducto);
  const creado = await schemaProducto.create(normalizado);

  // Registrar historial de creación (opcional pero útil)
  const evento = {
    usuario: {
      id_persona: usuarioCtx?.id_persona || null,
      email: usuarioCtx?.email || "sistema",
      rol: usuarioCtx?.rol || "admin",
    },
    cambios: Object.entries({
      nombre: creado.nombre,
      unidad_medida: creado.unidad_medida,
      precio: creado.precio,
      stock: creado.stock,
      categorias: creado.categorias,
      imagenes: creado.imagenes
    }).map(([campo, valor]) => ({ campo, anterior: null, nuevo: valor })),
    imagenesAgregadas: (creado.imagenes || []),
    imagenesEliminadas: []
  };

  await schemaProducto.pushHistorial(creado._id, evento);
  return await schemaProducto.findById(creado._id);
};

export const update = async function(id, objProducto, usuarioCtx) {
  const actual = await schemaProducto.findById(id);
  if (!actual) throw new Error("Producto no encontrado");

  const normalizado = normalizarPayloadImagenes(objProducto);
  const { cambios, imagenesAgregadas, imagenesEliminadas } = generarDiffs(actual.toObject(), normalizado);

  // Si no hay cambios, devolver el actual
  if (cambios.length === 0) {
    return actual;
  }

  // Aplicar set de campos (evita escribir campos no enviados)
  const setObj = {};
  for (const c of cambios) {
    // si el campo es "imagenes" el nuevo valor viene en normalizado.imagenes
    if (c.campo === "imagenes") setObj.imagenes = normalizado.imagenes || [];
    else setObj[c.campo] = c.nuevo;
  }

  const actualizado = await schemaProducto.updateCore(id, setObj);

  // Registrar historial
  const evento = {
    usuario: {
      id_persona: usuarioCtx?.id_persona || null,
      email: usuarioCtx?.email || "sistema",
      rol: usuarioCtx?.rol || "admin",
    },
    cambios,
    imagenesAgregadas,
    imagenesEliminadas
  };
  await schemaProducto.pushHistorial(id, evento);

  return await schemaProducto.findById(id);
};

export const getHistorial = async function(id) {
  const prod = await schemaProducto.findById(id);
  if (!prod) throw new Error("Producto no encontrado");
  // ordenar historial descendente por fecha (más reciente primero)
  const h = [...(prod.historial || [])].sort((a,b)=> new Date(b.fecha)-new Date(a.fecha));
  return h;
};
