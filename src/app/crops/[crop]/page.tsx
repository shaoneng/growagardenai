// /src/app/crops/[name]/page.tsx
// 作物详情页

import { notFound } from 'next/navigation';
import CropDetailPage from '../../components/feature/CropDetailPage';
import itemsData from '../../../../public/data/items.json';
import { slugify } from '@/lib/slugify';

// Cloudflare Pages 配置
// 选择 Edge Runtime 而不是静态生成，以获得更好的动态性能
export const runtime = 'edge';

// 注意：使用 Edge Runtime 时不能同时使用 generateStaticParams
// 这个页面将在请求时动态渲染，提供更好的灵活性

// 如果需要静态生成，可以移除 runtime = 'edge' 并启用下面的函数
/*
export async function generateStaticParams() {
  const seen = new Set<string>();
  const params: Array<{ crop: string }> = [];
  for (const item of (itemsData as any[])) {
    if (
      item?.source === 'crops' ||
      typeof item?.multi_harvest !== 'undefined' ||
      ['Common', 'Uncommon', 'Rare', 'Legendary'].includes(item?.tier)
    ) {
      const base = item?.display_name || item?.name;
      if (!base) continue;
      const slug = slugify(String(base));
      if (!slug || seen.has(slug)) continue;
      seen.add(slug);
      params.push({ crop: slug });
    }
  }
  return params;
}
*/

// 为避免 Cloudflare next-on-pages 的边缘合并冲突，这里移除 generateMetadata（可改为后续按需恢复）

export default function CropPage({ params }: { params: { crop: string } }) {
  // 查找对应的作物（按 slug 匹配）
  const crop = (itemsData as any[]).find((item: any) =>
    slugify(String(item.name || '')) === params.crop ||
    slugify(String(item.display_name || '')) === params.crop
  );

  if (!crop) {
    notFound();
  }

  return <CropDetailPage crop={crop} />;
}
