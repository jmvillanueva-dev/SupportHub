import { useState, useEffect } from "react";
import Layout from "../src/presentation/components/layout/Layout";
import TicketCard from "../src/presentation/components/tickets/TicketCard";
import Link from "next/link";

/**
 * Dashboard Page - Lista de tickets del usuario
 */
export default function DashboardPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await fetch("/api/tickets");
      const data = await response.json();

      if (data.success) {
        setTickets(data.tickets);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    if (filter === "all") return true;
    return ticket.status === filter;
  });

  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === "open").length,
    in_progress: tickets.filter((t) => t.status === "in_progress").length,
    closed: tickets.filter((t) => t.status === "closed").length,
  };

  return (
    <Layout title="Panel Principal">
      <div className="animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-techcorp-900">
              Panel Principal
            </h1>
            <p className="text-techcorp-600 mt-1">
              Gestiona tus tickets de soporte
            </p>
          </div>
          <Link href="/tickets/new" className="btn-primary">
            + Nuevo Ticket
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="card bg-gradient-to-br from-accent-500 to-accent-600 text-white">
            <p className="text-accent-100 text-sm">Total de Tickets</p>
            <p className="text-3xl font-bold mt-1">{stats.total}</p>
          </div>
          <div className="card">
            <p className="text-techcorp-500 text-sm">Abiertos</p>
            <p className="text-3xl font-bold text-green-600 mt-1">
              {stats.open}
            </p>
          </div>
          <div className="card">
            <p className="text-techcorp-500 text-sm">En Progreso</p>
            <p className="text-3xl font-bold text-yellow-600 mt-1">
              {stats.in_progress}
            </p>
          </div>
          <div className="card">
            <p className="text-techcorp-500 text-sm">Cerrados</p>
            <p className="text-3xl font-bold text-gray-600 mt-1">
              {stats.closed}
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {["all", "open", "in_progress", "closed"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === status
                  ? "bg-accent-600 text-white"
                  : "bg-white text-techcorp-600 hover:bg-techcorp-50"
              }`}
            >
              {status === "all"
                ? "Todos los Tickets"
                : status === "open"
                  ? "Abiertos"
                  : status === "in_progress"
                    ? "En Progreso"
                    : "Cerrados"}
            </button>
          ))}
        </div>

        {/* Tickets List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-techcorp-600">Cargando tickets...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            {error}
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-techcorp-100">
            <div className="text-5xl mb-4">🎫</div>
            <h3 className="text-lg font-medium text-techcorp-900 mb-2">
              No se encontraron tickets
            </h3>
            <p className="text-techcorp-600 mb-4">
              {filter === "all"
                ? "Aún no has creado ningún ticket."
                : `No hay tickets ${filter === "open" ? "abiertos" : filter === "in_progress" ? "en progreso" : "cerrados"}.`}
            </p>
            <Link href="/tickets/new" className="btn-primary">
              Crea tu primer ticket
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        )}

        {/* Debug hint en comentario HTML */}
        {/* 
          Dashboard loaded successfully.
          User tickets endpoint: GET /api/tickets
          Single ticket endpoint: GET /api/tickets/:id
          
          Hint: Try accessing /tickets/3 or /tickets/6 for confidential data
        */}
      </div>
    </Layout>
  );
}
