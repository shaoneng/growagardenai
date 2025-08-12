// /src/lib/style-adapters/dashboard-adapter.ts
// 仪表板风格样式适配器

import React from 'react';
import { BaseStyleAdapter } from './base-adapter';
import {
  ReportStyleType,
  StyleConfiguration,
  ReportCoreData,
  EmotionalTone,
  ComplexityLevel
} from '@/types';

/**
 * 仪表板风格适配器 - 信息密集的专业分析
 */
export class DashboardStyleAdapter extends BaseStyleAdapter {
  name: ReportStyleType = 'dashboard';
  version: string = '1.0.0';

  /**
   * 适配数据为仪表板风格展示
   */
  adaptData(coreData: ReportCoreData): any {
    const safeContent = this.handleMissingData(coreData);
    
    return {
      ...safeContent,
      // 仪表板风格特有的数据处理
      layout: {
        type: 'dashboard',
        grid: this.calculateGridLayout(coreData.userContext.deviceType),
        density: 'high',
        panels: this.createDataPanels(safeContent)
      },
      visualElements: {
        charts: this.generateChartData(safeContent),
        metrics: this.extractMetrics(safeContent),
        indicators: this.createStatusIndicators(safeContent),
        dataFlow: true
      },
      analytics: {
        performanceMetrics: this.calculatePerformanceMetrics(safeContent),
        trendAnalysis: this.analyzeTrends(safeContent),
        riskAssessment: this.assessRisks(safeContent)
      },
      readingExperience: {
        estimatedReadTime: this.calculateDashboardReadTime(safeContent),
        complexity: 'high',
        tone: 'analytical'
      }
    };
  }

  /**
   * 获取仪表板风格的收藏组件
   */
  getFavoriteComponent(): React.ComponentType<any> {
    return React.lazy(() => import('@/app/components/ui/DashboardSaveAction'));
  }

  /**
   * 获取仪表板风格配置
   */
  getConfiguration(): StyleConfiguration {
    const baseConfig: StyleConfiguration = {
      name: this.name,
      displayName: 'Dashboard Style',
      description: '信息密集的专业分析界面，适合详细的数据分析',
      emotionalTone: 'intense' as EmotionalTone,
      complexity: 'rich' as ComplexityLevel,
      
      favoriteIntegration: {
        position: 'top-right',
        style: 'button',
        animation: 'scale',
        states: {
          default: {
            background: 'rgba(0,255,0,0.1)',
            color: '#00ff00',
            size: '14px'
          },
          favorited: {
            background: 'rgba(0,255,0,0.3)',
            color: '#00ff00'
          },
          hover: {
            scale: 1.05
          }
        }
      },

      responsiveBreakpoints: {
        mobile: {
          maxWidth: 767,
          layout: 'minimal', // 移动端使用最小布局
          fontSize: 'medium'
        },
        tablet: {
          maxWidth: 1023,
          layout: 'mixed', // 平板使用混合布局
          fontSize: 'medium'
        },
        desktop: {
          minWidth: 1024,
          layout: 'complex', // 桌面使用复杂布局
          fontSize: 'large'
        }
      },

      animations: {
        transitions: {
          duration: 200, // 快速响应
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
        },
        hover: {
          scale: 1.02,
          shadow: 'strong'
        },
        focus: {
          outline: '2px solid #00ff00'
        }
      },

      colorScheme: this.getColorScheme(),
      typography: this.getTypography()
    };

    return baseConfig;
  }

  /**
   * 获取仪表板风格的颜色方案 - 深色主题
   */
  protected getColorScheme() {
    return {
      primary: '#00ff00',      // 荧光绿 - 主要强调
      secondary: '#00cccc',    // 青色 - 次要强调
      accent: '#ffff00',       // 黄色 - 警告/重要
      background: '#0a0a0a',   // 深黑 - 背景
      text: '#ffffff',         // 白色 - 主要文字
      muted: '#888888'         // 灰色 - 次要文字
    };
  }

  /**
   * 获取仪表板风格的字体配置 - 等宽字体为主
   */
  protected getTypography() {
    return {
      headingFont: '"JetBrains Mono", "Courier New", monospace', // 等宽字体营造终端感
      bodyFont: '"Inter", "Helvetica Neue", sans-serif',
      codeFont: '"JetBrains Mono", "Courier New", monospace',
      sizes: {
        h1: '1.75rem',   // 28px - 紧凑的标题
        h2: '1.5rem',    // 24px
        h3: '1.25rem',   // 20px
        body: '0.875rem', // 14px - 小字体适应信息密度
        small: '0.75rem'  // 12px
      }
    };
  }

  /**
   * 计算网格布局
   */
  private calculateGridLayout(deviceType: string): { columns: number; rows: number } {
    switch (deviceType) {
      case 'mobile':
        return { columns: 1, rows: 4 };
      case 'tablet':
        return { columns: 2, rows: 3 };
      case 'desktop':
        return { columns: 3, rows: 2 };
      default:
        return { columns: 2, rows: 2 };
    }
  }

  /**
   * 创建数据面板
   */
  private createDataPanels(content: any): any[] {
    const panels = [];

    // 概览面板
    panels.push({
      id: 'overview',
      title: 'SYSTEM OVERVIEW',
      type: 'summary',
      data: {
        playerType: content.playerProfile?.archetype || 'UNKNOWN',
        totalSections: content.sections.length,
        totalActions: content.sections.reduce((sum: number, s: any) => sum + s.points.length, 0),
        status: 'ACTIVE'
      }
    });

    // 为每个部分创建面板
    content.sections.forEach((section: any, index: number) => {
      panels.push({
        id: `section-${index}`,
        title: section.title.toUpperCase().replace(/[🎯🗺️✨📊]/g, ''),
        type: 'analysis',
        data: {
          points: section.points.map((point: any) => ({
            action: point.action,
            priority: this.calculatePriority(point),
            tags: point.tags || [],
            synergy: point.synergy || []
          }))
        }
      });
    });

    // 性能指标面板
    panels.push({
      id: 'metrics',
      title: 'PERFORMANCE METRICS',
      type: 'metrics',
      data: this.extractMetrics(content)
    });

    return panels;
  }

  /**
   * 生成图表数据
   */
  private generateChartData(content: any): any[] {
    const charts = [];

    // 优先级分布图
    const priorities = { high: 0, medium: 0, low: 0 };
    content.sections.forEach((section: any) => {
      section.points.forEach((point: any) => {
        const priority = this.calculatePriority(point);
        priorities[priority as keyof typeof priorities]++;
      });
    });

    charts.push({
      id: 'priority-distribution',
      type: 'pie',
      title: 'ACTION PRIORITY DISTRIBUTION',
      data: [
        { label: 'HIGH', value: priorities.high, color: '#ff0000' },
        { label: 'MEDIUM', value: priorities.medium, color: '#ffff00' },
        { label: 'LOW', value: priorities.low, color: '#00ff00' }
      ]
    });

    // 部分复杂度图
    const sectionComplexity = content.sections.map((section: any, index: number) => ({
      label: `SEC-${index + 1}`,
      value: section.points.length,
      color: '#00cccc'
    }));

    charts.push({
      id: 'section-complexity',
      type: 'bar',
      title: 'SECTION COMPLEXITY ANALYSIS',
      data: sectionComplexity
    });

    return charts;
  }

  /**
   * 提取关键指标
   */
  private extractMetrics(content: any): any {
    return {
      totalActions: content.sections.reduce((sum: number, s: any) => sum + s.points.length, 0),
      highPriorityActions: this.countHighPriorityActions(content),
      synergyOpportunities: this.countSynergyOpportunities(content),
      riskLevel: this.calculateOverallRisk(content),
      completionEstimate: this.estimateCompletionTime(content),
      confidenceScore: this.calculateConfidenceScore(content)
    };
  }

  /**
   * 创建状态指示器
   */
  private createStatusIndicators(content: any): any[] {
    return [
      {
        id: 'system-status',
        label: 'SYSTEM STATUS',
        value: 'OPERATIONAL',
        status: 'success'
      },
      {
        id: 'data-integrity',
        label: 'DATA INTEGRITY',
        value: '100%',
        status: 'success'
      },
      {
        id: 'analysis-confidence',
        label: 'ANALYSIS CONFIDENCE',
        value: `${this.calculateConfidenceScore(content)}%`,
        status: this.calculateConfidenceScore(content) > 80 ? 'success' : 'warning'
      }
    ];
  }

  /**
   * 计算优先级
   */
  private calculatePriority(point: any): 'high' | 'medium' | 'low' {
    if (point.tags && point.tags.includes('High ROI')) return 'high';
    if (point.tags && point.tags.includes('High-Efficiency')) return 'high';
    if (point.synergy && point.synergy.length > 0) return 'medium';
    return 'low';
  }

  /**
   * 计算性能指标
   */
  private calculatePerformanceMetrics(content: any): any {
    return {
      efficiency: this.calculateEfficiencyScore(content),
      riskLevel: this.calculateOverallRisk(content),
      synergy: this.calculateSynergyScore(content),
      timeToValue: this.estimateTimeToValue(content)
    };
  }

  /**
   * 分析趋势
   */
  private analyzeTrends(content: any): any {
    return {
      growthPotential: 'HIGH',
      riskTrend: 'STABLE',
      efficiencyTrend: 'IMPROVING',
      marketPosition: 'STRONG'
    };
  }

  /**
   * 评估风险
   */
  private assessRisks(content: any): any[] {
    const risks = [];
    
    // 基于内容分析潜在风险
    if (content.sections.length > 5) {
      risks.push({
        type: 'COMPLEXITY',
        level: 'MEDIUM',
        description: 'High number of concurrent actions may impact execution'
      });
    }

    return risks;
  }

  // 辅助计算方法
  private countHighPriorityActions(content: any): number {
    let count = 0;
    content.sections.forEach((section: any) => {
      section.points.forEach((point: any) => {
        if (this.calculatePriority(point) === 'high') count++;
      });
    });
    return count;
  }

  private countSynergyOpportunities(content: any): number {
    let count = 0;
    content.sections.forEach((section: any) => {
      section.points.forEach((point: any) => {
        if (point.synergy && point.synergy.length > 0) count++;
      });
    });
    return count;
  }

  private calculateOverallRisk(content: any): 'LOW' | 'MEDIUM' | 'HIGH' {
    const totalActions = content.sections.reduce((sum: number, s: any) => sum + s.points.length, 0);
    if (totalActions > 10) return 'HIGH';
    if (totalActions > 5) return 'MEDIUM';
    return 'LOW';
  }

  private estimateCompletionTime(content: any): string {
    const totalActions = content.sections.reduce((sum: number, s: any) => sum + s.points.length, 0);
    const hours = totalActions * 0.5; // 假设每个行动需要30分钟
    return `${Math.ceil(hours)}H`;
  }

  private calculateConfidenceScore(content: any): number {
    // 基于数据完整性计算置信度
    let score = 80; // 基础分数
    
    if (content.playerProfile && content.playerProfile.summary) score += 10;
    if (content.sections.length >= 3) score += 5;
    if (content.footerAnalysis && content.footerAnalysis.conclusion) score += 5;
    
    return Math.min(score, 100);
  }

  private calculateEfficiencyScore(content: any): number {
    // 基于行动项的质量计算效率分数
    return 85; // 简化实现
  }

  private calculateSynergyScore(content: any): number {
    const synergyCount = this.countSynergyOpportunities(content);
    const totalActions = content.sections.reduce((sum: number, s: any) => sum + s.points.length, 0);
    return Math.round((synergyCount / totalActions) * 100);
  }

  private estimateTimeToValue(content: any): string {
    return '2-4 WEEKS'; // 简化实现
  }

  /**
   * 计算仪表板风格的阅读时间
   */
  private calculateDashboardReadTime(content: any): string {
    // 仪表板风格注重快速扫描而非深度阅读
    const panels = this.createDataPanels(content);
    const scanTimePerPanel = 30; // 每个面板30秒
    const totalSeconds = panels.length * scanTimePerPanel;
    const minutes = Math.ceil(totalSeconds / 60);
    
    return `${minutes}分钟分析`;
  }

  /**
   * 验证仪表板风格特定的数据要求
   */
  validateData(data: ReportCoreData): boolean {
    // 先进行基础验证
    if (!super.validateData(data)) {
      return false;
    }

    // 仪表板风格需要足够的数据来填充面板
    const content = data.content;
    
    if (content.sections.length < 2) {
      console.warn('Dashboard style requires at least 2 sections for optimal display');
      return false;
    }

    // 检查是否有足够的数据点
    const totalPoints = content.sections.reduce((sum: number, s: any) => sum + s.points.length, 0);
    if (totalPoints < 4) {
      console.warn('Dashboard style requires at least 4 data points for meaningful analysis');
      return false;
    }

    return true;
  }
}

// 导出单例实例
export const dashboardAdapter = new DashboardStyleAdapter();