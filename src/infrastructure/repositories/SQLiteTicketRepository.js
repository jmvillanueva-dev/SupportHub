/**
 * SQLiteTicketRepository - Capa de Infraestructura
 * Implementación del repositorio de tickets usando SQLite
 *
 * ⚠️ [VULNERABLE] Este repositorio NO sanitiza el contenido de tickets (XSS)
 */
const Ticket = require("../../domain/entities/Ticket");

class SQLiteTicketRepository {
  constructor(db) {
    this.db = db;
  }

  /**
   * Busca un ticket por ID
   *
   * ⚠️ [VULNERABLE - IDOR]
   * No verifica si el usuario tiene permiso para ver este ticket
   *
   * @param {number} id
   * @returns {Ticket|null}
   */
  findById(id) {
    const stmt = this.db.prepare("SELECT * FROM tickets WHERE id = ?");
    const row = stmt.get(id);

    if (row) {
      return new Ticket(row);
    }
    return null;
  }

  /**
   * Obtiene todos los tickets de un usuario
   * @param {number} userId
   * @returns {Ticket[]}
   */
  findByUserId(userId) {
    const stmt = this.db.prepare(
      "SELECT * FROM tickets WHERE user_id = ? ORDER BY created_at DESC",
    );
    const rows = stmt.all(userId);

    return rows.map((row) => new Ticket(row));
  }

  /**
   * Obtiene todos los tickets del sistema
   * @returns {Ticket[]}
   */
  findAll() {
    const stmt = this.db.prepare(
      "SELECT * FROM tickets ORDER BY created_at DESC",
    );
    const rows = stmt.all();

    return rows.map((row) => new Ticket(row));
  }

  /**
   * Crea un nuevo ticket
   *
   * ⚠️ [VULNERABLE - STORED XSS]
   * El contenido de title y description NO se sanitiza
   * Se guarda tal cual en la base de datos
   *
   * @param {Ticket} ticket
   * @returns {Ticket}
   */
  create(ticket) {
    // ⚠️ VULNERABLE: No hay sanitización del input
    // Código malicioso como <script>alert('XSS')</script> se guardará directamente
    const stmt = this.db.prepare(`
      INSERT INTO tickets (title, description, user_id, status, priority) 
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      ticket.title,
      ticket.description, // Sin sanitizar - vulnerable a XSS
      ticket.user_id,
      ticket.status || "open",
      ticket.priority || "medium",
    );

    ticket.id = result.lastInsertRowid;
    return ticket;
  }

  /**
   * Actualiza un ticket existente
   * @param {Ticket} ticket
   * @returns {Ticket}
   */
  update(ticket) {
    const stmt = this.db.prepare(`
      UPDATE tickets 
      SET title = ?, description = ?, status = ?, priority = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(
      ticket.title,
      ticket.description,
      ticket.status,
      ticket.priority,
      ticket.id,
    );

    return ticket;
  }
}

module.exports = SQLiteTicketRepository;
