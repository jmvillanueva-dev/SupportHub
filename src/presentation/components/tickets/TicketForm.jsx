import React, { useState } from "react";
import { useRouter } from "next/router";

/**
 * TicketForm Component - Formulario para crear tickets
 *
 * ⚠️ [VULNERABLE - STORED XSS]
 * No hay sanitización del contenido antes de enviar
 */
export default function TicketForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // ⚠️ VULNERABLE: No hay sanitización - XSS payload se envía directo
      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        // Redirigir al nuevo ticket
        router.push(`/tickets/${data.ticket.id}`);
      } else {
        setError(data.error || "Failed to create ticket");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Título */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-techcorp-700 mb-2"
        >
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="input-field"
          placeholder="Brief description of the issue"
        />
      </div>

      {/* Prioridad */}
      <div>
        <label
          htmlFor="priority"
          className="block text-sm font-medium text-techcorp-700 mb-2"
        >
          Priority
        </label>
        <select
          id="priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="input-field"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
      </div>

      {/* Descripción - VULNERABLE A XSS */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-techcorp-700 mb-2"
        >
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={6}
          className="input-field resize-none"
          placeholder="Describe your issue in detail. You can use HTML for formatting."
        />
        {/* Hint intencional para XSS */}
        <p className="mt-1 text-xs text-techcorp-400">
          Tip: HTML formatting is supported (e.g., &lt;b&gt;bold&lt;/b&gt;,
          &lt;i&gt;italic&lt;/i&gt;)
        </p>
      </div>

      {/* Botón submit */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-secondary"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creating..." : "Create Ticket"}
        </button>
      </div>
    </form>
  );
}
