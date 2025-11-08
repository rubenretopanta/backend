import { Persona } from "../schemas/persona.schema.js";
import bcrypt from "bcrypt";

export const login = async function (objUsuario) {
    console.log("------------service------------");

    // Buscar usuario por email
    const usuario = await Persona.findOne({ "usuario.email": objUsuario.email }).lean();

    if (!usuario) {
        throw new Error("Usuario no encontrado");
    }

    // Validar contraseña usando bcrypt
    const passwordValida = await bcrypt.compare(objUsuario.password, usuario.usuario.password);
    if (!passwordValida) {
        throw new Error("Credenciales inválidas");
    }

    // Retornar datos esenciales del usuario
    return {
        id_persona: usuario._id,
        email: usuario.usuario.email,
        rol: usuario.usuario.rol // puede ser "admin" o "cliente"
    };
};


