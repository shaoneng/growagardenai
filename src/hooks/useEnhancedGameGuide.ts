'use client';

import { useState, useEffect, useCallback } from 'react';
import { GuideProgress } from '@/lib/enhanced-game-guide-types';
import { guideSections } from '@/lib/enhanced-game-guide-sections';
import { 
  GuideProgressManager, 
  GuideAnalyticsManager,
  GuideContentUtils 
} from '@/lib/enhanced-game-guide-utils';

export interface UseEnhancedGameGuideOptions {
  persistProgress?: boolean;
  startSection?: number;
  onComplete?: () => void;
}

export interface UseEnhancedGameGuideReturn {
  // State
  currentSection: number;
  completedSections: number[];
  progress: GuideProgress | null;
  isLoading: boolean;
  error: string | null;
  isCompleted: boolean;
  
  // Actions
  goToSection: (index: number) => void;
  nextSection: () => void;
  previousSection: () => void;
  markSectionComplete: (sectionId: string) => void;
  completeGuide: () => void;
  restartGuide: () => void;
  
  // Computed values
  progressPercentage: number;
  canGoNext: boolean;
  canGoPrevious: boolean;
  totalReadTime: number;
  currentSectionData: any;
}

export const useEnhancedGameGuide = (
  options: UseEnhancedGameGuideOptions = {}
): UseEnhancedGameGuideReturn => {
  const {
    persistProgress = true,
    startSection = 0,
    onComplete
  } = options;

  // State
  const [currentSection, setCurrentSection] = useState(startSection);
  const [completedSections, setCompletedSections] = useState<number[]>([]);
  const [progress, setProgress] = useState<GuideProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize from storage
  useEffect(() => {
    const initializeProgress = async () => {
      try {
        if (persistProgress) {
          const savedProgress = GuideProgressManager.loadProgress();
          if (savedProgress) {
            setCurrentSection(savedProgress.currentSection);
            setCompletedSections(savedProgress.completedSections);
            setProgress(savedProgress);
          }
        }
      } catch (err) {
        console.error('Failed to initialize guide progress:', err);
        setError('Failed to load your progress');
      } finally {
        setIsLoading(false);
      }
    };

    initializeProgress();
  }, [persistProgress]);

  // Save progress when state changes
  useEffect(() => {
    if (!isLoading && persistProgress) {
      const newProgress: GuideProgress = {
        currentSection,
        completedSections,
        timeSpent: progress?.timeSpent || 0,
        lastAccessed: new Date(),
        isCompleted: completedSections.length >= guideSections.length,
        sectionProgress: progress?.sectionProgress || {}
      };

      try {
        GuideProgressManager.saveProgress(newProgress);
        setProgress(newProgress);
      } catch (err) {
        console.error('Failed to save progress:', err);
      }
    }
  }, [currentSection, completedSections, isLoading, persistProgress, progress?.timeSpent, progress?.sectionProgress]);

  // Actions
  const goToSection = useCallback((index: number) => {
    if (GuideContentUtils.isValidSectionIndex(index, guideSections.length)) {
      setCurrentSection(index);
      GuideAnalyticsManager.trackSectionView(guideSections[index].id);
    }
  }, []);

  const nextSection = useCallback(() => {
    if (currentSection < guideSections.length - 1) {
      const nextIndex = currentSection + 1;
      setCurrentSection(nextIndex);
      GuideAnalyticsManager.trackSectionView(guideSections[nextIndex].id);
    }
  }, [currentSection]);

  const previousSection = useCallback(() => {
    if (currentSection > 0) {
      const prevIndex = currentSection - 1;
      setCurrentSection(prevIndex);
      GuideAnalyticsManager.trackSectionView(guideSections[prevIndex].id);
    }
  }, [currentSection]);

  const markSectionComplete = useCallback((sectionId: string) => {
    const sectionIndex = guideSections.findIndex(s => s.id === sectionId);
    if (sectionIndex !== -1 && !completedSections.includes(sectionIndex)) {
      const newCompleted = [...completedSections, sectionIndex].sort((a, b) => a - b);
      setCompletedSections(newCompleted);
      GuideAnalyticsManager.trackSectionComplete(sectionId);

      // Auto-complete guide if all sections are done
      if (newCompleted.length >= guideSections.length) {
        completeGuide();
      }
    }
  }, [completedSections]);

  const completeGuide = useCallback(() => {
    const allSections = Array.from({ length: guideSections.length }, (_, i) => i);
    setCompletedSections(allSections);
    
    if (persistProgress) {
      GuideProgressManager.markCompleted();
    }
    
    // Track completion
    guideSections.forEach(section => {
      GuideAnalyticsManager.trackSectionComplete(section.id);
    });

    onComplete?.();
  }, [persistProgress, onComplete]);

  const restartGuide = useCallback(() => {
    setCurrentSection(0);
    setCompletedSections([]);
    setError(null);
    
    if (persistProgress) {
      GuideProgressManager.resetProgress();
    }
    
    // Track restart
    GuideAnalyticsManager.trackSectionView(guideSections[0].id);
  }, [persistProgress]);

  // Computed values
  const progressPercentage = GuideContentUtils.getProgressPercentage(
    completedSections, 
    guideSections.length
  );
  
  const canGoNext = currentSection < guideSections.length - 1;
  const canGoPrevious = currentSection > 0;
  const totalReadTime = GuideContentUtils.calculateTotalReadTime(guideSections);
  const currentSectionData = guideSections[currentSection];
  const isCompleted = completedSections.length >= guideSections.length;

  return {
    // State
    currentSection,
    completedSections,
    progress,
    isLoading,
    error,
    isCompleted,
    
    // Actions
    goToSection,
    nextSection,
    previousSection,
    markSectionComplete,
    completeGuide,
    restartGuide,
    
    // Computed values
    progressPercentage,
    canGoNext,
    canGoPrevious,
    totalReadTime,
    currentSectionData
  };
};