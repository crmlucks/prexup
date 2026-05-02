/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Evita errores de linting durante el build para que sea más rápido
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
