// /src/app/pets/[name]/page.tsx
// 宠物详情页

import { notFound } from 'next/navigation';
import PetDetailPage from '../../components/feature/PetDetailPage';
import itemsData from '../../../../public/data/items.json';
import { slugify } from '@/lib/slugify';

// Cloudflare Pages 静态导出配置
// 使用静态生成来预渲染所有宠物页面

// 生成静态路径
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
