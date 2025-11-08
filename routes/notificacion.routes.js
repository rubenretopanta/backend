import _express from "express";
import * as cnotificacion from "../controllers/notificacion.controller.js";
import * as mauth from "../middleware/auth.middleware.js";

const router = _express.Router();

// Cliente y admin pueden consultar sus propias notificaciones
router.get('/:id', mauth.authMiddleware(['cliente', 'admin']), cnotificacion.findByEmail);

// Admin puede ver el detalle de cualquier notificación
router.get('/detalle/:id', mauth.authMiddleware(['admin']), cnotificacion.findById);

// Solo admin puede crear notificaciones
router.post('/', mauth.authMiddleware(['admin']), cnotificacion.create);

// Solo admin puede marcar como leída
router.put('/leer/:id', mauth.authMiddleware(['admin']), cnotificacion.marcarComoLeida);

export default router;



