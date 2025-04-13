if (typeof Headers === 'undefined') {
  global.Headers = require('node-fetch').Headers;
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    // 这个变量将在浏览器端可用
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000', // 默认值用于本地开发
  },
}

module.exports = nextConfig;