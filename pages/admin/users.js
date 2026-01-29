import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../../src/presentation/components/layout/Layout";

/**
 * Admin Users Page - Gestión de usuarios
 * Solo accesible para administradores
 */
export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "user",
  });
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users");
      const data = await response.json();

      if (data.success) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/admin/users/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(`Usuario "${data.user.username}" creado exitosamente`);
        setFormData({ username: "", password: "", role: "user" });
        setShowForm(false);
        fetchUsers(); // Recargar lista
      } else {
        setError(data.error || "Error al crear usuario");
      }
    } catch (err) {
      setError("Error de red. Por favor intenta de nuevo.");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <Layout title="Gestión de Usuarios">
      <div className="animate-fadeIn">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-techcorp-900">
              Gestión de Usuarios
            </h1>
            <p className="text-techcorp-600 mt-1">
              Administra los usuarios del sistema
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
            Nuevo Usuario
          </button>
        </div>

        {/* Mensajes */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <strong>Error:</strong> {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            <strong>Éxito:</strong> {success}
          </div>
        )}

        {/* Formulario de creación */}
        {showForm && (
          <div className="card mb-6">
            <h2 className="text-lg font-semibold text-techcorp-900 mb-4 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-accent-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
              Crear Nuevo Usuario
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-techcorp-700 mb-2"
                  >
                    Nombre de Usuario <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    minLength={3}
                    className="input-field"
                    placeholder="ej. nuevo_usuario"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-techcorp-700 mb-2"
                  >
                    Contraseña <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="input-field"
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>

                <div>
                  <label
                    htmlFor="role"
                    className="block text-sm font-medium text-techcorp-700 mb-2"
                  >
                    Rol
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="user">Usuario</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="btn-primary disabled:opacity-50"
                >
                  {formLoading ? "Creando..." : "Crear Usuario"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de usuarios */}
        <div className="card">
          <h2 className="text-lg font-semibold text-techcorp-900 mb-4 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-accent-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            Usuarios Registrados ({users.length})
          </h2>

          {loading ? (
            <div className="text-center py-8">
              <div className="w-10 h-10 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-3 text-techcorp-600">Cargando usuarios...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-techcorp-500">
              No hay usuarios registrados
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-techcorp-100">
                    <th className="text-left py-3 px-4 text-sm font-medium text-techcorp-600">
                      ID
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-techcorp-600">
                      Usuario
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-techcorp-600">
                      Rol
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-techcorp-600">
                      Fecha de Registro
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-techcorp-50 hover:bg-techcorp-50 transition-colors"
                    >
                      <td className="py-3 px-4 text-sm text-techcorp-500">
                        #{user.id}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-techcorp-200 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-techcorp-700">
                              {user.username?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="font-medium text-techcorp-900">
                            {user.username}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.role === "admin"
                              ? "bg-purple-100 text-purple-700 border border-purple-200"
                              : "bg-blue-100 text-blue-700 border border-blue-200"
                          }`}
                        >
                          {user.role === "admin" ? "Administrador" : "Usuario"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-techcorp-500">
                        {user.created_at
                          ? new Date(user.created_at).toLocaleDateString(
                              "es-ES",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )
                          : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 
          ============================================
          Admin Users Management
          ============================================
          
          API Endpoints:
          - GET /api/admin/users (list all users - no auth check!)
          - POST /api/admin/users/create (create new user)
          
          Note: The GET endpoint has no authentication check
          This is intentional for educational purposes (data exposure)
          ============================================
        */}
      </div>
    </Layout>
  );
}
