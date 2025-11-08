import { Persona } from "../schemas/persona.schema.js";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

/**
 * Crear usuario
 * @param {Object} objUsuario - Datos del usuario a crear
 * @param {String} rolCreador - Rol de quien crea el usuario ('admin' o null para registro público)
 */
export const create = async function(objUsuario, rolCreador = null) {
    console.log("------------service usuario------------");

    // Validaciones básicas
    const existeEmail = await Persona.findOne({ "usuario.email": objUsuario.usuario.email });
    if (existeEmail) throw new Error("El email ya está registrado");

    const existeDoc = await Persona.findOne({ nro_documento: objUsuario.nro_documento });
    if (existeDoc) throw new Error("El número de documento ya está registrado");

    // Si la creación es pública, obligar rol 'cliente'
    if (rolCreador !== 'admin') {
        objUsuario.usuario.rol = 'cliente';
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(objUsuario.usuario.password, SALT_ROUNDS);
    objUsuario.usuario.password = hashedPassword;

    // Crear usuario
    const nuevoUsuario = await Persona.create(objUsuario);

    // Retornar solo datos necesarios (sin contraseña)
    return {
        id_persona: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        apellido: nuevoUsuario.apellido,
        nro_documento: nuevoUsuario.nro_documento,
        edad: nuevoUsuario.edad,
        tipo_documento: nuevoUsuario.tipo_documento,
        usuario: {
            email: nuevoUsuario.usuario.email,
            rol: nuevoUsuario.usuario.rol
        },
        fecha_registro: nuevoUsuario.fecha_registro
    };
};
