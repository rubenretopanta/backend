import _express from "express";
import * as cusuario from "../controllers/usuario.controller.js";
import * as mauth from "../middleware/auth.middleware.js";

const router = _express.Router();

// Registro público (clientes)
router.post('/registro', mauth.authMiddleware([], true), cusuario.create);

// Crear usuario con token (solo admin)
router.post('/', mauth.authMiddleware(['admin']), cusuario.create);

export default router;
