'use client';
// /src/app/components/ui/StyleSwitcher.tsx
// 样式切换器组件

import React, { useState, useEffect } from 'react';
import { ReportStyleType } from '@/types';
import { StyleRegistry } from '@/lib/report-style-system';
import { UserPreferenceManager } from '@/lib/user-preference-manager';

interface StyleSwitcherProps {
  currentStyle: ReportStyleType;
  onStyleChange: (style: ReportStyleType) => void;
  className?: string;
}

export default function StyleSwitcher({
  currentStyle,
  onStyleChange,
  className = ''
}: StyleSwitcherProps) {
  const [availableStyles, setAvailableStyles] = useState<ReportStyleType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 获取可用样式
    const registry = StyleRegistry.getInstance();
    const styles = registry.getAvailableStyles();
    setAvailableStyles(styles);
  }, []);

  const handleStyleChange = async (newStyle: ReportStyleType) => {
    if (newStyle === currentStyle || isLoading) return;
    
    setIsLoading(true);
    
    try {
      // 记录样式使用
      const preferenceManager = UserPreferenceManager.getInstance();
      preferenceManager.setPreferredStyle(newStyle);
      
      // 触发样式变更
      onStyleChange(newStyle);
    } catch (error) {
      console.error('Failed to change style:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStyleDisplayName = (style: ReportStyleType): string => {
    const registry = StyleRegistry.getInstance();
    const config = registry.getConfiguration(style);
    return config?.displayName || style;
  };

  const getStyleDescription = (style: ReportStyleType): string => {
    const registry = StyleRegistry.getInstance();
    const config = registry.getConfiguration(style);
    return config?.description || '';
  };

  return (
    <div className={`style-switcher ${className}`}>
      <div className="flex gap-2">
        {availableStyles.map((style) => (
          <button
            key={style}
            type="button"
            className={`
              px-4 py-2 rounded-lg border-2 transition-all duration-200
              ${currentStyle === style
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }
              ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            onClick={() => handleStyleChange(style)}
            disabled={isLoading}
            title={getStyleDescription(style)}
          >
            {getStyleDisplayName(style)}
          </button>
        ))}
      </div>
      
      {isLoading && (
        <div className="mt-2 text-sm text-gray-500">
          正在切换样式...
        </div>
      )}
    </div>
  );
}