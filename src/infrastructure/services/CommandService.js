/**
 * CommandService - Capa de Infraestructura
 * Servicio para ejecutar comandos del sistema operativo
 *
 * ✅ [SEGURO - VALIDACIÓN + EXECFILE]
 * Implementa validación estricta de entrada y usa execFile
 */
const { execFile } = require("child_process");
const { promisify } = require("util");

const execFileAsync = promisify(execFile);

/**
 * Expresión regular para validar direcciones IPv4
 * Formato: xxx.xxx.xxx.xxx donde xxx es 0-255
 */
const IPV4_REGEX =
  /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

/**
 * Expresión regular para validar nombres de dominio
 * Solo permite caracteres alfanuméricos, guiones y puntos
 */
const HOSTNAME_REGEX =
  /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

class CommandService {
  /**
   * Valida si el input es una dirección IP o hostname válido
   * @param {string} input - Dirección IP o hostname a validar
   * @returns {boolean}
   */
  isValidTarget(input) {
    if (!input || typeof input !== "string") {
      return false;
    }

    const trimmed = input.trim();

    // Verificar longitud máxima (previene DoS)
    if (trimmed.length > 253) {
      return false;
    }

    // Validar como IPv4 o hostname
    return IPV4_REGEX.test(trimmed) || HOSTNAME_REGEX.test(trimmed);
  }

  /**
   * Ejecuta un ping a una dirección IP
   *
   * ✅ [SEGURO - PREVENCIÓN DE COMMAND INJECTION]
   * 1. Validación estricta con regex (whitelist)
   * 2. Uso de execFile en lugar de exec (no interpreta shell)
   * 3. Argumentos pasados como array separado
   *
   * @param {string} ip - Dirección IP a verificar
   * @returns {Promise<{success: boolean, output: string}>}
   */
  async ping(ip) {
    // ✅ SEGURO: Validación estricta del input con whitelist
    if (!this.isValidTarget(ip)) {
      return {
        success: false,
        output:
          "Dirección IP o hostname inválido. Use formato: xxx.xxx.xxx.xxx o dominio.com",
      };
    }

    const trimmedIp = ip.trim();
    const isWindows = process.platform === "win32";

    // ✅ SEGURO: Comando y argumentos separados
    const command = "ping";
    const args = isWindows
      ? ["-n", "2", trimmedIp] // Windows
      : ["-c", "2", trimmedIp]; // Linux/Mac

    console.log("[CommandService] Ejecutando ping seguro a:", trimmedIp);

    try {
      // ✅ SEGURO: execFile no interpreta metacaracteres de shell
      // Los argumentos se pasan como array, no como string concatenado
      const { stdout, stderr } = await execFileAsync(command, args, {
        timeout: 10000,
        maxBuffer: 1024 * 1024,
      });

      return {
        success: true,
        output: stdout || stderr,
        // ✅ SEGURO: No devolvemos el comando ejecutado
      };
    } catch (error) {
      return {
        success: false,
        // ✅ SEGURO: Mensaje genérico sin detalles técnicos internos
        output: error.killed
          ? "Tiempo de espera agotado"
          : "No se pudo alcanzar el destino",
      };
    }
  }
}

module.exports = CommandService;
