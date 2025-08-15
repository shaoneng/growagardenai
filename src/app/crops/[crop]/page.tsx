// /src/app/crops/[name]/page.tsx
// 作物详情页

import { notFound } from 'next/navigation';
import CropDetailPage from '../../components/feature/CropDetailPage';
import itemsData from '../../../../public/data/items.json';
import { slugify } from '@/lib/slugify';

// Cloudflare Pages 静态导出配置
// 使用静态生成来预渲染所有作物页面

// 生成静态路径
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
