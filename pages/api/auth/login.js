/**
 * API Route: Login
 * POST /api/auth/login
 *
 * ⚠️ [VULNERABLE - SQL INJECTION]
 */
const { getDatabase } = require("../../../src/infrastructure/database/sqlite");
const SQLiteUserRepository = require("../../../src/infrastructure/repositories/SQLiteUserRepository");
const LoginUseCase = require("../../../src/application/use-cases/auth/LoginUseCase");
const { setSession } = require("../../../src/shared/utils/cookies");

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username, password } = req.body;

  // Validación básica
  if (!username || !password) {
    return res.status(400).json({
      error: "Usuario y contraseña son requeridos",
    });
  }

  try {
    // Inyección de dependencias - Clean Architecture
    const db = getDatabase();
    const userRepository = new SQLiteUserRepository(db);
    const loginUseCase = new LoginUseCase(userRepository);

    // Ejecutar caso de uso (vulnerable a SQL Injection)
    const result = loginUseCase.execute(username, password);

    if (result.success) {
      // Crear sesión (cookie en texto plano - vulnerable)
      setSession(res, result.user.id, result.user.role);

      return res.status(200).json({
        success: true,
        message: "Inicio de sesión exitoso",
        user: result.user.toPublicJSON(),
      });
    }

    return res.status(401).json({
      success: false,
      error: result.error,
    });
  } catch (error) {
    console.error("[API /auth/login] Error:", error);

    // ⚠️ VULNERABLE: Devolver error detallado ayuda a error-based SQLi
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
