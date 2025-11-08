import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { Persona } from "./schemas/persona.schema.js";
import dotenv from "dotenv";

dotenv.config();

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch(err => console.error("❌ Error conectando a MongoDB:", err));

const actualizarPassword = async () => {
  try {
    // 🔐 Nueva contraseña (la que usarás para iniciar sesión)
    const nuevaPassword = "12345";

    // Generar hash con bcrypt
    const passwordEncriptado = await bcrypt.hash(nuevaPassword, 10);

    // Actualizar en base de datos
    const result = await Persona.updateOne(
      { "usuario.email": "rene@example.com" },
      { $set: { "usuario.password": passwordEncriptado } }
    );

    if (result.modifiedCount > 0) {
      console.log("✅ Contraseña encriptada actualizada correctamente");
    } else {
      console.log("⚠️ No se encontró el usuario o no se actualizó nada");
    }
  } catch (err) {
    console.error("❌ Error al actualizar:", err.message);
  } finally {
    mongoose.connection.close();
  }
};

actualizarPassword();
