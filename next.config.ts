/** @type {import('next').NextConfig} */
const nextConfig = {
  // 这是新增的配置
  experimental: {
    // 这个选项会改变Next.js打包（bundle）大型库的方式
    // 从而避免生成单个过大的文件，以适应Cloudflare等平台的限制
    largePageDataBytes: 128 * 1000, // 128kb (这是一个推荐的默认值)
  },
};

export default nextConfig;