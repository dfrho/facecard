/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // @vercel/blob ships an undici build that Next 14.0's bundler can't parse, so load it
    // from node_modules at runtime instead of bundling it into the server code.
    serverComponentsExternalPackages: ['@vercel/blob'],
  },
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
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com', // Uploaded profile photos (Vercel Blob)
        port: '',
        pathname: '/avatars/**',
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
