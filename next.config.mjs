/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  env: {
    API_URL: process.env.API_URL ,
    API_SECRET: process.env.API_SECRET,
  },
}

export default nextConfig
