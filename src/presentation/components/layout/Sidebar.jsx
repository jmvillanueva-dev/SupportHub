import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

// Iconos SVG como componentes
const DashboardIcon = () => (
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
      d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
    />
  </svg>
);

const TicketIcon = () => (
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
      d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
    />
  </svg>
);

const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

const ToolsIcon = () => (
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
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const LogoutIcon = () => (
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
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    />
  </svg>
);

const UsersIcon = () => (
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
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);

/**
 * Sidebar Component - Panel lateral de navegación
 * Estilo corporativo TechCorp Inc.
 */
export default function Sidebar({ user, onLogout }) {
  const router = useRouter();

  const isActive = (path) => router.pathname === path;

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      if (onLogout) onLogout();
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const menuItems = [
    {
      name: "Panel Principal",
      href: "/dashboard",
      icon: DashboardIcon,
      roles: ["user", "admin"],
    },
    {
      name: "Mis Tickets",
      href: "/dashboard",
      icon: TicketIcon,
      roles: ["user", "admin"],
    },
    {
      name: "Crear Ticket",
      href: "/tickets/new",
      icon: PlusIcon,
      roles: ["user", "admin"],
    },
    {
      name: "Herramientas Admin",
      href: "/admin/tools",
      icon: ToolsIcon,
      roles: ["admin"],
    },
    {
      name: "Gestión de Usuarios",
      href: "/admin/users",
      icon: UsersIcon,
      roles: ["admin"],
    },
  ];

  const filteredMenu = menuItems.filter((item) =>
    item.roles.includes(user?.role || "user"),
  );

  return (
    <>
      {/* 
        Sidebar Navigation Component
        Version: 2.1.0
        
        Available admin routes:
        - /admin/tools (network utilities)
        - /api/admin/users (user management API)
        - /api/admin/ping (network diagnostic)
      */}
      <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-techcorp-100 shadow-sm z-40">
        <div className="flex flex-col h-full">
          {/* Sección principal del menú */}
          <div className="flex-1 py-6 px-4">
            <nav className="space-y-2">
              {filteredMenu.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.href + item.name}
                    href={item.href}
                    className={`sidebar-link ${isActive(item.href) ? "sidebar-link-active" : ""}`}
                  >
                    <IconComponent />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Separador */}
            <div className="my-6 border-t border-techcorp-100"></div>

            {/* Info del usuario */}
            <div className="px-4">
              <p className="text-xs font-medium text-techcorp-500 uppercase tracking-wider mb-3">
                Info de Cuenta
              </p>
              <div className="bg-techcorp-50 rounded-lg p-3">
                <p className="text-sm font-medium text-techcorp-900">
                  {user?.username}
                </p>
                <p className="text-xs text-techcorp-500 capitalize">
                  {user?.role}
                </p>
                <p className="text-xs text-techcorp-400 mt-1">ID: {user?.id}</p>
              </div>
            </div>
          </div>

          {/* Botón Cerrar Sesión */}
          <div className="px-4 pb-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium bg-red-50 text-red-600 hover:bg-red-500 hover:text-white border border-red-200 hover:border-red-500 rounded-lg transition-all duration-200"
            >
              <LogoutIcon />
              Cerrar Sesión
            </button>
          </div>

          {/* Footer del sidebar */}
          <div className="p-4 border-t border-techcorp-100">
            <div className="text-xs text-techcorp-400">
              <p>TechCorp Inc. © 2024</p>
              <p>SupportHub v2.1.0</p>
              {/* Build info for debugging - remove in production */}
              <p className="mt-2 text-techcorp-300">Build: dev-2024.01.15</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
