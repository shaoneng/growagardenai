'use client';

import React, { useEffect } from 'react';
import { UserProfile } from '@/types';
import { onboardingStorage } from '@/lib/onboarding-storage';

interface PersonalizedNavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
  onRetakeOnboarding: () => void;
}

/**
 * PersonalizedNavigation Component
 * 显示基于用户个性化设置的导航选项
 */
const PersonalizedNavigation: React.FC<PersonalizedNavigationProps> = ({
  currentView,
  onViewChange,
  onRetakeOnboarding
}) => {
  const [userProfile, setUserProfile] = React.useState<UserProfile | null>(null);

  React.useEffect(() => {
    // 加载用户个性化设置
    const loadUserProfile = () => {
      if (onboardingStorage.isCompleted()) {
        const profile = onboardingStorage.load();
        setUserProfile(profile);
      }
    };

    loadUserProfile();
  }, []);

  // 获取个性化的导航选项
  const getNavigationOptions = () => {
    if (!userProfile) {
      return [
        { id: 'mode-selection', label: 'Mode Selection', icon: '🎯' },
        { id: 'item-selection', label: 'Item Selection', icon: '📋' }
      ];
    }

    const options = [
      { id: 'mode-selection', label: 'Home', icon: '🏠' }
    ];

    // 根据用户水平添加合适的选项
    switch (userProfile.level) {
      case 'beginner':
        options.push(
          { id: 'beginner-guide', label: 'Beginner Guide', icon: '🎓' },
          { id: 'item-selection', label: 'Simple Selection', icon: '📋' }
        );
        break;
      case 'advanced':
        options.push(
          { id: 'item-selection', label: 'Strategic Selection', icon: '🎯' },
          { id: 'configuration', label: 'Analysis Dashboard', icon: '📊' }
        );
        break;
      case 'expert':
        options.push(
          { id: 'item-selection', label: 'Item Selection', icon: '📋' },
          { id: 'configuration', label: 'Full Configuration', icon: '⚙️' }
        );
        break;
    }

    return options;
  };

  // 获取用户水平的显示信息
  const getUserLevelInfo = () => {
    if (!userProfile) return null;

    const levelInfo = {
      beginner: { title: 'Beginner', icon: '🌱', color: 'text-green-600' },
      advanced: { title: 'Advanced', icon: '🗺️', color: 'text-blue-600' },
      expert: { title: 'Expert', icon: '⚡', color: 'text-purple-600' }
    };

    return levelInfo[userProfile.level];
  };

  const navigationOptions = getNavigationOptions();
  const levelInfo = getUserLevelInfo();

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 左侧：主导航 */}
          <div className="flex items-center space-x-1">
            {navigationOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => onViewChange(option.id)}
                className={`
                  px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  flex items-center space-x-2
                  ${currentView === option.id
                    ? 'bg-blue-100 text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }
                `}
              >
                <span className="text-base">{option.icon}</span>
                <span>{option.label}</span>
              </button>
            ))}
          </div>

          {/* 右侧：用户信息和设置 */}
          <div className="flex items-center space-x-4">
            {/* 用户水平显示 */}
            {levelInfo && (
              <div className="flex items-center space-x-2 px-3 py-1 bg-gray-50 rounded-full">
                <span className="text-lg">{levelInfo.icon}</span>
                <span className={`text-sm font-medium ${levelInfo.color}`}>
                  {levelInfo.title} Player
                </span>
              </div>
            )}

            {/* 重新个性化按钮 */}
            <button
              onClick={onRetakeOnboarding}
              className="px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center space-x-1"
              title="Retake personalization guide"
            >
              <span className="text-base">🎯</span>
              <span className="hidden sm:inline">Personalize</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedNavigation;