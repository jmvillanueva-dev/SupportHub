/**
 * Conexión SQLite - Capa de Infraestructura
 * Proporciona la instancia de base de datos para toda la aplicación
 */
const Database = require("better-sqlite3");
const path = require("path");

// Ruta de la base de datos
const DB_PATH = path.join(process.cwd(), "data", "supporthub.db");

let db = null;

/**
 * Obtiene la instancia singleton de la base de datos
 * @returns {Database}
 */
function getDatabase() {
  if (!db) {
    try {
      db = new Database(DB_PATH);
      db.pragma("journal_mode = WAL");
      console.log("[DB] Conexión establecida con SQLite");
    } catch (error) {
      console.error("[DB] Error al conectar:", error.message);
      throw error;
    }
  }
  return db;
}

/**
 * Cierra la conexión a la base de datos
 */
function closeDatabase() {
  if (db) {
    db.close();
    db = null;
    console.log("[DB] Conexión cerrada");
  }
}

module.exports = {
  getDatabase,
  closeDatabase,
  DB_PATH,
};
