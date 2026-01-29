/**
 * API Route: Ticket by ID
 * GET /api/tickets/[id]
 *
 * ⚠️ [VULNERABLE - IDOR]
 * No verifica si el ticket pertenece al usuario actual
 */
const { getDatabase } = require("../../../src/infrastructure/database/sqlite");
const SQLiteTicketRepository = require("../../../src/infrastructure/repositories/SQLiteTicketRepository");
const GetTicketByIdUseCase = require("../../../src/application/use-cases/tickets/GetTicketByIdUseCase");
const {
  getSession,
  isAuthenticated,
} = require("../../../src/shared/utils/cookies");

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Verificar autenticación
  if (!isAuthenticated(req)) {
    return res.status(401).json({
      success: false,
      error: "Authentication required",
    });
  }

  const { id } = req.query;
  const ticketId = parseInt(id, 10);

  if (isNaN(ticketId)) {
    return res.status(400).json({
      success: false,
      error: "Invalid ticket ID",
    });
  }

  try {
    const session = getSession(req);
    const db = getDatabase();
    const ticketRepository = new SQLiteTicketRepository(db);
    const getTicketUseCase = new GetTicketByIdUseCase(ticketRepository);

    // ⚠️ VULNERABLE - IDOR
    // El userId se pasa pero NO SE VALIDA contra el owner del ticket
    const result = getTicketUseCase.execute(ticketId, session.userId);

    if (result.success) {
      return res.status(200).json({
        success: true,
        ticket: result.ticket.toJSON(),
      });
    }

    return res.status(404).json({
      success: false,
      error: result.error,
    });
  } catch (error) {
    console.error("[API /tickets/[id]] Error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}
