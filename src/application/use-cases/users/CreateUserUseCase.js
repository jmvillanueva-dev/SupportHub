/**
 * CreateUserUseCase - Capa de Aplicación
 * Caso de uso para crear nuevos usuarios (solo admin)
 */
const User = require("../../../domain/entities/User");

class CreateUserUseCase {
  /**
   * @param {IUserRepository} userRepository
   */
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Ejecuta el caso de uso de creación de usuario
   *
   * @param {object} userData - Datos del nuevo usuario
   * @param {string} userData.username
   * @param {string} userData.password
   * @param {string} userData.role
   * @returns {{success: boolean, user?: User, error?: string}}
   */
  execute(userData) {
    // Validación básica
    if (!userData.username || !userData.password) {
      return {
        success: false,
        error: "Usuario y contraseña son requeridos",
      };
    }

    if (userData.username.length < 3) {
      return {
        success: false,
        error: "El nombre de usuario debe tener al menos 3 caracteres",
      };
    }

    if (userData.password.length < 6) {
      return {
        success: false,
        error: "La contraseña debe tener al menos 6 caracteres",
      };
    }

    // Validar rol
    const validRoles = ["user", "admin"];
    const role = userData.role || "user";
    if (!validRoles.includes(role)) {
      return {
        success: false,
        error: "Rol inválido. Debe ser 'user' o 'admin'",
      };
    }

    try {
      // Crear entidad de usuario
      const newUser = new User({
        username: userData.username,
        password: userData.password, // En producción: hashear la contraseña
        role: role,
        avatar_url: userData.avatar_url || null,
      });

      // Guardar en el repositorio
      const createdUser = this.userRepository.create(newUser);

      console.log(
        `[CreateUserUseCase] Usuario creado: ${createdUser.username} (${createdUser.role})`,
      );

      return {
        success: true,
        user: createdUser,
      };
    } catch (error) {
      console.error("[CreateUserUseCase] Error:", error.message);

      // Verificar si es error de usuario duplicado
      if (error.message.includes("UNIQUE constraint")) {
        return {
          success: false,
          error: "El nombre de usuario ya existe",
        };
      }

      return {
        success: false,
        error: error.message,
      };
    }
  }
}

module.exports = CreateUserUseCase;
