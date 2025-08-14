"use client"; 

import React, { useState } from 'react';
import ModeAwareItemSelector from "./components/feature/ModeAwareItemSelector";
import PlayerStatusInput from "./components/feature/PlayerStatusInput";
import SelectedItemsList from "./components/feature/SelectedItemsList";
import SelectionToolbar from './components/feature/SelectionToolbar';
import InteractionModeSelector from './components/feature/InteractionModeSelector';
import BeginnerGuide from './components/feature/BeginnerGuide';
import EncyclopediaEntrance from './components/feature/EncyclopediaEntrance';
import PlayerLevelOnboarding from './components/feature/PlayerLevelOnboarding';
import PersonalizedNavigation from './components/ui/PersonalizedNavigation';
import PersonalizedWelcome from './components/ui/PersonalizedWelcome';
import { UserProfile } from '@/types';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useAppContext } from '@/context/AppContext';
import itemsData from "../../public/data/items.json";

type Item = {
  id: number;
  name: string;
  display_name: string;
  tier: string;
  source: string;
  multi_harvest: boolean;
  prices?: Record<string, number>;
  obtainable?: boolean;
};

export default function Home() {
  const items = itemsData as Item[];
  const [view, setView] = useState('mode-selection');
  const { interactionMode } = useAppContext();
  const { 
    userProfile, 
    isOnboardingCompleted, 
    isLoading, 
    updateUserProfile, 
    resetOnboarding 
  } = useOnboarding();
  
  // 控制引导显示状态
  const [showOnboarding, setShowOnboarding] = useState(false);

  // 检查是否需要显示引导
  React.useEffect(() => {
    if (!isLoading) {
      setShowOnboarding(!isOnboardingCompleted);
    }
  }, [isLoading, isOnboardingCompleted]);

  // Handle onboarding completion with routing
  const handleOnboardingComplete = (profile: UserProfile) => {
    console.log('User completed onboarding with profile:', profile);
    
    // 更新用户配置到context
    updateUserProfile(profile);
    
    // Route based on user's selected flow
    switch(profile.flow) {
      case 'beginner-guide':
        console.log('Routing to beginner guide interface');
        setView('beginner-guide');
        break;
      case 'item-selection':
        console.log('Routing to strategic item selection interface');
        setView('item-selection');
        break;
      case 'full-configuration':
        console.log('Routing to full customization dashboard');
        setView('configuration');
        break;
      default:
        console.log('Using default interface - item selection');
        setView('item-selection');
    }
    
    setShowOnboarding(false);
  };

  const handleOnboardingSkip = () => {
    console.log('User skipped onboarding, using default interface');
    setView('mode-selection');
    setShowOnboarding(false);
  };

  const handleRetakeOnboarding = () => {
    console.log('User requested to retake onboarding');
    resetOnboarding();
    setShowOnboarding(true);
  };

  // 显示加载状态
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your personalized experience...</p>
        </div>
      </div>
    );
  }

  // Show onboarding if needed
  if (showOnboarding) {
    return (
      <PlayerLevelOnboarding
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingSkip}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 个性化导航栏 */}
      <PersonalizedNavigation
        currentView={view}
        onViewChange={setView}
        onRetakeOnboarding={handleRetakeOnboarding}
      />
      
      <main className="p-4 pb-24 sm:p-8">
      
      {/* Home/Welcome Screen */}
      {view === 'mode-selection' && (
        <div className="mx-auto w-full max-w-6xl">
          <PersonalizedWelcome
            onStartJourney={setView}
            onRetakeOnboarding={handleRetakeOnboarding}
          />

          <div className="border-t border-gray-200 pt-12 mt-12">
            <EncyclopediaEntrance />
          </div>
        </div>
      )}

      {/* Beginner Guide */}
      {view === 'beginner-guide' && (
        <div>
          <button 
            onClick={() => setView('mode-selection')}
            className="mb-4 text-sm font-semibold text-blue-600 hover:underline"
          >
            ← Back to mode selection
          </button>
          <BeginnerGuide />
        </div>
      )}

      {/* Step 2: Item Selection */}
      {view === 'item-selection' && (
        <div>
          <button 
            onClick={() => setView('mode-selection')}
            className="mb-4 text-sm font-semibold text-blue-600 hover:underline"
          >
            ← Back to mode selection
          </button>
          <ModeAwareItemSelector items={items} />
          <SelectionToolbar allItems={items} onNextStep={() => setView('configuration')} />
        </div>
      )}

      {/* Step 3: Configuration and Analysis */}
      {view === 'configuration' && (
        <div className="mx-auto w-full max-w-7xl">
          <button 
            onClick={() => setView('item-selection')}
            className="mb-4 text-sm font-semibold text-blue-600 hover:underline"
          >
            ← Back to item selection
          </button>
          <div className="flex w-full flex-col gap-8">
            <PlayerStatusInput />
            <SelectedItemsList allItems={items} />
          </div>
        </div>
      )}

      </main>
    </div>
  );
}