/**
 * Onboarding Data Validation and Recovery
 * 
 * 实现需求 8.2: 数据验证和损坏数据恢复逻辑
 */

import { 
  UserProfile, 
  UserPreferences, 
  OnboardingState, 
  PlayerLevelType,
  OnboardingFlowType,
  OnboardingStep 
} from '@/types';
import { onboardingStorage } from './onboarding-storage';

/**
 * 验证错误类型
 */
export class ValidationError extends Error {
  constructor(
    message: string, 
    public readonly field: string,
    public readonly value: any,
    public readonly expectedType?: string
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * 数据恢复结果
 */
export interface RecoveryResult {
  success: boolean;
  recovered: boolean;
  data: any;
  errors: string[];
  warnings: string[];
}

/**
 * 验证玩家水平类型
 */
export const validatePlayerLevel = (level: any): level is PlayerLevelType => {
  const validLevels: PlayerLevelType[] = ['beginner', 'advanced', 'expert'];
  return typeof level === 'string' && validLevels.includes(level as PlayerLevelType);
};

/**
 * 验证引导流程类型
 */
export const validateOnboardingFlow = (flow: any): flow is OnboardingFlowType => {
  const validFlows: OnboardingFlowType[] = ['beginner-guide', 'item-selection', 'full-configuration'];
  return typeof flow === 'string' && validFlows.includes(flow as OnboardingFlowType);
};

/**
 * 验证引导步骤
 */
export const validateOnboardingStep = (step: any): step is OnboardingStep => {
  const validSteps: OnboardingStep[] = ['level-selection', 'goal-selection', 'result'];
  return typeof step === 'string' && validSteps.includes(step as OnboardingStep);
};

/**
 * 验证用户配置对象
 */
export const validateUserProfile = (profile: any): RecoveryResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  let recovered = false;

  // 检查基本结构
  if (!profile || typeof profile !== 'object') {
    return {
      success: false,
      recovered: false,
      data: null,
      errors: ['Invalid profile: not an object'],
      warnings: []
    };
  }

  // 验证必需字段
  const requiredFields = ['level', 'goal', 'flow'];
  const missingFields = requiredFields.filter(field => !(field in profile));
  
  if (missingFields.length > 0) {
    errors.push(`Missing required fields: ${missingFields.join(', ')}`);
  }

  // 验证玩家水平
  if ('level' in profile) {
    if (!validatePlayerLevel(profile.level)) {
      errors.push(`Invalid player level: ${profile.level}`);
      
      // 尝试恢复
      if (typeof profile.level === 'string') {
        const levelLower = profile.level.toLowerCase();
        if (levelLower.includes('begin')) {
          profile.level = 'beginner';
          recovered = true;
          warnings.push('Recovered player level to "beginner"');
        } else if (levelLower.includes('adv')) {
          profile.level = 'advanced';
          recovered = true;
          warnings.push('Recovered player level to "advanced"');
        } else if (levelLower.includes('exp') || levelLower.includes('pro')) {
          profile.level = 'expert';
          recovered = true;
          warnings.push('Recovered player level to "expert"');
        }
      }
    }
  }

  // 验证目标
  if ('goal' in profile) {
    if (typeof profile.goal !== 'string' || profile.goal.trim() === '') {
      errors.push(`Invalid goal: ${profile.goal}`);
      
      // 尝试恢复默认目标
      if (profile.level) {
        profile.goal = getDefaultGoalForLevel(profile.level);
        recovered = true;
        warnings.push(`Recovered goal to default for ${profile.level}: ${profile.goal}`);
      }
    }
  }

  // 验证流程
  if ('flow' in profile) {
    if (!validateOnboardingFlow(profile.flow)) {
      errors.push(`Invalid flow: ${profile.flow}`);
      
      // 尝试根据水平恢复流程
      if (profile.level && validatePlayerLevel(profile.level)) {
        profile.flow = getDefaultFlowForLevel(profile.level);
        recovered = true;
        warnings.push(`Recovered flow to default for ${profile.level}: ${profile.flow}`);
      }
    }
  }

  // 验证水平和流程的一致性
  if (profile.level && profile.flow && 
      validatePlayerLevel(profile.level) && 
      validateOnboardingFlow(profile.flow)) {
    
    const expectedFlow = getDefaultFlowForLevel(profile.level);
    if (profile.flow !== expectedFlow) {
      warnings.push(`Flow "${profile.flow}" may not match level "${profile.level}", expected "${expectedFlow}"`);
    }
  }

  return {
    success: errors.length === 0,
    recovered,
    data: profile,
    errors,
    warnings
  };
};

/**
 * 验证用户偏好设置
 */
export const validateUserPreferences = (preferences: any): RecoveryResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  let recovered = false;

  // 首先验证基础用户配置
  const profileValidation = validateUserProfile(preferences);
  errors.push(...profileValidation.errors);
  warnings.push(...profileValidation.warnings);
  recovered = profileValidation.recovered;

  if (!profileValidation.success && !profileValidation.recovered) {
    return {
      success: false,
      recovered: false,
      data: null,
      errors,
      warnings
    };
  }

  const prefs = profileValidation.data;

  // 验证时间戳
  if ('completedAt' in prefs) {
    if (typeof prefs.completedAt !== 'string') {
      errors.push('Invalid completedAt: must be a string');
      prefs.completedAt = new Date().toISOString();
      recovered = true;
      warnings.push('Recovered completedAt to current time');
    } else {
      try {
        const date = new Date(prefs.completedAt);
        if (isNaN(date.getTime())) {
          throw new Error('Invalid date');
        }
        
        // 检查日期是否合理（不能是未来时间）
        if (date.getTime() > Date.now()) {
          prefs.completedAt = new Date().toISOString();
          recovered = true;
          warnings.push('Recovered completedAt: was in the future');
        }
      } catch (error) {
        errors.push(`Invalid completedAt format: ${prefs.completedAt}`);
        prefs.completedAt = new Date().toISOString();
        recovered = true;
        warnings.push('Recovered completedAt to current time');
      }
    }
  } else {
    prefs.completedAt = new Date().toISOString();
    recovered = true;
    warnings.push('Added missing completedAt field');
  }

  // 验证版本
  if ('version' in prefs) {
    if (typeof prefs.version !== 'string') {
      errors.push('Invalid version: must be a string');
      prefs.version = '1.0.0';
      recovered = true;
      warnings.push('Recovered version to 1.0.0');
    }
  } else {
    prefs.version = '1.0.0';
    recovered = true;
    warnings.push('Added missing version field');
  }

  return {
    success: errors.length === 0,
    recovered,
    data: prefs,
    errors,
    warnings
  };
};

/**
 * 验证引导状态
 */
export const validateOnboardingState = (state: any): RecoveryResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  let recovered = false;

  if (!state || typeof state !== 'object') {
    return {
      success: false,
      recovered: false,
      data: null,
      errors: ['Invalid state: not an object'],
      warnings: []
    };
  }

  // 验证步骤
  if ('step' in state) {
    if (!validateOnboardingStep(state.step)) {
      errors.push(`Invalid step: ${state.step}`);
      state.step = 'level-selection';
      recovered = true;
      warnings.push('Recovered step to "level-selection"');
    }
  } else {
    state.step = 'level-selection';
    recovered = true;
    warnings.push('Added missing step field');
  }

  // 验证选中的水平
  if ('selectedLevel' in state && state.selectedLevel !== null) {
    if (!validatePlayerLevel(state.selectedLevel)) {
      errors.push(`Invalid selectedLevel: ${state.selectedLevel}`);
      state.selectedLevel = null;
      recovered = true;
      warnings.push('Reset invalid selectedLevel to null');
    }
  }

  // 验证选中的目标
  if ('selectedGoal' in state && state.selectedGoal !== null) {
    if (typeof state.selectedGoal !== 'string' || state.selectedGoal.trim() === '') {
      errors.push(`Invalid selectedGoal: ${state.selectedGoal}`);
      state.selectedGoal = null;
      recovered = true;
      warnings.push('Reset invalid selectedGoal to null');
    }
  }

  // 验证完成状态
  if ('isCompleted' in state) {
    if (typeof state.isCompleted !== 'boolean') {
      state.isCompleted = false;
      recovered = true;
      warnings.push('Recovered isCompleted to false');
    }
  } else {
    state.isCompleted = false;
    recovered = true;
    warnings.push('Added missing isCompleted field');
  }

  // 验证状态逻辑一致性
  if (state.step === 'goal-selection' && !state.selectedLevel) {
    warnings.push('Inconsistent state: goal-selection step without selectedLevel');
    state.step = 'level-selection';
    recovered = true;
  }

  if (state.step === 'result' && (!state.selectedLevel || !state.selectedGoal)) {
    warnings.push('Inconsistent state: result step without complete selections');
    state.step = state.selectedLevel ? 'goal-selection' : 'level-selection';
    recovered = true;
  }

  return {
    success: errors.length === 0,
    recovered,
    data: state,
    errors,
    warnings
  };
};

/**
 * 获取水平的默认目标
 */
const getDefaultGoalForLevel = (level: PlayerLevelType): string => {
  switch (level) {
    case 'beginner':
      return 'profit';
    case 'advanced':
      return 'balance';
    case 'expert':
      return 'custom';
    default:
      return 'profit';
  }
};

/**
 * 获取水平的默认流程
 */
const getDefaultFlowForLevel = (level: PlayerLevelType): OnboardingFlowType => {
  switch (level) {
    case 'beginner':
      return 'beginner-guide';
    case 'advanced':
      return 'item-selection';
    case 'expert':
      return 'full-configuration';
    default:
      return 'item-selection';
  }
};

/**
 * 尝试恢复损坏的存储数据
 */
export const recoverCorruptedData = (): RecoveryResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  let recovered = false;

  try {
    console.log('Starting corrupted data recovery...');

    // 尝试恢复用户偏好
    const preferences = onboardingStorage.load();
    if (preferences) {
      const prefValidation = validateUserPreferences(preferences);
      if (prefValidation.recovered) {
        console.log('Recovered user preferences:', prefValidation.data);
        onboardingStorage.save(prefValidation.data);
        recovered = true;
        warnings.push('Recovered and saved user preferences');
      }
      errors.push(...prefValidation.errors);
      warnings.push(...prefValidation.warnings);
    }

    // 尝试恢复部分状态
    const partialState = onboardingStorage.loadPartial();
    if (partialState) {
      const stateValidation = validateOnboardingState(partialState);
      if (stateValidation.recovered) {
        console.log('Recovered partial state:', stateValidation.data);
        onboardingStorage.savePartial(stateValidation.data);
        recovered = true;
        warnings.push('Recovered and saved partial state');
      }
      errors.push(...stateValidation.errors);
      warnings.push(...stateValidation.warnings);
    }

    // 检查存储统计
    const stats = onboardingStorage.getStats();
    if (!stats.isAvailable) {
      errors.push('Storage is not available');
    }

    return {
      success: errors.length === 0,
      recovered,
      data: { preferences, partialState, stats },
      errors,
      warnings
    };

  } catch (error) {
    console.error('Data recovery failed:', error);
    return {
      success: false,
      recovered: false,
      data: null,
      errors: [`Recovery failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
      warnings
    };
  }
};

/**
 * 清理无效数据
 */
export const cleanupInvalidData = (): boolean => {
  try {
    console.log('Starting invalid data cleanup...');

    // 检查并清理用户偏好
    const preferences = onboardingStorage.load();
    if (preferences) {
      const validation = validateUserPreferences(preferences);
      if (!validation.success && !validation.recovered) {
        console.warn('Removing invalid user preferences:', validation.errors);
        onboardingStorage.clear();
      }
    }

    // 检查并清理部分状态
    const partialState = onboardingStorage.loadPartial();
    if (partialState) {
      const validation = validateOnboardingState(partialState);
      if (!validation.success && !validation.recovered) {
        console.warn('Removing invalid partial state:', validation.errors);
        onboardingStorage.clearPartial();
      }
    }

    console.log('Invalid data cleanup completed');
    return true;

  } catch (error) {
    console.error('Data cleanup failed:', error);
    return false;
  }
};

/**
 * 执行完整的数据健康检查
 */
export const performDataHealthCheck = (): {
  healthy: boolean;
  issues: string[];
  recommendations: string[];
  stats: any;
} => {
  const issues: string[] = [];
  const recommendations: string[] = [];

  try {
    // 获取存储统计
    const stats = onboardingStorage.getStats();

    // 检查存储可用性
    if (!stats.isAvailable) {
      issues.push('Local storage is not available');
      recommendations.push('Check browser settings and ensure storage is enabled');
    }

    // 检查数据一致性
    if (stats.onboardingCompleted && !stats.hasUserPreferences) {
      issues.push('Onboarding marked as completed but no user preferences found');
      recommendations.push('Reset onboarding state or restore user preferences');
    }

    if (stats.hasPartialState && stats.onboardingCompleted) {
      issues.push('Partial state exists but onboarding is marked as completed');
      recommendations.push('Clear partial state or reset completion status');
    }

    // 检查存储大小
    if (stats.storageSize > 10000) { // 10KB threshold
      issues.push('Onboarding storage size is unusually large');
      recommendations.push('Consider clearing old error logs and temporary data');
    }

    // 验证实际数据
    if (stats.hasUserPreferences) {
      const preferences = onboardingStorage.load();
      if (preferences) {
        const validation = validateUserPreferences(preferences);
        if (!validation.success) {
          issues.push(`Invalid user preferences: ${validation.errors.join(', ')}`);
          recommendations.push('Run data recovery or reset user preferences');
        }
      }
    }

    if (stats.hasPartialState) {
      const partialState = onboardingStorage.loadPartial();
      if (partialState) {
        const validation = validateOnboardingState(partialState);
        if (!validation.success) {
          issues.push(`Invalid partial state: ${validation.errors.join(', ')}`);
          recommendations.push('Clear partial state or run data recovery');
        }
      }
    }

    return {
      healthy: issues.length === 0,
      issues,
      recommendations,
      stats
    };

  } catch (error) {
    return {
      healthy: false,
      issues: [`Health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
      recommendations: ['Try refreshing the page or clearing browser data'],
      stats: null
    };
  }
};

/**
 * 导出验证工具的统一接口
 */
export const onboardingValidation = {
  validateUserProfile,
  validateUserPreferences,
  validateOnboardingState,
  validatePlayerLevel,
  validateOnboardingFlow,
  validateOnboardingStep,
  recoverCorruptedData,
  cleanupInvalidData,
  performDataHealthCheck
};