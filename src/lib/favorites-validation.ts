// /src/lib/favorites-validation.ts
// 收藏系统的数据验证和错误处理工具

import { FavoriteItemType } from '@/types';

/**
 * 验证错误类型
 */
export enum ValidationErrorType {
  INVALID_ITEM_ID = 'INVALID_ITEM_ID',
  INVALID_ITEM_TYPE = 'INVALID_ITEM_TYPE',
  EMPTY_ITEM_ID = 'EMPTY_ITEM_ID',
  STORAGE_NOT_SUPPORTED = 'STORAGE_NOT_SUPPORTED',
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',
  DATA_CORRUPTED = 'DATA_CORRUPTED'
}

/**
 * 验证错误类
 */
export class FavoritesValidationError extends Error {
  public readonly type: ValidationErrorType;
  public readonly details?: any;

  constructor(type: ValidationErrorType, message: string, details?: any) {
    super(message);
    this.name = 'FavoritesValidationError';
    this.type = type;
    this.details = details;
  }
}

/**
 * 收藏系统验证工具类
 */
export class FavoritesValidator {
  /**
   * 验证物品ID
   */
  static validateItemId(itemId: string): void {
    if (!itemId) {
      throw new FavoritesValidationError(
        ValidationErrorType.EMPTY_ITEM_ID,
        'Item ID cannot be empty'
      );
    }

    if (typeof itemId !== 'string') {
      throw new FavoritesValidationError(
        ValidationErrorType.INVALID_ITEM_ID,
        'Item ID must be a string',
        { providedType: typeof itemId, value: itemId }
      );
    }

    // 检查ID格式（只允许字母、数字、下划线和连字符）
    const validIdPattern = /^[a-zA-Z0-9_-]+$/;
    if (!validIdPattern.test(itemId)) {
      throw new FavoritesValidationError(
        ValidationErrorType.INVALID_ITEM_ID,
        'Item ID contains invalid characters. Only letters, numbers, underscores, and hyphens are allowed.',
        { value: itemId }
      );
    }

    // 检查ID长度
    if (itemId.length > 100) {
      throw new FavoritesValidationError(
        ValidationErrorType.INVALID_ITEM_ID,
        'Item ID is too long. Maximum length is 100 characters.',
        { value: itemId, length: itemId.length }
      );
    }
  }

  /**
   * 验证物品类型
   */
  static validateItemType(itemType: string): asserts itemType is FavoriteItemType {
    const validTypes: FavoriteItemType[] = ['crops', 'pets', 'reports'];
    
    if (!validTypes.includes(itemType as FavoriteItemType)) {
      throw new FavoritesValidationError(
        ValidationErrorType.INVALID_ITEM_TYPE,
        `Invalid item type. Must be one of: ${validTypes.join(', ')}`,
        { providedType: itemType, validTypes }
      );
    }
  }

  /**
   * 验证收藏操作参数
   */
  static validateFavoriteOperation(itemId: string, itemType: string): void {
    this.validateItemId(itemId);
    this.validateItemType(itemType);
  }

  /**
   * 安全地解析 JSON 数据
   */
  static safeJsonParse<T = any>(jsonString: string, fallback?: T): T | null {
    try {
      const parsed = JSON.parse(jsonString);
      return parsed;
    } catch (error) {
      console.warn('Failed to parse JSON:', error);
      return fallback || null;
    }
  }

  /**
   * 安全地序列化数据为 JSON
   */
  static safeJsonStringify(data: any, fallback: string = '{}'): string {
    try {
      return JSON.stringify(data);
    } catch (error) {
      console.warn('Failed to stringify data:', error);
      return fallback;
    }
  }

  /**
   * 检查数组是否包含重复项
   */
  static hasDuplicates(array: string[]): boolean {
    return new Set(array).size !== array.length;
  }

  /**
   * 移除数组中的重复项
   */
  static removeDuplicates(array: string[]): string[] {
    return [...new Set(array)];
  }

  /**
   * 验证收藏数组的完整性
   */
  static validateFavoritesArray(array: any, arrayName: string): string[] {
    if (!Array.isArray(array)) {
      throw new FavoritesValidationError(
        ValidationErrorType.DATA_CORRUPTED,
        `${arrayName} must be an array`,
        { providedType: typeof array, value: array }
      );
    }

    // 检查数组元素是否都是有效的字符串
    const invalidItems = array.filter(item => {
      if (typeof item !== 'string') return true;
      try {
        this.validateItemId(item);
        return false;
      } catch {
        return true;
      }
    });

    if (invalidItems.length > 0) {
      throw new FavoritesValidationError(
        ValidationErrorType.DATA_CORRUPTED,
        `${arrayName} contains invalid items`,
        { invalidItems }
      );
    }

    // 移除重复项并返回清理后的数组
    return this.removeDuplicates(array);
  }

  /**
   * 清理和修复收藏数据
   */
  static sanitizeFavoritesData(data: any): { crops: string[]; pets: string[]; reports: string[] } {
    const result = {
      crops: [] as string[],
      pets: [] as string[],
      reports: [] as string[]
    };

    try {
      if (data && typeof data === 'object') {
        // 尝试修复 crops 数组
        if (data.crops) {
          try {
            result.crops = this.validateFavoritesArray(data.crops, 'crops');
          } catch (error) {
            console.warn('Failed to validate crops array, using empty array:', error);
          }
        }

        // 尝试修复 pets 数组
        if (data.pets) {
          try {
            result.pets = this.validateFavoritesArray(data.pets, 'pets');
          } catch (error) {
            console.warn('Failed to validate pets array, using empty array:', error);
          }
        }

        // 尝试修复 reports 数组
        if (data.reports) {
          try {
            result.reports = this.validateFavoritesArray(data.reports, 'reports');
          } catch (error) {
            console.warn('Failed to validate reports array, using empty array:', error);
          }
        }
      }
    } catch (error) {
      console.warn('Failed to sanitize favorites data, using empty data:', error);
    }

    return result;
  }
}

/**
 * 错误处理工具类
 */
export class FavoritesErrorHandler {
  /**
   * 处理 localStorage 错误
   */
  static handleStorageError(error: any): string {
    if (error instanceof Error) {
      switch (error.name) {
        case 'QuotaExceededError':
          return 'Storage quota exceeded. Please clear some browser data to continue using favorites.';
        case 'SecurityError':
          return 'Storage access denied. Please check your browser privacy settings.';
        case 'InvalidStateError':
          return 'Storage is in an invalid state. Please try refreshing the page.';
        default:
          return `Storage error: ${error.message}`;
      }
    }
    return 'An unknown storage error occurred.';
  }

  /**
   * 处理验证错误
   */
  static handleValidationError(error: FavoritesValidationError): string {
    switch (error.type) {
      case ValidationErrorType.INVALID_ITEM_ID:
        return 'Invalid item identifier. Please try again.';
      case ValidationErrorType.INVALID_ITEM_TYPE:
        return 'Invalid item type. Please select a valid item.';
      case ValidationErrorType.EMPTY_ITEM_ID:
        return 'Item identifier is required.';
      case ValidationErrorType.STORAGE_NOT_SUPPORTED:
        return 'Your browser does not support local storage. Favorites will not be saved.';
      case ValidationErrorType.QUOTA_EXCEEDED:
        return 'Storage quota exceeded. Please clear some browser data.';
      case ValidationErrorType.DATA_CORRUPTED:
        return 'Favorites data is corrupted and has been reset.';
      default:
        return error.message || 'A validation error occurred.';
    }
  }

  /**
   * 获取用户友好的错误消息
   */
  static getUserFriendlyMessage(error: any): string {
    if (error instanceof FavoritesValidationError) {
      return this.handleValidationError(error);
    }

    if (error instanceof Error) {
      return this.handleStorageError(error);
    }

    return 'An unexpected error occurred. Please try again.';
  }

  /**
   * 记录错误到控制台（开发环境）
   */
  static logError(error: any, context?: string): void {
    if (process.env.NODE_ENV === 'development') {
      const prefix = context ? `[Favorites${context}]` : '[Favorites]';
      console.error(prefix, error);
      
      if (error instanceof FavoritesValidationError && error.details) {
        console.error(`${prefix} Error details:`, error.details);
      }
    }
  }

  /**
   * 创建错误报告对象
   */
  static createErrorReport(error: any, context?: string) {
    return {
      timestamp: new Date().toISOString(),
      context: context || 'unknown',
      type: error.constructor.name,
      message: error.message,
      stack: error.stack,
      details: error instanceof FavoritesValidationError ? error.details : undefined
    };
  }
}

/**
 * 防抖工具函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

/**
 * 节流工具函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}