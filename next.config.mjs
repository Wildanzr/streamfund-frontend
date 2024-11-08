/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding",);
    return config;
  },
};

export default nextConfig;
