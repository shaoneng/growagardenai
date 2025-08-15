// /src/app/pets/page.tsx
// 宠物百科全书列表页

import { Metadata } from 'next';
import PetGallery from '../components/feature/PetGallery';
import NavigationHeader from '../components/ui/NavigationHeader';

export const metadata: Metadata = {
  title: 'Pets Encyclopedia | Grow a Garden AI Assistant',
  description: 'Complete guide to all pets in Grow a Garden. Find stats, bonuses, and strategies for every pet to optimize your garden.',
  keywords: 'grow a garden pets, pet guide, pet stats, pet bonuses, garden pets encyclopedia',
};

export default function PetsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <NavigationHeader
          title="🐾 Pets Encyclopedia"
          subtitle="Discover all the adorable pets in Grow a Garden. Learn about their unique bonuses, how to attract them, and which ones work best for your garden strategy."
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Pets' }
          ] as any}
        />

        {/* Enhanced Pet Gallery */}
        <PetGallery />
      </div>
    </main>
  );
}