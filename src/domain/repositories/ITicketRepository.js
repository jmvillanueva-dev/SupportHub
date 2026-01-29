/**
 * Interface ITicketRepository - Capa de Dominio
 * Define el contrato para el repositorio de tickets
 *
 * NOTA: JavaScript no tiene interfaces nativas, esto es documentación del contrato
 */

/**
 * @interface ITicketRepository
 *
 * @method findById(id) - Busca ticket por ID
 * @method findByUserId(userId) - Obtiene tickets de un usuario
 * @method findAll() - Obtiene todos los tickets
 * @method create(ticket) - Crea un nuevo ticket
 * @method update(ticket) - Actualiza un ticket existente
 */

class ITicketRepository {
  /**
   * Busca un ticket por su ID
   * [VULNERABLE] La implementación NO debe verificar ownership
   * @param {number} id
   * @returns {Ticket|null}
   */
  findById(id) {
    throw new Error("Method not implemented");
  }

  /**
   * Obtiene todos los tickets de un usuario específico
   * @param {number} userId
   * @returns {Ticket[]}
   */
  findByUserId(userId) {
    throw new Error("Method not implemented");
  }

  /**
   * Obtiene todos los tickets del sistema
   * @returns {Ticket[]}
   */
  findAll() {
    throw new Error("Method not implemented");
  }

  /**
   * Crea un nuevo ticket
   * [VULNERABLE] No debe sanitizar el contenido
   * @param {Ticket} ticket
   * @returns {Ticket}
   */
  create(ticket) {
    throw new Error("Method not implemented");
  }

  /**
   * Actualiza un ticket existente
   * @param {Ticket} ticket
   * @returns {Ticket}
   */
  update(ticket) {
    throw new Error("Method not implemented");
  }
}

module.exports = ITicketRepository;
