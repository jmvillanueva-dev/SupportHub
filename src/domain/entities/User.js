/**
 * Entidad User - Capa de Dominio
 * Representa un usuario del sistema SupportHub
 */
class User {
  constructor({ id, username, password, role, avatar_url }) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.role = role; // 'admin' | 'user'
    this.avatar_url = avatar_url;
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
    };
  }
}

module.exports = User;
