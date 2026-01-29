/**
 * CreateTicketUseCase - Capa de Aplicación
 * Caso de uso para crear nuevos tickets
 *
 * ⚠️ [VULNERABLE] No sanitiza el contenido - permite Stored XSS
 */
const Ticket = require("../../../domain/entities/Ticket");

class CreateTicketUseCase {
  /**
   * @param {ITicketRepository} ticketRepository
   */
  constructor(ticketRepository) {
    this.ticketRepository = ticketRepository;
  }

  /**
   * Ejecuta el caso de uso de creación de ticket
   *
   * ⚠️ [VULNERABLE - STORED XSS]
   * No hay sanitización del título ni descripción
   * Permite guardar payloads como: <script>alert('XSS')</script>
   *
   * @param {{title: string, description: string, userId: number, priority?: string}} data
   * @returns {{success: boolean, ticket?: Ticket, error?: string}}
   */
  execute(data) {
    const { title, description, userId, priority } = data;

    // Validación mínima
    if (!title || !description) {
      return {
        success: false,
        error: "Title and description are required",
      };
    }

    if (!userId) {
      return {
        success: false,
        error: "User ID is required",
      };
    }

    try {
      // ⚠️ VULNERABLE: No se sanitiza title ni description
      // En producción usar: DOMPurify, xss-clean, sanitize-html
      const ticket = new Ticket({
        title: title, // Sin sanitizar
        description: description, // Sin sanitizar - aquí se inyecta el XSS
        user_id: userId,
        priority: priority || "medium",
        status: "open",
      });

      const createdTicket = this.ticketRepository.create(ticket);

      console.log(
        `[CreateTicketUseCase] Ticket creado: #${createdTicket.id} - "${title}"`,
      );

      return {
        success: true,
        ticket: createdTicket,
      };
    } catch (error) {
      console.error("[CreateTicketUseCase] Error:", error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

module.exports = CreateTicketUseCase;
