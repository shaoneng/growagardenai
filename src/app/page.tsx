// /src/app/page.tsx (Correct Version)
"use client";

import { useState } from 'react';
import ItemSelector from "./components/ItemSelector";
import PlayerStatusInput from "./components/PlayerStatusInput";
import SelectedItemsList from "./components/SelectedItemsList";
import SelectionToolbar from './components/SelectionToolbar';
import itemsData from "../../public/data/items.json";

type Item = {
  id: number; name: string; display_name: string; tier: string; source: string;
  prices: Record<string, number>; multi_harvest: boolean; obtainable: boolean;
};

export default function Home() {
  const items: Item[] = itemsData;
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