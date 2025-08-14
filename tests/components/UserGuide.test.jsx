// /tests/components/UserGuide.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import UserGuide from '../../src/app/components/feature/UserGuide';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key, defaultValue) => defaultValue || key
  })
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;

describe('UserGuide Component', () => {
  const mockOnComplete = vi.fn();
  const mockOnSkip = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock DOM elements for guide targeting
    document.body.innerHTML = `
      <div data-guide="optimization-target">Optimization Target</div>
      <div data-guide="recommendations-area">Recommendations Area</div>
      <div data-guide="analysis-details">Analysis Details</div>
    `;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders the user guide with correct initial step', () => {
    render(<UserGuide onComplete={mockOnComplete} onSkip={mockOnSkip} />);
    
    expect(screen.getByText('Welcome Tour')).toBeInTheDocument();
    expect(screen.getByText('🎯 Choose Your Goal')).toBeInTheDocument();
    expect(screen.getByText('Step 1 of 3')).toBeInTheDocument();
  });

  it('displays correct step content for each step', () => {
    render(<UserGuide onComplete={mockOnComplete} onSkip={mockOnSkip} />);
    
    // Step 1
    expect(screen.getByText('🎯 Choose Your Goal')).toBeInTheDocument();
    expect(screen.getByText(/Select what you want to optimize/)).toBeInTheDocument();
    
    // Navigate to step 2
    fireEvent.click(screen.getByText('Next →'));
    expect(screen.getByText('📊 View Recommendations')).toBeInTheDocument();
    expect(screen.getByText(/Our AI analyzes your situation/)).toBeInTheDocument();
    
    // Navigate to step 3
    fireEvent.click(screen.getByText('Next →'));
    expect(screen.getByText('💡 Understand the Analysis')).toBeInTheDocument();
    expect(screen.getByText(/Click on any recommendation/)).toBeInTheDocument();
  });

  it('handles navigation between steps correctly', () => {
    render(<UserGuide onComplete={mockOnComplete} onSkip={mockOnSkip} />);
    
    // Initially on step 1, Previous should be disabled
    const previousButton = screen.getByText('← Previous');
    expect(previousButton).toBeDisabled();
    
    // Navigate to step 2
    fireEvent.click(screen.getByText('Next →'));
    expect(screen.getByText('Step 2 of 3')).toBeInTheDocument();
    expect(previousButton).not.toBeDisabled();
    
    // Navigate back to step 1
    fireEvent.click(previousButton);
    expect(screen.getByText('Step 1 of 3')).toBeInTheDocument();
    expect(previousButton).toBeDisabled();
  });

  it('shows finish button on last step', () => {
    render(<UserGuide onComplete={mockOnComplete} onSkip={mockOnSkip} />);
    
    // Navigate to last step
    fireEvent.click(screen.getByText('Next →'));
    fireEvent.click(screen.getByText('Next →'));
    
    expect(screen.getByText('Finish')).toBeInTheDocument();
    expect(screen.queryByText('Next →')).not.toBeInTheDocument();
  });

  it('calls onComplete when finish button is clicked', () => {
    render(<UserGuide onComplete={mockOnComplete} onSkip={mockOnSkip} />);
    
    // Navigate to last step and click finish
    fireEvent.click(screen.getByText('Next →'));
    fireEvent.click(screen.getByText('Next →'));
    fireEvent.click(screen.getByText('Finish'));
    
    expect(mockOnComplete).toHaveBeenCalledTimes(1);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('userGuideCompleted', 'true');
  });

  it('calls onSkip when skip button is clicked', () => {
    render(<UserGuide onComplete={mockOnComplete} onSkip={mockOnSkip} />);
    
    fireEvent.click(screen.getByText('Skip'));
    
    expect(mockOnSkip).toHaveBeenCalledTimes(1);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('userGuideSkipped', 'true');
  });

  it('handles "Don\'t show again" functionality', () => {
    render(<UserGuide onComplete={mockOnComplete} onSkip={mockOnSkip} />);
    
    fireEvent.click(screen.getByText("Don't show again"));
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith('userGuideDontShow', 'true');
    expect(mockOnSkip).toHaveBeenCalledTimes(1);
  });

  it('handles keyboard navigation', () => {
    render(<UserGuide onComplete={mockOnComplete} onSkip={mockOnSkip} />);
    
    // Test Escape key
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(mockOnSkip).toHaveBeenCalledTimes(1);
  });

  it('handles keyboard navigation for next step', () => {
    render(<UserGuide onComplete={mockOnComplete} onSkip={mockOnSkip} />);
    
    // Test Enter key for next step
    fireEvent.keyDown(document, { key: 'Enter' });
    expect(screen.getByText('Step 2 of 3')).toBeInTheDocument();
    
    // Test ArrowRight key for next step
    fireEvent.keyDown(document, { key: 'ArrowRight' });
    expect(screen.getByText('Step 3 of 3')).toBeInTheDocument();
  });

  it('handles keyboard navigation for previous step', () => {
    render(<UserGuide onComplete={mockOnComplete} onSkip={mockOnSkip} />);
    
    // Navigate to step 2 first
    fireEvent.click(screen.getByText('Next →'));
    
    // Test ArrowLeft key for previous step
    fireEvent.keyDown(document, { key: 'ArrowLeft' });
    expect(screen.getByText('Step 1 of 3')).toBeInTheDocument();
  });

  it('highlights target elements correctly', async () => {
    render(<UserGuide onComplete={mockOnComplete} onSkip={mockOnSkip} />);
    
    // Check if target element gets highlighted
    const targetElement = document.querySelector('[data-guide="optimization-target"]');
    
    await waitFor(() => {
      expect(targetElement.classList.contains('guide-highlight')).toBe(true);
      expect(targetElement.classList.contains('guide-highlight-primary')).toBe(true);
    });
  });

  it('updates progress indicators correctly', () => {
    render(<UserGuide onComplete={mockOnComplete} onSkip={mockOnSkip} />);
    
    const progressDots = screen.getAllByRole('generic').filter(el => 
      el.className.includes('rounded-full')
    );
    
    // First dot should be active (blue)
    expect(progressDots[0]).toHaveClass('bg-blue-500');
    expect(progressDots[1]).toHaveClass('bg-gray-300');
    expect(progressDots[2]).toHaveClass('bg-gray-300');
    
    // Navigate to step 2
    fireEvent.click(screen.getByText('Next →'));
    
    // Second dot should be active, first should be completed (green)
    expect(progressDots[0]).toHaveClass('bg-green-500');
    expect(progressDots[1]).toHaveClass('bg-blue-500');
    expect(progressDots[2]).toHaveClass('bg-gray-300');
  });

  it('closes guide when close button is clicked', () => {
    render(<UserGuide onComplete={mockOnComplete} onSkip={mockOnSkip} />);
    
    const closeButton = screen.getByLabelText('Close guide');
    fireEvent.click(closeButton);
    
    expect(mockOnSkip).toHaveBeenCalledTimes(1);
  });

  it('removes highlight classes when component unmounts', () => {
    const { unmount } = render(<UserGuide onComplete={mockOnComplete} onSkip={mockOnSkip} />);
    
    const targetElement = document.querySelector('[data-guide="optimization-target"]');
    
    // Unmount component
    unmount();
    
    // Highlight classes should be removed
    expect(targetElement.classList.contains('guide-highlight')).toBe(false);
    expect(targetElement.classList.contains('guide-highlight-primary')).toBe(false);
  });

  it('scrolls target element into view', async () => {
    // Mock scrollIntoView
    const mockScrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = mockScrollIntoView;
    
    render(<UserGuide onComplete={mockOnComplete} onSkip={mockOnSkip} />);
    
    await waitFor(() => {
      expect(mockScrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
      });
    });
  });
});