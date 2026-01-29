/**
 * Constantes de la aplicación
 * Capa Compartida (Shared)
 */

// Roles de usuario
const ROLES = {
  ADMIN: "admin",
  USER: "user",
};

// Estados de ticket
const TICKET_STATUS = {
  OPEN: "open",
  IN_PROGRESS: "in_progress",
  CLOSED: "closed",
};

// Prioridades de ticket
const TICKET_PRIORITY = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  CRITICAL: "critical",
};

// Colores por prioridad (para UI)
const PRIORITY_COLORS = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-blue-100 text-blue-800",
  high: "bg-orange-100 text-orange-800",
  critical: "bg-red-100 text-red-800",
};

// Colores por estado (para UI)
const STATUS_COLORS = {
  open: "bg-green-100 text-green-800",
  in_progress: "bg-yellow-100 text-yellow-800",
  closed: "bg-gray-100 text-gray-800",
};

// Iconos por estado
const STATUS_ICONS = {
  open: "🟢",
  in_progress: "🟡",
  closed: "⚫",
};

// Labels traducidos para prioridades
const PRIORITY_LABELS = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
  critical: "Crítica",
};

// Labels traducidos para estados
const STATUS_LABELS = {
  open: "Abierto",
  in_progress: "En Progreso",
  closed: "Cerrado",
};

// Configuración de la empresa ficticia
const COMPANY = {
  name: "TechCorp Inc.",
  tagline: "Innovating Tomorrow, Today",
  logo: "/logo.svg",
  supportEmail: "support@techcorp.internal",
};

module.exports = {
  ROLES,
  TICKET_STATUS,
  TICKET_PRIORITY,
  PRIORITY_COLORS,
  STATUS_COLORS,
  STATUS_ICONS,
  PRIORITY_LABELS,
  STATUS_LABELS,
  COMPANY,
};
