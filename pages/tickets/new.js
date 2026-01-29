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
    <Layout title="New Ticket">
      <div className="animate-fadeIn max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-techcorp-900">
            Create New Ticket
          </h1>
          <p className="text-techcorp-600 mt-1">
            Describe your issue and our support team will assist you.
          </p>
        </div>

        {/* Formulario */}
        <div className="card">
          <TicketForm />
        </div>

        {/* Tips - incluye hint de XSS */}
        <div className="mt-6 bg-techcorp-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-techcorp-900 mb-2">
            Tips for a good ticket:
          </h3>
          <ul className="text-sm text-techcorp-600 space-y-1">
            <li>• Be specific about the issue you're experiencing</li>
            <li>• Include any error messages you've seen</li>
            <li>• Describe steps to reproduce the problem</li>
            <li>
              • Use HTML formatting for better readability (&lt;b&gt;,
              &lt;i&gt;, &lt;ul&gt;)
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
