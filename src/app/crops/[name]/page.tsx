// /src/app/crops/[name]/page.tsx
// 作物详情页

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CropDetailPage from '../../components/feature/CropDetailPage';
import itemsData from '../../../../public/data/items.json';

// Cloudflare Pages Edge Runtime配置
export const runtime = 'edge';

// 生成静态路径
export async function generateStaticParams() {
  // 过滤出作物数据
  const crops = itemsData.filter(item => 
    item.source === 'crops' || 
    item.multi_harvest !== undefined ||
    ['Common', 'Uncommon', 'Rare', 'Legendary'].includes(item.tier)
  );

  return crops.map((crop) => ({
    name: crop.name.toLowerCase().replace(/\s+/g, '-'),
  }));
}

// 生成动态元数据
export async function generateMetadata({ params }: { params: { name: string } }): Promise<Metadata> {
  const cropName = params.name.replace(/-/g, ' ');
  
  // 查找对应的作物
  const crop = itemsData.find(item => 
    item.name.toLowerCase() === cropName.toLowerCase() ||
    item.display_name?.toLowerCase() === cropName.toLowerCase()
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
  const cropName = params.name.replace(/-/g, ' ');
  
  // 查找对应的作物
  const crop = itemsData.find(item => 
    item.name.toLowerCase() === cropName.toLowerCase() ||
    item.display_name?.toLowerCase() === cropName.toLowerCase()
  );

  if (!crop) {
    notFound();
  }

  return <CropDetailPage crop={crop} />;
}