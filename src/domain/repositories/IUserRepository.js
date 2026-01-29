/**
 * Interface IUserRepository - Capa de Dominio
 * Define el contrato para el repositorio de usuarios
 *
 * NOTA: JavaScript no tiene interfaces nativas, esto es documentación del contrato
 */

/**
 * @interface IUserRepository
 *
 * @method findByCredentials(username, password) - Busca usuario por credenciales
 * @method findById(id) - Busca usuario por ID
 * @method findAll() - Obtiene todos los usuarios
 * @method create(user) - Crea un nuevo usuario
 */

class IUserRepository {
  /**
   * Busca un usuario por sus credenciales
   * @param {string} username
   * @param {string} password
   * @returns {User|null}
   */
  findByCredentials(username, password) {
    throw new Error("Method not implemented");
  }

  /**
   * Busca un usuario por su ID
   * @param {number} id
   * @returns {User|null}
   */
  findById(id) {
    throw new Error("Method not implemented");
  }

  /**
   * Obtiene todos los usuarios del sistema
   * @returns {User[]}
   */
  findAll() {
    throw new Error("Method not implemented");
  }

  /**
   * Crea un nuevo usuario
   * @param {User} user
   * @returns {User}
   */
  create(user) {
    throw new Error("Method not implemented");
  }
}

module.exports = IUserRepository;
