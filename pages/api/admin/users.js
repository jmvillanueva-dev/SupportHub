/**
 * API Route: Admin - Get All Users
 * GET /api/admin/users
 *
 * ⚠️ [VULNERABLE - SENSITIVE DATA EXPOSURE]
 * Esta ruta "olvidada" expone todos los usuarios con contraseñas
 */
const { getDatabase } = require("../../../src/infrastructure/database/sqlite");
const SQLiteUserRepository = require("../../../src/infrastructure/repositories/SQLiteUserRepository");
const GetAllUsersUseCase = require("../../../src/application/use-cases/admin/GetAllUsersUseCase");

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // ⚠️ VULNERABLE: No hay verificación de autenticación
  // El desarrollador "olvidó" agregar el middleware de auth
  // TODO: Agregar verificación de admin antes de producción

  try {
    const db = getDatabase();
    const userRepository = new SQLiteUserRepository(db);
    const getAllUsersUseCase = new GetAllUsersUseCase(userRepository);

    const result = getAllUsersUseCase.execute();

    if (result.success) {
      // ⚠️ VULNERABLE: Devuelve passwords en texto plano
      return res.status(200).json({
        success: true,
        message: "Debug endpoint - Remove before production!",
        users: result.users,
        _debug: result._debug,
      });
    }

    return res.status(500).json({
      success: false,
      error: result.error,
    });
  } catch (error) {
    console.error("[API /admin/users] Error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}
