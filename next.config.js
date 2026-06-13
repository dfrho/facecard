/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // domains: ['localhost'], // Deprecated: Move to remotePatterns
    remotePatterns: [
      // Commenting out placeholder to debug fetch errors
      // {
      //   protocol: 'https',
      //   hostname: 'via.placeholder.com',
      //   port: '',
      //   pathname: '/**',
      // },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media.licdn.com', // Add LinkedIn media domain
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http', // Add localhost for local development
        hostname: 'localhost',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
