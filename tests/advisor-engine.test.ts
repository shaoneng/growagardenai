// /tests/advisor-engine.test.ts
import { describe, it, expect } from 'vitest';
import { 
  generateStrategicAdvice, 
  InteractionMode, 
  isRuleEngineAvailable 
} from '../src/lib/advisor-engine';

describe('Advisor Engine', () => {
  it('should be available', () => {
    expect(isRuleEngineAvailable()).toBe(true);
  });

  it('should generate advice for beginner mode', async () => {
    const mockItems = [
      { name: 'Carrot', quantity: 2, properties: [] }
    ];

    const result = await generateStrategicAdvice(
      mockItems,
      100,
      'Spring, Day 1',
      '2025-01-01',
      InteractionMode.BEGINNER
    );

    expect(result.mainTitle).toBe('Your Garden Guide');
    expect(result.subTitle).toBe('SIMPLE STEPS TO SUCCESS');
    expect(result.sections).toHaveLength(2); // Should have simplified sections
  });

  it('should generate advice for advanced mode', async () => {
    const mockItems = [
      { name: 'Tomato', quantity: 1, properties: ['multi-harvest'] }
    ];

    const result = await generateStrategicAdvice(
      mockItems,
      500,
      'Summer, Day 5',
      '2025-01-01',
      InteractionMode.ADVANCED
    );

    expect(result.mainTitle).toBe('Strategic Briefing');
    expect(result.subTitle).toBe('GROW A GARDEN INTELLIGENCE REPORT');
    expect(result.sections.length).toBeGreaterThan(2);
  });

  it('should generate advice for expert mode', async () => {
    const mockItems = [
      { name: 'Watermelon', quantity: 1, properties: [] }
    ];

    const expertOptions = {
      optimizationGoal: 'profit' as const,
      riskTolerance: 'aggressive' as const,
      timeHorizon: 'long' as const
    };

    const result = await generateStrategicAdvice(
      mockItems,
      1000,
      'Summer, Day 10',
      '2025-01-01',
      InteractionMode.EXPERT,
      expertOptions
    );

    expect(result.mainTitle).toBe('Advanced Strategic Analysis');
    expect(result.subTitle).toBe('COMPREHENSIVE MARKET INTELLIGENCE');
    expect(result.sections).toHaveLength(4); // Should have all expert sections
  });
});