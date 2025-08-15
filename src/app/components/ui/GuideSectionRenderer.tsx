'use client';

import React, { useEffect, useRef } from 'react';
import { Clock, BookOpen, Star } from 'lucide-react';
import { GuideSectionRendererProps } from '@/lib/enhanced-game-guide-types';
import { GuideContentUtils, GuideAnalyticsManager, GuideAccessibilityUtils } from '@/lib/enhanced-game-guide-utils';

const GuideSectionRenderer: React.FC<GuideSectionRendererProps> = ({
  section,
  isActive,
  onSectionComplete
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    if (isActive) {
      // Track section view for analytics
      GuideAnalyticsManager.trackSectionView(section.id);
      
      // Update page title for accessibility
      GuideAccessibilityUtils.setPageTitle(section.title);
      
      // Announce section change to screen readers
      GuideAccessibilityUtils.announceToScreenReader(`Now viewing: ${section.title}`);
      
      // Focus the section for keyboard navigation
      if (sectionRef.current) {
        sectionRef.current.focus();
      }

      // Reset start time
      startTimeRef.current = Date.now();
    }

    return () => {
      if (isActive) {
        // Track time spent when leaving section
        const timeSpent = (Date.now() - startTimeRef.current) / 1000 / 60; // minutes
        if (timeSpent > 0.5) { // Only track if spent more than 30 seconds
          GuideAnalyticsManager.trackSectionComplete(section.id);
        }
      }
    };
  }, [isActive, section.id, section.title]);

  const handleSectionComplete = () => {
    GuideAnalyticsManager.trackSectionComplete(section.id);
    onSectionComplete(section.id);
  };

  if (!isActive) {
    return null;
  }

  return (
    <div 
      ref={sectionRef}
      className="w-full max-w-4xl mx-auto"
      tabIndex={-1}
      role="main"
      aria-labelledby={`section-${section.id}-title`}
    >
      {/* Section Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          {section.icon}
          <h1 
            id={`section-${section.id}-title`}
            className="text-3xl font-bold text-gray-800"
          >
            {section.title}
          </h1>
        </div>
        
        {/* Section Metadata */}
        <div className="flex items-center justify-center gap-6 text-sm text-gray-500 mb-6">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{GuideContentUtils.formatReadTime(section.estimatedReadTime)} read</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            <span>{section.keyTopics.length} key topics</span>
          </div>
        </div>

        {/* Key Topics Preview */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {section.keyTopics.map((topic, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-200"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>

      {/* Section Content */}
      <div 
        className="prose prose-lg max-w-none"
        role="region"
        aria-label="Section content"
      >
        {section.content}
      </div>

      {/* Section Footer */}
      <div className="mt-12 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Star className="w-6 h-6 text-green-600" />
            <div>
              <h3 className="font-semibold text-gray-800">Section Complete!</h3>
              <p className="text-sm text-gray-600">
                You've learned about {section.keyTopics.join(', ').toLowerCase()}
              </p>
            </div>
          </div>
          
          <button
            onClick={handleSectionComplete}
            className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
            aria-label={`Mark ${section.title} as complete`}
          >
            Mark Complete
          </button>
        </div>
      </div>

      {/* Accessibility Skip Link */}
      <div className="sr-only">
        <a href="#guide-navigation" className="skip-link">
          Skip to navigation
        </a>
      </div>
    </div>
  );
};

export default GuideSectionRenderer;