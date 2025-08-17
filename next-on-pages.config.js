/** @type {import('@cloudflare/next-on-pages').Config} */
const config = {
  // 跳过重复标识符检查（临时解决方案）
  skipDuplicateIdentifierCheck: true,
  
  // 其他配置选项
  experimental: {
    // 关闭 worker 压缩，避免重复标识符在压缩后冲突
    minify: false,
  },
  
  // 排除某些文件或目录
  exclude: [
    // 排除测试文件
    '**/*.test.*',
    '**/*.spec.*',
    // 排除开发工具
    '**/scripts/**',
    '**/tests/**',
    // 排除调试/测试 API 路由，避免与生产函数打包混合
    'src/app/api/debug-analyze/**',
    'src/app/api/test-analyze/**',
  ],
};

module.exports = config;
