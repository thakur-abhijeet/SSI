/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "192.168.1.24",
        port: "8000",
      },
      {
        protocol: "http",
        hostname: "192.168.1.24",
        port: "8000",
      },
    ],
  },
};

module.exports = nextConfig;
