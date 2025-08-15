// /src/app/pets/[name]/page.tsx
// 宠物详情页

import { notFound } from 'next/navigation';
import PetDetailPage from '../../components/feature/PetDetailPage';
import petsData from '../../../../public/data/pets.json';
import { slugify } from '@/lib/slugify';

// Cloudflare Pages 静态导出配置
// 使用静态生成来预渲染所有宠物页面

// 生成静态路径
export async function generateStaticParams() {
  const params: Array<{ pet: string }> = [];
  
  // 使用专门的宠物数据文件
  for (const pet of petsData) {
    if (pet?.name) {
      // 使用宠物的name作为slug
      params.push({ pet: pet.name });
    }
  }
  
  console.log(`Generated ${params.length} static params for pets:`, params.slice(0, 5));
  return params;
}

// 为避免 Cloudflare next-on-pages 的边缘合并冲突，这里移除 generateMetadata（可改为后续按需恢复）

export default function PetPage({ params }: { params: { pet: string } }) {
  // 查找对应的宠物（按 name 匹配）
  const pet = petsData.find((petItem: any) => petItem.name === params.pet);

  if (!pet) {
    notFound();
  }

  return <PetDetailPage pet={pet} />;
}
