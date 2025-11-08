// controllers/seguridad.controller.js

import * as sseguridad from "../services/seguridad.service.js";
import { generateToken, generateRefreshToken } from "../config/auth.js";

export const login = async function (req, res) {
    try {
        const usuario = await sseguridad.login(req.body);

        // Generar tokens solo si pasó validación de rol admin
        const token = generateToken(usuario);
        const refreshToken = generateRefreshToken(usuario);

        res.json({
            mensaje: "Login exitoso",
            token,
            refreshToken,
            usuario
        });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};

export const refreshToken = async function(req, res) {
    console.log("------------controller: refreshToken------------");
    const { token } = req.body;

    try {
        const payload = verifyRefreshToken(token);
        const persona = await sseguridad.findById(payload.id_persona);

        if (!persona) {
            return res.status(401).json({ error: "Usuario no encontrado" });
        }

        const newToken = generateToken({
            id_persona: persona._id,
            email: persona.usuario.email,
            rol: persona.usuario.rol
        });

        res.json({ token: newToken });
    } catch (error) {
        console.error(error);
        res.status(401).json({ error: "Refresh token inválido o expirado" });
    }
};
