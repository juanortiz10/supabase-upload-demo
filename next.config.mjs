/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'adrqigrvexlkoamyyeyz.supabase.co',
            port: '',
          },
        ],
    },
    experimental: {
      serverActions: {
        bodySizeLimit: '10mb',
      }
    }
};

export default nextConfig;
