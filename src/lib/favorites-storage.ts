// /src/lib/favorites-storage.ts
// 收藏系统的 localStorage 管理工具

import { FavoritesData, StorageResult, FavoriteItemType } from '@/types';

/**
 * 默认收藏数据
 */
const DEFAULT_FAVORITES: FavoritesData = {
  crops: [],
  pets: [],
  reports: [],
  lastUpdated: new Date().toISOString()
};

/**
 * localStorage 键名
 */
const STORAGE_KEY = 'growagarden_favorites';

/**
 * 数据版本（用于未来的数据迁移）
 */
const DATA_VERSION = '1.0.0';

/**
 * 收藏数据存储管理类
 */
export class FavoritesStorage {
  /**
   * 检查 localStorage 是否可用
   */
  static isSupported(): boolean {
    try {
      const testKey = '__localStorage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      console.warn('localStorage is not supported:', error);
      return false;
    }
  }

  /**
   * 验证收藏数据格式
   */
  static validateFavoritesData(data: any): data is FavoritesData {
    if (!data || typeof data !== 'object') {
      return false;
    }

    const { crops, pets, reports, lastUpdated } = data;

    // 检查必需字段
    if (!Array.isArray(crops) || !Array.isArray(pets) || typeof lastUpdated !== 'string') {
      return false;
    }

    // 检查 reports 字段（可能不存在于旧数据中）
    if (reports !== undefined && !Array.isArray(reports)) {
      return false;
    }

    // 检查数组元素是否都是字符串
    const isValidStringArray = (arr: any[]): boolean => {
      return arr.every(item => typeof item === 'string');
    };

    if (!isValidStringArray(crops) || !isValidStringArray(pets)) {
      return false;
    }

    if (reports && !isValidStringArray(reports)) {
      return false;
    }

    // 检查日期格式
    if (isNaN(Date.parse(lastUpdated))) {
      return false;
    }

    return true;
  }

  /**
   * 从 localStorage 加载收藏数据
   * 注意：这是基础加载方法，不包含迁移功能
   * 如需迁移功能，请使用 EnhancedFavoritesLoader.safeLoad()
   */
  static load(): StorageResult<FavoritesData> {
    if (!this.isSupported()) {
      return {
        success: false,
        error: 'localStorage is not supported',
        data: DEFAULT_FAVORITES
      };
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      
      if (!stored) {
        // 首次使用，返回默认数据
        return {
          success: true,
          data: DEFAULT_FAVORITES
        };
      }

      const parsed = JSON.parse(stored);
      
      // 验证数据格式
      if (!this.validateFavoritesData(parsed)) {
        console.warn('Invalid favorites data format, resetting to default');
        this.clear();
        return {
          success: true,
          data: DEFAULT_FAVORITES
        };
      }

      return {
        success: true,
        data: parsed
      };

    } catch (error) {
      console.error('Failed to load favorites from localStorage:', error);
      
      // 数据损坏，清除并返回默认数据
      this.clear();
      return {
        success: false,
        error: 'Failed to parse favorites data',
        data: DEFAULT_FAVORITES
      };
    }
  }

  /**
   * 保存收藏数据到 localStorage
   */
  static save(favorites: FavoritesData): StorageResult<void> {
    if (!this.isSupported()) {
      return {
        success: false,
        error: 'localStorage is not supported'
      };
    }

    try {
      // 验证数据格式
      if (!this.validateFavoritesData(favorites)) {
        return {
          success: false,
          error: 'Invalid favorites data format'
        };
      }

      // 添加版本信息和时间戳
      const dataToSave = {
        ...favorites,
        lastUpdated: new Date().toISOString(),
        version: DATA_VERSION
      };

      const serialized = JSON.stringify(dataToSave);
      localStorage.setItem(STORAGE_KEY, serialized);

      return {
        success: true
      };

    } catch (error) {
      console.error('Failed to save favorites to localStorage:', error);
      
      // 检查是否是存储空间不足
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        return {
          success: false,
          error: 'Storage quota exceeded. Please clear some browser data.'
        };
      }

      return {
        success: false,
        error: 'Failed to save favorites data'
      };
    }
  }

  /**
   * 清除所有收藏数据
   */
  static clear(): StorageResult<void> {
    if (!this.isSupported()) {
      return {
        success: false,
        error: 'localStorage is not supported'
      };
    }

    try {
      localStorage.removeItem(STORAGE_KEY);
      return {
        success: true
      };
    } catch (error) {
      console.error('Failed to clear favorites from localStorage:', error);
      return {
        success: false,
        error: 'Failed to clear favorites data'
      };
    }
  }

  /**
   * 获取存储数据的大小（字节）
   */
  static getStorageSize(): number {
    if (!this.isSupported()) {
      return 0;
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? new Blob([stored]).size : 0;
    } catch (error) {
      console.error('Failed to get storage size:', error);
      return 0;
    }
  }

  /**
   * 导出收藏数据为 JSON 字符串
   */
  static exportData(): StorageResult<string> {
    const result = this.load();
    
    if (!result.success || !result.data) {
      return {
        success: false,
        error: result.error || 'Failed to load data for export'
      };
    }

    try {
      const exportData = {
        ...result.data,
        exportedAt: new Date().toISOString(),
        version: DATA_VERSION
      };

      return {
        success: true,
        data: JSON.stringify(exportData, null, 2)
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to serialize export data'
      };
    }
  }

  /**
   * 从 JSON 字符串导入收藏数据
   */
  static importData(jsonData: string): StorageResult<void> {
    try {
      const parsed = JSON.parse(jsonData);
      
      // 验证导入的数据格式
      if (!this.validateFavoritesData(parsed)) {
        return {
          success: false,
          error: 'Invalid import data format'
        };
      }

      // 保存导入的数据
      return this.save(parsed);

    } catch (error) {
      return {
        success: false,
        error: 'Failed to parse import data'
      };
    }
  }
}

/**
 * 收藏数据工具函数
 */
export class FavoritesUtils {
  /**
   * 添加物品到收藏列表
   */
  static addItem(favorites: FavoritesData, itemId: string, type: FavoriteItemType): FavoritesData {
    const newFavorites = { ...favorites };
    
    if (!newFavorites[type].includes(itemId)) {
      newFavorites[type] = [...newFavorites[type], itemId];
      newFavorites.lastUpdated = new Date().toISOString();
    }
    
    return newFavorites;
  }

  /**
   * 从收藏列表移除物品
   */
  static removeItem(favorites: FavoritesData, itemId: string, type: FavoriteItemType): FavoritesData {
    const newFavorites = { ...favorites };
    
    newFavorites[type] = newFavorites[type].filter(id => id !== itemId);
    newFavorites.lastUpdated = new Date().toISOString();
    
    return newFavorites;
  }

  /**
   * 检查物品是否已收藏
   */
  static isItemFavorited(favorites: FavoritesData, itemId: string, type: FavoriteItemType): boolean {
    return favorites[type].includes(itemId);
  }

  /**
   * 获取收藏总数
   */
  static getTotalCount(favorites: FavoritesData): number {
    return favorites.crops.length + favorites.pets.length + (favorites.reports?.length || 0);
  }

  /**
   * 获取指定类型的收藏数量
   */
  static getCountByType(favorites: FavoritesData, type: FavoriteItemType): number {
    return favorites[type].length;
  }

  /**
   * 清空指定类型的收藏
   */
  static clearByType(favorites: FavoritesData, type: FavoriteItemType): FavoritesData {
    const newFavorites = { ...favorites };
    newFavorites[type] = [];
    newFavorites.lastUpdated = new Date().toISOString();
    return newFavorites;
  }

  /**
   * 清空所有收藏
   */
  static clearAll(): FavoritesData {
    return {
      crops: [],
      pets: [],
      reports: [],
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * 合并两个收藏数据（用于导入时合并现有数据）
   */
  static merge(existing: FavoritesData, imported: FavoritesData): FavoritesData {
    const mergedCrops = [...new Set([...existing.crops, ...imported.crops])];
    const mergedPets = [...new Set([...existing.pets, ...imported.pets])];
    const mergedReports = [...new Set([...(existing.reports || []), ...(imported.reports || [])])];

    return {
      crops: mergedCrops,
      pets: mergedPets,
      reports: mergedReports,
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * 获取收藏统计信息
   */
  static getStats(favorites: FavoritesData) {
    return {
      totalCount: this.getTotalCount(favorites),
      cropsCount: favorites.crops.length,
      petsCount: favorites.pets.length,
      reportsCount: favorites.reports?.length || 0,
      lastUpdated: favorites.lastUpdated,
      isEmpty: this.getTotalCount(favorites) === 0
    };
  }
}