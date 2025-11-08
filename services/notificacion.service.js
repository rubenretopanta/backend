import * as schemaNotificacion from "../schemas/notificacion.schema.js";
import {getIO} from "../utils/socket.js";

export const findAll = async function() {
    console.log("------------service------------");
    let results= await schemaNotificacion.findAll();
    console.log("luego del modelo");
    console.log(results);
    return results;
};

export const findByEmail = async function(email) {
    console.log("------------service------------");
    let results= await schemaNotificacion.findByEmail(email);
    return results;
};

export const create = async function(objNotificacion) {
    console.log("------------service------------");
    let results= await schemaNotificacion.create(objNotificacion);

    const io=getIO();
    io.to(objNotificacion.email).emit("nuevaNotificacion", results);

    return results;
};

export const leer = async function(id_notificacion) {
    console.log("------------service------------");
    await schemaNotificacion.leer(id_notificacion);
    let results= await schemaNotificacion.findById(id_notificacion);
    return results;
};

export const findById = async function (id_notificacion) {
    console.log("------------service findById------------");
    const result = await schemaNotificacion.findById(id_notificacion);
    return result;
};