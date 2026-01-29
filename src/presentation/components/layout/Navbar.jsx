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
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  router.pathname === "/dashboard"
                    ? "bg-techcorp-800 text-white"
                    : "text-techcorp-300 hover:bg-techcorp-800 hover:text-white"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                  />
                </svg>
                Panel Principal
              </Link>
              <Link
                href="/tickets/new"
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  router.pathname === "/tickets/new"
                    ? "bg-techcorp-800 text-white"
                    : "text-techcorp-300 hover:bg-techcorp-800 hover:text-white"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Nuevo Ticket
              </Link>
              {user?.role === "admin" && (
                <Link
                  href="/admin/tools"
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    router.pathname === "/admin/tools"
                      ? "bg-techcorp-800 text-white"
                      : "text-techcorp-300 hover:bg-techcorp-800 hover:text-white"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Herramientas Admin
                </Link>
              )}
              {user?.role === "admin" && (
                <Link
                  href="/admin/users"
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    router.pathname === "/admin/users"
                      ? "bg-techcorp-800 text-white"
                      : "text-techcorp-300 hover:bg-techcorp-800 hover:text-white"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
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
                  Usuarios
                </Link>
              )}
            </div>

            {/* Usuario */}
            <div className="flex items-center">
              {user && (
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
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
