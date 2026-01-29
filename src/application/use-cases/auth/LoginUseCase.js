/**
 * LoginUseCase - Capa de Aplicación
 * Caso de uso para autenticación de usuarios
 *
 * ⚠️ [VULNERABLE] Utiliza repositorio con SQL Injection
 */

class LoginUseCase {
  /**
   * @param {IUserRepository} userRepository
   */
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Ejecuta el caso de uso de login
   *
   * @param {string} username
   * @param {string} password
   * @returns {{success: boolean, user?: User, error?: string}}
   */
  execute(username, password) {
    // Validación básica (pero no suficiente para prevenir SQLi)
    if (!username || !password) {
      return {
        success: false,
        error: "Usuario y contraseña son requeridos",
      };
    }

    try {
      // ⚠️ El repositorio es vulnerable a SQL Injection
      const user = this.userRepository.findByCredentials(username, password);

      if (user) {
        console.log(
          `[LoginUseCase] Login exitoso para: ${user.username} (${user.role})`,
        );
        return {
          success: true,
          user: user,
        };
      }

      return {
        success: false,
        error: "Credenciales inválidas",
      };
    } catch (error) {
      console.error("[LoginUseCase] Error:", error.message);
      return {
        success: false,
        error: error.message, // Devolver el error ayuda al atacante
      };
    }
  }
}

module.exports = LoginUseCase;
