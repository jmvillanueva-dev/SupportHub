import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../../src/presentation/components/layout/Layout";
import TicketDetail from "../../src/presentation/components/tickets/TicketDetail";
import Link from "next/link";

/**
 * Ticket Detail Page - Vista detallada de un ticket
 *
 * ⚠️ [VULNERABLE - IDOR + STORED XSS]
 * - IDOR: Cualquier usuario puede ver cualquier ticket cambiando el ID
 * - XSS: La descripción se renderiza sin sanitizar
 */
export default function TicketDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      fetchTicket();
    }
  }, [id]);

  const fetchTicket = async () => {
    try {
      // ⚠️ VULNERABLE - IDOR
      // No se valida si el usuario tiene acceso a este ticket
      const response = await fetch(`/api/tickets/${id}`);
      const data = await response.json();

      if (data.success) {
        setTicket(data.ticket);
      } else {
        setError(data.error || "Ticket not found");
      }
    } catch (err) {
      setError("Failed to load ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title={ticket ? `Ticket #${ticket.id}` : "Ticket Details"}>
      <div className="animate-fadeIn">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-techcorp-500">
            <li>
              <Link href="/dashboard" className="hover:text-accent-600">
                Dashboard
              </Link>
            </li>
            <li>/</li>
            <li className="text-techcorp-900 font-medium">Ticket #{id}</li>
          </ol>
        </nav>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-techcorp-600">Loading ticket...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">❌</div>
            <h3 className="text-lg font-medium text-red-800 mb-2">Error</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <Link href="/dashboard" className="btn-primary">
              Back to Dashboard
            </Link>
          </div>
        ) : ticket ? (
          <>
            {/* Ticket Detail Component - XSS se renderiza aquí */}
            <TicketDetail ticket={ticket} />

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              <Link href="/dashboard" className="btn-secondary">
                ← Back to Dashboard
              </Link>
            </div>

            {/* 
              Ticket Details Debug Info:
              - Ticket ID: {ticket.id}
              - Owner User ID: {ticket.user_id}
              - Current URL: /tickets/{id}
              
              Security Note: Access control not implemented
              Any authenticated user can view any ticket by changing the ID
              Try: /tickets/1, /tickets/3, /tickets/6 for sensitive data
            */}
          </>
        ) : null}
      </div>
    </Layout>
  );
}
