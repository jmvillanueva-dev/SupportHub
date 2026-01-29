/**
 * Entidad Ticket - Capa de Dominio
 * Representa un ticket de soporte en el sistema
 */
class Ticket {
  constructor({
    id,
    title,
    description,
    user_id,
    status,
    priority,
    created_at,
    updated_at,
  }) {
    this.id = id;
    this.title = title;
    this.description = description; // [VULNERABLE] Puede contener código malicioso (XSS)
    this.user_id = user_id;
    this.status = status || "open"; // 'open' | 'in_progress' | 'closed'
    this.priority = priority || "medium"; // 'low' | 'medium' | 'high' | 'critical'
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  isOwnedBy(userId) {
    return this.user_id === userId;
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      user_id: this.user_id,
      status: this.status,
      priority: this.priority,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}

module.exports = Ticket;
