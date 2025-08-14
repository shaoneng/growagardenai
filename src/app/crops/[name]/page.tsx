// /src/app/crops/[name]/page.tsx
// 作物详情页

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CropDetailPage from '../../components/feature/CropDetailPage';
import itemsData from '../../../../public/data/items.json';

// 统一的 slug 规范：仅小写字母数字，用连字符分隔，去除首尾连字符
const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

// 注意：此页面使用generateStaticParams进行静态生成，不能使用Edge Runtime

// 生成静态路径
export async function generateStaticParams() {
  // 过滤出作物数据
  const crops = itemsData.filter((item: any) =>
    item.source === 'crops' ||
    item.multi_harvest !== undefined ||
    ['Common', 'Uncommon', 'Rare', 'Legendary'].includes(item.tier)
  );

  // 去重且保证 slug 合法
  const seen = new Set<string>();
  const params: Array<{ name: string }> = [];
  for (const crop of crops) {
    const base = crop.display_name || crop.name;
    if (!base) continue;
    const slug = slugify(String(base));
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);
    params.push({ name: slug });
  }
  return params;
}

// 生成动态元数据
export async function generateMetadata({ params }: { params: { name: string } }): Promise<Metadata> {
  const findBySlug = (nameOrDisplay: string) => slugify(String(nameOrDisplay || ''));

  // 查找对应的作物（按 slug 匹配，避免大小写/符号差异）
  const crop = (itemsData as any[]).find((item: any) =>
    findBySlug(item.name) === params.name || findBySlug(item.display_name) === params.name
  );

  if (!crop) {
    return {
      title: 'Crop Not Found | Grow a Garden AI Assistant',
    };
  }

  return {
    title: `${crop.display_name || crop.name} - Crop Guide | Grow a Garden AI Assistant`,
    description: `Complete growing guide for ${crop.display_name || crop.name}. Learn growth time, profit margins, seasonal bonuses, and farming strategies.`,
    keywords: `${crop.name}, grow a garden crop, crop guide, farming guide, ${crop.tier} crop, crop profits`,
  };
}

export default function CropPage({ params }: { params: { name: string } }) {
  const findBySlug = (nameOrDisplay: string) => slugify(String(nameOrDisplay || ''));
  
  // 查找对应的作物（按 slug 匹配）
  const crop = (itemsData as any[]).find((item: any) =>
    findBySlug(item.name) === params.name || findBySlug(item.display_name) === params.name
  );

  if (!crop) {
    notFound();
  }

  return <CropDetailPage crop={crop} />;
}
