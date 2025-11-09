import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['localhost'], // для разработки
      // Для продакшена добавьте ваши домены:
      // domains: ['localhost', 'your-production-domain.com', 'api.yourdomain.com'],
  },
};

export default nextConfig;
