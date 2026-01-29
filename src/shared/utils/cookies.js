/**
 * Utilidades para manejo de cookies
 * Capa Compartida (Shared)
 *
 * ⚠️ VULNERABLE: Cookies en texto plano sin firma ni encriptación
 */
const cookie = require("cookie");

const COOKIE_NAME = "supporthub_session";

/**
 * Parsea las cookies de una request
 * @param {string} cookieHeader
 * @returns {object}
 */
function parseCookies(cookieHeader) {
  return cookie.parse(cookieHeader || "");
}

/**
 * Obtiene la sesión del usuario desde las cookies
 *
 * ⚠️ VULNERABLE: No hay validación de integridad
 * El usuario puede modificar la cookie manualmente
 *
 * @param {object} req - Request object
 * @returns {{userId: number, role: string}|null}
 */
function getSession(req) {
  const cookies = parseCookies(req.headers.cookie);
  const sessionData = cookies[COOKIE_NAME];

  if (!sessionData) {
    return null;
  }

  try {
    // ⚠️ VULNERABLE: Cookie en texto plano, fácilmente manipulable
    // Formato: userId:role (ej: "2:user" o "1:admin")
    const [userId, role] = sessionData.split(":");

    return {
      userId: parseInt(userId, 10),
      role: role,
    };
  } catch (error) {
    return null;
  }
}

/**
 * Crea la cookie de sesión
 *
 * ⚠️ VULNERABLE: Sin httpOnly, sin secure, sin firma
 *
 * @param {object} res - Response object
 * @param {number} userId
 * @param {string} role
 */
function setSession(res, userId, role) {
  // ⚠️ VULNERABLE: Cookie en texto plano
  const sessionValue = `${userId}:${role}`;

  res.setHeader(
    "Set-Cookie",
    cookie.serialize(COOKIE_NAME, sessionValue, {
      httpOnly: false, // ⚠️ VULNERABLE: Accesible desde JavaScript
      secure: false, // ⚠️ VULNERABLE: No requiere HTTPS
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 semana
    }),
  );
}

/**
 * Elimina la cookie de sesión
 * @param {object} res - Response object
 */
function clearSession(res) {
  res.setHeader(
    "Set-Cookie",
    cookie.serialize(COOKIE_NAME, "", {
      httpOnly: false,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    }),
  );
}

/**
 * Middleware para verificar autenticación
 * @param {object} req
 * @returns {boolean}
 */
function isAuthenticated(req) {
  const session = getSession(req);
  return session !== null && session.userId;
}

/**
 * Middleware para verificar si es admin
 *
 * ⚠️ VULNERABLE: Confía en el valor de la cookie que el usuario puede modificar
 *
 * @param {object} req
 * @returns {boolean}
 */
function isAdmin(req) {
  const session = getSession(req);
  // ⚠️ VULNERABLE: El atacante puede cambiar la cookie a "1:admin"
  return session !== null && session.role === "admin";
}

module.exports = {
  COOKIE_NAME,
  parseCookies,
  getSession,
  setSession,
  clearSession,
  isAuthenticated,
  isAdmin,
};
