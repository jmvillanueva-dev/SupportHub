/**
 * GetAllUsersUseCase - Capa de Aplicación
 * Caso de uso para obtener todos los usuarios
 *
 * ✅ [SEGURO - FILTRADO DE DATOS SENSIBLES]
 * Solo expone datos públicos mediante toPublicJSON()
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
   * ✅ [SEGURO - DATA FILTERING]
   * Utiliza toPublicJSON() que excluye datos sensibles como contraseñas.
   * Aplica el principio de "mínimo privilegio" - solo devuelve lo necesario.
   *
   * @returns {{success: boolean, users?: User[], error?: string}}
   */
  execute() {
    try {
      const users = this.userRepository.findAll();

      console.log(
        `[GetAllUsersUseCase] Obteniendo ${users.length} usuarios (datos públicos)`,
      );

      // ✅ SEGURO: Usa toPublicJSON() que excluye password y datos sensibles
      // Principio de mínimo privilegio: solo devolver lo estrictamente necesario
      return {
        success: true,
        users: users.map((u) => u.toPublicJSON()), // Sin password!
      };
    } catch (error) {
      console.error("[GetAllUsersUseCase] Error:", error.message);
      return {
        success: false,
        error: "Error al obtener usuarios",
      };
    }
  }
}

module.exports = GetAllUsersUseCase;
