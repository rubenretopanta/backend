import _express from "express";
import notificacionRoutes from "./routes/notificacion.routes.js";
import seguridadRoutes from "./routes/seguridad.routes.js";
import usuarioRoutes from "./routes/usuario.routes.js";
import productoRoutes from "./routes/producto.routes.js"; // <- NUEVO

const router = _express.Router();

router.use("/notificaciones", notificacionRoutes);
router.use("/seguridad", seguridadRoutes);
router.use("/usuarios", usuarioRoutes);
router.use("/productos", productoRoutes); // <- NUEVO

export default router;

