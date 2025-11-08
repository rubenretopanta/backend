import { Server } from "socket.io";
import {FRONTEND_URL} from "./constantes.js";

let io;

export const configSocket= function(server){
  console.log("io.configSocket");
  io = new Server(server, {
    cors: { origin: FRONTEND_URL }  // Permite conexiones desde cualquier origen (ajusta en producción)
  });

  io.on("connection", (socket) => {
    console.log("Usuario conectado al socket: ", socket.id);
    // Escuchar evento para matricular un usuario específico
    socket.on("matriculado", (usuario) => {
      socket.join(usuario);  // Establecer el tunel
      console.log(`Usuario ${usuario} matriculado`);
    });
    socket.on("disconnect", () => {
      console.log("Usuario desconectado del socket: ", socket.id);
    });

    socket.on("tresenraya", (datoJuego) => {
      console.log("tresenraya", datoJuego);
      io.emit("notificacion", datoJuego);
    });

  });

  // Exportar io para usarlo en otras partes (ej: enviar notificaciones)
  return io;
};

export const getIO= function(){
  if(!io){
    throw new Error("Socket.io no inicializado");
  }
  return io;
}
