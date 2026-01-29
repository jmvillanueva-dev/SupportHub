import { useState } from "react";
import Layout from "../../src/presentation/components/layout/Layout";

/**
 * Admin Tools Page - Panel de herramientas de administración
 *
 * ⚠️ [VULNERABLE - OS COMMAND INJECTION]
 * La herramienta de ping no sanitiza el input
 */
export default function AdminToolsPage({ user }) {
  const [ip, setIp] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePing = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOutput("");

    try {
      // ⚠️ VULNERABLE - Command Injection
      // El input se envía sin validación
      const response = await fetch("/api/admin/ping", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ip }),
      });

      const data = await response.json();

      if (response.ok) {
        setOutput(data.output || "No output received");
      } else {
        setError(data.error || "Request failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Admin Tools">
      <div className="animate-fadeIn">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-techcorp-900">Admin Tools</h1>
          <p className="text-techcorp-600 mt-1">
            Network diagnostics and system utilities
          </p>
        </div>

        {/* Warning Banner */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-yellow-600 text-xl">⚠️</span>
            <p className="text-sm text-yellow-800">
              <strong>Admin Access Required:</strong> These tools are restricted
              to system administrators only.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Network Ping Tool */}
          <div className="card">
            <h2 className="text-lg font-semibold text-techcorp-900 mb-4 flex items-center gap-2">
              <span>🔧</span> Network Connectivity Test
            </h2>
            <p className="text-sm text-techcorp-600 mb-4">
              Verify network connectivity to internal or external servers by
              entering an IP address.
            </p>

            <form onSubmit={handlePing} className="space-y-4">
              <div>
                <label
                  htmlFor="ip"
                  className="block text-sm font-medium text-techcorp-700 mb-2"
                >
                  IP Address or Hostname
                </label>
                <input
                  type="text"
                  id="ip"
                  value={ip}
                  onChange={(e) => setIp(e.target.value)}
                  className="input-field"
                  placeholder="e.g., 8.8.8.8 or google.com"
                  required
                />
                {/* Hint intencional */}
                <p className="mt-1 text-xs text-techcorp-400">
                  Enter the target IP address to check connectivity
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full disabled:opacity-50"
              >
                {loading ? "Running..." : "Run Ping Test"}
              </button>
            </form>

            {/* Output */}
            {(output || error) && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-techcorp-700 mb-2">
                  Output
                </label>
                <pre
                  className={`p-4 rounded-lg text-sm font-mono overflow-x-auto max-h-64 ${
                    error
                      ? "bg-red-50 text-red-700 border border-red-200"
                      : "bg-techcorp-900 text-green-400"
                  }`}
                >
                  {error || output}
                </pre>
              </div>
            )}
          </div>

          {/* System Info Card */}
          <div className="card">
            <h2 className="text-lg font-semibold text-techcorp-900 mb-4 flex items-center gap-2">
              <span>📊</span> System Information
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-techcorp-100">
                <span className="text-techcorp-600">Current User</span>
                <span className="font-medium text-techcorp-900">
                  {user?.username || "N/A"}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-techcorp-100">
                <span className="text-techcorp-600">Role</span>
                <span className="font-medium text-techcorp-900 capitalize">
                  {user?.role || "N/A"}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-techcorp-100">
                <span className="text-techcorp-600">User ID</span>
                <span className="font-medium text-techcorp-900">
                  {user?.id || "N/A"}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-techcorp-100">
                <span className="text-techcorp-600">System Version</span>
                <span className="font-medium text-techcorp-900">
                  SupportHub v2.1.0
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-techcorp-600">Environment</span>
                <span className="font-medium text-techcorp-900">
                  Development
                </span>
              </div>
            </div>

            {/* Debug links */}
            <div className="mt-6 pt-4 border-t border-techcorp-100">
              <p className="text-xs text-techcorp-400 mb-2">
                Quick Links (Dev Only):
              </p>
              <div className="space-y-1">
                <a
                  href="/api/admin/users"
                  target="_blank"
                  className="text-xs text-accent-600 hover:underline block"
                >
                  → View All Users (Debug API)
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 
          ============================================
          Admin Tools Panel
          ============================================
          
          Available endpoints:
          - POST /api/admin/ping (Command Injection vulnerable)
          - GET /api/admin/users (No auth check - data exposure)
          
          Ping command format:
          - Linux: ping -c 2 <ip>
          - Windows: ping -n 2 <ip>
          
          Command injection examples:
          - Linux: 8.8.8.8; cat /etc/passwd
          - Linux: 8.8.8.8; ls -la
          - Windows: 8.8.8.8 & whoami
          - Windows: 8.8.8.8 | dir C:\
          
          Bypass admin check: Change cookie to "userId:admin"
          ============================================
        */}
      </div>
    </Layout>
  );
}
