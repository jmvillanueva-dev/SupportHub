import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

/**
 * Login Page - Página de autenticación
 *
 * ⚠️ [VULNERABLE - SQL INJECTION]
 * El formulario envía datos directamente al endpoint vulnerable
 */
export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        router.push("/dashboard");
      } else {
        // Mostrar error detallado (ayuda a SQLi error-based)
        setError(data.error || "Error de autenticación");
      }
    } catch (err) {
      setError("Error de red. Por favor intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Iniciar Sesión | TechCorp SupportHub</title>
        <meta
          name="description"
          content="Iniciar sesión en TechCorp SupportHub"
        />
      </Head>

      {/* 
        ============================================
        TechCorp Inc. - SupportHub Login
        ============================================
        
        Development Notes (TODO: Remove before production):
        - Default test accounts:
          * jdoe / johndoe123 (user)
          * sysadmin / Admin@TechCorp2024! (admin)
          * ceo_martinez / CEO#Secure!99 (admin)
        
        - Debug endpoint: GET /api/admin/users
        - Admin tools: /admin/tools (requires admin role)
        
        Known Issues:
        - SQL query logging enabled in console
        - Password validation needs improvement
        ============================================
      */}

      <div className="min-h-screen bg-gradient-to-br from-techcorp-900 to-techcorp-800 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-4xl font-bold text-white">TC</span>
            </div>
            <h1 className="text-3xl font-bold text-white">TechCorp Inc.</h1>
            <p className="text-techcorp-400 mt-2">Sistema de Soporte Interno</p>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-semibold text-techcorp-900 mb-6 text-center">
              Iniciar Sesión
            </h2>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
                {/* Error detallado - útil para SQLi error-based */}
                <strong>Error:</strong> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-techcorp-700 mb-2"
                >
                  Usuario
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="Ingrese su usuario"
                  autoComplete="username"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-techcorp-700 mb-2"
                >
                  Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="Ingrese su contraseña"
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 text-base disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Iniciando sesión...
                  </span>
                ) : (
                  "Iniciar Sesión"
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-techcorp-100">
              <p className="text-xs text-techcorp-400 text-center">
                Contacte al Soporte de TI si necesita ayuda para acceder a su
                cuenta.
              </p>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-techcorp-500 text-sm mt-8">
            © 2024 TechCorp Inc. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </>
  );
}
