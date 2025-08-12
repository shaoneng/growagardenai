// /src/lib/style-adapters/magazine-adapter.ts
// 杂志风格样式适配器

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
 * 杂志风格适配器 - 权威专业的阅读体验
 */
export class MagazineStyleAdapter extends BaseStyleAdapter {
  name: ReportStyleType = 'magazine';
  version: string = '1.0.0';

  /**
   * 适配数据为杂志风格展示
   */
  adaptData(coreData: ReportCoreData): any {
    const safeContent = this.handleMissingData(coreData);
    
    return {
      ...safeContent,
      // 杂志风格特有的数据处理
      layout: {
        type: 'magazine',
        columns: this.getColumnLayout(coreData.userContext.deviceType),
        spacing: 'generous',
        typography: 'serif-sans-mix'
      },
      visualElements: {
        largeVisualAnchor: true,
        decorativeElements: true,
        sectionDividers: true,
        pullQuotes: this.extractPullQuotes(safeContent)
      },
      readingExperience: {
        estimatedReadTime: this.calculateReadTime(safeContent),
        complexity: 'moderate',
        tone: 'authoritative'
      }
    };
  }

  /**
   * 获取杂志风格的收藏组件
   */
  getFavoriteComponent(): React.ComponentType<any> {
    // 这里返回杂志风格的书签组件
    return React.lazy(() => import('@/app/components/ui/MagazineBookmark'));
  }

  /**
   * 获取杂志风格配置
   */
  getConfiguration(): StyleConfiguration {
    const baseConfig: StyleConfiguration = {
      name: this.name,
      displayName: 'Magazine Style',
      description: '权威专业的深度阅读体验，适合沉浸式内容消费',
      emotionalTone: 'professional' as EmotionalTone,
      complexity: 'moderate' as ComplexityLevel,
      
      favoriteIntegration: {
        position: 'top-right',
        style: 'bookmark',
        animation: 'fold',
        states: {
          default: {
            color: '#8B7355',
            opacity: 0.7,
            background: 'transparent'
          },
          favorited: {
            color: '#D4AF37',
            opacity: 1.0,
            background: 'rgba(212, 175, 55, 0.1)'
          },
          hover: {
            transform: 'translateY(-2px)',
            shadow: '0 4px 12px rgba(0,0,0,0.15)',
            scale: 1.05
          }
        }
      },

      responsiveBreakpoints: {
        mobile: {
          maxWidth: 767,
          layout: 'single-column',
          fontSize: 'large' // 移动端使用大字体便于阅读
        },
        tablet: {
          maxWidth: 1023,
          layout: 'dual-column',
          fontSize: 'medium'
        },
        desktop: {
          minWidth: 1024,
          layout: 'multi-column',
          fontSize: 'medium'
        }
      },

      animations: {
        transitions: {
          duration: 400,
          easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' // 优雅的缓动
        },
        hover: {
          scale: 1.02,
          shadow: 'soft'
        },
        focus: {
          outline: '2px solid #8B7355',
          background: 'rgba(139, 115, 85, 0.05)'
        }
      },

      colorScheme: this.getColorScheme(),
      typography: this.getTypography()
    };

    return baseConfig;
  }

  /**
   * 获取杂志风格的颜色方案
   */
  protected getColorScheme() {
    return {
      primary: '#2C1810',      // 深棕色 - 主要文字
      secondary: '#8B7355',    // 中性棕色 - 次要元素
      accent: '#D4AF37',       // 金色 - 强调色
      background: '#F8F7F2',   // 米白色 - 背景
      text: '#2C1810',         // 深棕色 - 正文
      muted: '#A0956B'         // 柔和棕色 - 辅助文字
    };
  }

  /**
   * 获取杂志风格的字体配置
   */
  protected getTypography() {
    return {
      headingFont: '"Playfair Display", "Times New Roman", serif', // 衬线字体用于标题
      bodyFont: '"Inter", "Helvetica Neue", sans-serif',           // 无衬线字体用于正文
      codeFont: '"JetBrains Mono", "Courier New", monospace',
      sizes: {
        h1: '2.5rem',    // 40px
        h2: '2rem',      // 32px
        h3: '1.5rem',    // 24px
        body: '1.125rem', // 18px - 较大的正文字体便于阅读
        small: '0.875rem' // 14px
      }
    };
  }

  /**
   * 根据设备类型获取列布局
   */
  private getColumnLayout(deviceType: string): number {
    switch (deviceType) {
      case 'mobile':
        return 1;
      case 'tablet':
        return 2;
      case 'desktop':
        return 3;
      default:
        return 2;
    }
  }

  /**
   * 提取引用文本用于杂志风格的拉引
   */
  private extractPullQuotes(content: any): string[] {
    const quotes: string[] = [];
    
    // 添加中间引用
    if (content.midBreakerQuote) {
      quotes.push(content.midBreakerQuote);
    }

    // 从各个部分提取重要观点
    content.sections.forEach((section: any) => {
      section.points.forEach((point: any) => {
        // 寻找包含引号或重要观点的内容
        if (point.reasoning && point.reasoning.includes('"')) {
          const match = point.reasoning.match(/"([^"]+)"/);
          if (match && match[1].length > 20 && match[1].length < 100) {
            quotes.push(match[1]);
          }
        }
      });
    });

    return quotes.slice(0, 3); // 最多3个拉引
  }

  /**
   * 计算预估阅读时间
   */
  private calculateReadTime(content: any): string {
    let wordCount = 0;
    
    // 计算标题字数
    wordCount += (content.mainTitle || '').split(' ').length;
    wordCount += (content.subTitle || '').split(' ').length;
    
    // 计算玩家档案字数
    if (content.playerProfile) {
      wordCount += (content.playerProfile.summary || '').split(' ').length;
    }
    
    // 计算各部分字数
    content.sections.forEach((section: any) => {
      wordCount += (section.title || '').split(' ').length;
      section.points.forEach((point: any) => {
        wordCount += (point.action || '').split(' ').length;
        wordCount += (point.reasoning || '').split(' ').length;
      });
    });
    
    // 计算结论字数
    if (content.footerAnalysis) {
      wordCount += (content.footerAnalysis.conclusion || '').split(' ').length;
      wordCount += (content.footerAnalysis.callToAction || '').split(' ').length;
    }
    
    // 按每分钟200词计算阅读时间
    const readTimeMinutes = Math.ceil(wordCount / 200);
    
    if (readTimeMinutes <= 1) {
      return '1分钟阅读';
    } else if (readTimeMinutes <= 5) {
      return `${readTimeMinutes}分钟阅读`;
    } else {
      return `${readTimeMinutes}分钟深度阅读`;
    }
  }

  /**
   * 验证杂志风格特定的数据要求
   */
  validateData(data: ReportCoreData): boolean {
    // 先进行基础验证
    if (!super.validateData(data)) {
      return false;
    }

    // 杂志风格特定验证
    const content = data.content;
    
    // 确保有足够的内容支持杂志风格的展示
    if (content.sections.length < 2) {
      console.warn('Magazine style requires at least 2 sections for optimal display');
      return false;
    }

    // 确保有玩家档案信息
    if (!content.playerProfile || !content.playerProfile.summary) {
      console.warn('Magazine style requires player profile for rich display');
      return false;
    }

    return true;
  }
}

// 导出单例实例
export const magazineAdapter = new MagazineStyleAdapter();