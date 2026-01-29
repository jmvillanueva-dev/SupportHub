import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

/**
 * Navbar Component - Barra de navegación superior
 * Estilo corporativo TechCorp Inc.
 */
export default function Navbar({ user, onLogout }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      if (onLogout) onLogout();
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <>
      {/* 
        ========================================
        TechCorp Inc. - SupportHub v2.1.0
        Internal Support System
        ========================================
        
        TODO: Remove debug endpoints before production deploy
        Debug API: /api/admin/users
        Test accounts: jdoe/johndoe123, sysadmin/Admin@TechCorp2024!
      */}
      <nav className="bg-techcorp-900 text-white shadow-lg fixed top-0 left-0 right-0 z-50">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo y nombre */}
            <div className="flex items-center">
              <Link href="/dashboard" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-accent-500 rounded-lg flex items-center justify-center">
                  <span className="text-xl font-bold">TC</span>
                </div>
                <div className="hidden md:block">
                  <h1 className="text-lg font-semibold">TechCorp Inc.</h1>
                  <p className="text-xs text-techcorp-300">SupportHub</p>
                </div>
              </Link>
            </div>

            {/* Navegación central */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                href="/dashboard"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  router.pathname === "/dashboard"
                    ? "bg-techcorp-800 text-white"
                    : "text-techcorp-300 hover:bg-techcorp-800 hover:text-white"
                }`}
              >
                Panel Principal
              </Link>
              <Link
                href="/tickets/new"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  router.pathname === "/tickets/new"
                    ? "bg-techcorp-800 text-white"
                    : "text-techcorp-300 hover:bg-techcorp-800 hover:text-white"
                }`}
              >
                Nuevo Ticket
              </Link>
              {user?.role === "admin" && (
                <Link
                  href="/admin/tools"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    router.pathname === "/admin/tools"
                      ? "bg-techcorp-800 text-white"
                      : "text-techcorp-300 hover:bg-techcorp-800 hover:text-white"
                  }`}
                >
                  Herramientas Admin
                </Link>
              )}
            </div>

            {/* Usuario y logout */}
            <div className="flex items-center space-x-4">
              {user && (
                <>
                  <div className="hidden sm:flex items-center space-x-2">
                    <div className="w-8 h-8 bg-techcorp-700 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">
                        {user.username?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">{user.username}</p>
                      <p className="text-techcorp-400 text-xs capitalize">
                        {user.role}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 text-sm font-medium text-techcorp-300 hover:text-white hover:bg-techcorp-800 rounded-md transition-colors"
                  >
                    Cerrar Sesión
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
