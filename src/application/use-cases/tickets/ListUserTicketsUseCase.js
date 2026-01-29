/**
 * ListUserTicketsUseCase - Capa de Aplicación
 * Caso de uso para listar tickets del usuario actual
 */

class ListUserTicketsUseCase {
  /**
   * @param {ITicketRepository} ticketRepository
   */
  constructor(ticketRepository) {
    this.ticketRepository = ticketRepository;
  }

  /**
   * Obtiene los tickets de un usuario específico
   *
   * @param {number} userId - ID del usuario
   * @param {boolean} isAdmin - Si es admin, devuelve todos los tickets
   * @returns {{success: boolean, tickets?: Ticket[], error?: string}}
   */
  execute(userId, isAdmin = false) {
    if (!userId) {
      return {
        success: false,
        error: "User ID is required",
      };
    }

    try {
      let tickets;

      if (isAdmin) {
        // Admin puede ver todos los tickets
        tickets = this.ticketRepository.findAll();
        console.log(
          `[ListUserTicketsUseCase] Admin solicitando todos los tickets`,
        );
      } else {
        // Usuario normal solo ve sus tickets
        tickets = this.ticketRepository.findByUserId(userId);
        console.log(
          `[ListUserTicketsUseCase] Usuario ${userId} solicitando sus tickets`,
        );
      }

      return {
        success: true,
        tickets: tickets,
      };
    } catch (error) {
      console.error("[ListUserTicketsUseCase] Error:", error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

module.exports = ListUserTicketsUseCase;
