// /src/app/pets/[name]/page.tsx
// 宠物详情页

import { notFound } from 'next/navigation';
import PetDetailPage from '../../components/feature/PetDetailPage';
import itemsData from '../../../../public/data/items.json';
import { slugify } from '@/lib/slugify';
export const runtime = 'edge';

// 在 Cloudflare Pages 上避免 Next-on-Pages 的 prerender 冲突，强制该动态路由走 SSR
// 运行时与动态渲染配置由父级 segment layout 统一导出，避免多路由重复导出引发合并冲突

// 注意：此页面使用generateStaticParams进行静态生成，不能使用Edge Runtime

// 生成静态路径
// 注意：为兼容 Cloudflare Pages，这里不再静态预生成全部宠物详情页

// 为避免 Cloudflare next-on-pages 的边缘合并冲突，这里移除 generateMetadata（可改为后续按需恢复）

export default function PetPage({ params }: { params: { pet: string } }) {
  // 查找对应的宠物（按 slug 匹配）
  const pet = (itemsData as any[]).find((item: any) =>
    slugify(String(item.name || '')) === params.pet ||
    slugify(String(item.display_name || '')) === params.pet
  );

  if (!pet) {
    notFound();
  }

  return <PetDetailPage pet={pet} />;
}
