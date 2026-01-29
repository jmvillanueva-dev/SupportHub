import { useState, useEffect } from "react";
import Layout from "../../src/presentation/components/layout/Layout";

/**
 * Admin Tools Page - Panel de herramientas de administración
 *
 * ⚠️ [VULNERABLE - OS COMMAND INJECTION]
 * La herramienta de ping no sanitiza el input
 */
export default function AdminToolsPage() {
  const [ip, setIp] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Obtener información del usuario actual
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/me");
        const data = await response.json();
        if (data.success) {
          setUser(data.user);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
  }, []);

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
    <Layout title="Herramientas Admin">
      <div className="animate-fadeIn">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-techcorp-900">
            Herramientas de Administración
          </h1>
          <p className="text-techcorp-600 mt-1">
            Diagnósticos de red y utilidades del sistema
          </p>
        </div>

        {/* Warning Banner */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-yellow-600 text-xl">⚠️</span>
            <p className="text-sm text-yellow-800">
              <strong>Acceso de Administrador Requerido:</strong> Estas
              herramientas están restringidas solo para administradores del
              sistema.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Network Ping Tool */}
          <div className="card">
            <h2 className="text-lg font-semibold text-techcorp-900 mb-4 flex items-center gap-2">
              <span>🔧</span> Prueba de Conectividad de Red
            </h2>
            <p className="text-sm text-techcorp-600 mb-4">
              Verifica la conectividad de red hacia servidores internos o
              externos ingresando una dirección IP.
            </p>

            <form onSubmit={handlePing} className="space-y-4">
              <div>
                <label
                  htmlFor="ip"
                  className="block text-sm font-medium text-techcorp-700 mb-2"
                >
                  Dirección IP o Nombre de Host
                </label>
                <input
                  type="text"
                  id="ip"
                  value={ip}
                  onChange={(e) => setIp(e.target.value)}
                  className="input-field"
                  placeholder="ej., 8.8.8.8 o google.com"
                  required
                />
                {/* Hint intencional */}
                <p className="mt-1 text-xs text-techcorp-400">
                  Ingresa la dirección IP objetivo para verificar conectividad
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full disabled:opacity-50"
              >
                {loading ? "Ejecutando..." : "Ejecutar Prueba de Ping"}
              </button>
            </form>

            {/* Output */}
            {(output || error) && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-techcorp-700 mb-2">
                  Resultado
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
              <span>📊</span> Información del Sistema
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-techcorp-100">
                <span className="text-techcorp-600">Usuario Actual</span>
                <span className="font-medium text-techcorp-900">
                  {user?.username || "N/A"}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-techcorp-100">
                <span className="text-techcorp-600">Rol</span>
                <span className="font-medium text-techcorp-900 capitalize">
                  {user?.role || "N/A"}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-techcorp-100">
                <span className="text-techcorp-600">ID de Usuario</span>
                <span className="font-medium text-techcorp-900">
                  {user?.id || "N/A"}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-techcorp-100">
                <span className="text-techcorp-600">Versión del Sistema</span>
                <span className="font-medium text-techcorp-900">
                  SupportHub v2.1.0
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-techcorp-600">Entorno</span>
                <span className="font-medium text-techcorp-900">
                  Desarrollo
                </span>
              </div>
            </div>

            {/* Debug links */}
            <div className="mt-6 pt-4 border-t border-techcorp-100">
              <p className="text-xs text-techcorp-400 mb-2">
                Enlaces Rápidos (Solo Dev):
              </p>
              <div className="space-y-1">
                <a
                  href="/api/admin/users"
                  target="_blank"
                  className="text-xs text-accent-600 hover:underline block"
                >
                  → Ver Todos los Usuarios (API Debug)
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
