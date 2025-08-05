// /src/app/page.tsx (Fixed TypeScript Type)
"use client"; 

import { useState } from 'react';
import ItemSelector from "./components/ItemSelector";
import PlayerStatusInput from "./components/PlayerStatusInput";
import SelectedItemsList from "./components/SelectedItemsList";
import SelectionToolbar from './components/SelectionToolbar';
import itemsData from "../../public/data/items.json";

// --- 这是关键改动 ---
type Item = {
  id: number;
  name: string;
  display_name: string;
  tier: string;
  source: string;
  multi_harvest: boolean;
  // 将 prices 和 obtainable 设为可选属性 (在冒号前加问号)
  prices?: Record<string, number>;
  obtainable?: boolean;
};

export default function Home() {
  // 将 itemsData 类型断言为 Item[] 类型，确保数据类型安全
  const items = itemsData as Item[];
  const [view, setView] = useState('selection'); 

  return (
    <main className="min-h-screen bg-gray-100 p-4 pb-24 sm:p-8">
      
      {view === 'selection' && (
        <>
          <ItemSelector items={items} />
          <SelectionToolbar allItems={items} onNextStep={() => setView('review')} />
        </>
      )}

      {view === 'review' && (
        <div className="mx-auto w-full max-w-7xl animate-fade-in">
            <button 
                onClick={() => setView('selection')}
                className="mb-4 text-sm font-semibold text-blue-600 hover:underline"
            >
                &larr; Back to selection
            </button>
            <div className="flex w-full flex-col gap-8">
              <PlayerStatusInput />
              <SelectedItemsList allItems={items} />
            </div>
        </div>
      )}

    </main>
  );
}