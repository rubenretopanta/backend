import * as sproducto from "../services/producto.service.js";

/**
 * Notas:
 * - Se apoya en `req.usuario` que llena tu auth.middleware (email, rol, id_persona).
 * - Roles: admin crea/actualiza; público/cliente consulta.
 */

export const list = async function(req, res){
  try {
    const data = await sproducto.list();
    res.json(data || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error listando productos" });
  }
};

export const findById = async function(req, res){
  try {
    const data = await sproducto.findById(req.params.id);
    res.json(data || {});
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: err.message || "Producto no encontrado" });
  }
};

export const create = async function(req, res){
  try {
    const usuarioCtx = req.usuario || null; // desde middleware
    const data = await sproducto.create(req.body, usuarioCtx);
    res.json(data || {});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Error creando producto" });
  }
};

export const update = async function(req, res){
  try {
    const usuarioCtx = req.usuario || null;
    const data = await sproducto.update(req.params.id, req.body, usuarioCtx);
    res.json(data || {});
  } catch (err) {
    console.error(err);
    const code = /no encontrado/i.test(err.message) ? 404 : 500;
    res.status(code).json({ error: err.message || "Error actualizando producto" });
  }
};

export const historial = async function(req, res){
  try {
    const data = await sproducto.getHistorial(req.params.id);
    res.json(data || []);
  } catch (err) {
    console.error(err);
    const code = /no encontrado/i.test(err.message) ? 404 : 500;
    res.status(code).json({ error: err.message || "Error obteniendo el historial" });
  }
};
