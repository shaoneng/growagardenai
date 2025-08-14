// /src/app/pets/[name]/page.tsx
// 宠物详情页

import { notFound } from 'next/navigation';
import PetDetailPage from '../../components/feature/PetDetailPage';
import itemsData from '../../../../public/data/items.json';
import { slugify } from '@/lib/slugify';

// 在 Cloudflare Pages 上避免 Next-on-Pages 的 prerender 冲突，强制该动态路由走 SSR
// 运行时与动态渲染配置由父级 segment layout 统一导出，避免多路由重复导出引发合并冲突

// 注意：此页面使用generateStaticParams进行静态生成，不能使用Edge Runtime

// 生成静态路径
// 生成静态路径（去重且规范化 slug）
export async function generateStaticParams() {
  const seen = new Set<string>();
  const params: Array<{ pet: string }> = [];
  for (const item of (itemsData as any[])) {
    if (
      item?.source === 'pets' ||
      (typeof item?.name === 'string' && item?.name.toLowerCase().includes('pet')) ||
      typeof item?.bonus_type !== 'undefined'
    ) {
      const base = item?.display_name || item?.name;
      if (!base) continue;
      const slug = slugify(String(base));
      if (!slug || seen.has(slug)) continue;
      seen.add(slug);
      params.push({ pet: slug });
    }
  }
  return params;
}

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
