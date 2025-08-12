// /src/hooks/useUserGuide.js
"use client";

import { useState, useEffect } from 'react';

export const useUserGuide = () => {
  const [shouldShowGuide, setShouldShowGuide] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  useEffect(() => {
    // Check if user has completed or skipped the guide
    const hasCompleted = localStorage.getItem('userGuideCompleted') === 'true';
    const hasSkipped = localStorage.getItem('userGuideSkipped') === 'true';
    const dontShow = localStorage.getItem('userGuideDontShow') === 'true';
    const hasVisited = localStorage.getItem('hasVisitedBefore') === 'true';

    // Determine if this is first visit
    if (!hasVisited) {
      setIsFirstVisit(true);
      localStorage.setItem('hasVisitedBefore', 'true');
    }

    // Show guide if:
    // 1. First visit AND hasn't completed/skipped/disabled
    // 2. OR user manually requested to see it again
    const shouldShow = (isFirstVisit && !hasCompleted && !hasSkipped && !dontShow);
    setShouldShowGuide(shouldShow);
  }, [isFirstVisit]);

  const showGuide = () => {
    setShouldShowGuide(true);
  };

  const hideGuide = () => {
    setShouldShowGuide(false);
  };

  const resetGuide = () => {
    // Clear all guide-related localStorage items
    localStorage.removeItem('userGuideCompleted');
    localStorage.removeItem('userGuideSkipped');
    localStorage.removeItem('userGuideDontShow');
    setShouldShowGuide(true);
  };

  const handleGuideComplete = () => {
    localStorage.setItem('userGuideCompleted', 'true');
    setShouldShowGuide(false);
  };

  const handleGuideSkip = () => {
    localStorage.setItem('userGuideSkipped', 'true');
    setShouldShowGuide(false);
  };

  return {
    shouldShowGuide,
    isFirstVisit,
    showGuide,
    hideGuide,
    resetGuide,
    handleGuideComplete,
    handleGuideSkip
  };
};