'use client';

import React from 'react';
import { UserProfile } from '@/types';
import { onboardingStorage } from '@/lib/onboarding-storage';

interface PersonalizedWelcomeProps {
  onStartJourney: (flow: string) => void;
  onRetakeOnboarding: () => void;
}

/**
 * PersonalizedWelcome Component
 * 显示基于用户个性化设置的欢迎界面
 */
const PersonalizedWelcome: React.FC<PersonalizedWelcomeProps> = ({
  onStartJourney,
  onRetakeOnboarding
}) => {
  const [userProfile, setUserProfile] = React.useState<UserProfile | null>(null);

  React.useEffect(() => {
    const loadUserProfile = () => {
      if (onboardingStorage.isCompleted()) {
        const profile = onboardingStorage.load();
        setUserProfile(profile);
      }
    };

    loadUserProfile();
  }, []);

  // 获取个性化的欢迎信息
  const getWelcomeInfo = () => {
    if (!userProfile) {
      return {
        title: 'Welcome to Garden Growth Advisor',
        subtitle: 'Your intelligent companion for optimizing crop selection',
        description: 'Get started by taking our personalization guide to receive tailored recommendations.',
        cta: 'Get Started',
        flow: 'mode-selection'
      };
    }

    const levelInfo = {
      beginner: {
        title: 'Welcome Back, Beginner Gardener! 🌱',
        subtitle: 'Ready for your guided farming journey?',
        description: 'Continue with step-by-step tutorials and safe strategies designed just for you.',
        cta: 'Start Beginner Guide',
        flow: 'beginner-guide'
      },
      advanced: {
        title: 'Welcome Back, Strategic Farmer! 🗺️',
        subtitle: 'Ready to optimize your strategy?',
        description: 'Access detailed analysis tools and strategic options tailored to your experience.',
        cta: 'Open Strategic Dashboard',
        flow: 'item-selection'
      },
      expert: {
        title: 'Welcome Back, Expert Optimizer! ⚡',
        subtitle: 'Ready for full customization?',
        description: 'Dive into advanced metrics and complete control over your optimization parameters.',
        cta: 'Launch Full Configuration',
        flow: 'configuration'
      }
    };

    return levelInfo[userProfile.level];
  };

  // 获取用户目标的描述
  const getGoalDescription = () => {
    if (!userProfile) return null;

    const goalDescriptions = {
      profit: { icon: '💰', text: 'Maximizing Profit' },
      speed: { icon: '⚡', text: 'Fast Growth' },
      balance: { icon: '⚖️', text: 'Balanced Strategy' },
      xp: { icon: '📈', text: 'XP Efficiency' },
      custom: { icon: '🎯', text: 'Custom Strategy' }
    };

    return goalDescriptions[userProfile.goal as keyof typeof goalDescriptions] || null;
  };

  // 获取最近活动信息
  const getRecentActivity = () => {
    if (!userProfile) return null;

    const completedAt = new Date(userProfile.completedAt);
    const now = new Date();
    const daysSince = Math.floor((now.getTime() - completedAt.getTime()) / (1000 * 60 * 60 * 24));

    if (daysSince === 0) {
      return 'Personalized today';
    } else if (daysSince === 1) {
      return 'Personalized yesterday';
    } else {
      return `Personalized ${daysSince} days ago`;
    }
  };

  const welcomeInfo = getWelcomeInfo();
  const goalInfo = getGoalDescription();
  const recentActivity = getRecentActivity();

  return (
    <div className="max-w-4xl mx-auto">
      {/* 主欢迎区域 */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {welcomeInfo.title}
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          {welcomeInfo.subtitle}
        </p>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          {welcomeInfo.description}
        </p>
      </div>

      {/* 个性化信息卡片 */}
      {userProfile && (
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Your Personalized Setup</h2>
            <span className="text-sm text-gray-500">{recentActivity}</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 经验水平 */}
            <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-xl">
              <div className="text-3xl">
                {userProfile.level === 'beginner' ? '🌱' : 
                 userProfile.level === 'advanced' ? '🗺️' : '⚡'}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 capitalize">
                  {userProfile.level} Player
                </h3>
                <p className="text-sm text-gray-600">Experience Level</p>
              </div>
            </div>

            {/* 目标 */}
            {goalInfo && (
              <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-xl">
                <div className="text-3xl">{goalInfo.icon}</div>
                <div>
                  <h3 className="font-semibold text-gray-900">{goalInfo.text}</h3>
                  <p className="text-sm text-gray-600">Primary Goal</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 行动按钮 */}
      <div className="text-center space-y-4">
        <button
          onClick={() => onStartJourney(welcomeInfo.flow)}
          className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          {welcomeInfo.cta}
        </button>

        <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6">
          <button
            onClick={onRetakeOnboarding}
            className="px-6 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors flex items-center space-x-2"
          >
            <span>🎯</span>
            <span>Retake Personalization Guide</span>
          </button>
          
          <button
            onClick={() => onStartJourney('item-selection')}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
          >
            Skip to Item Selection
          </button>
        </div>
      </div>

      {/* 快速访问选项 */}
      {userProfile && (
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => onStartJourney('beginner-guide')}
            className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 hover:border-blue-300"
          >
            <div className="text-2xl mb-2">🎓</div>
            <h3 className="font-medium text-gray-900">Beginner Guide</h3>
            <p className="text-sm text-gray-600">Step-by-step tutorials</p>
          </button>

          <button
            onClick={() => onStartJourney('item-selection')}
            className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 hover:border-blue-300"
          >
            <div className="text-2xl mb-2">📋</div>
            <h3 className="font-medium text-gray-900">Item Selection</h3>
            <p className="text-sm text-gray-600">Choose your strategy</p>
          </button>

          <button
            onClick={() => onStartJourney('configuration')}
            className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 hover:border-blue-300"
          >
            <div className="text-2xl mb-2">⚙️</div>
            <h3 className="font-medium text-gray-900">Configuration</h3>
            <p className="text-sm text-gray-600">Advanced settings</p>
          </button>
        </div>
      )}
    </div>
  );
};

export default PersonalizedWelcome;