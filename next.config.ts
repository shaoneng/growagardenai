import { withSentryConfig } from '@sentry/nextjs'

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // 这个选项会改变Next.js打包（bundle）大型库的方式
    // 从而避免生成单个过大的文件，以适应Cloudflare等平台的限制
    largePageDataBytes: 128 * 1000, // 128kb
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
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ]
  },
  
  // 图片优化配置
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
    unoptimized: process.env.NODE_ENV === 'development', // 开发环境不优化图片
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/images/**',
      },
    ],
  },
  
  // 性能优化
  compress: true,
  poweredByHeader: false,
}

// Sentry配置
const sentryWebpackPluginOptions = {
  silent: true,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
}

export default withSentryConfig(nextConfig, sentryWebpackPluginOptions)