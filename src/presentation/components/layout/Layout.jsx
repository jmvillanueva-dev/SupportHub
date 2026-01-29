import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

/**
 * Layout Component - Estructura principal de la aplicación
 * Envuelve todas las páginas autenticadas
 */
export default function Layout({ children, title = "SupportHub" }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch("/api/auth/me");
      const data = await response.json();

      if (data.success) {
        setUser(data.user);
      } else {
        // No autenticado, redirigir a login
        router.push("/login");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-techcorp-600">Loading SupportHub...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{title} | TechCorp SupportHub</title>
        <meta
          name="description"
          content="TechCorp Inc. Internal Support System"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        {/* 
          Meta tags for internal use
          System: SupportHub v2.1.0
          API Documentation: /api/admin/users (internal only)
        */}
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Navbar fija en la parte superior */}
        <Navbar user={user} onLogout={handleLogout} />

        {/* Sidebar fija en la izquierda */}
        <Sidebar user={user} onLogout={handleLogout} />

        {/* Contenido principal */}
        <main className="pt-16 pl-64">
          <div className="p-6">
            {/* Pasar el usuario como prop a los children */}
            {React.Children.map(children, (child) => {
              if (React.isValidElement(child)) {
                return React.cloneElement(child, { user });
              }
              return child;
            })}
          </div>
        </main>
      </div>
    </>
  );
}
