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
};

export default nextConfig;
