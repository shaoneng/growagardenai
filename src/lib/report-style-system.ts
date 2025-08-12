// /src/lib/report-style-system.ts
// 报告样式系统核心实现

import { 
  ReportStyleType, 
  StyleConfiguration, 
  StyleAdapter, 
  ReportCoreData,
  ReportStyleSystem,
  StyleRecommendation,
  ContextFactors,
  StyleUsageHistory,
  UserContext,
  PerformanceMetrics
} from '@/types';

/**
 * 样式注册表 - 管理所有可用的报告样式
 */
export class StyleRegistry {
  private static instance: StyleRegistry;
  private adapters: Map<ReportStyleType, StyleAdapter> = new Map();
  private configurations: Map<ReportStyleType, StyleConfiguration> = new Map();
  private performanceMetrics: Map<ReportStyleType, PerformanceMetrics[]> = new Map();

  private constructor() {}

  static getInstance(): StyleRegistry {
    if (!StyleRegistry.instance) {
      StyleRegistry.instance = new StyleRegistry();
    }
    return StyleRegistry.instance;
  }

  /**
   * 注册新的样式适配器
   */
  registerStyle(adapter: StyleAdapter): void {
    const startTime = performance.now();
    
    try {
      // 验证适配器
      if (!this.validateAdapter(adapter)) {
        throw new Error(`Invalid adapter for style: ${adapter.name}`);
      }

      // 注册适配器和配置
      this.adapters.set(adapter.name, adapter);
      this.configurations.set(adapter.name, adapter.getConfiguration());

      // 记录性能指标
      const endTime = performance.now();
      this.recordPerformanceMetric(adapter.name, {
        styleLoadTime: endTime - startTime,
        renderTime: 0,
        interactionDelay: 0,
        memoryUsage: this.getMemoryUsage(),
        timestamp: new Date().toISOString()
      });

      console.log(`✅ Style registered: ${adapter.name} v${adapter.version}`);
    } catch (error) {
      console.error(`❌ Failed to register style ${adapter.name}:`, error);
      throw error;
    }
  }

  /**
   * 获取样式适配器
   */
  getAdapter(styleName: ReportStyleType): StyleAdapter | null {
    return this.adapters.get(styleName) || null;
  }

  /**
   * 获取样式配置
   */
  getConfiguration(styleName: ReportStyleType): StyleConfiguration | null {
    return this.configurations.get(styleName) || null;
  }

  /**
   * 获取所有可用样式
   */
  getAvailableStyles(): ReportStyleType[] {
    return Array.from(this.adapters.keys());
  }

  /**
   * 验证样式适配器
   */
  private validateAdapter(adapter: StyleAdapter): boolean {
    // 检查必需方法
    const requiredMethods = ['adaptData', 'getFavoriteComponent', 'getConfiguration', 'validateData'];
    for (const method of requiredMethods) {
      if (typeof (adapter as any)[method] !== 'function') {
        console.error(`Missing required method: ${method}`);
        return false;
      }
    }

    // 检查配置有效性
    try {
      const config = adapter.getConfiguration();
      if (!config.name || !config.displayName || !config.description) {
        console.error('Invalid configuration: missing required fields');
        return false;
      }
    } catch (error) {
      console.error('Failed to get configuration:', error);
      return false;
    }

    return true;
  }

  /**
   * 记录性能指标
   */
  private recordPerformanceMetric(styleName: ReportStyleType, metric: PerformanceMetrics): void {
    if (!this.performanceMetrics.has(styleName)) {
      this.performanceMetrics.set(styleName, []);
    }
    
    const metrics = this.performanceMetrics.get(styleName)!;
    metrics.push(metric);
    
    // 只保留最近100条记录
    if (metrics.length > 100) {
      metrics.splice(0, metrics.length - 100);
    }
  }

  /**
   * 获取内存使用情况
   */
  private getMemoryUsage(): number {
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize;
    }
    return 0;
  }

  /**
   * 获取样式性能指标
   */
  getPerformanceMetrics(styleName: ReportStyleType): PerformanceMetrics[] {
    return this.performanceMetrics.get(styleName) || [];
  }
}

/**
 * 样式推荐引擎 - 基于上下文推荐最佳样式
 */
export class StyleRecommendationEngine {
  private static instance: StyleRecommendationEngine;
  private registry: StyleRegistry;

  private constructor() {
    this.registry = StyleRegistry.getInstance();
  }

  static getInstance(): StyleRecommendationEngine {
    if (!StyleRecommendationEngine.instance) {
      StyleRecommendationEngine.instance = new StyleRecommendationEngine();
    }
    return StyleRecommendationEngine.instance;
  }

  /**
   * 分析用户上下文并推荐最佳样式
   */
  analyzeUserContext(userContext: UserContext, reportContent: ReportCoreData): StyleRecommendation {
    const factors: ContextFactors = {
      timeOfDay: userContext.timeOfDay,
      deviceType: userContext.deviceType,
      reportComplexity: this.analyzeContentComplexity(reportContent),
      userHistory: [], // 将从用户偏好中获取
      currentMood: this.inferUserMood(userContext)
    };

    return this.calculateOptimalStyle(factors);
  }

  /**
   * 计算最佳样式
   */
  private calculateOptimalStyle(factors: ContextFactors): StyleRecommendation {
    const scores: Record<ReportStyleType, number> = {
      magazine: 0,
      minimal: 0,
      dashboard: 0
    };

    // 基于时间的权重
    switch (factors.timeOfDay) {
      case 'morning':
        scores.minimal += 0.3; // 早晨偏好简洁
        scores.magazine += 0.2;
        break;
      case 'afternoon':
        scores.magazine += 0.3; // 下午适合深度阅读
        scores.dashboard += 0.2;
        break;
      case 'evening':
        scores.dashboard += 0.3; // 晚上适合数据分析
        scores.magazine += 0.2;
        break;
      case 'night':
        scores.minimal += 0.2; // 夜晚偏好简洁
        break;
    }

    // 基于设备类型的权重
    switch (factors.deviceType) {
      case 'mobile':
        scores.minimal += 0.4; // 移动端偏好简洁
        scores.magazine += 0.1;
        break;
      case 'tablet':
        scores.magazine += 0.3; // 平板适合杂志风格
        scores.minimal += 0.2;
        break;
      case 'desktop':
        scores.dashboard += 0.4; // 桌面端适合复杂界面
        scores.magazine += 0.3;
        break;
    }

    // 基于内容复杂度的权重
    switch (factors.reportComplexity) {
      case 'low':
        scores.minimal += 0.4;
        break;
      case 'medium':
        scores.magazine += 0.3;
        scores.minimal += 0.2;
        break;
      case 'high':
        scores.dashboard += 0.4;
        scores.magazine += 0.2;
        break;
    }

    // 基于用户历史的权重
    if (factors.userHistory.length > 0) {
      const recentUsage = factors.userHistory.slice(-5);
      const styleFrequency: Record<string, number> = {};
      
      recentUsage.forEach(usage => {
        styleFrequency[usage.styleName] = (styleFrequency[usage.styleName] || 0) + 1;
      });

      // 给经常使用的样式加分
      Object.entries(styleFrequency).forEach(([style, frequency]) => {
        if (style in scores) {
          scores[style as ReportStyleType] += frequency * 0.1;
        }
      });
    }

    // 找出得分最高的样式
    const sortedStyles = Object.entries(scores)
      .sort(([, a], [, b]) => b - a)
      .map(([style, score]) => ({ style: style as ReportStyleType, score }));

    const recommended = sortedStyles[0];
    const alternatives = sortedStyles.slice(1);

    return {
      recommendedStyle: recommended.style,
      confidence: Math.min(recommended.score, 1.0),
      reasoning: this.generateReasoning(factors, recommended.style),
      alternatives: alternatives.map(alt => ({
        style: alt.style,
        score: alt.score,
        reason: this.generateAlternativeReason(alt.style, factors)
      }))
    };
  }

  /**
   * 分析内容复杂度
   */
  private analyzeContentComplexity(reportContent: ReportCoreData): 'low' | 'medium' | 'high' {
    const content = reportContent.content;
    
    // 计算复杂度指标
    const sectionCount = content.sections.length;
    const totalPoints = content.sections.reduce((sum, section) => sum + section.points.length, 0);
    const hasComplexData = content.sections.some(section => 
      section.points.some(point => point.synergy && point.synergy.length > 0)
    );

    if (sectionCount <= 2 && totalPoints <= 5) {
      return 'low';
    } else if (sectionCount <= 4 && totalPoints <= 10 && !hasComplexData) {
      return 'medium';
    } else {
      return 'high';
    }
  }

  /**
   * 推断用户心情
   */
  private inferUserMood(userContext: UserContext): 'focused' | 'casual' | 'analytical' | 'exploratory' {
    // 基于时间和设备类型推断心情
    if (userContext.timeOfDay === 'morning' && userContext.deviceType === 'mobile') {
      return 'casual';
    } else if (userContext.timeOfDay === 'afternoon' && userContext.deviceType === 'desktop') {
      return 'focused';
    } else if (userContext.timeOfDay === 'evening' && userContext.deviceType === 'desktop') {
      return 'analytical';
    } else {
      return 'exploratory';
    }
  }

  /**
   * 生成推荐理由
   */
  private generateReasoning(factors: ContextFactors, recommendedStyle: ReportStyleType): string {
    const reasons: string[] = [];

    switch (recommendedStyle) {
      case 'magazine':
        if (factors.deviceType === 'tablet') {
          reasons.push('平板设备适合杂志式的深度阅读体验');
        }
        if (factors.timeOfDay === 'afternoon') {
          reasons.push('下午时光适合沉浸式的内容消费');
        }
        if (factors.reportComplexity === 'medium') {
          reasons.push('中等复杂度的内容适合杂志风格的展示');
        }
        break;

      case 'minimal':
        if (factors.deviceType === 'mobile') {
          reasons.push('移动设备上简洁的设计更易阅读');
        }
        if (factors.timeOfDay === 'morning') {
          reasons.push('早晨时光适合快速浏览核心信息');
        }
        if (factors.reportComplexity === 'low') {
          reasons.push('简单内容无需复杂的展示形式');
        }
        break;

      case 'dashboard':
        if (factors.deviceType === 'desktop') {
          reasons.push('桌面环境适合信息密集的专业分析');
        }
        if (factors.timeOfDay === 'evening') {
          reasons.push('晚间适合深度的数据分析工作');
        }
        if (factors.reportComplexity === 'high') {
          reasons.push('复杂内容需要仪表板式的结构化展示');
        }
        break;
    }

    return reasons.join('，') || '基于当前上下文的综合分析';
  }

  /**
   * 生成备选方案理由
   */
  private generateAlternativeReason(style: ReportStyleType, factors: ContextFactors): string {
    switch (style) {
      case 'magazine':
        return '如果你想要更沉浸的阅读体验';
      case 'minimal':
        return '如果你偏好简洁快速的信息获取';
      case 'dashboard':
        return '如果你需要详细的数据分析视图';
      default:
        return '另一种展示选择';
    }
  }
}

/**
 * 样式切换引擎 - 处理样式间的平滑切换
 */
export class StyleSwitchEngine {
  private static instance: StyleSwitchEngine;
  private registry: StyleRegistry;
  private currentStyle: ReportStyleType | null = null;
  private switchHistory: Array<{
    from: ReportStyleType;
    to: ReportStyleType;
    timestamp: string;
    duration: number;
  }> = [];

  private constructor() {
    this.registry = StyleRegistry.getInstance();
  }

  static getInstance(): StyleSwitchEngine {
    if (!StyleSwitchEngine.instance) {
      StyleSwitchEngine.instance = new StyleSwitchEngine();
    }
    return StyleSwitchEngine.instance;
  }

  /**
   * 切换到指定样式
   */
  async switchToStyle(
    targetStyle: ReportStyleType, 
    reportData: ReportCoreData,
    options: {
      animated?: boolean;
      duration?: number;
      onProgress?: (progress: number) => void;
    } = {}
  ): Promise<any> {
    const startTime = performance.now();
    const { animated = true, duration = 300, onProgress } = options;

    try {
      // 获取目标样式适配器
      const adapter = this.registry.getAdapter(targetStyle);
      if (!adapter) {
        throw new Error(`Style adapter not found: ${targetStyle}`);
      }

      // 验证数据兼容性
      if (!adapter.validateData(reportData)) {
        throw new Error(`Data incompatible with style: ${targetStyle}`);
      }

      // 记录切换历史
      if (this.currentStyle) {
        this.switchHistory.push({
          from: this.currentStyle,
          to: targetStyle,
          timestamp: new Date().toISOString(),
          duration: 0 // 将在完成后更新
        });
      }

      // 执行样式切换
      if (animated && onProgress) {
        await this.animatedSwitch(adapter, reportData, duration, onProgress);
      } else {
        await this.instantSwitch(adapter, reportData);
      }

      // 更新当前样式
      this.currentStyle = targetStyle;

      // 更新切换历史中的持续时间
      const endTime = performance.now();
      if (this.switchHistory.length > 0) {
        this.switchHistory[this.switchHistory.length - 1].duration = endTime - startTime;
      }

      // 记录性能指标
      this.registry['recordPerformanceMetric'](targetStyle, {
        styleLoadTime: 0,
        renderTime: endTime - startTime,
        interactionDelay: 0,
        memoryUsage: this.getMemoryUsage(),
        timestamp: new Date().toISOString()
      });

      return adapter.adaptData(reportData);

    } catch (error) {
      console.error(`Failed to switch to style ${targetStyle}:`, error);
      throw error;
    }
  }

  /**
   * 动画切换
   */
  private async animatedSwitch(
    adapter: StyleAdapter,
    reportData: ReportCoreData,
    duration: number,
    onProgress: (progress: number) => void
  ): Promise<void> {
    return new Promise((resolve) => {
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        onProgress(progress);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };
      
      requestAnimationFrame(animate);
    });
  }

  /**
   * 即时切换
   */
  private async instantSwitch(adapter: StyleAdapter, reportData: ReportCoreData): Promise<void> {
    // 即时切换逻辑
    return Promise.resolve();
  }

  /**
   * 获取当前样式
   */
  getCurrentStyle(): ReportStyleType | null {
    return this.currentStyle;
  }

  /**
   * 获取切换历史
   */
  getSwitchHistory(): Array<{
    from: ReportStyleType;
    to: ReportStyleType;
    timestamp: string;
    duration: number;
  }> {
    return [...this.switchHistory];
  }

  /**
   * 获取内存使用情况
   */
  private getMemoryUsage(): number {
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize;
    }
    return 0;
  }
}

/**
 * 报告数据适配器 - 处理数据转换和标准化
 */
export class ReportDataAdapter {
  /**
   * 将原始报告数据转换为核心数据结构
   */
  static adaptToCore(
    rawData: any, 
    userContext: UserContext
  ): ReportCoreData {
    return {
      reportId: rawData.reportId || `report-${Date.now()}`,
      content: rawData,
      metadata: {
        generatedAt: rawData.publicationDate || new Date().toISOString(),
        version: '1.0.0',
        dataSource: 'advisor-engine',
        processingTime: 0
      },
      userContext
    };
  }

  /**
   * 验证核心数据结构
   */
  static validateCoreData(data: ReportCoreData): boolean {
    try {
      // 检查必需字段
      if (!data.reportId || !data.content || !data.metadata || !data.userContext) {
        return false;
      }

      // 检查内容结构
      const content = data.content;
      if (!content.sections || !Array.isArray(content.sections)) {
        return false;
      }

      // 检查每个部分的结构
      for (const section of content.sections) {
        if (!section.id || !section.title || !section.points || !Array.isArray(section.points)) {
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Data validation error:', error);
      return false;
    }
  }

  /**
   * 清理和标准化数据
   */
  static sanitizeData(data: any): any {
    // 移除不安全的内容
    const sanitized = JSON.parse(JSON.stringify(data));
    
    // 确保必需字段存在
    if (!sanitized.reportId) {
      sanitized.reportId = `report-${Date.now()}`;
    }
    
    if (!sanitized.publicationDate) {
      sanitized.publicationDate = new Date().toISOString();
    }

    if (!sanitized.sections) {
      sanitized.sections = [];
    }

    return sanitized;
  }
}