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
  
  try {
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
    
    // 添加一些可能缺失的常见作物路径作为备用
    // 包括可能的 URL 变体（下划线和连字符）
    const commonCrops = [
      'burning_bud', 'burning-bud', 'carrot', 'strawberry', 'blueberry', 
      'tomato', 'corn', 'pumpkin', 'watermelon', 'cauliflower', 'artichoke'
    ];
    
    for (const crop of commonCrops) {
      if (!seen.has(crop)) {
        params.push({ crop });
        seen.add(crop);
      }
    }
    
    console.log('Generated static params for crops:', params.map(p => p.crop));
    return params;
  } catch (error) {
    console.error('Error generating static params for crops:', error);
    // 返回基本的备用路径
    return [
      { crop: 'carrot' },
      { crop: 'strawberry' },
      { crop: 'blueberry' },
      { crop: 'burning_bud' }
    ];
  }
}

// 为避免 Cloudflare next-on-pages 的边缘合并冲突，这里移除 generateMetadata（可改为后续按需恢复）

export default function CropPage({ params }: { params: { crop: string } }) {
  // 查找对应的作物（按 slug 匹配）
  // 处理下划线和连字符的变体
  const normalizedParam = params.crop.replace(/_/g, '-');
  const alternativeParam = params.crop.replace(/-/g, '_');
  
  const crop = (itemsData as any[]).find((item: any) => {
    const itemSlug = slugify(String(item.name || ''));
    const displaySlug = slugify(String(item.display_name || ''));
    
    return itemSlug === params.crop ||
           displaySlug === params.crop ||
           itemSlug === normalizedParam ||
           displaySlug === normalizedParam ||
           itemSlug === alternativeParam ||
           displaySlug === alternativeParam;
  });

  if (!crop) {
    console.log(`Crop not found for param: ${params.crop}`);
    console.log(`Tried variants: ${normalizedParam}, ${alternativeParam}`);
    notFound();
  }

  return <CropDetailPage crop={crop} />;
}
