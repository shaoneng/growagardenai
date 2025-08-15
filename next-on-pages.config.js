/** @type {import('@cloudflare/next-on-pages').Config} */
const config = {
  // 跳过重复标识符检查（临时解决方案）
  skipDuplicateIdentifierCheck: true,
  
  // 其他配置选项
  experimental: {
    // 启用实验性功能
    minify: true,
  },
  
  // 排除某些文件或目录
  exclude: [
    // 排除测试文件
    '**/*.test.*',
    '**/*.spec.*',
    // 排除开发工具
    '**/scripts/**',
    '**/tests/**',
  ],
};

module.exports = config;