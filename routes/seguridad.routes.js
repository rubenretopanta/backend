// routes/seguridad.routes.js
import _express from "express";
import * as cseguridad from "../controllers/seguridad.controller.js";

const router = _express.Router();

router.post('/login', cseguridad.login);
router.post('/refresh-token', cseguridad.refreshToken);

export default router;
