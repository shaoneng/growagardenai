'use client';

// /src/app/components/ui/ReportFavoriteButton.tsx
// 策略报告收藏按钮组件

import React from 'react';
import { Heart, FileText } from 'lucide-react';
import { useFavoriteStatus } from '@/contexts/FavoritesContext';
import { useFavoriteToast } from './Toast';

interface ReportFavoriteButtonProps {
  reportId: string;
  reportTitle: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function ReportFavoriteButton({
  reportId,
  reportTitle,
  size = 'md',
  showLabel = false,
  className = ''
}: ReportFavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavoriteStatus(reportId, 'reports');
  const { showAddedToFavorites, showRemovedFromFavorites } = useFavoriteToast();

  const handleClick = () => {
    const wasNotFavorite = !isFavorite;
    toggleFavorite();
    
    // 显示 Toast 通知
    if (wasNotFavorite) {
      showAddedToFavorites(reportTitle, 'reports');
    } else {
      showRemovedFromFavorites(reportTitle, 'reports');
    }
  };

  // 尺寸样式映射
  const sizeStyles = {
    sm: {
      button: 'p-1.5 text-sm',
      icon: 'w-4 h-4',
      text: 'text-xs'
    },
    md: {
      button: 'p-2 text-base',
      icon: 'w-5 h-5',
      text: 'text-sm'
    },
    lg: {
      button: 'p-3 text-lg',
      icon: 'w-6 h-6',
      text: 'text-base'
    }
  };

  const currentSize = sizeStyles[size];

  // 按钮样式
  const buttonBaseStyles = `
    inline-flex items-center justify-center gap-2 
    rounded-lg border-2 transition-all duration-200 
    hover:scale-105 active:scale-95
    focus:outline-none focus:ring-2 focus:ring-offset-2
    ${currentSize.button}
  `;

  const buttonVariantStyles = isFavorite
    ? `
      bg-red-50 border-red-200 text-red-600 
      hover:bg-red-100 hover:border-red-300
      focus:ring-red-500
    `
    : `
      bg-gray-50 border-gray-200 text-gray-600 
      hover:bg-gray-100 hover:border-gray-300
      focus:ring-gray-500
    `;

  // 可访问性属性
  const ariaLabel = isFavorite 
    ? `从收藏中移除策略报告 ${reportTitle}` 
    : `收藏策略报告 ${reportTitle}`;

  return (
    <button
      type="button"
      className={`${buttonBaseStyles} ${buttonVariantStyles} ${className}`}
      onClick={handleClick}
      aria-label={ariaLabel}
      aria-pressed={isFavorite}
      title={ariaLabel}
    >
      <Heart
        className={`${currentSize.icon} transition-colors duration-200`}
        fill={isFavorite ? 'currentColor' : 'none'}
        strokeWidth={isFavorite ? 1 : 2}
      />
      {showLabel && (
        <span className={`${currentSize.text} font-medium`}>
          {isFavorite ? '已收藏' : '收藏报告'}
        </span>
      )}
    </button>
  );
}

/**
 * 紧凑型策略报告收藏按钮
 */
export function CompactReportFavoriteButton({
  reportId,
  reportTitle,
  className = ''
}: Omit<ReportFavoriteButtonProps, 'size' | 'showLabel'>) {
  const { isFavorite, toggleFavorite } = useFavoriteStatus(reportId, 'reports');
  const { showAddedToFavorites, showRemovedFromFavorites } = useFavoriteToast();

  const handleClick = () => {
    const wasNotFavorite = !isFavorite;
    toggleFavorite();
    
    if (wasNotFavorite) {
      showAddedToFavorites(reportTitle, 'reports');
    } else {
      showRemovedFromFavorites(reportTitle, 'reports');
    }
  };

  const ariaLabel = isFavorite 
    ? `从收藏中移除策略报告 ${reportTitle}` 
    : `收藏策略报告 ${reportTitle}`;

  return (
    <button
      type="button"
      className={`
        p-2 rounded-full transition-all duration-200
        hover:scale-110 active:scale-95
        focus:outline-none focus:ring-2 focus:ring-offset-2
        ${isFavorite 
          ? 'text-red-500 hover:text-red-600 focus:ring-red-500' 
          : 'text-gray-400 hover:text-gray-600 focus:ring-gray-500'
        }
        ${className}
      `}
      onClick={handleClick}
      aria-label={ariaLabel}
      aria-pressed={isFavorite}
      title={ariaLabel}
    >
      <Heart
        className="w-5 h-5 transition-colors duration-200"
        fill={isFavorite ? 'currentColor' : 'none'}
        strokeWidth={isFavorite ? 1 : 2}
      />
    </button>
  );
}

/**
 * 策略报告收藏卡片按钮（带报告图标）
 */
export function ReportCardFavoriteButton({
  reportId,
  reportTitle,
  className = ''
}: Omit<ReportFavoriteButtonProps, 'size' | 'showLabel'>) {
  const { isFavorite, toggleFavorite } = useFavoriteStatus(reportId, 'reports');
  const { showAddedToFavorites, showRemovedFromFavorites } = useFavoriteToast();

  const handleClick = () => {
    const wasNotFavorite = !isFavorite;
    toggleFavorite();
    
    if (wasNotFavorite) {
      showAddedToFavorites(reportTitle, 'reports');
    } else {
      showRemovedFromFavorites(reportTitle, 'reports');
    }
  };

  return (
    <button
      type="button"
      className={`
        flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200
        hover:scale-105 active:scale-95
        focus:outline-none focus:ring-2 focus:ring-offset-2
        ${isFavorite
          ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100 focus:ring-red-500'
          : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 focus:ring-gray-500'
        }
        ${className}
      `}
      onClick={handleClick}
      aria-label={isFavorite ? `从收藏中移除 ${reportTitle}` : `收藏 ${reportTitle}`}
    >
      <FileText className="w-4 h-4" />
      <Heart
        className="w-4 h-4 transition-colors duration-200"
        fill={isFavorite ? 'currentColor' : 'none'}
        strokeWidth={isFavorite ? 1 : 2}
      />
      <span className="text-sm font-medium">
        {isFavorite ? '已收藏' : '收藏'}
      </span>
    </button>
  );
}