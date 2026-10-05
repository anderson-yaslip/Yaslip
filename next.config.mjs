/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Mantém o Turbopack nesta aplicação, sem herdar configs da pasta pai.
  turbopack: {
    root: process.cwd(),
  },
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
