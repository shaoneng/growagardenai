'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '@/types';
import { onboardingStorage } from '@/lib/onboarding-storage';

interface OnboardingContextType {
  userProfile: UserProfile | null;
  isOnboardingCompleted: boolean;
  isLoading: boolean;
  updateUserProfile: (profile: UserProfile) => void;
  resetOnboarding: () => void;
  refreshProfile: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

interface OnboardingProviderProps {
  children: React.ReactNode;
}

export const OnboardingProvider: React.FC<OnboardingProviderProps> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 加载用户个性化设置
  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      
      const completed = onboardingStorage.isCompleted();
      setIsOnboardingCompleted(completed);
      
      if (completed) {
        const profile = onboardingStorage.load();
        if (profile) {
          setUserProfile(profile);
          console.log('Loaded user profile:', profile);
        }
      }
    } catch (error) {
      console.error('Failed to load user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 更新用户个性化设置
  const updateUserProfile = (profile: UserProfile) => {
    try {
      const success = onboardingStorage.save(profile);
      if (success) {
        setUserProfile(profile);
        setIsOnboardingCompleted(true);
        console.log('Updated user profile:', profile);
      } else {
        console.error('Failed to save user profile');
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  // 重置引导状态
  const resetOnboarding = () => {
    try {
      const success = onboardingStorage.reset();
      if (success) {
        setUserProfile(null);
        setIsOnboardingCompleted(false);
        console.log('Onboarding reset successfully');
      } else {
        console.error('Failed to reset onboarding');
      }
    } catch (error) {
      console.error('Error resetting onboarding:', error);
    }
  };

  // 刷新用户配置
  const refreshProfile = () => {
    loadUserProfile();
  };

  // 初始化时加载用户配置
  useEffect(() => {
    loadUserProfile();
  }, []);

  // 监听存储变化（如果用户在其他标签页完成引导）
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key?.includes('onboarding') || event.key?.includes('user:preferences')) {
        console.log('Onboarding storage changed, refreshing profile');
        loadUserProfile();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const contextValue: OnboardingContextType = {
    userProfile,
    isOnboardingCompleted,
    isLoading,
    updateUserProfile,
    resetOnboarding,
    refreshProfile
  };

  return (
    <OnboardingContext.Provider value={contextValue}>
      {children}
    </OnboardingContext.Provider>
  );
};