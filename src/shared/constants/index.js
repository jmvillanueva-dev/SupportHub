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
  low: "bg-slate-100 text-slate-700 border border-slate-200",
  medium: "bg-blue-100 text-blue-700 border border-blue-200",
  high: "bg-orange-100 text-orange-700 border border-orange-200",
  critical: "bg-red-100 text-red-700 border border-red-200",
};

// Colores por estado (para UI)
const STATUS_COLORS = {
  open: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  in_progress: "bg-amber-100 text-amber-700 border border-amber-200",
  closed: "bg-slate-100 text-slate-600 border border-slate-200",
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
