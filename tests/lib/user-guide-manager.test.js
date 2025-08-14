// /tests/lib/user-guide-manager.test.js
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { UserGuideManager } from '../../src/lib/user-guide-manager';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

// Mock window object
const windowMock = {
  localStorage: localStorageMock
};

global.window = windowMock;

describe('UserGuideManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('shouldShowGuide', () => {
    it('returns true for first-time visitors', () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      const result = UserGuideManager.shouldShowGuide();
      
      expect(result).toBe(true);
      expect(localStorageMock.getItem).toHaveBeenCalledWith('userGuideCompleted');
      expect(localStorageMock.getItem).toHaveBeenCalledWith('userGuideSkipped');
      expect(localStorageMock.getItem).toHaveBeenCalledWith('userGuideDontShow');
      expect(localStorageMock.getItem).toHaveBeenCalledWith('hasVisitedBefore');
    });

    it('returns false if user has completed the guide', () => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'userGuideCompleted') return 'true';
        return null;
      });
      
      const result = UserGuideManager.shouldShowGuide();
      
      expect(result).toBe(false);
    });

    it('returns false if user has skipped the guide', () => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'userGuideSkipped') return 'true';
        return null;
      });
      
      const result = UserGuideManager.shouldShowGuide();
      
      expect(result).toBe(false);
    });

    it('returns false if user has set "don\'t show again"', () => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'userGuideDontShow') return 'true';
        return null;
      });
      
      const result = UserGuideManager.shouldShowGuide();
      
      expect(result).toBe(false);
    });

    it('returns false if user has visited before', () => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'hasVisitedBefore') return 'true';
        return null;
      });
      
      const result = UserGuideManager.shouldShowGuide();
      
      expect(result).toBe(false);
    });

    it('returns false when window is undefined (SSR)', () => {
      const originalWindow = global.window;
      global.window = undefined;
      
      const result = UserGuideManager.shouldShowGuide();
      
      expect(result).toBe(false);
      
      global.window = originalWindow;
    });
  });

  describe('markAsVisited', () => {
    it('sets the visited flag in localStorage', () => {
      UserGuideManager.markAsVisited();
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith('hasVisitedBefore', 'true');
    });

    it('does nothing when window is undefined', () => {
      const originalWindow = global.window;
      global.window = undefined;
      
      UserGuideManager.markAsVisited();
      
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
      
      global.window = originalWindow;
    });
  });

  describe('markAsCompleted', () => {
    it('sets the completed flag and removes current step', () => {
      UserGuideManager.markAsCompleted();
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith('userGuideCompleted', 'true');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('userGuideCurrentStep');
    });
  });

  describe('markAsSkipped', () => {
    it('sets the skipped flag and removes current step', () => {
      UserGuideManager.markAsSkipped();
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith('userGuideSkipped', 'true');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('userGuideCurrentStep');
    });
  });

  describe('setDontShowAgain', () => {
    it('sets the don\'t show flag and removes current step', () => {
      UserGuideManager.setDontShowAgain();
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith('userGuideDontShow', 'true');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('userGuideCurrentStep');
    });
  });

  describe('saveCurrentStep', () => {
    it('saves the current step to localStorage', () => {
      UserGuideManager.saveCurrentStep(2);
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith('userGuideCurrentStep', '2');
    });
  });

  describe('getCurrentStep', () => {
    it('returns the current step from localStorage', () => {
      localStorageMock.getItem.mockReturnValue('2');
      
      const result = UserGuideManager.getCurrentStep();
      
      expect(result).toBe(2);
      expect(localStorageMock.getItem).toHaveBeenCalledWith('userGuideCurrentStep');
    });

    it('returns 0 when no step is saved', () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      const result = UserGuideManager.getCurrentStep();
      
      expect(result).toBe(0);
    });

    it('returns 0 when window is undefined', () => {
      const originalWindow = global.window;
      global.window = undefined;
      
      const result = UserGuideManager.getCurrentStep();
      
      expect(result).toBe(0);
      
      global.window = originalWindow;
    });
  });

  describe('resetGuide', () => {
    it('removes all guide-related localStorage items', () => {
      UserGuideManager.resetGuide();
      
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('userGuideCompleted');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('userGuideSkipped');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('userGuideDontShow');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('hasVisitedBefore');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('userGuideCurrentStep');
    });
  });

  describe('getGuideStats', () => {
    it('returns guide statistics object', () => {
      localStorageMock.getItem.mockImplementation((key) => {
        switch (key) {
          case 'userGuideCompleted': return 'true';
          case 'userGuideSkipped': return null;
          case 'userGuideDontShow': return null;
          case 'hasVisitedBefore': return 'true';
          case 'userGuideCurrentStep': return '1';
          default: return null;
        }
      });
      
      const result = UserGuideManager.getGuideStats();
      
      expect(result).toEqual({
        hasCompleted: true,
        hasSkipped: false,
        dontShowAgain: false,
        hasVisited: true,
        currentStep: 1
      });
    });

    it('returns empty object when window is undefined', () => {
      const originalWindow = global.window;
      global.window = undefined;
      
      const result = UserGuideManager.getGuideStats();
      
      expect(result).toEqual({});
      
      global.window = originalWindow;
    });
  });

  describe('canShowGuideAgain', () => {
    it('returns true when "don\'t show again" is not set', () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      const result = UserGuideManager.canShowGuideAgain();
      
      expect(result).toBe(true);
      expect(localStorageMock.getItem).toHaveBeenCalledWith('userGuideDontShow');
    });

    it('returns false when "don\'t show again" is set', () => {
      localStorageMock.getItem.mockReturnValue('true');
      
      const result = UserGuideManager.canShowGuideAgain();
      
      expect(result).toBe(false);
    });

    it('returns false when window is undefined', () => {
      const originalWindow = global.window;
      global.window = undefined;
      
      const result = UserGuideManager.canShowGuideAgain();
      
      expect(result).toBe(false);
      
      global.window = originalWindow;
    });
  });
});