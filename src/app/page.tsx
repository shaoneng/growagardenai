// /src/app/page.tsx (Fixed TypeScript Type)
"use client"; 

import { useState } from 'react';
import ModeAwareItemSelector from "./components/feature/ModeAwareItemSelector";
import PlayerStatusInput from "./components/feature/PlayerStatusInput";
import SelectedItemsList from "./components/feature/SelectedItemsList";
import SelectionToolbar from './components/feature/SelectionToolbar';
import InteractionModeSelector from './components/feature/InteractionModeSelector';
import BeginnerGuide from './components/feature/BeginnerGuide';
import EncyclopediaEntrance from './components/feature/EncyclopediaEntrance';
import UserGuide from './components/feature/UserGuide';
import GuideButton from './components/ui/GuideButton';
import { useAppContext } from '@/context/AppContext';
import { useUserGuide } from '@/hooks/useUserGuide';
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
  const [view, setView] = useState('mode-selection'); // 从模式选择开始
  const { interactionMode } = useAppContext();
  const { 
    shouldShowGuide, 
    showGuide, 
    handleGuideComplete, 
    handleGuideSkip 
  } = useUserGuide();

  return (
    <main className="min-h-screen bg-gray-100 p-4 pb-24 sm:p-8">
      
      {/* 第一步：模式选择 */}
      {view === 'mode-selection' && (
        <div className="mx-auto w-full max-w-4xl animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to Garden Growth Advisor
            </h1>
            <p className="text-lg text-gray-600">
              Choose your experience level to get personalized guidance
            </p>
          </div>
          
          <div data-guide="optimization-target">
            <InteractionModeSelector />
          </div>
          
          <div className="text-center mt-8 mb-12">
            <button 
              onClick={() => {
                if (interactionMode === 'beginner') {
                  setView('beginner-guide');
                } else {
                  setView('item-selection');
                }
              }}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              {interactionMode === 'beginner' ? 'Get Started Guide' : 'Continue to Item Selection'}
            </button>
            
            {/* Guide Button */}
            <div className="mt-4">
              <GuideButton onShowGuide={showGuide} />
            </div>
          </div>

          {/* 百科全书入口 */}
          <div className="border-t border-gray-200 pt-12">
            <EncyclopediaEntrance />
          </div>
        </div>
      )}

      {/* 新手指南 */}
      {view === 'beginner-guide' && (
        <div className="animate-fade-in">
          <button 
            onClick={() => setView('mode-selection')}
            className="mb-4 text-sm font-semibold text-blue-600 hover:underline"
          >
            &larr; Back to mode selection
          </button>
          <BeginnerGuide />
        </div>
      )}

      {/* 第二步：物品选择（进阶和专家模式） */}
      {view === 'item-selection' && (
        <div className="animate-fade-in">
          <button 
            onClick={() => setView('mode-selection')}
            className="mb-4 text-sm font-semibold text-blue-600 hover:underline"
          >
            &larr; Back to mode selection
          </button>
          <div data-guide="recommendations-area">
            <ModeAwareItemSelector items={items} />
          </div>
          <SelectionToolbar allItems={items} onNextStep={() => setView('configuration')} />
        </div>
      )}

      {/* 第三步：配置和分析 */}
      {view === 'configuration' && (
        <div className="mx-auto w-full max-w-7xl animate-fade-in">
          <button 
            onClick={() => setView('item-selection')}
            className="mb-4 text-sm font-semibold text-blue-600 hover:underline"
          >
            &larr; Back to item selection
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