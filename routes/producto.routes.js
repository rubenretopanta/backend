import _express from "express";
import * as cproducto from "../controllers/producto.controller.js";
import * as mauth from "../middleware/auth.middleware.js";

const router = _express.Router();

/**
 * Rutas:
 * - GET /productos (público)
 * - GET /productos/:id (público)
 * - GET /productos/:id/historial (cliente/admin) -> sensible, pero visible para ambos
 * - POST /productos (solo admin)
 * - PUT /productos/:id (solo admin)
 */

// Públicas (no requieren token)
router.get("/", mauth.authMiddleware([], true), cproducto.list);
router.get("/:id", mauth.authMiddleware([], true), cproducto.findById);

// Historial (requiere estar autenticado como cliente o admin)
router.get("/:id/historial", mauth.authMiddleware(["cliente", "admin"]), cproducto.historial);

// Crear/Actualizar (solo admin)
router.post("/", mauth.authMiddleware(["admin"]), cproducto.create);
router.put("/:id", mauth.authMiddleware(["admin"]), cproducto.update);

export default router;
