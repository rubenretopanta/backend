import jwt from "jsonwebtoken";

/**
 * Middleware para autenticar y autorizar según roles.
 * @param {Array} rolesPermitidos - Ejemplo: ['admin'], ['cliente', 'admin'], o [] si es público.
 * @param {boolean} publico - Si es true, la ruta no requiere token.
 */
export const authMiddleware = (rolesPermitidos = [], publico = false) => {
  return (req, res, next) => {
    try {
      console.log("🛡️ --- Verificando acceso ---");
      console.log("🔹 Ruta:", req.originalUrl);
      console.log("🔹 Método:", req.method);

      // Si es ruta pública, no necesita token
      if (publico) {
        console.log("✅ Ruta pública, acceso permitido\n");
        return next();
      }

      const authHeader = req.headers.authorization;
      if (!authHeader) {
        console.log("❌ No se envió token\n");
        return res.status(401).json({ message: "Token no proporcionado" });
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.usuario = decoded;

      console.log("👤 Usuario autenticado:");
      console.log("   Email:", decoded.email);
      console.log("   Rol:", decoded.rol);

      // Si la ruta tiene restricciones de rol
      if (rolesPermitidos.length > 0 && !rolesPermitidos.includes(decoded.rol)) {
        console.log("⛔ Acceso denegado, rol no autorizado\n");
        return res.status(403).json({ message: "Acceso denegado: no tiene permisos suficientes" });
      }

      console.log("✅ Acceso autorizado\n");
      next();
    } catch (error) {
      console.error("❌ Error en autenticación:", error.message);
      return res.status(401).json({ message: "Token inválido o expirado" });
    }
  };
};
