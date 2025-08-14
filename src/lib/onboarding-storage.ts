/**
 * Onboarding Storage Utilities
 * 
 * 专门用于引导系统的数据持久化工具函数
 * 实现需求 7.1-7.5: 数据持久化和状态管理
 */

import { 
  UserProfile, 
  UserPreferences, 
  OnboardingState, 
  PlayerLevelType,
  ONBOARDING_STORAGE_KEYS 
} from '@/types';

/**
 * 存储版本管理
 */
const CURRENT_STORAGE_VERSION = '1.0.0';
const PARTIAL_STATE_KEY = 'grow-a-garden:onboarding:partial-state';
const SKIP_RECORD_KEY = 'grow-a-garden:onboarding:skip-record';

/**
 * 存储错误类型
 */
export class StorageError extends Error {
  constructor(message: string, public readonly operation: string) {
    super(message);
    this.name = 'StorageError';
  }
}

/**
 * 检查localStorage是否可用
 */
export const isStorageAvailable = (): boolean => {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    console.warn('localStorage is not available:', error);
    return false;
  }
};

/**
 * 安全的localStorage操作包装器
 */
const safeStorageOperation = <T>(
  operation: () => T,
  fallback: T,
  operationName: string
): T => {
  try {
    if (!isStorageAvailable()) {
      console.warn(`Storage not available for ${operationName}, using fallback`);
      return fallback;
    }
    return operation();
  } catch (error) {
    console.error(`Storage operation failed for ${operationName}:`, error);
    return fallback;
  }
};

/**
 * 保存用户偏好设置
 * 需求 7.1: 创建localStorage存储工具函数
 */
export const saveUserPreferences = (userProfile: UserProfile): boolean => {
  return safeStorageOperation(
    () => {
      const preferences: UserPreferences = {
        ...userProfile,
        completedAt: new Date().toISOString(),
        version: CURRENT_STORAGE_VERSION
      };

      localStorage.setItem(
        ONBOARDING_STORAGE_KEYS.USER_PREFERENCES, 
        JSON.stringify(preferences)
      );
      localStorage.setItem(
        ONBOARDING_STORAGE_KEYS.ONBOARDING_COMPLETED, 
        'true'
      );
      localStorage.setItem(
        ONBOARDING_STORAGE_KEYS.ONBOARDING_VERSION, 
        CURRENT_STORAGE_VERSION
      );

      console.log('User preferences saved successfully:', preferences);
      return true;
    },
    false,
    'saveUserPreferences'
  );
};

/**
 * 读取用户偏好设置
 * 需求 7.2: 实现用户偏好的保存和读取逻辑
 */
export const loadUserPreferences = (): UserPreferences | null => {
  return safeStorageOperation(
    () => {
      const preferencesData = localStorage.getItem(ONBOARDING_STORAGE_KEYS.USER_PREFERENCES);
      const completedStatus = localStorage.getItem(ONBOARDING_STORAGE_KEYS.ONBOARDING_COMPLETED);
      
      if (!preferencesData || completedStatus !== 'true') {
        return null;
      }

      const preferences: UserPreferences = JSON.parse(preferencesData);
      
      // 验证数据完整性
      if (!isValidUserPreferences(preferences)) {
        console.warn('Invalid user preferences data, clearing storage');
        clearOnboardingData();
        return null;
      }

      // 检查版本兼容性
      if (preferences.version !== CURRENT_STORAGE_VERSION) {
        console.warn(`Version mismatch: stored ${preferences.version}, current ${CURRENT_STORAGE_VERSION}`);
        // 可以在这里实现版本迁移逻辑
      }

      return preferences;
    },
    null,
    'loadUserPreferences'
  );
};

/**
 * 检查引导完成状态
 * 需求 7.3: 添加引导完成状态的检查机制
 */
export const isOnboardingCompleted = (): boolean => {
  return safeStorageOperation(
    () => {
      const completed = localStorage.getItem(ONBOARDING_STORAGE_KEYS.ONBOARDING_COMPLETED);
      return completed === 'true';
    },
    false,
    'isOnboardingCompleted'
  );
};

/**
 * 检查引导是否被跳过
 */
export const isOnboardingSkipped = (): boolean => {
  return safeStorageOperation(
    () => {
      const completed = localStorage.getItem(ONBOARDING_STORAGE_KEYS.ONBOARDING_COMPLETED);
      return completed === 'skipped';
    },
    false,
    'isOnboardingSkipped'
  );
};

/**
 * 保存部分引导状态
 * 用于用户在引导过程中的进度保存
 */
export const savePartialOnboardingState = (state: Partial<OnboardingState>): boolean => {
  return safeStorageOperation(
    () => {
      const partialState = {
        step: state.step,
        selectedLevel: state.selectedLevel,
        selectedGoal: state.selectedGoal,
        timestamp: new Date().toISOString(),
        version: CURRENT_STORAGE_VERSION
      };
      
      localStorage.setItem(PARTIAL_STATE_KEY, JSON.stringify(partialState));
      return true;
    },
    false,
    'savePartialOnboardingState'
  );
};

/**
 * 读取部分引导状态
 * 用于恢复用户的引导进度
 */
export const loadPartialOnboardingState = (): Partial<OnboardingState> | null => {
  return safeStorageOperation(
    () => {
      const partialStateData = localStorage.getItem(PARTIAL_STATE_KEY);
      
      if (!partialStateData) {
        return null;
      }

      const partialState = JSON.parse(partialStateData);
      
      // 验证数据有效性
      if (!partialState.timestamp) {
        console.warn('Invalid partial state data, ignoring');
        return null;
      }

      // 检查数据是否过期（24小时）
      const stateAge = Date.now() - new Date(partialState.timestamp).getTime();
      const maxAge = 24 * 60 * 60 * 1000; // 24小时
      
      if (stateAge > maxAge) {
        console.log('Partial state expired, clearing');
        clearPartialOnboardingState();
        return null;
      }

      return {
        step: partialState.step,
        selectedLevel: partialState.selectedLevel,
        selectedGoal: partialState.selectedGoal,
        isCompleted: false
      };
    },
    null,
    'loadPartialOnboardingState'
  );
};

/**
 * 清除部分引导状态
 */
export const clearPartialOnboardingState = (): boolean => {
  return safeStorageOperation(
    () => {
      localStorage.removeItem(PARTIAL_STATE_KEY);
      return true;
    },
    false,
    'clearPartialOnboardingState'
  );
};

/**
 * 记录跳过引导事件
 */
export const recordOnboardingSkip = (currentState: Partial<OnboardingState>): boolean => {
  return safeStorageOperation(
    () => {
      const skipRecord = {
        skippedAt: new Date().toISOString(),
        currentStep: currentState.step,
        selectedLevel: currentState.selectedLevel,
        selectedGoal: currentState.selectedGoal,
        version: CURRENT_STORAGE_VERSION
      };
      
      localStorage.setItem(ONBOARDING_STORAGE_KEYS.ONBOARDING_COMPLETED, 'skipped');
      localStorage.setItem(SKIP_RECORD_KEY, JSON.stringify(skipRecord));
      
      // 清除部分状态
      clearPartialOnboardingState();
      
      return true;
    },
    false,
    'recordOnboardingSkip'
  );
};

/**
 * 重置引导状态
 * 需求 7.4: 实现重新进入引导的功能
 */
export const resetOnboardingState = (): boolean => {
  return safeStorageOperation(
    () => {
      // 清除所有引导相关的存储
      localStorage.removeItem(ONBOARDING_STORAGE_KEYS.ONBOARDING_COMPLETED);
      localStorage.removeItem(ONBOARDING_STORAGE_KEYS.USER_PREFERENCES);
      localStorage.removeItem(ONBOARDING_STORAGE_KEYS.ONBOARDING_VERSION);
      localStorage.removeItem(PARTIAL_STATE_KEY);
      localStorage.removeItem(SKIP_RECORD_KEY);
      
      console.log('Onboarding state reset successfully');
      return true;
    },
    false,
    'resetOnboardingState'
  );
};

/**
 * 清除所有引导数据
 */
export const clearOnboardingData = (): boolean => {
  return resetOnboardingState();
};

/**
 * 验证用户偏好数据的完整性
 */
const isValidUserPreferences = (preferences: any): preferences is UserPreferences => {
  if (!preferences || typeof preferences !== 'object') {
    return false;
  }

  // 检查必需字段
  const requiredFields = ['level', 'goal', 'flow', 'completedAt', 'version'];
  for (const field of requiredFields) {
    if (!(field in preferences)) {
      console.warn(`Missing required field: ${field}`);
      return false;
    }
  }

  // 验证枚举值
  const validLevels = ['beginner', 'advanced', 'expert'];
  const validFlows = ['beginner-guide', 'item-selection', 'full-configuration'];
  
  if (!validLevels.includes(preferences.level)) {
    console.warn(`Invalid level: ${preferences.level}`);
    return false;
  }
  
  if (!validFlows.includes(preferences.flow)) {
    console.warn(`Invalid flow: ${preferences.flow}`);
    return false;
  }

  return true;
};

/**
 * 获取存储使用情况统计
 * 用于调试和监控
 */
export const getStorageStats = (): {
  isAvailable: boolean;
  onboardingCompleted: boolean;
  hasPartialState: boolean;
  hasUserPreferences: boolean;
  storageSize: number;
} => {
  return safeStorageOperation(
    () => {
      const stats = {
        isAvailable: isStorageAvailable(),
        onboardingCompleted: isOnboardingCompleted(),
        hasPartialState: !!localStorage.getItem(PARTIAL_STATE_KEY),
        hasUserPreferences: !!localStorage.getItem(ONBOARDING_STORAGE_KEYS.USER_PREFERENCES),
        storageSize: 0
      };

      // 计算存储大小
      try {
        const onboardingKeys = [
          ONBOARDING_STORAGE_KEYS.ONBOARDING_COMPLETED,
          ONBOARDING_STORAGE_KEYS.USER_PREFERENCES,
          ONBOARDING_STORAGE_KEYS.ONBOARDING_VERSION,
          PARTIAL_STATE_KEY,
          SKIP_RECORD_KEY
        ];

        stats.storageSize = onboardingKeys.reduce((total, key) => {
          const value = localStorage.getItem(key);
          return total + (value ? value.length : 0);
        }, 0);
      } catch (error) {
        console.warn('Failed to calculate storage size:', error);
      }

      return stats;
    },
    {
      isAvailable: false,
      onboardingCompleted: false,
      hasPartialState: false,
      hasUserPreferences: false,
      storageSize: 0
    },
    'getStorageStats'
  );
};

/**
 * 内存状态管理（localStorage不可用时的降级方案）
 * 需求 8.3: localStorage不可用时的内存状态管理
 */
class MemoryStorage {
  private storage: Map<string, string> = new Map();

  setItem(key: string, value: string): void {
    this.storage.set(key, value);
  }

  getItem(key: string): string | null {
    return this.storage.get(key) || null;
  }

  removeItem(key: string): void {
    this.storage.delete(key);
  }

  clear(): void {
    this.storage.clear();
  }

  get size(): number {
    return this.storage.size;
  }
}

// 内存存储实例（降级方案）
const memoryStorage = new MemoryStorage();

/**
 * 获取存储实例（localStorage或内存存储）
 */
export const getStorageInstance = (): Storage | MemoryStorage => {
  return isStorageAvailable() ? localStorage : memoryStorage;
};

/**
 * 导出存储工具的统一接口
 */
export const onboardingStorage = {
  save: saveUserPreferences,
  load: loadUserPreferences,
  isCompleted: isOnboardingCompleted,
  isSkipped: isOnboardingSkipped,
  savePartial: savePartialOnboardingState,
  loadPartial: loadPartialOnboardingState,
  clearPartial: clearPartialOnboardingState,
  recordSkip: recordOnboardingSkip,
  reset: resetOnboardingState,
  clear: clearOnboardingData,
  getStats: getStorageStats,
  getStorage: getStorageInstance
};