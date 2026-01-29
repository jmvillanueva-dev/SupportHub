/**
 * GetTicketByIdUseCase - Capa de Aplicación
 * Caso de uso para obtener un ticket por su ID
 *
 * ⚠️ [VULNERABLE - IDOR] No verifica ownership del ticket
 */

class GetTicketByIdUseCase {
  /**
   * @param {ITicketRepository} ticketRepository
   */
  constructor(ticketRepository) {
    this.ticketRepository = ticketRepository;
  }

  /**
   * Ejecuta el caso de uso para obtener un ticket
   *
   * ⚠️ [VULNERABLE - INSECURE DIRECT OBJECT REFERENCE]
   * El parámetro currentUserId se recibe pero NO SE USA
   * Cualquier usuario puede ver cualquier ticket cambiando el ID
   *
   * @param {number} ticketId - ID del ticket a buscar
   * @param {number} currentUserId - ID del usuario actual (IGNORADO)
   * @returns {{success: boolean, ticket?: Ticket, error?: string}}
   */
  execute(ticketId, currentUserId) {
    if (!ticketId) {
      return {
        success: false,
        error: "Ticket ID is required",
      };
    }

    try {
      const ticket = this.ticketRepository.findById(ticketId);

      if (!ticket) {
        return {
          success: false,
          error: "Ticket not found",
        };
      }

      // ⚠️ VULNERABLE: Esta validación está comentada/omitida
      // En producción DEBE verificarse:
      // if (ticket.user_id !== currentUserId && !isAdmin(currentUserId)) {
      //   return { success: false, error: 'Access denied' };
      // }

      // TODO: Implementar verificación de permisos (nunca se hizo)
      console.log(
        `[GetTicketByIdUseCase] Usuario ${currentUserId} accediendo a ticket #${ticketId} (owner: ${ticket.user_id})`,
      );

      return {
        success: true,
        ticket: ticket,
      };
    } catch (error) {
      console.error("[GetTicketByIdUseCase] Error:", error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

module.exports = GetTicketByIdUseCase;
