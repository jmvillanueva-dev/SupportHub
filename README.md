# SupportHub - Sistema de Tickets Vulnerable

<div align="center">
  <h3>🎯 Aplicación Deliberadamente Vulnerable para Hacking Ético</h3>
  <p>Sistema de tickets de soporte interno con 5 vulnerabilidades de seguridad críticas</p>
</div>

---

## ⚠️ ADVERTENCIA

> **Esta aplicación es INTENCIONALMENTE VULNERABLE.**  
> Está diseñada exclusivamente para fines educativos en cursos de Hacking Ético y Seguridad Informática.  
> **NUNCA desplegar en un entorno de producción real.**

---

## 📋 Descripción

SupportHub es un sistema de tickets de soporte interno ficticio para "TechCorp Inc.". La aplicación simula un sistema corporativo real pero contiene **5 vulnerabilidades críticas** de seguridad que los estudiantes deben identificar y explotar como parte de un examen de Hacking Ético.

## 🏗️ Arquitectura

El proyecto implementa **Clean Architecture** con las siguientes capas:

```
src/
├── domain/           # Entidades y contratos (interfaces)
├── application/      # Casos de uso (lógica de negocio)
├── infrastructure/   # Implementaciones (DB, servicios)
├── presentation/     # API Routes, componentes React
└── shared/           # Utilidades compartidas
```

## 🛠️ Tecnologías

- **Framework**: Next.js 14 (Pages Router)
- **Base de Datos**: SQLite (better-sqlite3) - Sin ORM
- **Estilos**: TailwindCSS
- **Autenticación**: Cookies en texto plano (vulnerable)

---

## 🚀 Instalación

### Opción 1: Desarrollo Local

```bash
# Clonar el repositorio
git clone <repo-url>
cd supporthub

# Instalar dependencias
npm install

# Inicializar base de datos
npm run init-db

# Iniciar servidor de desarrollo
npm run dev
```

Acceder a: http://localhost:3000

### Opción 2: Docker

```bash
# Construir y ejecutar con Docker Compose
docker-compose up --build

# O manualmente
docker build -t supporthub .
docker run -p 3000:3000 supporthub
```

---

## 👥 Usuarios de Prueba

| Usuario         | Contraseña            | Rol   |
| --------------- | --------------------- | ----- |
| `jdoe`          | `johndoe123`          | user  |
| `asmith`        | `alice2024`           | user  |
| `intern_garcia` | `password123`         | user  |
| `sysadmin`      | `Admin@TechCorp2024!` | admin |
| `ceo_martinez`  | `CEO#Secure!99`       | admin |

---

## 🎯 Vulnerabilidades Implementadas

### 1. SQL Injection (SQLi)

- **Ubicación**: Login (`/api/auth/login`)
- **Tipo**: Authentication Bypass
- **Archivo vulnerable**: `src/infrastructure/repositories/SQLiteUserRepository.js`
- **Payload de ejemplo**: `' OR '1'='1' --`
- **Objetivo**: Acceder como cualquier usuario sin conocer la contraseña

### 2. Stored XSS (Cross-Site Scripting)

- **Ubicación**: Descripción de tickets
- **Tipo**: Stored/Persistent XSS
- **Archivo vulnerable**: `src/presentation/components/tickets/TicketDetail.jsx`
- **Payload de ejemplo**: `<script>alert('XSS')</script>`
- **Objetivo**: Ejecutar JavaScript malicioso cuando alguien vea el ticket

### 3. IDOR (Insecure Direct Object Reference)

- **Ubicación**: Visor de tickets (`/tickets/[id]`)
- **Tipo**: Broken Access Control
- **Archivo vulnerable**: `src/application/use-cases/tickets/GetTicketByIdUseCase.js`
- **Objetivo**: Acceder a tickets confidenciales de otros usuarios (ej: ticket #3 o #6)

### 4. Sensitive Data Exposure

- **Ubicación**: API de debugging (`/api/admin/users`)
- **Tipo**: Information Disclosure
- **Archivo vulnerable**: `pages/api/admin/users.js`
- **Objetivo**: Obtener credenciales de todos los usuarios

### 5. OS Command Injection

- **Ubicación**: Admin Tools - Ping (`/admin/tools`)
- **Tipo**: Remote Code Execution
- **Archivo vulnerable**: `src/infrastructure/services/CommandService.js`
- **Payload de ejemplo**:
  - Linux: `8.8.8.8; cat /etc/passwd`
  - Windows: `8.8.8.8 & whoami`
- **Objetivo**: Ejecutar comandos del sistema operativo en el servidor

---

## 🔍 Pistas para Estudiantes

1. **Inspecciona el código fuente** HTML de las páginas (hay comentarios ocultos)
2. **Revisa las cookies** en las herramientas de desarrollo del navegador
3. **Prueba fuzzing** en las rutas de API (`/api/admin/...`)
4. **Observa los logs** de la consola del servidor
5. **Lee los mensajes de error** detallados

---

## 📁 Estructura de Archivos

```
supporthub/
├── pages/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login.js       # POST - SQLi vulnerable
│   │   │   ├── logout.js
│   │   │   └── me.js
│   │   ├── tickets/
│   │   │   ├── index.js       # GET/POST
│   │   │   └── [id].js        # GET - IDOR vulnerable
│   │   └── admin/
│   │       ├── users.js       # GET - Data Exposure
│   │       └── ping.js        # POST - Command Injection
│   ├── login.js
│   ├── dashboard.js
│   ├── tickets/
│   │   ├── new.js             # XSS input
│   │   └── [id].js            # XSS render
│   └── admin/
│       └── tools.js           # Command Injection UI
├── src/
│   ├── domain/
│   ├── application/
│   ├── infrastructure/
│   ├── presentation/
│   └── shared/
├── Dockerfile
├── docker-compose.yml
└── package.json
```

---

## 📝 Objetivos del Examen

1. ✅ Bypassear el login usando SQL Injection
2. ✅ Ejecutar un alert() mediante Stored XSS
3. ✅ Leer tickets confidenciales (IDOR)
4. ✅ Obtener credenciales desde el endpoint de debug
5. ✅ Ejecutar comandos del sistema vía Command Injection

---

## 🔒 Cómo Arreglar las Vulnerabilidades (Referencia)

### SQL Injection

```javascript
// VULNERABLE
const query = "SELECT * FROM users WHERE username = '" + username + "'";

// SEGURO
const stmt = db.prepare("SELECT * FROM users WHERE username = ?");
const user = stmt.get(username);
```

### XSS

```javascript
// VULNERABLE
<div dangerouslySetInnerHTML={{ __html: content }} />;

// SEGURO
import DOMPurify from "dompurify";
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} />;
```

### IDOR

```javascript
// VULNERABLE
const ticket = repository.findById(ticketId);

// SEGURO
const ticket = repository.findById(ticketId);
if (ticket.user_id !== currentUser.id && !currentUser.isAdmin()) {
  throw new Error("Access denied");
}
```

### Data Exposure

```javascript
// VULNERABLE
return users.map((u) => u.toFullJSON()); // Incluye passwords

// SEGURO
return users.map((u) => u.toPublicJSON()); // Solo datos públicos
```

### Command Injection

```javascript
// VULNERABLE
exec("ping -c 1 " + ip);

// SEGURO
const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
if (!ipRegex.test(ip)) throw new Error("Invalid IP");
execFile("ping", ["-c", "1", ip]); // Usar execFile con argumentos separados
```

---

## 📄 Licencia

Este proyecto es solo para fines educativos. No está diseñado para uso en producción.

---

<div align="center">
  <p><strong>TechCorp Inc.</strong> - "Innovating Tomorrow, Today"</p>
  <p><em>SupportHub v2.1.0 - Internal Use Only</em></p>
</div>
