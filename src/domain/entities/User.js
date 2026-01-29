/**
 * Entidad User - Capa de Dominio
 * Representa un usuario del sistema SupportHub
 */
class User {
  constructor({ id, username, password, role, avatar_url, created_at }) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.role = role; // 'admin' | 'user'
    this.avatar_url = avatar_url;
    this.created_at = created_at;
  }

  isAdmin() {
    return this.role === "admin";
  }

  toPublicJSON() {
    return {
      id: this.id,
      username: this.username,
      role: this.role,
      avatar_url: this.avatar_url,
      created_at: this.created_at,
    };
  }

  // NOTA: En producción esto expondría datos sensibles
  // [VULNERABLE] Este método incluye el password - usado por GetAllUsersUseCase
  toFullJSON() {
    return {
      id: this.id,
      username: this.username,
      password: this.password,
      role: this.role,
      avatar_url: this.avatar_url,
      created_at: this.created_at,
    };
  }
}

module.exports = User;
