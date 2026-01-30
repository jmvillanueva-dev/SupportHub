import { useState } from "react";
import Head from "next/head";

/**
 * Fake Login Page - Para demostración de Phishing via Stored XSS
 */
export default function FakeLoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // En un ataque real, esto enviaría los datos a un servidor atacante.
    // Para el laboratorio, simplemente los mostramos en un alert.
    alert(`[PHISHING EXITOSO]\n\nCredenciales capturadas:\nUsuario: ${formData.username}\nContraseña: ${formData.password}\n\nEnviando a servidor atacante...`);
    
    // Opcional: Redirigir de vuelta al login real después del alert
    window.location.href = "/login";
  };

  return (
    <>
      <Head>
        <title>Iniciar Sesión | TechCorp SupportHub</title>
      </Head>

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
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
               <p className="text-sm text-yellow-700">
                 Su sesión ha expirado por razones de seguridad. Por favor, ingrese sus credenciales nuevamente.
               </p>
            </div>

            <h2 className="text-2xl font-semibold text-techcorp-900 mb-6 text-center">
              Iniciar Sesión
            </h2>

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
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-techcorp-700 mb-2"
                >
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="input-field pr-12"
                    placeholder="Ingrese su contraseña"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-techcorp-400 hover:text-techcorp-600 transition-colors"
                  >
                    {showPassword ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full btn-primary py-3 text-base"
              >
                Iniciar Sesión
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
