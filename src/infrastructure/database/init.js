/**
 * Script de Inicialización de Base de Datos
 * Crea las tablas y pobla con datos de prueba para el examen de Hacking Ético
 *
 * Ejecutar: npm run init-db
 */
const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

// Crear directorio data si no existe
const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const DB_PATH = path.join(dataDir, "supporthub.db");

// Eliminar base de datos existente para empezar limpio
if (fs.existsSync(DB_PATH)) {
  fs.unlinkSync(DB_PATH);
  console.log("[INIT] Base de datos anterior eliminada");
}

const db = new Database(DB_PATH);
console.log("[INIT] Creando nueva base de datos...");

// ============================================
// CREAR TABLAS
// ============================================

db.exec(`
  -- Tabla de usuarios
  CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    avatar_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Tabla de tickets
  CREATE TABLE tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    status TEXT DEFAULT 'open',
    priority TEXT DEFAULT 'medium',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  -- Índices para mejor rendimiento
  CREATE INDEX idx_tickets_user_id ON tickets(user_id);
  CREATE INDEX idx_tickets_status ON tickets(status);
`);

console.log("[INIT] Tablas creadas correctamente");

// ============================================
// DATOS DE PRUEBA - USUARIOS
// ============================================
// NOTA: Contraseñas en texto plano intencionalmente para el ejercicio
// En producción SIEMPRE usar bcrypt o argon2

const users = [
  {
    username: "sysadmin",
    password: "Admin@TechCorp2024!",
    role: "admin",
    avatar_url: "/avatars/admin.png",
  },
  {
    username: "jdoe",
    password: "johndoe123",
    role: "user",
    avatar_url: "/avatars/jdoe.png",
  },
  {
    username: "asmith",
    password: "alice2024",
    role: "user",
    avatar_url: "/avatars/asmith.png",
  },
  {
    username: "ceo_martinez",
    password: "CEO#Secure!99",
    role: "admin",
    avatar_url: "/avatars/ceo.png",
  },
  {
    username: "intern_garcia",
    password: "password123",
    role: "user",
    avatar_url: "/avatars/intern.png",
  },
];

const insertUser = db.prepare(`
  INSERT INTO users (username, password, role, avatar_url) 
  VALUES (@username, @password, @role, @avatar_url)
`);

for (const user of users) {
  insertUser.run(user);
}
console.log(`[INIT] ${users.length} usuarios insertados`);

// ============================================
// DATOS DE PRUEBA - TICKETS
// ============================================

const tickets = [
  {
    title: "Problema con acceso VPN",
    description:
      'No puedo conectarme a la VPN corporativa desde mi casa. El error dice "Authentication Failed". Ya verifiqué mis credenciales y están correctas.',
    user_id: 2, // jdoe
    status: "open",
    priority: "high",
  },
  {
    title: "Solicitud de nuevo monitor",
    description:
      "Mi monitor actual tiene líneas verticales en la pantalla. Necesito un reemplazo para poder trabajar correctamente.",
    user_id: 3, // asmith
    status: "in_progress",
    priority: "medium",
  },
  {
    title: "[CONFIDENCIAL] Revisión de presupuesto Q1 2024",
    description:
      "Adjunto el documento con las proyecciones financieras. <strong>INFORMACIÓN CONFIDENCIAL:</strong> El presupuesto para el departamento de IT será reducido en un 15%. No compartir con empleados regulares hasta el anuncio oficial. Códigos de acceso al sistema financiero: FIN-2024-ADMIN",
    user_id: 4, // ceo_martinez
    status: "closed",
    priority: "critical",
  },
  {
    title: "Error en sistema de nómina",
    description:
      "El cálculo de horas extra no está funcionando correctamente. Me pagaron menos de lo que debería este mes.",
    user_id: 2, // jdoe
    status: "open",
    priority: "high",
  },
  {
    title: "Instalación de software Adobe",
    description:
      "Necesito que me instalen Adobe Creative Suite para el proyecto de marketing. Ya tengo la aprobación de mi supervisor.",
    user_id: 5, // intern_garcia
    status: "open",
    priority: "low",
  },
  {
    title: "[PRIVADO] Credenciales de servidor producción",
    description:
      "Para el equipo de DevOps: Las credenciales del servidor de producción son: <br><strong>Host:</strong> prod-srv-01.techcorp.internal<br><strong>User:</strong> deploy_admin<br><strong>Pass:</strong> Pr0d#Deploy2024!<br>Por favor actualizar en el gestor de secretos.",
    user_id: 1, // sysadmin
    status: "closed",
    priority: "critical",
  },
];

const insertTicket = db.prepare(`
  INSERT INTO tickets (title, description, user_id, status, priority) 
  VALUES (@title, @description, @user_id, @status, @priority)
`);

for (const ticket of tickets) {
  insertTicket.run(ticket);
}
console.log(`[INIT] ${tickets.length} tickets insertados`);

// ============================================
// RESUMEN
// ============================================

db.close();

console.log("\n========================================");
console.log("✅ BASE DE DATOS INICIALIZADA");
console.log("========================================");
console.log("\n📋 USUARIOS DE PRUEBA:");
console.log("----------------------------------------");
users.forEach((u) => {
  console.log(
    `   👤 ${u.username.padEnd(15)} | 🔑 ${u.password.padEnd(20)} | ${u.role}`,
  );
});
console.log("\n📝 TICKETS DE PRUEBA: " + tickets.length);
console.log("\n🎯 OBJETIVOS DEL EJERCICIO:");
console.log("   1. SQL Injection en login → Acceder como admin");
console.log("   2. Stored XSS → Ejecutar script en ticket");
console.log("   3. IDOR → Leer ticket #3 o #6 (confidenciales)");
console.log("   4. Data Exposure → /api/admin/users");
console.log("   5. Command Injection → Panel de admin/tools");
console.log("========================================\n");
