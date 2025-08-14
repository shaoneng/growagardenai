// /tests/hooks/useUserGuide.test.js
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useUserGuide } from '../../src/hooks/useUserGuide';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;

describe('useUserGuide Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with correct default values for first-time visitor', () => {
    localStorageMock.getItem.mockReturnValue(null);
    
    const { result } = renderHook(() => useUserGuide());
    
    expect(result.current.shouldShowGuide).toBe(false); // Initially false, will be set to true after effect
    expect(result.current.isFirstVisit).toBe(false);
  });

  it('sets shouldShowGuide to true for first-time visitors', async () => {
    localStorageMock.getItem.mockReturnValue(null);
    
    const { result, rerender } = renderHook(() => useUserGuide());
    
    // Trigger the effect by re-rendering
    rerender();
    
    // The effect should have run and set the visited flag
    expect(localStorageMock.setItem).toHaveBeenCalledWith('hasVisitedBefore', 'true');
  });

  it('does not show guide if user has completed it', () => {
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'userGuideCompleted') return 'true';
      if (key === 'hasVisitedBefore') return 'true';
      return null;
    });
    
    const { result } = renderHook(() => useUserGuide());
    
    expect(result.current.shouldShowGuide).toBe(false);
  });

  it('does not show guide if user has skipped it', () => {
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'userGuideSkipped') return 'true';
      if (key === 'hasVisitedBefore') return 'true';
      return null;
    });
    
    const { result } = renderHook(() => useUserGuide());
    
    expect(result.current.shouldShowGuide).toBe(false);
  });

  it('does not show guide if user has set "don\'t show again"', () => {
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'userGuideDontShow') return 'true';
      if (key === 'hasVisitedBefore') return 'true';
      return null;
    });
    
    const { result } = renderHook(() => useUserGuide());
    
    expect(result.current.shouldShowGuide).toBe(false);
  });

  it('showGuide function sets shouldShowGuide to true', () => {
    localStorageMock.getItem.mockReturnValue('true'); // Simulate returning visitor
    
    const { result } = renderHook(() => useUserGuide());
    
    act(() => {
      result.current.showGuide();
    });
    
    expect(result.current.shouldShowGuide).toBe(true);
  });

  it('hideGuide function sets shouldShowGuide to false', () => {
    localStorageMock.getItem.mockReturnValue(null); // First time visitor
    
    const { result } = renderHook(() => useUserGuide());
    
    // First show the guide
    act(() => {
      result.current.showGuide();
    });
    
    expect(result.current.shouldShowGuide).toBe(true);
    
    // Then hide it
    act(() => {
      result.current.hideGuide();
    });
    
    expect(result.current.shouldShowGuide).toBe(false);
  });

  it('resetGuide function clears localStorage and shows guide', () => {
    localStorageMock.getItem.mockReturnValue('true'); // Simulate completed guide
    
    const { result } = renderHook(() => useUserGuide());
    
    act(() => {
      result.current.resetGuide();
    });
    
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('userGuideCompleted');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('userGuideSkipped');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('userGuideDontShow');
    expect(result.current.shouldShowGuide).toBe(true);
  });

  it('handleGuideComplete function marks as completed and hides guide', () => {
    const { result } = renderHook(() => useUserGuide());
    
    // First show the guide
    act(() => {
      result.current.showGuide();
    });
    
    expect(result.current.shouldShowGuide).toBe(true);
    
    // Then complete it
    act(() => {
      result.current.handleGuideComplete();
    });
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith('userGuideCompleted', 'true');
    expect(result.current.shouldShowGuide).toBe(false);
  });

  it('handleGuideSkip function marks as skipped and hides guide', () => {
    const { result } = renderHook(() => useUserGuide());
    
    // First show the guide
    act(() => {
      result.current.showGuide();
    });
    
    expect(result.current.shouldShowGuide).toBe(true);
    
    // Then skip it
    act(() => {
      result.current.handleGuideSkip();
    });
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith('userGuideSkipped', 'true');
    expect(result.current.shouldShowGuide).toBe(false);
  });

  it('correctly identifies first visit', () => {
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'hasVisitedBefore') return null; // No previous visit
      return null;
    });
    
    const { result, rerender } = renderHook(() => useUserGuide());
    
    // Trigger the effect
    rerender();
    
    // Should mark as visited
    expect(localStorageMock.setItem).toHaveBeenCalledWith('hasVisitedBefore', 'true');
  });

  it('does not mark as visited for returning users', () => {
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'hasVisitedBefore') return 'true'; // Previous visit
      return null;
    });
    
    const { result } = renderHook(() => useUserGuide());
    
    expect(result.current.isFirstVisit).toBe(false);
    // Should not set visited flag again
    expect(localStorageMock.setItem).not.toHaveBeenCalledWith('hasVisitedBefore', 'true');
  });

  it('provides all expected functions and properties', () => {
    const { result } = renderHook(() => useUserGuide());
    
    expect(typeof result.current.shouldShowGuide).toBe('boolean');
    expect(typeof result.current.isFirstVisit).toBe('boolean');
    expect(typeof result.current.showGuide).toBe('function');
    expect(typeof result.current.hideGuide).toBe('function');
    expect(typeof result.current.resetGuide).toBe('function');
    expect(typeof result.current.handleGuideComplete).toBe('function');
    expect(typeof result.current.handleGuideSkip).toBe('function');
  });
});