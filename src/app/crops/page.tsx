// /src/app/crops/page.tsx
// 作物百科全书列表页

import { Metadata } from 'next';
import CropsEncyclopedia from '../components/feature/CropsEncyclopedia';
import NavigationHeader from '../components/ui/NavigationHeader';

export const metadata: Metadata = {
  title: 'Crops Encyclopedia | Grow a Garden AI Assistant',
  description: 'Complete guide to all crops in Grow a Garden. Find growth times, profits, seasonal bonuses, and growing strategies.',
  keywords: 'grow a garden crops, crop guide, crop profits, seasonal crops, farming guide, crop encyclopedia',
};

export default function CropsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <NavigationHeader
          title="🌱 Crops Encyclopedia"
          subtitle="Master the art of farming with our comprehensive crop guide. Learn growth times, profit margins, seasonal bonuses, and optimal planting strategies."
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Crops' }
          ] as any}
        />

        {/* 作物百科组件 */}
        <CropsEncyclopedia />
      </div>
    </main>
  );
}