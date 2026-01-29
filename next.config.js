/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Permitir que las API routes accedan a módulos nativos
  serverExternalPackages: ["better-sqlite3"],
};

module.exports = nextConfig;
