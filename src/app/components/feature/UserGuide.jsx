// /src/app/components/feature/UserGuide.jsx
"use client";

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const UserGuide = ({ onComplete, onSkip }) => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // 3-step tutorial as specified in requirements
  const tutorialSteps = [
    {
      id: 'step-1',
      title: t('userGuide.step1.title', '🎯 Choose Your Goal'),
      description: t('userGuide.step1.description', 'Select what you want to optimize: maximize gold, grow quickly, or increase mutation chances.'),
      targetSelector: '[data-guide="optimization-target"]',
      position: 'bottom',
      highlightClass: 'guide-highlight-primary'
    },
    {
      id: 'step-2', 
      title: t('userGuide.step2.title', '📊 View Recommendations'),
      description: t('userGuide.step2.description', 'Our AI analyzes your situation and shows the best crop, pet, and equipment combinations for maximum results.'),
      targetSelector: '[data-guide="recommendations-area"]',
      position: 'top',
      highlightClass: 'guide-highlight-secondary'
    },
    {
      id: 'step-3',
      title: t('userGuide.step3.title', '💡 Understand the Analysis'),
      description: t('userGuide.step3.description', 'Click on any recommendation to see detailed profit calculations, growth times, and the mathematical reasoning behind our suggestions.'),
      targetSelector: '[data-guide="analysis-details"]',
      position: 'left',
      highlightClass: 'guide-highlight-accent'
    }
  ];

  const currentStepData = tutorialSteps[currentStep];

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isVisible) return;
      
      if (e.key === 'Escape') {
        handleSkip();
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrevious();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [currentStep, isVisible]);

  // Highlight target element
  useEffect(() => {
    if (!isVisible || !currentStepData) return;

    const targetElement = document.querySelector(currentStepData.targetSelector);
    if (targetElement) {
      // Add highlight class
      targetElement.classList.add('guide-highlight', currentStepData.highlightClass);
      
      // Scroll into view smoothly
      targetElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'nearest'
      });

      // Remove highlight when step changes
      return () => {
        targetElement.classList.remove('guide-highlight', currentStepData.highlightClass);
      };
    }
  }, [currentStep, isVisible, currentStepData]);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    // Store completion status
    localStorage.setItem('userGuideCompleted', 'true');
    onComplete?.();
  };

  const handleSkip = () => {
    setIsVisible(false);
    // Store skip status
    localStorage.setItem('userGuideSkipped', 'true');
    onSkip?.();
  };

  const handleDontShowAgain = () => {
    localStorage.setItem('userGuideDontShow', 'true');
    handleSkip();
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40 guide-overlay" />
      
      {/* Guide Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 guide-modal">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">
                  {currentStep + 1}
                </span>
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                {t('userGuide.title', 'Welcome Tour')}
              </h2>
            </div>
            <button
              onClick={handleSkip}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={t('userGuide.close', 'Close guide')}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {currentStepData.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {currentStepData.description}
              </p>
            </div>

            {/* Progress Indicators */}
            <div className="flex justify-center space-x-2 mb-6">
              {tutorialSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentStep
                      ? 'bg-blue-500'
                      : index < currentStep
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {t('userGuide.previous', '← Previous')}
              </button>

              <div className="flex space-x-2">
                <button
                  onClick={handleSkip}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  {t('userGuide.skip', 'Skip')}
                </button>
                <button
                  onClick={handleNext}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  {currentStep === tutorialSteps.length - 1
                    ? t('userGuide.finish', 'Finish')
                    : t('userGuide.next', 'Next →')
                  }
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 rounded-b-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">
                {t('userGuide.stepCounter', 'Step {{current}} of {{total}}', {
                  current: currentStep + 1,
                  total: tutorialSteps.length
                })}
              </span>
              <button
                onClick={handleDontShowAgain}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                {t('userGuide.dontShowAgain', "Don't show again")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Guide Styles */}
      <style jsx>{`
        .guide-overlay {
          animation: fadeIn 0.3s ease-out;
        }
        
        .guide-modal {
          animation: slideIn 0.3s ease-out;
        }
        
        :global(.guide-highlight) {
          position: relative;
          z-index: 45;
          transition: all 0.3s ease;
        }
        
        :global(.guide-highlight-primary) {
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5), 0 0 20px rgba(59, 130, 246, 0.3);
          border-radius: 8px;
        }
        
        :global(.guide-highlight-secondary) {
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.5), 0 0 20px rgba(16, 185, 129, 0.3);
          border-radius: 8px;
        }
        
        :global(.guide-highlight-accent) {
          box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.5), 0 0 20px rgba(245, 158, 11, 0.3);
          border-radius: 8px;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideIn {
          from { 
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </>
  );
};

export default UserGuide;