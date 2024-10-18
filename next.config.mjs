/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  env: {
    API_URL: process.env.API_URL || 'http://localhost:3000',
    API_SECRET: process.env.API_SECRET || 'secret',
  },
}

export default nextConfig
