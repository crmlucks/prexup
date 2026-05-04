/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Evita errores de linting durante el build para que sea más rápido
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    cpus: 1,
    workerThreads: false,
    memoryBasedWorkersCount: false
  }
};

export default nextConfig;
