// /src/lib/user-guide-manager.js
"use client";

/**
 * User Guide State Manager
 * Handles user guide completion status and preferences
 */
export class UserGuideManager {
  static STORAGE_KEYS = {
    COMPLETED: 'userGuideCompleted',
    SKIPPED: 'userGuideSkipped',
    DONT_SHOW: 'userGuideDontShow',
    FIRST_VISIT: 'hasVisitedBefore',
    CURRENT_STEP: 'userGuideCurrentStep'
  };

  /**
   * Check if user should see the guide
   * @returns {boolean}
   */
  static shouldShowGuide() {
    if (typeof window === 'undefined') return false;

    const hasCompleted = localStorage.getItem(this.STORAGE_KEYS.COMPLETED) === 'true';
    const hasSkipped = localStorage.getItem(this.STORAGE_KEYS.SKIPPED) === 'true';
    const dontShow = localStorage.getItem(this.STORAGE_KEYS.DONT_SHOW) === 'true';
    const hasVisited = localStorage.getItem(this.STORAGE_KEYS.FIRST_VISIT) === 'true';

    // Show guide only on first visit and if not completed/skipped/disabled
    return !hasVisited && !hasCompleted && !hasSkipped && !dontShow;
  }

  /**
   * Mark user as having visited the site
   */
  static markAsVisited() {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.STORAGE_KEYS.FIRST_VISIT, 'true');
  }

  /**
   * Mark guide as completed
   */
  static markAsCompleted() {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.STORAGE_KEYS.COMPLETED, 'true');
    localStorage.removeItem(this.STORAGE_KEYS.CURRENT_STEP);
  }

  /**
   * Mark guide as skipped
   */
  static markAsSkipped() {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.STORAGE_KEYS.SKIPPED, 'true');
    localStorage.removeItem(this.STORAGE_KEYS.CURRENT_STEP);
  }

  /**
   * Set don't show again preference
   */
  static setDontShowAgain() {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.STORAGE_KEYS.DONT_SHOW, 'true');
    localStorage.removeItem(this.STORAGE_KEYS.CURRENT_STEP);
  }

  /**
   * Save current step progress
   * @param {number} step
   */
  static saveCurrentStep(step) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.STORAGE_KEYS.CURRENT_STEP, step.toString());
  }

  /**
   * Get current step progress
   * @returns {number}
   */
  static getCurrentStep() {
    if (typeof window === 'undefined') return 0;
    const step = localStorage.getItem(this.STORAGE_KEYS.CURRENT_STEP);
    return step ? parseInt(step, 10) : 0;
  }

  /**
   * Reset all guide preferences (for testing or manual reset)
   */
  static resetGuide() {
    if (typeof window === 'undefined') return;
    Object.values(this.STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }

  /**
   * Get guide statistics for analytics
   * @returns {Object}
   */
  static getGuideStats() {
    if (typeof window === 'undefined') return {};

    return {
      hasCompleted: localStorage.getItem(this.STORAGE_KEYS.COMPLETED) === 'true',
      hasSkipped: localStorage.getItem(this.STORAGE_KEYS.SKIPPED) === 'true',
      dontShowAgain: localStorage.getItem(this.STORAGE_KEYS.DONT_SHOW) === 'true',
      hasVisited: localStorage.getItem(this.STORAGE_KEYS.FIRST_VISIT) === 'true',
      currentStep: this.getCurrentStep()
    };
  }

  /**
   * Check if user can see guide again (for "Show Guide" button)
   * @returns {boolean}
   */
  static canShowGuideAgain() {
    if (typeof window === 'undefined') return false;
    const dontShow = localStorage.getItem(this.STORAGE_KEYS.DONT_SHOW) === 'true';
    return !dontShow;
  }
}