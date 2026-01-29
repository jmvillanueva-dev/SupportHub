import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

/**
 * Sidebar Component - Panel lateral de navegación
 * Estilo corporativo TechCorp Inc.
 */
export default function Sidebar({ user }) {
  const router = useRouter();

  const isActive = (path) => router.pathname === path;

  const menuItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: "📊",
      roles: ["user", "admin"],
    },
    {
      name: "My Tickets",
      href: "/dashboard",
      icon: "🎫",
      roles: ["user", "admin"],
    },
    {
      name: "Create Ticket",
      href: "/tickets/new",
      icon: "➕",
      roles: ["user", "admin"],
    },
    {
      name: "Admin Tools",
      href: "/admin/tools",
      icon: "🔧",
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
              {filteredMenu.map((item) => (
                <Link
                  key={item.href + item.name}
                  href={item.href}
                  className={`sidebar-link ${isActive(item.href) ? "sidebar-link-active" : ""}`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>

            {/* Separador */}
            <div className="my-6 border-t border-techcorp-100"></div>

            {/* Info del usuario */}
            <div className="px-4">
              <p className="text-xs font-medium text-techcorp-500 uppercase tracking-wider mb-3">
                Account Info
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
