import React from "react";
import Link from "next/link";
import {
  PRIORITY_COLORS,
  STATUS_COLORS,
  STATUS_ICONS,
  PRIORITY_LABELS,
  STATUS_LABELS,
} from "../../../shared/constants";

/**
 * TicketCard Component - Tarjeta de ticket en el dashboard
 */
export default function TicketCard({ ticket }) {
  const priorityClass =
    PRIORITY_COLORS[ticket.priority] || PRIORITY_COLORS.medium;
  const statusClass = STATUS_COLORS[ticket.status] || STATUS_COLORS.open;
  const statusIcon = STATUS_ICONS[ticket.status] || "🟢";

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Link href={`/tickets/${ticket.id}`}>
      <div className="card hover:shadow-md transition-shadow duration-200 cursor-pointer">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* Título y ID */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-techcorp-400 text-sm">#{ticket.id}</span>
              <h3 className="font-medium text-techcorp-900 line-clamp-1">
                {ticket.title}
              </h3>
            </div>

            {/* Descripción truncada */}
            <p className="text-sm text-techcorp-600 line-clamp-2 mb-3">
              {ticket.description.replace(/<[^>]*>/g, "")}{" "}
              {/* Strip HTML para preview */}
            </p>

            {/* Badges */}
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}
              >
                {statusIcon} {STATUS_LABELS[ticket.status] || ticket.status}
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${priorityClass}`}
              >
                {PRIORITY_LABELS[ticket.priority] || ticket.priority}
              </span>
            </div>
          </div>

          {/* Fecha */}
          <div className="text-right ml-4">
            <p className="text-xs text-techcorp-400">
              {formatDate(ticket.created_at)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
