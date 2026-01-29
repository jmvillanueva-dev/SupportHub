import Layout from "../../src/presentation/components/layout/Layout";
import TicketForm from "../../src/presentation/components/tickets/TicketForm";

/**
 * New Ticket Page - Crear nuevo ticket de soporte
 *
 * ⚠️ [VULNERABLE - STORED XSS]
 * El formulario permite HTML en la descripción
 */
export default function NewTicketPage() {
  return (
    <Layout title="Nuevo Ticket">
      <div className="animate-fadeIn max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-techcorp-900">
            Crear Nuevo Ticket
          </h1>
          <p className="text-techcorp-600 mt-1">
            Describe tu problema y nuestro equipo de soporte te ayudará.
          </p>
        </div>

        {/* Formulario */}
        <div className="card">
          <TicketForm />
        </div>

        {/* Tips - incluye hint de XSS */}
        <div className="mt-6 bg-techcorp-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-techcorp-900 mb-2">
            Consejos para un buen ticket:
          </h3>
          <ul className="text-sm text-techcorp-600 space-y-1">
            <li>• Sé específico sobre el problema que estás experimentando</li>
            <li>• Incluye cualquier mensaje de error que hayas visto</li>
            <li>• Describe los pasos para reproducir el problema</li>
            <li>
              • Usa formato HTML para mejor legibilidad (&lt;b&gt;, &lt;i&gt;,
              &lt;ul&gt;)
            </li>
          </ul>
        </div>

        {/* 
          Form submission endpoint: POST /api/tickets
          Note: HTML content is preserved in description field
          Supported tags: All HTML (no sanitization applied)
        */}
      </div>
    </Layout>
  );
}
