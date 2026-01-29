/**
 * GetAllUsersUseCase - Capa de Aplicación
 * Caso de uso para obtener todos los usuarios
 *
 * ⚠️ [VULNERABLE - SENSITIVE DATA EXPOSURE]
 * Esta ruta "de debugging" expone datos sensibles
 */

class GetAllUsersUseCase {
  /**
   * @param {IUserRepository} userRepository
   */
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Obtiene todos los usuarios del sistema
   *
   * ⚠️ [VULNERABLE - DATA EXPOSURE]
   * Devuelve datos completos incluyendo contraseñas
   * Esta función debería estar protegida y no exponer passwords
   *
   * @returns {{success: boolean, users?: User[], error?: string}}
   */
  execute() {
    try {
      const users = this.userRepository.findAll();

      console.log(
        `[GetAllUsersUseCase] ⚠️ Exponiendo ${users.length} usuarios con datos completos`,
      );

      // ⚠️ VULNERABLE: Devuelve toFullJSON() que incluye passwords
      // En producción SIEMPRE usar toPublicJSON() o DTOs sin datos sensibles
      return {
        success: true,
        users: users.map((u) => u.toFullJSON()), // Incluye password!
        // Información extra que no debería exponerse
        _debug: {
          total: users.length,
          roles: {
            admin: users.filter((u) => u.role === "admin").length,
            user: users.filter((u) => u.role === "user").length,
          },
        },
      };
    } catch (error) {
      console.error("[GetAllUsersUseCase] Error:", error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

module.exports = GetAllUsersUseCase;
