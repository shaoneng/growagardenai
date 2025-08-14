// /src/app/pets/[name]/page.tsx
// 宠物详情页

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PetDetailPage from '../../components/feature/PetDetailPage';
import itemsData from '../../../../public/data/items.json';

// 统一的 slug 规范：仅小写字母数字，用连字符分隔，去除首尾连字符
const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

// 在 Cloudflare Pages 上避免 Next-on-Pages 的 prerender 冲突，强制该动态路由走 SSR
export const dynamic = 'force-dynamic';

// 注意：此页面使用generateStaticParams进行静态生成，不能使用Edge Runtime

// 生成静态路径
// 注意：为兼容 Cloudflare Pages，这里不再静态预生成全部宠物详情页

// 生成动态元数据
export async function generateMetadata({ params }: { params: { name: string } }): Promise<Metadata> {
  const findBySlug = (nameOrDisplay: string) => slugify(String(nameOrDisplay || ''));

  // 查找对应的宠物（按 slug 匹配）
  const pet = (itemsData as any[]).find((item: any) =>
    findBySlug(item.name) === params.name || findBySlug(item.display_name) === params.name
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
  const findBySlug = (nameOrDisplay: string) => slugify(String(nameOrDisplay || ''));
  
  // 查找对应的宠物（按 slug 匹配）
  const pet = (itemsData as any[]).find((item: any) =>
    findBySlug(item.name) === params.name || findBySlug(item.display_name) === params.name
  );

  if (!pet) {
    notFound();
  }

  return <PetDetailPage pet={pet} />;
}
