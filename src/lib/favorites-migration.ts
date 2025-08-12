// /src/lib/favorites-migration.ts
// 收藏系统的数据迁移和版本控制

import { FavoritesData, StorageResult } from '@/types';
import { FavoritesValidator } from './favorites-validation';

/**
 * 数据版本定义
 */
export const DATA_VERSIONS = {
  '1.0.0': '1.0.0', // 初始版本
  CURRENT: '1.0.0'
} as const;

/**
 * 版本化的收藏数据结构
 */
export interface VersionedFavoritesData {
  crops: string[];
  pets: string[];
  reports: string[];
  lastUpdated: string;
  version: string;
  migratedFrom?: string;
  migrationDate?: string;
}

/**
 * 迁移函数类型
 */
type MigrationFunction = (data: any) => VersionedFavoritesData;

/**
 * 数据迁移管理器
 */
export class FavoritesMigrationManager {
  /**
   * 迁移映射表
   */
  private static migrations: Record<string, MigrationFunction> = {
    // 从未版本化数据迁移到 1.0.0
    'unversioned': (data: any): VersionedFavoritesData => {
      const sanitized = FavoritesValidator.sanitizeFavoritesData(data);
      return {
        ...sanitized,
        reports: sanitized.reports || [], // 确保 reports 字段存在
        lastUpdated: data.lastUpdated || new Date().toISOString(),
        version: DATA_VERSIONS['1.0.0'],
        migratedFrom: 'unversioned',
        migrationDate: new Date().toISOString()
      };
    }
  };

  /**
   * 检测数据版本
   */
  static detectVersion(data: any): string {
    if (!data || typeof data !== 'object') {
      return 'invalid';
    }

    if (data.version && typeof data.version === 'string') {
      return data.version;
    }

    // 检查是否是有效的未版本化数据
    if (data.crops || data.pets || data.lastUpdated) {
      return 'unversioned';
    }

    return 'invalid';
  }

  /**
   * 检查是否需要迁移
   */
  static needsMigration(data: any): boolean {
    const version = this.detectVersion(data);
    return version !== DATA_VERSIONS.CURRENT && version !== 'invalid';
  }

  /**
   * 执行数据迁移
   */
  static migrate(data: any): StorageResult<VersionedFavoritesData> {
    try {
      const version = this.detectVersion(data);

      if (version === 'invalid') {
        return {
          success: false,
          error: 'Invalid data format, cannot migrate'
        };
      }

      if (version === DATA_VERSIONS.CURRENT) {
        // 已经是最新版本
        return {
          success: true,
          data: data as VersionedFavoritesData
        };
      }

      // 执行迁移
      const migrationFunction = this.migrations[version];
      if (!migrationFunction) {
        return {
          success: false,
          error: `No migration available for version ${version}`
        };
      }

      const migratedData = migrationFunction(data);

      // 验证迁移后的数据
      if (!this.validateMigratedData(migratedData)) {
        return {
          success: false,
          error: 'Migration produced invalid data'
        };
      }

      return {
        success: true,
        data: migratedData
      };

    } catch (error) {
      return {
        success: false,
        error: `Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * 验证迁移后的数据
   */
  private static validateMigratedData(data: VersionedFavoritesData): boolean {
    try {
      // 基本结构验证
      if (!data || typeof data !== 'object') {
        return false;
      }

      // 检查必需字段
      if (!Array.isArray(data.crops) || !Array.isArray(data.pets)) {
        return false;
      }

      // 检查 reports 字段（可能不存在于旧数据中）
      if (data.reports !== undefined && !Array.isArray(data.reports)) {
        return false;
      }

      if (typeof data.lastUpdated !== 'string' || typeof data.version !== 'string') {
        return false;
      }

      // 验证数组内容
      const isValidStringArray = (arr: string[]): boolean => {
        return arr.every(item => typeof item === 'string' && item.length > 0);
      };

      if (!isValidStringArray(data.crops) || !isValidStringArray(data.pets)) {
        return false;
      }

      if (data.reports && !isValidStringArray(data.reports)) {
        return false;
      }

      // 验证日期格式
      if (isNaN(Date.parse(data.lastUpdated))) {
        return false;
      }

      // 验证版本格式
      if (!Object.values(DATA_VERSIONS).includes(data.version as any)) {
        return false;
      }

      return true;

    } catch (error) {
      console.error('Data validation error:', error);
      return false;
    }
  }

  /**
   * 创建备份数据
   */
  static createBackup(data: any): StorageResult<string> {
    try {
      const backup = {
        originalData: data,
        backupDate: new Date().toISOString(),
        version: this.detectVersion(data),
        backupVersion: '1.0.0'
      };

      return {
        success: true,
        data: JSON.stringify(backup, null, 2)
      };

    } catch (error) {
      return {
        success: false,
        error: `Failed to create backup: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * 从备份恢复数据
   */
  static restoreFromBackup(backupData: string): StorageResult<any> {
    try {
      const backup = JSON.parse(backupData);

      if (!backup.originalData) {
        return {
          success: false,
          error: 'Invalid backup format'
        };
      }

      return {
        success: true,
        data: backup.originalData
      };

    } catch (error) {
      return {
        success: false,
        error: `Failed to restore from backup: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * 获取迁移历史
   */
  static getMigrationHistory(data: VersionedFavoritesData): {
    currentVersion: string;
    migratedFrom?: string;
    migrationDate?: string;
    isOriginal: boolean;
  } {
    return {
      currentVersion: data.version,
      migratedFrom: data.migratedFrom,
      migrationDate: data.migrationDate,
      isOriginal: !data.migratedFrom
    };
  }
}

/**
 * 增强的收藏数据加载器
 */
export class EnhancedFavoritesLoader {
  /**
   * 安全加载收藏数据（包含迁移）
   */
  static safeLoad(): StorageResult<FavoritesData> {
    try {
      // 尝试从 localStorage 读取
      const stored = localStorage.getItem('growagarden_favorites');
      
      if (!stored) {
        // 首次使用，返回默认数据
        return {
          success: true,
          data: {
            crops: [],
            pets: [],
            reports: [],
            lastUpdated: new Date().toISOString()
          }
        };
      }

      // 解析数据
      const parsed = JSON.parse(stored);

      // 检查是否需要迁移
      if (FavoritesMigrationManager.needsMigration(parsed)) {
        console.log('Migrating favorites data to latest version...');

        // 创建备份
        const backupResult = FavoritesMigrationManager.createBackup(parsed);
        if (backupResult.success && backupResult.data) {
          // 保存备份到 localStorage（可选）
          try {
            localStorage.setItem('growagarden_favorites_backup', backupResult.data);
          } catch (error) {
            console.warn('Failed to save backup:', error);
          }
        }

        // 执行迁移
        const migrationResult = FavoritesMigrationManager.migrate(parsed);
        if (!migrationResult.success || !migrationResult.data) {
          return {
            success: false,
            error: migrationResult.error || 'Migration failed',
            data: {
              crops: [],
              pets: [],
              reports: [],
              lastUpdated: new Date().toISOString()
            }
          };
        }

        // 保存迁移后的数据
        try {
          localStorage.setItem('growagarden_favorites', JSON.stringify(migrationResult.data));
        } catch (error) {
          console.warn('Failed to save migrated data:', error);
        }

        return {
          success: true,
          data: migrationResult.data
        };
      }

      // 数据已经是最新版本，直接返回
      return {
        success: true,
        data: parsed
      };

    } catch (error) {
      console.error('Failed to load favorites data:', error);
      
      // 加载失败，返回默认数据
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        data: {
          crops: [],
          pets: [],
          reports: [],
          lastUpdated: new Date().toISOString()
        }
      };
    }
  }

  /**
   * 批量保存（带重试机制）
   */
  static batchSave(data: FavoritesData, retries: number = 3): StorageResult<void> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const versionedData: VersionedFavoritesData = {
          ...data,
          version: DATA_VERSIONS.CURRENT,
          lastUpdated: new Date().toISOString()
        };

        localStorage.setItem('growagarden_favorites', JSON.stringify(versionedData));
        
        return {
          success: true
        };

      } catch (error) {
        console.warn(`Save attempt ${attempt} failed:`, error);
        
        if (attempt === retries) {
          return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          };
        }

        // 等待一段时间后重试
        if (attempt < retries) {
          // 在浏览器环境中使用 setTimeout，但这里我们简化处理
          continue;
        }
      }
    }

    return {
      success: false,
      error: 'All save attempts failed'
    };
  }
}