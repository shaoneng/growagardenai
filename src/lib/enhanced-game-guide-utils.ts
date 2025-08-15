// Enhanced Game Guide Utilities
import { GuideProgress, GuideAnalytics } from './enhanced-game-guide-types';

// Local Storage Keys
const GUIDE_PROGRESS_KEY = 'enhanced-game-guide-progress';
const GUIDE_ANALYTICS_KEY = 'enhanced-game-guide-analytics';

// Progress Management
export class GuideProgressManager {
  static saveProgress(progress: GuideProgress): void {
    try {
      const progressData = {
        ...progress,
        lastAccessed: new Date().toISOString()
      };
      localStorage.setItem(GUIDE_PROGRESS_KEY, JSON.stringify(progressData));
    } catch (error) {
      console.warn('Failed to save guide progress:', error);
    }
  }

  static loadProgress(): GuideProgress | null {
    try {
      const stored = localStorage.getItem(GUIDE_PROGRESS_KEY);
      if (!stored) return null;
      
      const progress = JSON.parse(stored);
      return {
        ...progress,
        lastAccessed: new Date(progress.lastAccessed)
      };
    } catch (error) {
      console.warn('Failed to load guide progress:', error);
      return null;
    }
  }

  static updateSectionProgress(sectionId: string, percentage: number): void {
    const current = this.loadProgress() || this.createDefaultProgress();
    current.sectionProgress[sectionId] = percentage;
    
    // Mark section as completed if 100%
    if (percentage >= 100 && !current.completedSections.includes(current.currentSection)) {
      current.completedSections.push(current.currentSection);
    }
    
    // Check if guide is fully completed
    current.isCompleted = current.completedSections.length >= 6;
    
    this.saveProgress(current);
  }

  static setCurrentSection(sectionIndex: number): void {
    const current = this.loadProgress() || this.createDefaultProgress();
    current.currentSection = sectionIndex;
    this.saveProgress(current);
  }

  static addTimeSpent(minutes: number): void {
    const current = this.loadProgress() || this.createDefaultProgress();
    current.timeSpent += minutes;
    this.saveProgress(current);
  }

  static markCompleted(): void {
    const current = this.loadProgress() || this.createDefaultProgress();
    current.isCompleted = true;
    current.completedSections = [0, 1, 2, 3, 4, 5]; // All sections
    this.saveProgress(current);
  }

  static resetProgress(): void {
    localStorage.removeItem(GUIDE_PROGRESS_KEY);
  }

  private static createDefaultProgress(): GuideProgress {
    return {
      currentSection: 0,
      completedSections: [],
      timeSpent: 0,
      lastAccessed: new Date(),
      isCompleted: false,
      sectionProgress: {}
    };
  }
}

// Analytics Tracking
export class GuideAnalyticsManager {
  static trackSectionView(sectionId: string): void {
    try {
      const analytics = this.loadAnalytics();
      const now = Date.now();
      
      // Track section start time
      if (!analytics.sectionStartTimes) {
        analytics.sectionStartTimes = {};
      }
      analytics.sectionStartTimes[sectionId] = now;
      
      this.saveAnalytics(analytics);
    } catch (error) {
      console.warn('Failed to track section view:', error);
    }
  }

  static trackSectionComplete(sectionId: string): void {
    try {
      const analytics = this.loadAnalytics();
      const now = Date.now();
      
      // Calculate time spent if we have start time
      if (analytics.sectionStartTimes?.[sectionId]) {
        const timeSpent = (now - analytics.sectionStartTimes[sectionId]) / 1000 / 60; // minutes
        analytics.averageTimePerSection[sectionId] = timeSpent;
      }
      
      // Update completion rate
      analytics.sectionCompletionRates[sectionId] = 
        (analytics.sectionCompletionRates[sectionId] || 0) + 1;
      
      this.saveAnalytics(analytics);
    } catch (error) {
      console.warn('Failed to track section completion:', error);
    }
  }

  static trackDropOff(sectionId: string): void {
    try {
      const analytics = this.loadAnalytics();
      if (!analytics.dropOffPoints.includes(sectionId)) {
        analytics.dropOffPoints.push(sectionId);
      }
      this.saveAnalytics(analytics);
    } catch (error) {
      console.warn('Failed to track drop off:', error);
    }
  }

  static trackFeedback(sectionId: string, rating: number): void {
    try {
      const analytics = this.loadAnalytics();
      analytics.userFeedback[sectionId] = rating;
      this.saveAnalytics(analytics);
    } catch (error) {
      console.warn('Failed to track feedback:', error);
    }
  }

  static getAnalytics(): GuideAnalytics {
    return this.loadAnalytics();
  }

  private static loadAnalytics(): any {
    try {
      const stored = localStorage.getItem(GUIDE_ANALYTICS_KEY);
      return stored ? JSON.parse(stored) : this.createDefaultAnalytics();
    } catch (error) {
      return this.createDefaultAnalytics();
    }
  }

  private static saveAnalytics(analytics: any): void {
    try {
      localStorage.setItem(GUIDE_ANALYTICS_KEY, JSON.stringify(analytics));
    } catch (error) {
      console.warn('Failed to save analytics:', error);
    }
  }

  private static createDefaultAnalytics(): any {
    return {
      sectionCompletionRates: {},
      averageTimePerSection: {},
      dropOffPoints: [],
      returnVisitRate: 0,
      userFeedback: {},
      sectionStartTimes: {}
    };
  }
}

// Content Utilities
export class GuideContentUtils {
  static calculateTotalReadTime(sections: any[]): number {
    return sections.reduce((total, section) => total + section.estimatedReadTime, 0);
  }

  static getProgressPercentage(completedSections: number[], totalSections: number): number {
    return Math.round((completedSections.length / totalSections) * 100);
  }

  static formatReadTime(minutes: number): string {
    if (minutes < 1) return 'Less than 1 min';
    if (minutes === 1) return '1 min';
    return `${minutes} mins`;
  }

  static getSectionById(sections: any[], sectionId: string): any | null {
    return sections.find(section => section.id === sectionId) || null;
  }

  static getNextSection(sections: any[], currentIndex: number): any | null {
    return currentIndex < sections.length - 1 ? sections[currentIndex + 1] : null;
  }

  static getPreviousSection(sections: any[], currentIndex: number): any | null {
    return currentIndex > 0 ? sections[currentIndex - 1] : null;
  }

  static isValidSectionIndex(index: number, totalSections: number): boolean {
    return index >= 0 && index < totalSections;
  }
}

// Error Handling Utilities
export class GuideErrorHandler {
  static handleContentLoadError(sectionId: string, error: Error): void {
    console.error(`Failed to load content for section ${sectionId}:`, error);
    
    // Track error for analytics
    try {
      const errorLog = JSON.parse(localStorage.getItem('guide-errors') || '[]');
      errorLog.push({
        sectionId,
        error: error.message,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('guide-errors', JSON.stringify(errorLog.slice(-10))); // Keep last 10 errors
    } catch (e) {
      // Ignore storage errors
    }
  }

  static handleNavigationError(fromSection: number, toSection: number, error: Error): void {
    console.error(`Navigation error from section ${fromSection} to ${toSection}:`, error);
  }

  static handleProgressSaveError(progress: GuideProgress, error: Error): void {
    console.error('Failed to save guide progress:', error);
    
    // Attempt to save to session storage as backup
    try {
      sessionStorage.setItem('guide-progress-backup', JSON.stringify(progress));
    } catch (e) {
      // If even session storage fails, we can't do much more
    }
  }

  static recoverFromBackup(): GuideProgress | null {
    try {
      const backup = sessionStorage.getItem('guide-progress-backup');
      return backup ? JSON.parse(backup) : null;
    } catch (error) {
      return null;
    }
  }
}

// Accessibility Utilities
export class GuideAccessibilityUtils {
  static announceToScreenReader(message: string): void {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  static focusElement(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.focus();
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  static setPageTitle(sectionTitle: string): void {
    document.title = `${sectionTitle} - Enhanced Game Guide - Grow a Garden Strategy Hub`;
  }

  static updateAriaLabel(elementId: string, label: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.setAttribute('aria-label', label);
    }
  }
}