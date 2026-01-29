/**
 * CommandService - Capa de Infraestructura
 * Servicio para ejecutar comandos del sistema operativo
 *
 * ⚠️ [VULNERABLE - COMMAND INJECTION]
 * Este servicio NO sanitiza los inputs antes de ejecutar comandos
 */
const { exec } = require("child_process");
const { promisify } = require("util");

const execAsync = promisify(exec);

class CommandService {
  /**
   * Ejecuta un ping a una dirección IP
   *
   * ⚠️ [VULNERABLE - OS COMMAND INJECTION]
   * El parámetro ip se concatena directamente al comando
   * Payload de ejemplo: 8.8.8.8; cat /etc/passwd
   * En Windows: 8.8.8.8 & type C:\Windows\System32\drivers\etc\hosts
   *
   * @param {string} ip - Dirección IP a verificar
   * @returns {Promise<{success: boolean, output: string}>}
   */
  async ping(ip) {
    // Detectar sistema operativo para usar el comando correcto
    const isWindows = process.platform === "win32";

    // ⚠️ VULNERABLE: Concatenación directa del input del usuario
    // En producción NUNCA hacer esto - usar validación estricta de IP
    const command = isWindows
      ? `ping -n 2 ${ip}` // Windows: 8.8.8.8 & whoami
      : `ping -c 2 ${ip}`; // Linux: 8.8.8.8; whoami

    console.log("[CommandService] Ejecutando comando:", command);

    try {
      const { stdout, stderr } = await execAsync(command, {
        timeout: 10000, // 10 segundos timeout
        maxBuffer: 1024 * 1024, // 1MB buffer
      });

      return {
        success: true,
        output: stdout || stderr,
        command: command, // Devolver el comando ejecutado (info adicional para el atacante)
      };
    } catch (error) {
      return {
        success: false,
        output: error.message,
        stderr: error.stderr,
        command: command,
      };
    }
  }

  /**
   * Ejecuta un comando arbitrario (MUY PELIGROSO)
   * Esta función existe "por error del desarrollador"
   *
   * @param {string} cmd - Comando a ejecutar
   * @returns {Promise<{success: boolean, output: string}>}
   */
  async executeRaw(cmd) {
    console.log("[CommandService] ⚠️ Ejecutando comando raw:", cmd);

    try {
      const { stdout, stderr } = await execAsync(cmd, {
        timeout: 30000,
        maxBuffer: 1024 * 1024,
      });

      return {
        success: true,
        output: stdout || stderr,
      };
    } catch (error) {
      return {
        success: false,
        output: error.message,
        stderr: error.stderr,
      };
    }
  }
}

module.exports = CommandService;
