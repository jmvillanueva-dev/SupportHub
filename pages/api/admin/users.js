/**
 * API Route: Admin - Get All Users
 * GET /api/admin/users
 *
 * ✅ [SEGURO - CONTROL DE ACCESO + FILTRADO DE DATOS]
 * - Requiere autenticación válida
 * - Requiere rol de administrador
 * - Solo devuelve datos públicos (sin contraseñas)
 */
const { getDatabase } = require("../../../src/infrastructure/database/sqlite");
const SQLiteUserRepository = require("../../../src/infrastructure/repositories/SQLiteUserRepository");
const GetAllUsersUseCase = require("../../../src/application/use-cases/admin/GetAllUsersUseCase");
const { getSession } = require("../../../src/shared/utils/cookies");

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  // ✅ SEGURO: Verificación de autenticación
  const session = getSession(req);
  if (!session) {
    return res.status(401).json({
      success: false,
      error: "No autenticado. Debe iniciar sesión.",
    });
  }

  // ✅ SEGURO: Verificación de rol de administrador
  if (session.role !== "admin") {
    return res.status(403).json({
      success: false,
      error: "Acceso denegado. Se requiere rol de administrador.",
    });
  }

  try {
    const db = getDatabase();
    const userRepository = new SQLiteUserRepository(db);
    const getAllUsersUseCase = new GetAllUsersUseCase(userRepository);

    const result = getAllUsersUseCase.execute();

    if (result.success) {
      // ✅ SEGURO: Solo devuelve datos públicos, sin información de debug
      return res.status(200).json({
        success: true,
        users: result.users,
      });
    }

    return res.status(500).json({
      success: false,
      error: "Error al obtener usuarios",
    });
  } catch (error) {
    console.error("[API /admin/users] Error:", error);
    // ✅ SEGURO: Mensaje genérico sin detalles técnicos
    return res.status(500).json({
      success: false,
      error: "Error interno del servidor",
    });
  }
}
