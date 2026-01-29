/**
 * API Route: Create User
 * POST /api/admin/users/create
 *
 * Solo accesible para administradores
 */
const {
  getDatabase,
} = require("../../../../src/infrastructure/database/sqlite");
const SQLiteUserRepository = require("../../../../src/infrastructure/repositories/SQLiteUserRepository");
const CreateUserUseCase = require("../../../../src/application/use-cases/users/CreateUserUseCase");
const { getSession } = require("../../../../src/shared/utils/cookies");

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  // Verificar autenticación y rol de admin
  const session = getSession(req);
  if (!session) {
    return res.status(401).json({
      success: false,
      error: "No autenticado",
    });
  }

  if (session.role !== "admin") {
    return res.status(403).json({
      success: false,
      error: "Acceso denegado. Se requiere rol de administrador",
    });
  }

  const { username, password, role } = req.body;

  // Validación básica
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      error: "Usuario y contraseña son requeridos",
    });
  }

  try {
    // Inyección de dependencias - Clean Architecture
    const db = getDatabase();
    const userRepository = new SQLiteUserRepository(db);
    const createUserUseCase = new CreateUserUseCase(userRepository);

    // Ejecutar caso de uso
    const result = createUserUseCase.execute({
      username,
      password,
      role: role || "user",
    });

    if (result.success) {
      return res.status(201).json({
        success: true,
        message: "Usuario creado exitosamente",
        user: result.user.toPublicJSON(),
      });
    }

    return res.status(400).json({
      success: false,
      error: result.error,
    });
  } catch (error) {
    console.error("[API /admin/users/create] Error:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
