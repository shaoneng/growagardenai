// /src/app/pets/[name]/page.tsx
// 宠物详情页

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PetDetailPage from '../../components/feature/PetDetailPage';
import itemsData from '../../../../public/data/items.json';

// 注意：此页面使用generateStaticParams进行静态生成，不能使用Edge Runtime

// 生成静态路径
export async function generateStaticParams() {
  // 过滤出宠物数据
  const pets = itemsData.filter(item => 
    item.source === 'pets' || 
    item.name.toLowerCase().includes('pet') ||
    'bonus_type' in item
  );

  return pets.map((pet) => ({
    name: pet.name.toLowerCase().replace(/\s+/g, '-'),
  }));
}

// 生成动态元数据
export async function generateMetadata({ params }: { params: { name: string } }): Promise<Metadata> {
  const petName = params.name.replace(/-/g, ' ');
  
  // 查找对应的宠物
  const pet = itemsData.find(item => 
    item.name.toLowerCase() === petName.toLowerCase() ||
    item.display_name?.toLowerCase() === petName.toLowerCase()
  );

  if (!pet) {
    return {
      title: 'Pet Not Found | Grow a Garden AI Assistant',
    };
  }

  return {
    title: `${pet.display_name || pet.name} - Pet Guide | Grow a Garden AI Assistant`,
    description: `Complete guide to ${pet.display_name || pet.name} in Grow a Garden. Learn about bonuses, attraction methods, and strategies.`,
    keywords: `${pet.name}, grow a garden pet, pet guide, pet bonuses, ${pet.tier} pet`,
  };
}

export default function PetPage({ params }: { params: { name: string } }) {
  const petName = params.name.replace(/-/g, ' ');
  
  // 查找对应的宠物
  const pet = itemsData.find(item => 
    item.name.toLowerCase() === petName.toLowerCase() ||
    item.display_name?.toLowerCase() === petName.toLowerCase()
  );

  if (!pet) {
    notFound();
  }

  return <PetDetailPage pet={pet} />;
}