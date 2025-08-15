'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, Home, RotateCcw } from 'lucide-react';

interface GuideNavigationProps {
  currentSection: number;
  totalSections: number;
  onPrevious: () => void;
  onNext: () => void;
  onComplete: () => void;
  onRestart: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
  isLastSection: boolean;
}

const GuideNavigation: React.FC<GuideNavigationProps> = ({
  currentSection,
  totalSections,
  onPrevious,
  onNext,
  onComplete,
  onRestart,
  canGoBack,
  canGoForward,
  isLastSection
}) => {
  return (
    <div className="flex justify-between items-center pt-6 border-t border-gray-200">
      {/* Left Side - Previous Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={onPrevious}
          disabled={!canGoBack}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
            ${canGoBack
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm'
              : 'bg-gray-50 text-gray-400 cursor-not-allowed'
            }
          `}
          aria-label="Go to previous section"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        {/* Restart Button (only show after first section) */}
        {currentSection > 0 && (
          <button
            onClick={onRestart}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Restart guide from beginning"
            title="Restart from beginning"
          >
            <RotateCcw className="w-4 h-4" />
            Restart
          </button>
        )}
      </div>

      {/* Center - Section Indicator */}
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
        <span className="text-sm text-gray-600">
          {currentSection + 1} / {totalSections}
        </span>
      </div>

      {/* Right Side - Next/Complete Button */}
      <div className="flex items-center gap-3">
        {isLastSection ? (
          <button
            onClick={onComplete}
            className="flex items-center gap-2 px-6 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-all duration-200 shadow-sm hover:shadow-md"
            aria-label="Complete guide and return to app"
          >
            <Home className="w-4 h-4" />
            Complete Guide
          </button>
        ) : (
          <button
            onClick={onNext}
            disabled={!canGoForward}
            className={`
              flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all duration-200
              ${canGoForward
                ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-sm hover:shadow-md'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }
            `}
            aria-label="Go to next section"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default GuideNavigation;