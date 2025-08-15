'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { BookOpen, CheckCircle, AlertCircle } from 'lucide-react';
import { EnhancedGameGuideProps, GuideProgress } from '@/lib/enhanced-game-guide-types';
import { guideSections } from '@/lib/enhanced-game-guide-sections';
import { 
  GuideProgressManager, 
  GuideContentUtils, 
  GuideErrorHandler,
  GuideAccessibilityUtils 
} from '@/lib/enhanced-game-guide-utils';
import GuideProgressBar from '@/app/components/ui/GuideProgressBar';
import GuideNavigation from '@/app/components/ui/GuideNavigation';
import GuideSectionRenderer from '@/app/components/ui/GuideSectionRenderer';

const EnhancedGameGuide: React.FC<EnhancedGameGuideProps> = ({
  onComplete,
  startSection = 0,
  showProgressPersistence = true
}) => {
  const [currentSection, setCurrentSection] = useState(startSection);
  const [completedSections, setCompletedSections] = useState<number[]>([]);
  const [progress, setProgress] = useState<GuideProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCompletion, setShowCompletion] = useState(false);

  // Initialize progress from storage
  useEffect(() => {
    try {
      if (showProgressPersistence) {
        const savedProgress = GuideProgressManager.loadProgress();
        if (savedProgress) {
          setCurrentSection(savedProgress.currentSection);
          setCompletedSections(savedProgress.completedSections);
          setProgress(savedProgress);
        }
      }
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to load guide progress:', err);
      setError('Failed to load your progress. Starting fresh.');
      setIsLoading(false);
    }
  }, [showProgressPersistence]);

  // Save progress whenever it changes
  useEffect(() => {
    if (!isLoading && showProgressPersistence) {
      try {
        const newProgress: GuideProgress = {
          currentSection,
          completedSections,
          timeSpent: progress?.timeSpent || 0,
          lastAccessed: new Date(),
          isCompleted: completedSections.length >= guideSections.length,
          sectionProgress: progress?.sectionProgress || {}
        };
        
        GuideProgressManager.saveProgress(newProgress);
        setProgress(newProgress);
      } catch (err) {
        GuideErrorHandler.handleProgressSaveError({
          currentSection,
          completedSections,
          timeSpent: 0,
          lastAccessed: new Date(),
          isCompleted: false,
          sectionProgress: {}
        }, err as Error);
      }
    }
  }, [currentSection, completedSections, isLoading, showProgressPersistence, progress?.timeSpent, progress?.sectionProgress]);

  // Navigation handlers
  const handleSectionJump = useCallback((sectionIndex: number) => {
    if (GuideContentUtils.isValidSectionIndex(sectionIndex, guideSections.length)) {
      setCurrentSection(sectionIndex);
      GuideAccessibilityUtils.announceToScreenReader(`Jumped to section ${sectionIndex + 1}`);
    }
  }, []);

  const handlePrevious = useCallback(() => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      GuideAccessibilityUtils.announceToScreenReader('Previous section');
    }
  }, [currentSection]);

  const handleNext = useCallback(() => {
    if (currentSection < guideSections.length - 1) {
      setCurrentSection(currentSection + 1);
      GuideAccessibilityUtils.announceToScreenReader('Next section');
    }
  }, [currentSection]);

  const handleSectionComplete = useCallback((sectionId: string) => {
    const sectionIndex = guideSections.findIndex(s => s.id === sectionId);
    if (sectionIndex !== -1 && !completedSections.includes(sectionIndex)) {
      const newCompleted = [...completedSections, sectionIndex].sort((a, b) => a - b);
      setCompletedSections(newCompleted);
      
      GuideAccessibilityUtils.announceToScreenReader(`Section ${sectionIndex + 1} marked as complete`);
      
      // Check if all sections are completed
      if (newCompleted.length >= guideSections.length) {
        setShowCompletion(true);
        GuideProgressManager.markCompleted();
      }
    }
  }, [completedSections]);

  const handleComplete = useCallback(() => {
    setShowCompletion(true);
    GuideProgressManager.markCompleted();
    GuideAccessibilityUtils.announceToScreenReader('Guide completed! Redirecting to main application.');
    
    // Delay redirect to show completion message
    setTimeout(() => {
      onComplete?.();
    }, 2000);
  }, [onComplete]);

  const handleRestart = useCallback(() => {
    setCurrentSection(0);
    setCompletedSections([]);
    setShowCompletion(false);
    GuideProgressManager.resetProgress();
    GuideAccessibilityUtils.announceToScreenReader('Guide restarted from beginning');
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-pulse" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Your Guide...</h2>
          <p className="text-gray-600">Preparing your personalized learning experience</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null);
              setIsLoading(false);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Continue Anyway
          </button>
        </div>
      </div>
    );
  }

  // Completion state
  if (showCompletion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto p-8">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Congratulations! 🎉
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            You've completed the Enhanced Game Guide for Grow a Garden!
          </p>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-green-200 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">What you've learned:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
              {guideSections.map((section, index) => (
                <div key={section.id} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>{section.title}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-gray-600 mb-4">
            You're now ready to master Grow a Garden with confidence!
          </p>
          <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">Returning to the main application...</p>
        </div>
      </div>
    );
  }

  const currentSectionData = guideSections[currentSection];
  const totalReadTime = GuideContentUtils.calculateTotalReadTime(guideSections);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="w-10 h-10 text-blue-500" />
            <h1 className="text-4xl font-bold text-gray-800">
              Enhanced Game Guide
            </h1>
          </div>
          <p className="text-xl text-gray-600 mb-2">
            Master the viral Roblox farming sensation
          </p>
          <p className="text-sm text-gray-500">
            Total reading time: {GuideContentUtils.formatReadTime(totalReadTime)}
          </p>
        </div>

        {/* Progress Bar */}
        <GuideProgressBar
          currentSection={currentSection}
          totalSections={guideSections.length}
          completedSections={completedSections}
          onSectionJump={handleSectionJump}
        />

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <GuideSectionRenderer
            section={currentSectionData}
            isActive={true}
            onSectionComplete={handleSectionComplete}
          />
        </div>

        {/* Navigation */}
        <div id="guide-navigation" className="bg-white rounded-xl shadow-sm p-6">
          <GuideNavigation
            currentSection={currentSection}
            totalSections={guideSections.length}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onComplete={handleComplete}
            onRestart={handleRestart}
            canGoBack={currentSection > 0}
            canGoForward={currentSection < guideSections.length - 1}
            isLastSection={currentSection === guideSections.length - 1}
          />
        </div>

        {/* Footer Info */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>
            Progress is automatically saved • 
            Use keyboard navigation for accessibility • 
            {completedSections.length}/{guideSections.length} sections completed
          </p>
        </div>
      </div>
    </div>
  );
};

export default EnhancedGameGuide;