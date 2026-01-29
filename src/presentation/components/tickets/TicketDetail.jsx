import React from "react";
import {
  PRIORITY_COLORS,
  STATUS_COLORS,
  STATUS_ICONS,
} from "../../../shared/constants";

/**
 * TicketDetail Component - Vista detallada de un ticket
 *
 * ⚠️ [VULNERABLE - STORED XSS]
 * Usa dangerouslySetInnerHTML para renderizar la descripción
 * Sin sanitización previa
 */
export default function TicketDetail({ ticket }) {
  const priorityClass =
    PRIORITY_COLORS[ticket.priority] || PRIORITY_COLORS.medium;
  const statusClass = STATUS_COLORS[ticket.status] || STATUS_COLORS.open;
  const statusIcon = STATUS_ICONS[ticket.status] || "🟢";

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="card">
      {/* Header del ticket */}
      <div className="border-b border-techcorp-100 pb-4 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-techcorp-400 text-sm">
              Ticket #{ticket.id}
            </span>
            <h1 className="text-2xl font-semibold text-techcorp-900 mt-1">
              {ticket.title}
            </h1>
          </div>
          <div className="flex gap-2">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${statusClass}`}
            >
              {statusIcon} {ticket.status.replace("_", " ")}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${priorityClass}`}
            >
              {ticket.priority}
            </span>
          </div>
        </div>
      </div>

      {/* Metadatos */}
      <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
        <div>
          <p className="text-techcorp-500">Created</p>
          <p className="text-techcorp-900 font-medium">
            {formatDate(ticket.created_at)}
          </p>
        </div>
        <div>
          <p className="text-techcorp-500">Last Updated</p>
          <p className="text-techcorp-900 font-medium">
            {formatDate(ticket.updated_at)}
          </p>
        </div>
        <div>
          <p className="text-techcorp-500">Reporter ID</p>
          <p className="text-techcorp-900 font-medium">
            User #{ticket.user_id}
          </p>
        </div>
        <div>
          <p className="text-techcorp-500">Priority Level</p>
          <p className="text-techcorp-900 font-medium capitalize">
            {ticket.priority}
          </p>
        </div>
      </div>

      {/* Descripción - VULNERABLE A XSS */}
      <div className="border-t border-techcorp-100 pt-6">
        <h2 className="text-lg font-medium text-techcorp-900 mb-4">
          Description
        </h2>

        {/* 
          ⚠️ VULNERABLE - STORED XSS
          dangerouslySetInnerHTML renderiza HTML sin sanitizar
          Si ticket.description contiene <script>alert('XSS')</script>
          el script SE EJECUTARÁ en el navegador del usuario
          
          En producción usar: DOMPurify.sanitize(ticket.description)
        */}
        <div
          className="prose prose-techcorp max-w-none text-techcorp-700 bg-techcorp-50 rounded-lg p-4"
          dangerouslySetInnerHTML={{ __html: ticket.description }}
        />

        {/* Debug info - visible en HTML source */}
        {/* 
          Ticket raw data for debugging:
          ID: {ticket.id}
          User: {ticket.user_id}
          HTML content not sanitized
        */}
      </div>
    </div>
  );
}
