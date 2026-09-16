import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async redirects() {
    return [
      { source: "/beta-tareas", destination: "/servicios", permanent: true },
      { source: "/en/beta-tareas", destination: "/en/servicios", permanent: true },
    ];
  },
};

export default nextConfig;
