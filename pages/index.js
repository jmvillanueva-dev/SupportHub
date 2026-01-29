import { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

/**
 * Home Page - Redirige al login o dashboard
 */
export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Verificar si hay sesión activa
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me");
        const data = await response.json();

        if (data.success) {
          router.push("/dashboard");
        } else {
          router.push("/login");
        }
      } catch (error) {
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  return (
    <>
      <Head>
        <title>SupportHub | TechCorp Inc.</title>
        <meta
          name="description"
          content="TechCorp Inc. Internal Support System"
        />
      </Head>

      <div className="min-h-screen bg-techcorp-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl font-bold text-white">TC</span>
          </div>
          <h1 className="text-2xl font-semibold text-white mb-2">
            TechCorp Inc.
          </h1>
          <p className="text-techcorp-400">Loading SupportHub...</p>
          <div className="mt-6">
            <div className="w-8 h-8 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      </div>
    </>
  );
}
