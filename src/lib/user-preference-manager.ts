// /src/lib/user-preference-manager.ts
// 用户偏好管理系统

import {
  ReportStyleType,
  StyleUsageHistory,
  StylePersonalization,
  UserContext,
  ReportStyleSystem
} from '@/types';

/**
 * 用户偏好管理器 - 处理样式偏好的存储、同步和学习
 */
export class UserPreferenceManager {
  private static instance: UserPreferenceManager;
  private readonly STORAGE_KEY = 'report-style-preferences';
  private readonly HISTORY_KEY = 'report-style-history';
  private readonly SYNC_INTERVAL = 5 * 60 * 1000; // 5分钟同步一次

  private preferences: ReportStyleSystem['userPreferences'] = {
    preferredStyle: 'magazine',
    styleHistory: [],
    personalizations: [],
    lastUpdated: new Date().toISOString()
  };

  private syncTimer: NodeJS.Timeout | null = null;

  private constructor() {
    this.loadPreferences();
    this.startSyncTimer();
  }

  static getInstance(): UserPreferenceManager {
    if (!UserPreferenceManager.instance) {
      UserPreferenceManager.instance = new UserPreferenceManager();
    }
    return UserPreferenceManager.instance;
  }

  /**
   * 获取用户偏好
   */
  getPreferences(): ReportStyleSystem['userPreferences'] {
    return { ...this.preferences };
  }

  /**
   * 设置首选样式
   */
  setPreferredStyle(style: ReportStyleType): void {
    this.preferences.preferredStyle = style;
    this.preferences.lastUpdated = new Date().toISOString();
    this.savePreferences();
  }

  /**
   * 记录样式使用历史
   */
  recordStyleUsage(
    styleName: ReportStyleType,
    duration: number,
    deviceType: string,
    satisfaction?: number
  ): void {
    const usage: StyleUsageHistory = {
      styleName,
      usedAt: new Date().toISOString(),
      duration,
      deviceType,
      satisfaction
    };

    this.preferences.styleHistory.push(usage);

    // 只保留最近100条记录
    if (this.preferences.styleHistory.length > 100) {
      this.preferences.styleHistory = this.preferences.styleHistory.slice(-100);
    }

    this.preferences.lastUpdated = new Date().toISOString();
    this.savePreferences();

    // 基于使用历史更新首选样式
    this.updatePreferredStyleFromHistory();
  }

  /**
   * 保存样式个性化配置
   */
  savePersonalization(personalization: StylePersonalization): void {
    // 查找现有的个性化配置
    const existingIndex = this.preferences.personalizations.findIndex(
      p => p.styleName === personalization.styleName
    );

    if (existingIndex >= 0) {
      // 更新现有配置
      this.preferences.personalizations[existingIndex] = {
        ...personalization,
        lastUsed: new Date().toISOString()
      };
    } else {
      // 添加新配置
      this.preferences.personalizations.push(personalization);
    }

    this.preferences.lastUpdated = new Date().toISOString();
    this.savePreferences();
  }

  /**
   * 获取样式个性化配置
   */
  getPersonalization(styleName: ReportStyleType): StylePersonalization | null {
    return this.preferences.personalizations.find(
      p => p.styleName === styleName
    ) || null;
  }

  /**
   * 获取样式使用统计
   */
  getStyleUsageStats(): Record<ReportStyleType, {
    totalUsage: number;
    averageDuration: number;
    averageSatisfaction: number;
    lastUsed: string | null;
    devicePreference: Record<string, number>;
  }> {
    const stats: any = {
      magazine: { totalUsage: 0, averageDuration: 0, averageSatisfaction: 0, lastUsed: null, devicePreference: {} },
      minimal: { totalUsage: 0, averageDuration: 0, averageSatisfaction: 0, lastUsed: null, devicePreference: {} },
      dashboard: { totalUsage: 0, averageDuration: 0, averageSatisfaction: 0, lastUsed: null, devicePreference: {} }
    };

    this.preferences.styleHistory.forEach(usage => {
      const style = usage.styleName;
      if (stats[style]) {
        stats[style].totalUsage++;
        stats[style].averageDuration += usage.duration;
        
        if (usage.satisfaction) {
          stats[style].averageSatisfaction += usage.satisfaction;
        }

        // 更新最后使用时间
        if (!stats[style].lastUsed || usage.usedAt > stats[style].lastUsed) {
          stats[style].lastUsed = usage.usedAt;
        }

        // 统计设备偏好
        stats[style].devicePreference[usage.deviceType] = 
          (stats[style].devicePreference[usage.deviceType] || 0) + 1;
      }
    });

    // 计算平均值
    Object.keys(stats).forEach(style => {
      const styleStats = stats[style];
      if (styleStats.totalUsage > 0) {
        styleStats.averageDuration = styleStats.averageDuration / styleStats.totalUsage;
        styleStats.averageSatisfaction = styleStats.averageSatisfaction / styleStats.totalUsage;
      }
    });

    return stats;
  }

  /**
   * 基于使用历史推荐样式
   */
  recommendStyleBasedOnHistory(userContext: UserContext): ReportStyleType | null {
    const stats = this.getStyleUsageStats();
    const currentDevice = userContext.deviceType;

    // 找出在当前设备上使用最多且满意度最高的样式
    let bestStyle: ReportStyleType | null = null;
    let bestScore = 0;

    Object.entries(stats).forEach(([style, styleStats]) => {
      const deviceUsage = styleStats.devicePreference[currentDevice] || 0;
      const satisfaction = styleStats.averageSatisfaction || 0;
      const recentUsage = this.getRecentUsageScore(style as ReportStyleType);
      
      // 综合评分：设备使用频率 * 满意度 * 最近使用权重
      const score = deviceUsage * satisfaction * recentUsage;
      
      if (score > bestScore) {
        bestScore = score;
        bestStyle = style as ReportStyleType;
      }
    });

    return bestStyle;
  }

  /**
   * 获取最近使用评分
   */
  private getRecentUsageScore(style: ReportStyleType): number {
    const recentHistory = this.preferences.styleHistory
      .filter(h => h.styleName === style)
      .slice(-10); // 最近10次使用

    if (recentHistory.length === 0) return 0;

    // 基于时间衰减计算权重
    const now = Date.now();
    let totalWeight = 0;
    let weightedScore = 0;

    recentHistory.forEach(usage => {
      const usageTime = new Date(usage.usedAt).getTime();
      const daysSince = (now - usageTime) / (1000 * 60 * 60 * 24);
      const weight = Math.exp(-daysSince / 7); // 7天半衰期
      
      totalWeight += weight;
      weightedScore += weight * (usage.satisfaction || 3); // 默认满意度3
    });

    return totalWeight > 0 ? weightedScore / totalWeight : 0;
  }

  /**
   * 基于使用历史更新首选样式
   */
  private updatePreferredStyleFromHistory(): void {
    const stats = this.getStyleUsageStats();
    
    // 找出总体使用最多且满意度最高的样式
    let bestStyle: ReportStyleType = this.preferences.preferredStyle;
    let bestScore = 0;

    Object.entries(stats).forEach(([style, styleStats]) => {
      if (styleStats.totalUsage > 0) {
        const score = styleStats.totalUsage * styleStats.averageSatisfaction;
        if (score > bestScore) {
          bestScore = score;
          bestStyle = style as ReportStyleType;
        }
      }
    });

    // 只有当新样式明显更好时才更新首选项
    if (bestScore > 0 && bestStyle !== this.preferences.preferredStyle) {
      this.preferences.preferredStyle = bestStyle;
    }
  }

  /**
   * 从本地存储加载偏好
   */
  private loadPreferences(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.preferences = {
          ...this.preferences,
          ...parsed
        };
      }
    } catch (error) {
      console.warn('Failed to load user preferences:', error);
    }
  }

  /**
   * 保存偏好到本地存储
   */
  private savePreferences(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.preferences));
    } catch (error) {
      console.warn('Failed to save user preferences:', error);
    }
  }

  /**
   * 启动同步定时器
   */
  private startSyncTimer(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
    }

    this.syncTimer = setInterval(() => {
      this.syncWithServer();
    }, this.SYNC_INTERVAL);
  }

  /**
   * 与服务器同步偏好（如果有的话）
   */
  private async syncWithServer(): Promise<void> {
    // 这里可以实现与服务器的同步逻辑
    // 目前只是占位符
    try {
      // const response = await fetch('/api/user-preferences', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(this.preferences)
      // });
      // 
      // if (response.ok) {
      //   console.log('Preferences synced with server');
      // }
    } catch (error) {
      console.warn('Failed to sync preferences with server:', error);
    }
  }

  /**
   * 导出偏好数据
   */
  exportPreferences(): string {
    return JSON.stringify(this.preferences, null, 2);
  }

  /**
   * 导入偏好数据
   */
  importPreferences(data: string): boolean {
    try {
      const imported = JSON.parse(data);
      
      // 验证数据结构
      if (this.validatePreferencesData(imported)) {
        this.preferences = {
          ...imported,
          lastUpdated: new Date().toISOString()
        };
        this.savePreferences();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to import preferences:', error);
      return false;
    }
  }

  /**
   * 验证偏好数据结构
   */
  private validatePreferencesData(data: any): boolean {
    try {
      return (
        data &&
        typeof data.preferredStyle === 'string' &&
        Array.isArray(data.styleHistory) &&
        Array.isArray(data.personalizations) &&
        typeof data.lastUpdated === 'string'
      );
    } catch {
      return false;
    }
  }

  /**
   * 重置偏好到默认值
   */
  resetPreferences(): void {
    this.preferences = {
      preferredStyle: 'magazine',
      styleHistory: [],
      personalizations: [],
      lastUpdated: new Date().toISOString()
    };
    this.savePreferences();
  }

  /**
   * 清理过期数据
   */
  cleanupExpiredData(): void {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const cutoffTime = thirtyDaysAgo.toISOString();

    // 清理过期的使用历史
    this.preferences.styleHistory = this.preferences.styleHistory.filter(
      history => history.usedAt > cutoffTime
    );

    // 清理过期的个性化配置
    this.preferences.personalizations = this.preferences.personalizations.filter(
      personalization => personalization.lastUsed > cutoffTime
    );

    this.preferences.lastUpdated = new Date().toISOString();
    this.savePreferences();
  }

  /**
   * 加载用户偏好（SSR 安全）
   */
  private loadPreferences(): void {
    // SSR 安全检查
    if (typeof window === 'undefined') {
      return; // 服务端不加载偏好，使用默认值
    }

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (this.validatePreferencesData(parsed)) {
          this.preferences = parsed;
        }
      }
    } catch (error) {
      console.warn('Failed to load preferences from localStorage:', error);
    }
  }

  /**
   * 保存用户偏好（SSR 安全）
   */
  private savePreferences(): void {
    // SSR 安全检查
    if (typeof window === 'undefined') {
      return; // 服务端不保存偏好
    }

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.preferences));
    } catch (error) {
      console.warn('Failed to save preferences to localStorage:', error);
    }
  }

  /**
   * 启动同步定时器（SSR 安全）
   */
  private startSyncTimer(): void {
    // SSR 安全检查
    if (typeof window === 'undefined') {
      return; // 服务端不启动定时器
    }

    this.syncTimer = setInterval(() => {
      this.syncWithServer();
    }, this.SYNC_INTERVAL);
  }

  /**
   * 销毁实例（用于测试或清理）
   */
  destroy(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
    }
  }
}

/**
 * 用户上下文检测器 - 自动检测用户的使用环境
 */
export class UserContextDetector {
  /**
   * 检测当前用户上下文
   */
  static detectContext(): UserContext {
    return {
      deviceType: this.detectDeviceType(),
      screenSize: this.getScreenSize(),
      timeOfDay: this.getTimeOfDay(),
      preferredComplexity: this.detectPreferredComplexity(),
      accessibilityNeeds: this.detectAccessibilityNeeds()
    };
  }

  /**
   * 检测设备类型
   */
  private static detectDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    // SSR 安全检查
    if (typeof window === 'undefined') {
      return 'desktop'; // 服务端默认为桌面端
    }
    
    const width = window.innerWidth;
    
    if (width < 768) {
      return 'mobile';
    } else if (width < 1024) {
      return 'tablet';
    } else {
      return 'desktop';
    }
  }

  /**
   * 获取屏幕尺寸
   */
  private static getScreenSize(): { width: number; height: number } {
    // SSR 安全检查
    if (typeof window === 'undefined') {
      return { width: 1920, height: 1080 }; // 服务端默认尺寸
    }
    
    return {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }

  /**
   * 获取时间段
   */
  private static getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
    const hour = new Date().getHours();
    
    if (hour >= 6 && hour < 12) {
      return 'morning';
    } else if (hour >= 12 && hour < 18) {
      return 'afternoon';
    } else if (hour >= 18 && hour < 22) {
      return 'evening';
    } else {
      return 'night';
    }
  }

  /**
   * 检测偏好的复杂度
   */
  private static detectPreferredComplexity(): 'minimal' | 'moderate' | 'rich' {
    // 基于设备类型和屏幕尺寸推断
    const deviceType = this.detectDeviceType();
    const screenSize = this.getScreenSize();
    
    if (deviceType === 'mobile' || screenSize.width < 600) {
      return 'minimal';
    } else if (deviceType === 'tablet' || screenSize.width < 1200) {
      return 'moderate';
    } else {
      return 'rich';
    }
  }

  /**
   * 检测可访问性需求
   */
  private static detectAccessibilityNeeds(): UserContext['accessibilityNeeds'] {
    // SSR 安全检查
    if (typeof window === 'undefined') {
      return undefined; // 服务端无法检测可访问性偏好
    }

    const needs: UserContext['accessibilityNeeds'] = {};

    // 检测是否偏好减少动画
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      needs.reducedMotion = true;
    }

    // 检测是否偏好高对比度
    if (window.matchMedia('(prefers-contrast: high)').matches) {
      needs.highContrast = true;
    }

    // 检测是否偏好大字体
    if (window.matchMedia('(prefers-reduced-data: reduce)').matches) {
      needs.largeText = true;
    }

    return Object.keys(needs).length > 0 ? needs : undefined;
  }
}