/**
 * PingServerUseCase - Capa de Aplicación
 * Caso de uso para verificar conectividad de red
 *
 * ⚠️ [VULNERABLE - COMMAND INJECTION]
 * Utiliza CommandService que no sanitiza inputs
 */

class PingServerUseCase {
  /**
   * @param {CommandService} commandService
   */
  constructor(commandService) {
    this.commandService = commandService;
  }

  /**
   * Ejecuta un ping a la dirección especificada
   *
   * ⚠️ [VULNERABLE - OS COMMAND INJECTION]
   * El input se pasa directamente al CommandService sin validación
   * Payloads de ejemplo:
   *   - Linux: 8.8.8.8; cat /etc/passwd
   *   - Linux: 8.8.8.8; ls -la /
   *   - Windows: 8.8.8.8 & whoami
   *   - Windows: 8.8.8.8 | dir C:\
   *
   * @param {string} ipAddress - Dirección IP a verificar
   * @returns {Promise<{success: boolean, output?: string, error?: string}>}
   */
  async execute(ipAddress) {
    if (!ipAddress) {
      return {
        success: false,
        error: "IP address is required",
      };
    }

    // ⚠️ VULNERABLE: No hay validación de formato de IP
    // En producción usar regex: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/

    // "Validación" inútil que no previene el ataque
    if (ipAddress.length > 500) {
      return {
        success: false,
        error: "IP address too long",
      };
    }

    console.log(`[PingServerUseCase] ⚠️ Ejecutando ping a: ${ipAddress}`);

    try {
      const result = await this.commandService.ping(ipAddress);

      return {
        success: result.success,
        output: result.output,
        command: result.command, // Revela el comando ejecutado
      };
    } catch (error) {
      console.error("[PingServerUseCase] Error:", error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

module.exports = PingServerUseCase;
