/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  // Docker 部署优化：生成独立运行的最小化版本
  output: "standalone",
};

module.exports = nextConfig;
