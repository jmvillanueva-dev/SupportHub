/**
 * SQLiteUserRepository - Capa de Infraestructura
 * Implementación del repositorio de usuarios usando SQLite
 *
 * ✅ [SEGURO] Implementación con prepared statements (consultas parametrizadas)
 */
const User = require("../../domain/entities/User");

class SQLiteUserRepository {
  constructor(db) {
    this.db = db;
  }

  /**
   * Busca un usuario por credenciales
   *
   * ✅ [SEGURO - PREPARED STATEMENTS]
   * Se utilizan consultas parametrizadas (?) que separan
   * los datos de la lógica SQL, previniendo SQL Injection.
   * Los parámetros se pasan como argumentos separados al método get().
   *
   * @param {string} username
   * @param {string} password
   * @returns {User|null}
   */
  findByCredentials(username, password) {
    // ✅ SEGURO: Uso de prepared statements con parámetros posicionales (?)
    // Los valores se pasan como argumentos separados, no concatenados en el SQL
    // Esto previene cualquier intento de inyección SQL
    const stmt = this.db.prepare(
      "SELECT * FROM users WHERE username = ? AND password = ?",
    );

    console.log(
      "[SQLiteUserRepository] Consulta segura ejecutada para usuario:",
      username,
    );

    try {
      // Los parámetros se pasan de forma segura al método get()
      const row = stmt.get(username, password);

      if (row) {
        return new User(row);
      }
      return null;
    } catch (error) {
      console.error("[SQLiteUserRepository] Error en query:", error.message);
      // ✅ SEGURO: Mensaje genérico que no expone detalles internos
      throw new Error("Error de autenticación");
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
