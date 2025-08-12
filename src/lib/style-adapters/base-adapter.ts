// /src/lib/style-adapters/base-adapter.ts
// 样式适配器基类

import React from 'react';
import {
  StyleAdapter,
  ReportStyleType,
  StyleConfiguration,
  ReportCoreData,
  FavoriteIntegrationConfig,
  ResponsiveConfig,
  AnimationConfig
} from '@/types';

/**
 * 样式适配器基类 - 提供通用功能和默认实现
 */
export abstract class BaseStyleAdapter implements StyleAdapter {
  abstract name: ReportStyleType;
  abstract version: string;

  /**
   * 将核心数据适配为特定样式的展示数据
   */
  abstract adaptData(coreData: ReportCoreData): any;

  /**
   * 获取样式特定的收藏组件
   */
  abstract getFavoriteComponent(): React.ComponentType<any>;

  /**
   * 获取样式配置
   */
  abstract getConfiguration(): StyleConfiguration;

  /**
   * 验证数据兼容性
   */
  validateData(data: ReportCoreData): boolean {
    try {
      // 基础验证
      if (!data || !data.reportId || !data.content) {
        return false;
      }

      // 验证内容结构
      const content = data.content;
      if (!content.sections || !Array.isArray(content.sections)) {
        return false;
      }

      // 验证每个部分
      for (const section of content.sections) {
        if (!section.id || !section.title || !section.points) {
          return false;
        }

        if (!Array.isArray(section.points)) {
          return false;
        }

        // 验证每个要点
        for (const point of section.points) {
          if (!point.action || !point.reasoning) {
            return false;
          }
        }
      }

      return true;
    } catch (error) {
      console.error('Data validation error:', error);
      return false;
    }
  }

  /**
   * 获取默认的响应式配置
   */
  protected getDefaultResponsiveConfig(): ResponsiveConfig {
    return {
      mobile: {
        maxWidth: 767,
        layout: 'single-column',
        fontSize: 'medium'
      },
      tablet: {
        maxWidth: 1023,
        layout: 'dual-column',
        fontSize: 'medium'
      },
      desktop: {
        minWidth: 1024,
        layout: 'multi-column',
        fontSize: 'large'
      }
    };
  }

  /**
   * 获取默认的动画配置
   */
  protected getDefaultAnimationConfig(): AnimationConfig {
    return {
      transitions: {
        duration: 300,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
      },
      hover: {
        scale: 1.02,
        shadow: 'soft'
      },
      focus: {
        outline: '2px solid #3b82f6'
      }
    };
  }

  /**
   * 获取默认的收藏集成配置
   */
  protected getDefaultFavoriteConfig(): FavoriteIntegrationConfig {
    return {
      position: 'top-right',
      style: 'button',
      animation: 'scale',
      states: {
        default: {
          color: '#6b7280',
          opacity: 0.8
        },
        favorited: {
          color: '#3b82f6',
          opacity: 1.0
        },
        hover: {
          scale: 1.1,
          opacity: 1.0
        }
      }
    };
  }

  /**
   * 处理数据缺失的情况
   */
  protected handleMissingData(coreData: ReportCoreData): any {
    const content = coreData.content;
    
    // 确保基本字段存在
    const safeContent = {
      reportId: content.reportId || `report-${Date.now()}`,
      publicationDate: content.publicationDate || new Date().toISOString(),
      mainTitle: content.mainTitle || 'Strategic Analysis',
      subTitle: content.subTitle || 'GROW A GARDEN INTELLIGENCE REPORT',
      visualAnchor: content.visualAnchor || 'A',
      playerProfile: content.playerProfile || {
        title: 'Player Profile',
        archetype: 'Strategic Player',
        summary: 'Analyzing your current position and opportunities.'
      },
      midBreakerQuote: content.midBreakerQuote || 'Strategic thinking leads to strategic success.',
      sections: content.sections || [],
      footerAnalysis: content.footerAnalysis || {
        title: 'Summary',
        conclusion: 'Continue developing your strategy for optimal results.',
        callToAction: 'Take action on the recommendations above.'
      }
    };

    return safeContent;
  }

  /**
   * 生成样式特定的CSS类名
   */
  protected generateClassName(baseClass: string, modifier?: string): string {
    const prefix = `report-${this.name}`;
    let className = `${prefix}-${baseClass}`;
    
    if (modifier) {
      className += ` ${prefix}-${baseClass}--${modifier}`;
    }
    
    return className;
  }

  /**
   * 获取样式特定的颜色方案
   */
  protected abstract getColorScheme(): {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    muted: string;
  };

  /**
   * 获取样式特定的字体配置
   */
  protected abstract getTypography(): {
    headingFont: string;
    bodyFont: string;
    codeFont?: string;
    sizes: {
      h1: string;
      h2: string;
      h3: string;
      body: string;
      small: string;
    };
  };

  /**
   * 处理用户个性化设置
   */
  protected applyPersonalization(config: StyleConfiguration, personalizations?: any): StyleConfiguration {
    if (!personalizations) {
      return config;
    }

    // 应用字体大小调整
    if (personalizations.fontSize) {
      const fontSizeMultiplier = personalizations.fontSize;
      config.typography.sizes = {
        h1: this.adjustFontSize(config.typography.sizes.h1, fontSizeMultiplier),
        h2: this.adjustFontSize(config.typography.sizes.h2, fontSizeMultiplier),
        h3: this.adjustFontSize(config.typography.sizes.h3, fontSizeMultiplier),
        body: this.adjustFontSize(config.typography.sizes.body, fontSizeMultiplier),
        small: this.adjustFontSize(config.typography.sizes.small, fontSizeMultiplier)
      };
    }

    // 应用颜色调整
    if (personalizations.colorAdjustments) {
      config.colorScheme = {
        ...config.colorScheme,
        ...personalizations.colorAdjustments
      };
    }

    return config;
  }

  /**
   * 调整字体大小
   */
  private adjustFontSize(originalSize: string, multiplier: number): string {
    const match = originalSize.match(/^(\d+(?:\.\d+)?)(.*)$/);
    if (match) {
      const [, size, unit] = match;
      const newSize = parseFloat(size) * multiplier;
      return `${newSize}${unit}`;
    }
    return originalSize;
  }

  /**
   * 获取可访问性增强配置
   */
  protected getAccessibilityEnhancements(userContext: ReportCoreData['userContext']): Partial<StyleConfiguration> {
    const enhancements: Partial<StyleConfiguration> = {};

    if (userContext.accessibilityNeeds?.highContrast) {
      enhancements.colorScheme = this.getHighContrastColors();
    }

    if (userContext.accessibilityNeeds?.largeText) {
      enhancements.typography = this.getLargeTextTypography();
    }

    if (userContext.accessibilityNeeds?.reducedMotion) {
      enhancements.animations = this.getReducedMotionAnimations();
    }

    return enhancements;
  }

  /**
   * 获取高对比度颜色方案
   */
  private getHighContrastColors() {
    return {
      primary: '#000000',
      secondary: '#333333',
      accent: '#0066cc',
      background: '#ffffff',
      text: '#000000',
      muted: '#666666'
    };
  }

  /**
   * 获取大字体排版配置
   */
  private getLargeTextTypography() {
    const baseTypography = this.getTypography();
    return {
      ...baseTypography,
      sizes: {
        h1: this.adjustFontSize(baseTypography.sizes.h1, 1.25),
        h2: this.adjustFontSize(baseTypography.sizes.h2, 1.25),
        h3: this.adjustFontSize(baseTypography.sizes.h3, 1.25),
        body: this.adjustFontSize(baseTypography.sizes.body, 1.25),
        small: this.adjustFontSize(baseTypography.sizes.small, 1.25)
      }
    };
  }

  /**
   * 获取减少动画的配置
   */
  private getReducedMotionAnimations(): AnimationConfig {
    return {
      transitions: {
        duration: 0,
        easing: 'linear'
      },
      hover: {},
      focus: {
        outline: '3px solid #3b82f6'
      }
    };
  }
}