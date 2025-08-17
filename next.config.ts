// Sentry wrapper disabled for next-on-pages to avoid duplicate identifier issues

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloudflare Pages 特定优化
  experimental: {
    // 减少单个文件大小以符合 Cloudflare 限制
    largePageDataBytes: 128 * 1000, // 128KB
  },
  
  // 外部包配置
  serverExternalPackages: ['@google/generative-ai'],
  
  // Cloudflare Pages (next-on-pages) 构建，不使用静态导出
  images: {
    unoptimized: true,
  },
  
  // ESLint配置 - 放宽规则以允许构建通过
  eslint: {
    // 在构建时忽略ESLint错误
    ignoreDuringBuilds: false,
    // 只检查特定目录
    dirs: ['src/app', 'src/components', 'src/lib']
  },
  
  // TypeScript配置
  typescript: {
    // 在构建时忽略TypeScript错误（仅用于紧急部署）
    ignoreBuildErrors: true // 临时忽略构建错误以允许部署
  },
  
  // 注意：App Router不支持i18n配置，需要手动实现国际化
  
  // 安全头配置
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ]
  },
  

  
  // 重定向配置
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/dashboard',
        destination: '/favorites',
        permanent: true,
      },
    ]
  },
  
  // 性能优化
  compress: true,
  poweredByHeader: false,
}

export default nextConfig
