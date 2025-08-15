// Enhanced Game Guide Type Definitions
import { ReactNode } from 'react';

// Core Guide Section Interface
export interface GuideSection {
  id: string;
  title: string;
  icon: ReactNode;
  content: ReactNode;
  estimatedReadTime: number;
  keyTopics: string[];
}

// Game Mechanics Data Structure
export interface GameMechanic {
  name: string;
  description: string;
  tips: string[];
  relatedMechanics: string[];
  chineseTerm?: string; // Original Chinese term for reference
  englishTerm: string;  // Professional English translation
}

// Strategic Phase Information
export interface StrategyPhase {
  phase: 'early' | 'mid' | 'late' | 'ongoing';
  title: string;
  description: string;
  keyActions: string[];
  expectedOutcomes: string[];
  recommendedResources: string[];
  timeframe: string;
}

// Complete Guide Content Structure
export interface GuideContent {
  sections: GuideSection[];
  mechanics: GameMechanic[];
  strategies: StrategyPhase[];
  glossary: Record<string, string>;
  viralStats: ViralStatistics;
}

// Progress Tracking
export interface GuideProgress {
  userId?: string;
  currentSection: number;
  completedSections: number[];
  timeSpent: number;
  lastAccessed: Date;
  isCompleted: boolean;
  sectionProgress: Record<string, number>; // Percentage completion per section
}

// Viral Statistics and Cultural Context
export interface ViralStatistics {
  peakConcurrentPlayers: number;
  culturalPositioning: string;
  comparisonGames: string[];
  releaseImpact: string;
  communitySize: string;
}

// Localization Mapping
export interface LocalizationMapping {
  chinese: string;
  english: string;
  context: string;
  usage: string;
}

// Component Props Interfaces
export interface EnhancedGameGuideProps {
  onComplete?: () => void;
  startSection?: number;
  showProgressPersistence?: boolean;
}

export interface GuideProgressBarProps {
  currentSection: number;
  totalSections: number;
  completedSections: number[];
  onSectionJump: (sectionIndex: number) => void;
}

export interface GuideSectionRendererProps {
  section: GuideSection;
  isActive: boolean;
  onSectionComplete: (sectionId: string) => void;
}

// Error Handling
export interface GuideErrorState {
  type: 'content_load' | 'navigation' | 'progress_save';
  message: string;
  retryAction?: () => void;
  fallbackContent?: ReactNode;
}

// Analytics and Metrics
export interface GuideAnalytics {
  sectionCompletionRates: Record<string, number>;
  averageTimePerSection: Record<string, number>;
  dropOffPoints: string[];
  returnVisitRate: number;
  userFeedback: Record<string, number>; // Section ratings
}

// Content Categories for Organization
export type ContentCategory = 
  | 'welcome'
  | 'core-gameplay'
  | 'advanced-mechanics'
  | 'progression'
  | 'social-features'
  | 'strategy-roadmap';

// Interactive Elements
export interface InteractiveElement {
  type: 'flowchart' | 'weather-wheel' | 'pet-gallery' | 'comparison-chart' | 'timeline';
  data: any;
  title: string;
  description: string;
}