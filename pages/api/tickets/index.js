/**
 * API Route: Tickets
 * GET /api/tickets - Lista tickets del usuario
 * POST /api/tickets - Crear nuevo ticket
 *
 * ⚠️ [VULNERABLE - STORED XSS en POST]
 */
const { getDatabase } = require("../../../src/infrastructure/database/sqlite");
const SQLiteTicketRepository = require("../../../src/infrastructure/repositories/SQLiteTicketRepository");
const CreateTicketUseCase = require("../../../src/application/use-cases/tickets/CreateTicketUseCase");
const ListUserTicketsUseCase = require("../../../src/application/use-cases/tickets/ListUserTicketsUseCase");
const {
  getSession,
  isAuthenticated,
} = require("../../../src/shared/utils/cookies");

export default function handler(req, res) {
  // Verificar autenticación
  if (!isAuthenticated(req)) {
    return res.status(401).json({
      success: false,
      error: "Authentication required",
    });
  }

  const session = getSession(req);
  const db = getDatabase();
  const ticketRepository = new SQLiteTicketRepository(db);

  switch (req.method) {
    case "GET":
      return handleGet(req, res, ticketRepository, session);
    case "POST":
      return handlePost(req, res, ticketRepository, session);
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}

/**
 * GET /api/tickets - Lista tickets del usuario actual
 */
function handleGet(req, res, ticketRepository, session) {
  try {
    const listUseCase = new ListUserTicketsUseCase(ticketRepository);
    const isAdmin = session.role === "admin";

    const result = listUseCase.execute(session.userId, isAdmin);

    if (result.success) {
      return res.status(200).json({
        success: true,
        tickets: result.tickets.map((t) => t.toJSON()),
      });
    }

    return res.status(500).json({
      success: false,
      error: result.error,
    });
  } catch (error) {
    console.error("[API /tickets GET] Error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}

/**
 * POST /api/tickets - Crear nuevo ticket
 *
 * ⚠️ [VULNERABLE - STORED XSS]
 * No hay sanitización del título ni descripción
 */
function handlePost(req, res, ticketRepository, session) {
  const { title, description, priority } = req.body;

  if (!title || !description) {
    return res.status(400).json({
      success: false,
      error: "Title and description are required",
    });
  }

  try {
    const createUseCase = new CreateTicketUseCase(ticketRepository);

    // ⚠️ VULNERABLE: Los datos se pasan sin sanitizar
    const result = createUseCase.execute({
      title, // Sin sanitizar
      description, // Sin sanitizar - aquí va el payload XSS
      userId: session.userId,
      priority: priority || "medium",
    });

    if (result.success) {
      return res.status(201).json({
        success: true,
        message: "Ticket created successfully",
        ticket: result.ticket.toJSON(),
      });
    }

    return res.status(400).json({
      success: false,
      error: result.error,
    });
  } catch (error) {
    console.error("[API /tickets POST] Error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}
