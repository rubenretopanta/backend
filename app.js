import _express from "express";
import _bodyParser from "body-parser";
import _cors from "./config/cors.js";

import PUERTO from "./utils/constantes.js";
import api from "./routes.js";

import { configSocket } from "./utils/socket.js";

const app = _express();

// Middlewares
app.use(_bodyParser.json());
app.use(
  _bodyParser.urlencoded({
    extended: true,
    type: "application/x-www-form-urlencoded",
  })
);
app.use(_cors);

// ✅ Ruta raíz para indicar que el servidor está activo
app.get("/", (req, res) => {
res.send("Servidor funcionando con GitHub Actions v4🚀");
});

// ✅ Rutas API
app.use("/api/v1", api);

// ✅ Servidor
const server = app.listen(PUERTO, () => {
  console.log("✅ Servidor escuchando en el puerto " + PUERTO);
});

// ✅ Socket
configSocket(server);

