import odm from "../config/mongoose.js";

/**
 * Modelo Producto con historial de cambios.
 * Las imágenes actuales se almacenan en `imagenes` (array de URLs).
 * El historial conserva imágenes agregadas/eliminadas y diffs de campos.
 */
const categoriaSchema = new odm.Schema({
  id_categoria: { type: odm.Schema.Types.Mixed, required: true }, // admite Number o String
  nombre: { type: String, required: true },
}, { _id: false });

const cambioSchema = new odm.Schema({
  campo: { type: String, required: true },
  anterior: { type: odm.Schema.Types.Mixed, required: true },
  nuevo: { type: odm.Schema.Types.Mixed, required: true },
}, { _id: false });

const historialSchema = new odm.Schema({
  fecha: { type: Date, default: Date.now },
  usuario: {
    id_persona: { type: odm.Schema.Types.ObjectId, ref: "persona", required: true },
    email: { type: String, required: true },
    rol: { type: String, required: true },
  },
  cambios: { type: [cambioSchema], default: [] },
  imagenesAgregadas: { type: [String], default: [] },  // URLs nuevas
  imagenesEliminadas: { type: [String], default: [] }, // URLs que salieron del array actual
}, { _id: false });

const productoSchema = new odm.Schema({
  nombre: { type: String, required: true, trim: true },
  unidad_medida: { type: String, required: true, trim: true },
  precio: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0 },
  categorias: { type: [categoriaSchema], default: [] },
  // Estado actual de imágenes (solo URLs)
  imagenes: { type: [String], default: [] },

  // Compatibilidad "legacy": opcionalmente admitir imagen1/imagen2 a nivel de dato entrante
  imagen1: { type: String },
  imagen2: { type: String },

  fecha_registro: { type: Date, default: Date.now },

  // Historial de cambios
  historial: { type: [historialSchema], default: [] },
}, { collection: "producto", versionKey: "version" });

/**
 * Normaliza imagen1/imagen2 -> imagenes, si vienen en payloads antiguos.
 * (Solo aplica al crear; en updates lo hace el service).
 */
productoSchema.pre("save", function(next){
  if ((!this.imagenes || this.imagenes.length === 0) && (this.imagen1 || this.imagen2)) {
    this.imagenes = [this.imagen1, this.imagen2].filter(Boolean);
  }
  return next();
});

export const Producto = odm.model("producto", productoSchema);

// Helpers CRUD de bajo nivel (similares a notificación)
export const findAll = async function() {
  return Producto.find({}).sort({ fecha_registro: -1 });
}

export const findById = async function(id) {
  return Producto.findById(id);
}

export const create = async function(obj) {
  const prod = await Producto.create(obj);
  return prod;
}

export const updateCore = async function(id, setObj) {
  // findByIdAndUpdate NO ejecuta pre('save'), por eso el service normaliza antes
  return Producto.findByIdAndUpdate(id, { $set: setObj }, { new: true });
}

export const pushHistorial = async function(id, eventoHistorial) {
  return Producto.findByIdAndUpdate(
    id,
    { $push: { historial: eventoHistorial } },
    { new: true }
  );
}
