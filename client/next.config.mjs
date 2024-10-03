/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images:{
    // domains: ["www.gravatar.com", "localhost"],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/**', // match any path on example.com
      },
      {
        protocol: 'https',
        hostname: 'www.gravatar.com',
        pathname: '/**', // match any path on example.com
      }

    ],
  }
};

export default nextConfig;
