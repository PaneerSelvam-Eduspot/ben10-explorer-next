/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  images: {
    remotePatterns:[
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/public/**'
      },
      {
        protocol: 'https',
        hostname: 'ben10-api-u7dc.onrender.com',
        pathname: '/public/**'
      }
    ]
  }
};

export default nextConfig;
