'use client';

import React from 'react';
import { Check, Circle } from 'lucide-react';
import { GuideProgressBarProps } from '@/lib/enhanced-game-guide-types';
import { GuideContentUtils } from '@/lib/enhanced-game-guide-utils';

const GuideProgressBar: React.FC<GuideProgressBarProps> = ({
  currentSection,
  totalSections,
  completedSections,
  onSectionJump
}) => {
  const progressPercentage = GuideContentUtils.getProgressPercentage(completedSections, totalSections);

  return (
    <div className="w-full mb-6">
      {/* Progress Summary */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600">
            Section {currentSection + 1} of {totalSections}
          </span>
          <span className="text-xs text-gray-500">
            ({completedSections.length} completed)
          </span>
        </div>
        <span className="text-sm text-gray-500">
          {progressPercentage}% Complete
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Section Dots Navigation */}
      <div className="flex justify-center gap-3">
        {Array.from({ length: totalSections }, (_, index) => {
          const isCompleted = completedSections.includes(index);
          const isCurrent = index === currentSection;
          const isAccessible = index <= Math.max(...completedSections, currentSection);

          return (
            <button
              key={index}
              onClick={() => isAccessible && onSectionJump(index)}
              disabled={!isAccessible}
              className={`
                relative w-10 h-10 rounded-full border-2 transition-all duration-300 
                flex items-center justify-center text-sm font-medium
                ${isCurrent 
                  ? 'border-blue-500 bg-blue-500 text-white shadow-lg scale-110' 
                  : isCompleted
                    ? 'border-green-500 bg-green-500 text-white hover:scale-105'
                    : isAccessible
                      ? 'border-gray-300 bg-white text-gray-600 hover:border-gray-400 hover:scale-105'
                      : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                }
                ${isAccessible && !isCurrent ? 'hover:shadow-md' : ''}
              `}
              aria-label={`Go to section ${index + 1}${isCompleted ? ' (completed)' : ''}${isCurrent ? ' (current)' : ''}`}
              title={`Section ${index + 1}${isCompleted ? ' ✓' : ''}${isCurrent ? ' (current)' : ''}`}
            >
              {isCompleted ? (
                <Check className="w-5 h-5" />
              ) : (
                <span>{index + 1}</span>
              )}
              
              {/* Current section indicator */}
              {isCurrent && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Progress Text */}
      <div className="text-center mt-3">
        <p className="text-xs text-gray-500">
          Click on any accessible section to jump directly to it
        </p>
      </div>
    </div>
  );
};

export default GuideProgressBar;