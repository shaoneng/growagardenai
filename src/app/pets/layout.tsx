// /src/app/pets/layout.tsx
// 将运行时与动态渲染配置提升到 segment 级，避免多路由重复导出引发合并冲突

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default function PetsLayout({ children }: { children: React.ReactNode }) {
  return children;
}

