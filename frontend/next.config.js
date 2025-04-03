/** @type {import('next').NextConfig} */

// 从环境变量读取后端 API 地址，提供一个默认值用于本地开发
// 从环境变量读取后端 API 地址，使用 NEXT_PUBLIC_ 前缀确保 Next.js 正确处理
// 提供一个默认值用于本地开发
// 注意：在运行时读取环境变量，确保Docker环境中的变量能被正确使用
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    // 在运行时读取环境变量，而不是在构建时
    const backendApiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8000';
    console.log('Using backend API URL:', backendApiUrl);
    
    return [
      {
        source: '/api/:path*',
        // 使用环境变量配置目标地址
        destination: `${backendApiUrl}/api/:path*`,
      },
    ];
  },
  // 如果使用 Docker，可以考虑启用 standalone 输出以优化镜像大小
  // 这会将必要的依赖项复制到一个独立的 .next/standalone 目录中
  // 需要相应调整 frontend/Dockerfile
  // output: 'standalone',
};

module.exports = nextConfig;