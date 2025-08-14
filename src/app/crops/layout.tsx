// /src/app/crops/layout.tsx
// 将运行时与动态渲染配置提升到 segment 级，避免多路由重复导出引发合并冲突

export default function CropsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
