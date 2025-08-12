// /src/app/components/ui/GuideButton.jsx
"use client";

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UserGuideManager } from '@/lib/user-guide-manager';

const GuideButton = ({ onShowGuide, className = '' }) => {
  const { t } = useTranslation();
  const [canShow, setCanShow] = useState(() => UserGuideManager.canShowGuideAgain());

  const handleShowGuide = () => {
    // Reset guide state to allow showing again
    UserGuideManager.resetGuide();
    onShowGuide?.();
  };

  if (!canShow) return null;

  return (
    <button
      onClick={handleShowGuide}
      className={`inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors ${className}`}
      title={t('userGuide.showAgain', 'Show welcome tour again')}
    >
      <svg 
        className="w-4 h-4 mr-2" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
        />
      </svg>
      {t('userGuide.showGuideButton', 'Show Guide')}
    </button>
  );
};

export default GuideButton;