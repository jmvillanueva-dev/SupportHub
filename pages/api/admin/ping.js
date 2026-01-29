/**
 * API Route: Admin - Ping Tool
 * POST /api/admin/ping
 *
 * ⚠️ [VULNERABLE - OS COMMAND INJECTION]
 * Ejecuta comandos del sistema sin sanitizar input
 */
const CommandService = require("../../../src/infrastructure/services/CommandService");
const PingServerUseCase = require("../../../src/application/use-cases/admin/PingServerUseCase");
const {
  isAuthenticated,
  isAdmin,
} = require("../../../src/shared/utils/cookies");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Verificar autenticación (pero confía en la cookie manipulable)
  if (!isAuthenticated(req)) {
    return res.status(401).json({
      success: false,
      error: "Authentication required",
    });
  }

  // ⚠️ VULNERABLE: isAdmin() solo verifica la cookie que el usuario puede modificar
  // Cambiar cookie de "2:user" a "2:admin" bypassea esta verificación
  if (!isAdmin(req)) {
    return res.status(403).json({
      success: false,
      error: "Admin access required",
    });
  }

  const { ip } = req.body;

  if (!ip) {
    return res.status(400).json({
      success: false,
      error: "IP address is required",
    });
  }

  try {
    const commandService = new CommandService();
    const pingUseCase = new PingServerUseCase(commandService);

    // ⚠️ VULNERABLE - COMMAND INJECTION
    // El input se pasa directamente sin validación
    // Payloads: "8.8.8.8; cat /etc/passwd" o "8.8.8.8 & whoami"
    const result = await pingUseCase.execute(ip);

    return res.status(200).json({
      success: result.success,
      output: result.output,
      command: result.command, // Revela el comando ejecutado
      message: result.success ? "Ping successful" : "Ping failed",
    });
  } catch (error) {
    console.error("[API /admin/ping] Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
