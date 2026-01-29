/**
 * SQLiteUserRepository - Capa de Infraestructura
 * Implementación del repositorio de usuarios usando SQLite
 *
 * ⚠️ [VULNERABLE] Este repositorio contiene SQL Injection intencional
 */
const User = require("../../domain/entities/User");

class SQLiteUserRepository {
  constructor(db) {
    this.db = db;
  }

  /**
   * Busca un usuario por credenciales
   *
   * ⚠️ [VULNERABLE - SQL INJECTION]
   * La consulta concatena directamente los parámetros del usuario
   * Payload de ejemplo: ' OR '1'='1' --
   *
   * @param {string} username
   * @param {string} password
   * @returns {User|null}
   */
  findByCredentials(username, password) {
    // ⚠️ VULNERABLE: Concatenación directa de strings en la query
    // En producción NUNCA hacer esto - usar prepared statements
    const query =
      "SELECT * FROM users WHERE username = '" +
      username +
      "' AND password = '" +
      password +
      "'";

    console.log("[SQLiteUserRepository] Query ejecutada:", query);

    try {
      const row = this.db.prepare(query).get();

      if (row) {
        return new User(row);
      }
      return null;
    } catch (error) {
      console.error("[SQLiteUserRepository] Error en query:", error.message);
      // Devolver el error puede ayudar al atacante (error-based SQLi)
      throw new Error("Database error: " + error.message);
    }
  }

  /**
   * Busca un usuario por ID
   * @param {number} id
   * @returns {User|null}
   */
  findById(id) {
    const stmt = this.db.prepare("SELECT * FROM users WHERE id = ?");
    const row = stmt.get(id);

    if (row) {
      return new User(row);
    }
    return null;
  }

  /**
   * Obtiene todos los usuarios
   *
   * ⚠️ [VULNERABLE - DATA EXPOSURE]
   * Devuelve TODOS los campos incluyendo passwords
   *
   * @returns {User[]}
   */
  findAll() {
    const stmt = this.db.prepare("SELECT * FROM users");
    const rows = stmt.all();

    return rows.map((row) => new User(row));
  }

  /**
   * Crea un nuevo usuario
   * @param {User} user
   * @returns {User}
   */
  create(user) {
    const stmt = this.db.prepare(`
      INSERT INTO users (username, password, role, avatar_url) 
      VALUES (?, ?, ?, ?)
    `);

    const result = stmt.run(
      user.username,
      user.password,
      user.role,
      user.avatar_url,
    );
    user.id = result.lastInsertRowid;

    return user;
  }
}

module.exports = SQLiteUserRepository;
