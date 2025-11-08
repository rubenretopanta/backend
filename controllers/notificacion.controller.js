    import * as snotificacion from "../services/notificacion.service.js";
import * as auth from "../config/auth.js";

export const findByEmail = async function(req, res) {
    console.log("------------controller------------");
   
    try{
        const email= req.params.id;
        console.log(email);
        const notificaciones = await snotificacion.findByEmail(email);
        res.json(notificaciones || []);
    }catch(error){
        console.log(error);
        res.status(500).json({"error":"Error obteniendo registros"});
    }
}

export const create = async function(req, res) {
    console.log("------------controller------------");
   
    try{
        const objNotificacion= req.body;
        console.log(objNotificacion);
        const notificaciones = await snotificacion.create(objNotificacion);
        res.json(notificaciones || {});
    }catch(error){
        console.log(error);
        res.status(500).json({"error":"Error ingresando registros"});
    }
}

export const marcarComoLeida = async function (req, res) {
    console.log("------------controller leer------------");

    try {
        const id_notificacion = req.params.id; // se recibe como /leer/:id
        console.log("ID de notificación:", id_notificacion);

        // Obtenemos la notificación
        const notificacion = await snotificacion.leer(id_notificacion);

        if (!notificacion || notificacion.length === 0) {
            return res.status(404).json({ error: "Notificación no encontrada" });
        }

        // Si existe, simplemente retornamos su estado actual (no modificamos la DB)
        return res.json({
            mensaje: "Consulta de lectura realizada correctamente",
            notificacion
        });
    } catch (error) {
        console.error("Error en marcarComoLeida:", error);
        return res.status(500).json({ error: "Error al consultar la lectura" });
    }
};

export const findById = async function (req, res) {
    console.log("------------controller findById------------");
    try {
        const id = req.params.id;
        console.log("Buscando notificación con ID:", id);

        const notificacion = await snotificacion.findById(id);

        if (!notificacion) {
            return res.status(404).json({ error: "Notificación no encontrada" });
        }

        return res.json(notificacion);
    } catch (error) {
        console.error("Error en findById:", error);
        return res.status(500).json({ error: "Error consultando la notificación" });
    }
};




/*
export const update = async function(req, res) {
    console.log("------------controller------------");
   
    try{
        const id_persona= req.params.id;
        const objUsuario= req.body;
        console.log(id_persona);
        console.log(objUsuario);
        const usuarios = await snotificacion.update(id_persona, objUsuario);
        res.json(usuarios || {});
    }catch(error){
        console.log(error);
        res.status(500).json({"error":"Error ingresando registros"});
    }
}

export const findEdadPromedio = async function(req, res) {
    console.log("------------controller------------");
    try{
        const edadMinima= req.body.edadMinima;
        console.log(edadMinima);
        const usuarios = await snotificacion.findEdadPromedio(edadMinima);
        res.json(usuarios || []);
    }catch(error){
        console.log(error);
        res.status(500).json({"error":"Error obteniendo registros"});
    }
}
*/
