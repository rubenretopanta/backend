import * as susuario from "../services/usuario.service.js";

export const create = async function(req, res) {
    console.log("------------controller usuario------------");
    try {
        const objUsuario = req.body;
        console.log(objUsuario);

        // Obtener rol del creador si viene de un admin autenticado
        const rolCreador = req.user?.rol || null;

        const nuevoUsuario = await susuario.create(objUsuario, rolCreador);
        res.json(nuevoUsuario);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};
