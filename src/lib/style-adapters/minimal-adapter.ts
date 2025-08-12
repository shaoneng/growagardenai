// /src/lib/style-adapters/minimal-adapter.ts
// 极简风格样式适配器

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
 * 极简风格适配器 - 纯粹专注的设计美学
 */
export class MinimalStyleAdapter extends BaseStyleAdapter {
  name: ReportStyleType = 'minimal';
  version: string = '1.0.0';

  /**
   * 适配数据为极简风格展示
   */
  adaptData(coreData: ReportCoreData): any {
    const safeContent = this.handleMissingData(coreData);
    
    return {
      ...safeContent,
      // 极简风格特有的数据处理
      layout: {
        type: 'minimal',
        density: 'sparse',
        whitespace: 'generous',
        hierarchy: 'clear'
      },
      visualElements: {
        decorations: false,
        dividers: false,
        emphasis: 'typography',
        colorUsage: 'minimal'
      },
      content: {
        // 简化内容结构，只保留核心信息
        essentialSections: this.extractEssentialContent(safeContent),
        keyInsights: this.extractKeyInsights(safeContent),
        actionItems: this.extractActionItems(safeContent)
      },
      readingExperience: {
        estimatedReadTime: this.calculateMinimalReadTime(safeContent),
        complexity: 'low',
        tone: 'direct'
      }
    };
  }

  /**
   * 获取极简风格的收藏组件
   */
  getFavoriteComponent(): React.ComponentType<any> {
    return React.lazy(() => import('@/app/components/ui/MinimalFavorite'));
  }

  /**
   * 获取极简风格配置
   */
  getConfiguration(): StyleConfiguration {
    const baseConfig: StyleConfiguration = {
      name: this.name,
      displayName: 'Minimal Style',
      description: '纯粹专注的设计美学，快速浏览核心信息',
      emotionalTone: 'casual' as EmotionalTone,
      complexity: 'minimal' as ComplexityLevel,
      
      favoriteIntegration: {
        position: 'integrated',
        style: 'ghost',
        animation: 'fade',
        states: {
          default: {
            opacity: 0.3,
            size: '16px',
            color: '#6b7280'
          },
          favorited: {
            opacity: 1.0,
            color: '#000000'
          },
          hover: {
            opacity: 0.8,
            scale: 1.1
          }
        }
      },

      responsiveBreakpoints: {
        mobile: {
          maxWidth: 767,
          layout: 'single-column',
          fontSize: 'large' // 移动端保持可读性
        },
        tablet: {
          maxWidth: 1023,
          layout: 'dual-column', // 平板使用双列
          fontSize: 'medium'
        },
        desktop: {
          minWidth: 1024,
          layout: 'multi-column', // 桌面使用多列
          fontSize: 'large'
        }
      },

      animations: {
        transitions: {
          duration: 150, // 更快的过渡
          easing: 'linear' // 简单的缓动
        },
        hover: {
          // 极简的悬停效果
        },
        focus: {
          outline: '1px solid #000000'
        }
      },

      colorScheme: this.getColorScheme(),
      typography: this.getTypography()
    };

    return baseConfig;
  }

  /**
   * 获取极简风格的颜色方案 - 单色调设计
   */
  protected getColorScheme() {
    return {
      primary: '#000000',      // 纯黑 - 主要文字
      secondary: '#666666',    // 中灰 - 次要文字
      accent: '#000000',       // 纯黑 - 强调色
      background: '#ffffff',   // 纯白 - 背景
      text: '#000000',         // 纯黑 - 正文
      muted: '#999999'         // 浅灰 - 辅助文字
    };
  }

  /**
   * 获取极简风格的字体配置 - 统一字体系统
   */
  protected getTypography() {
    return {
      headingFont: '"Inter", "Helvetica Neue", sans-serif', // 统一使用无衬线字体
      bodyFont: '"Inter", "Helvetica Neue", sans-serif',
      codeFont: '"JetBrains Mono", "Courier New", monospace',
      sizes: {
        h1: '2rem',      // 32px - 适中的标题
        h2: '1.5rem',    // 24px
        h3: '1.25rem',   // 20px
        body: '1rem',    // 16px - 标准正文
        small: '0.875rem' // 14px
      }
    };
  }

  /**
   * 提取核心内容 - 只保留最重要的信息
   */
  private extractEssentialContent(content: any): any[] {
    const essential: any[] = [];
    
    // 只保留前2个最重要的部分
    const importantSections = content.sections.slice(0, 2);
    
    importantSections.forEach((section: any) => {
      // 每个部分只保留前3个要点
      const essentialPoints = section.points.slice(0, 3).map((point: any) => ({
        action: point.action,
        reasoning: this.simplifyReasoning(point.reasoning),
        priority: this.calculatePointPriority(point)
      }));

      essential.push({
        title: this.simplifyTitle(section.title),
        points: essentialPoints
      });
    });

    return essential;
  }

  /**
   * 提取关键洞察
   */
  private extractKeyInsights(content: any): string[] {
    const insights = [];
    
    // 从玩家档案提取核心洞察
    if (content.playerProfile && content.playerProfile.archetype) {
      insights.push(content.playerProfile.archetype);
    }

    // 从中间引用提取洞察
    if (content.midBreakerQuote) {
      insights.push(content.midBreakerQuote.replace(/"/g, ''));
    }

    // 从结论提取洞察
    if (content.footerAnalysis && content.footerAnalysis.callToAction) {
      insights.push(content.footerAnalysis.callToAction);
    }

    return insights.slice(0, 3); // 最多3个洞察
  }

  /**
   * 提取行动项目
   */
  private extractActionItems(content: any): string[] {
    const actions: string[] = [];
    
    content.sections.forEach((section: any) => {
      section.points.forEach((point: any) => {
        if (point.action && point.action.length < 50) { // 只要简短的行动项
          actions.push(point.action);
        }
      });
    });

    return actions.slice(0, 5); // 最多5个行动项
  }

  /**
   * 简化标题
   */
  private simplifyTitle(title: string): string {
    // 移除表情符号和装饰性文字
    return title.replace(/[🎯🗺️✨📊]/g, '').trim();
  }

  /**
   * 简化推理文本
   */
  private simplifyReasoning(reasoning: string): string {
    // 保留第一句话，移除复杂的解释
    const firstSentence = reasoning.split('.')[0];
    return firstSentence.length > 100 ? 
      firstSentence.substring(0, 100) + '...' : 
      firstSentence + '.';
  }

  /**
   * 计算要点优先级
   */
  private calculatePointPriority(point: any): 'high' | 'medium' | 'low' {
    // 基于标签和内容长度判断优先级
    if (point.tags && point.tags.includes('High ROI')) {
      return 'high';
    }
    if (point.action && point.action.length < 30) {
      return 'high'; // 简短的行动项通常更重要
    }
    return 'medium';
  }

  /**
   * 计算极简风格的阅读时间
   */
  private calculateMinimalReadTime(content: any): string {
    // 极简风格的内容更少，阅读时间更短
    const essentialContent = this.extractEssentialContent(content);
    const keyInsights = this.extractKeyInsights(content);
    
    let wordCount = 0;
    
    // 计算核心内容字数
    essentialContent.forEach((section: any) => {
      wordCount += section.title.split(' ').length;
      section.points.forEach((point: any) => {
        wordCount += point.action.split(' ').length;
        wordCount += point.reasoning.split(' ').length;
      });
    });
    
    // 计算洞察字数
    keyInsights.forEach((insight: string) => {
      wordCount += insight.split(' ').length;
    });
    
    // 按每分钟250词计算（比杂志风格快）
    const readTimeMinutes = Math.ceil(wordCount / 250);
    
    if (readTimeMinutes <= 1) {
      return '快速浏览';
    } else if (readTimeMinutes <= 3) {
      return `${readTimeMinutes}分钟速读`;
    } else {
      return `${readTimeMinutes}分钟阅读`;
    }
  }

  /**
   * 验证极简风格特定的数据要求
   */
  validateData(data: ReportCoreData): boolean {
    // 先进行基础验证
    if (!super.validateData(data)) {
      return false;
    }

    // 极简风格对数据要求较低，基本验证通过即可
    const content = data.content;
    
    // 至少需要一个部分
    if (content.sections.length < 1) {
      console.warn('Minimal style requires at least 1 section');
      return false;
    }

    return true;
  }
}

// 导出单例实例
export const minimalAdapter = new MinimalStyleAdapter();