import "../styles/globals.css";

/**
 * App Component - Punto de entrada de Next.js
 * Carga estilos globales de TailwindCSS
 */
function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
