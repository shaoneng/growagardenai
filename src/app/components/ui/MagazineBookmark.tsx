'use client';
// /src/app/components/ui/MagazineBookmark.tsx
// 杂志风格的书签收藏组件

import React, { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { useFavoriteStatus } from '@/contexts/FavoritesContext';

interface MagazineBookmarkProps {
  reportId: string;
  reportTitle?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function MagazineBookmark({
  reportId,
  reportTitle,
  className = '',
  size = 'md'
}: MagazineBookmarkProps) {
  const { isFavorite, toggleFavorite } = useFavoriteStatus(reportId, 'reports');
  const [isAnimating, setIsAnimating] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // 尺寸配置
  const sizeConfig = {
    sm: {
      container: 'w-8 h-12',
      icon: 'w-4 h-4',
      fold: 'w-6 h-3'
    },
    md: {
      container: 'w-10 h-16',
      icon: 'w-5 h-5',
      fold: 'w-8 h-4'
    },
    lg: {
      container: 'w-12 h-20',
      icon: 'w-6 h-6',
      fold: 'w-10 h-5'
    }
  };

  const config = sizeConfig[size];

  const handleToggleFavorite = async () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    // 添加短暂延迟以显示动画效果
    setTimeout(() => {
      toggleFavorite();
      setIsAnimating(false);
    }, 200);
  };

  const ariaLabel = isFavorite 
    ? `从收藏中移除报告 ${reportTitle || reportId}` 
    : `收藏报告 ${reportTitle || reportId}`;

  return (
    <div className="relative">
      {/* 书签主体 */}
      <button
        type="button"
        className={`
          relative group transition-all duration-400 ease-out
          ${config.container}
          ${isFavorite 
            ? 'text-amber-600 drop-shadow-md' 
            : 'text-amber-700/70 hover:text-amber-600'
          }
          ${isAnimating ? 'animate-pulse' : ''}
          ${className}
        `}
        onClick={handleToggleFavorite}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        aria-label={ariaLabel}
        aria-pressed={isFavorite}
        role="button"
        title={ariaLabel}
      >
        {/* 书签背景 */}
        <div className={`
          absolute inset-0 transition-all duration-400
          ${isFavorite 
            ? 'bg-gradient-to-b from-amber-100 via-amber-50 to-amber-100 border-amber-200' 
            : 'bg-gradient-to-b from-stone-100 via-stone-50 to-stone-100 border-stone-200 group-hover:from-amber-50 group-hover:via-amber-25 group-hover:to-amber-50'
          }
          border border-solid rounded-t-sm
          shadow-sm group-hover:shadow-md
          transform group-hover:-translate-y-1
        `} />

        {/* 书签折角效果 */}
        <div className={`
          absolute top-0 right-0 ${config.fold}
          ${isFavorite 
            ? 'bg-amber-200 border-amber-300' 
            : 'bg-stone-200 border-stone-300 group-hover:bg-amber-100'
          }
          border-l border-b border-solid
          transform rotate-0 origin-top-right
          transition-all duration-400
          ${isFavorite ? 'scale-110' : 'group-hover:scale-105'}
        `} 
        style={{
          clipPath: 'polygon(0 0, 100% 0, 0 100%)'
        }} />

        {/* 书签图标 */}
        <div className="absolute inset-0 flex items-center justify-center">
          {isFavorite ? (
            <BookmarkCheck 
              className={`
                ${config.icon} 
                transition-all duration-300
                ${isAnimating ? 'scale-125' : 'group-hover:scale-110'}
              `}
            />
          ) : (
            <Bookmark 
              className={`
                ${config.icon} 
                transition-all duration-300
                group-hover:scale-110
              `}
            />
          )}
        </div>

        {/* 收藏状态指示器 */}
        {isFavorite && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
        )}

        {/* 悬停效果 - 纸张质感 */}
        <div className={`
          absolute inset-0 opacity-0 group-hover:opacity-100
          bg-gradient-to-br from-white/20 via-transparent to-black/5
          transition-opacity duration-300
          pointer-events-none
          rounded-t-sm
        `} />
      </button>

      {/* 工具提示 */}
      {showTooltip && (
        <div className={`
          absolute top-full left-1/2 transform -translate-x-1/2 mt-2
          px-3 py-2 bg-stone-800 text-white text-sm rounded-md
          whitespace-nowrap z-50
          animate-in fade-in-0 zoom-in-95 duration-200
          shadow-lg
        `}>
          {isFavorite ? '已收藏' : '收藏报告'}
          {/* 工具提示箭头 */}
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-stone-800 rotate-45" />
        </div>
      )}

      {/* 页面折角动画效果 */}
      {isAnimating && (
        <div className={`
          absolute top-0 right-0 ${config.container}
          pointer-events-none
          animate-in zoom-in-50 duration-200
        `}>
          <div className="absolute inset-0 bg-amber-200/50 rounded-t-sm animate-pulse" />
        </div>
      )}
    </div>
  );
}

/**
 * 紧凑版杂志书签 - 用于列表或小空间
 */
export function CompactMagazineBookmark({
  reportId,
  reportTitle,
  className = ''
}: Omit<MagazineBookmarkProps, 'size'>) {
  const { isFavorite, toggleFavorite } = useFavoriteStatus(reportId, 'reports');
  
  return (
    <button
      type="button"
      className={`
        relative w-6 h-8 transition-all duration-300
        ${isFavorite 
          ? 'text-amber-600' 
          : 'text-stone-400 hover:text-amber-600'
        }
        ${className}
      `}
      onClick={toggleFavorite}
      aria-label={isFavorite ? '取消收藏' : '收藏报告'}
      title={reportTitle}
    >
      {/* 简化的书签背景 */}
      <div className={`
        absolute inset-0 rounded-t-sm border transition-all duration-300
        ${isFavorite 
          ? 'bg-amber-50 border-amber-200' 
          : 'bg-stone-50 border-stone-200 hover:bg-amber-50'
        }
      `} />
      
      {/* 简化的折角 */}
      <div className={`
        absolute top-0 right-0 w-3 h-2 transition-all duration-300
        ${isFavorite 
          ? 'bg-amber-200' 
          : 'bg-stone-200 hover:bg-amber-100'
        }
      `}
      style={{
        clipPath: 'polygon(0 0, 100% 0, 0 100%)'
      }} />
      
      {/* 图标 */}
      <div className="absolute inset-0 flex items-center justify-center">
        {isFavorite ? (
          <BookmarkCheck className="w-3 h-3" />
        ) : (
          <Bookmark className="w-3 h-3" />
        )}
      </div>
    </button>
  );
}

/**
 * 浮动杂志书签 - 用于固定位置显示
 */
export function FloatingMagazineBookmark({
  reportId,
  reportTitle,
  className = ''
}: Omit<MagazineBookmarkProps, 'size'>) {
  const { isFavorite, toggleFavorite } = useFavoriteStatus(reportId, 'reports');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 延迟显示以创建优雅的入场效果
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className={`
      fixed top-20 right-6 z-40
      animate-in slide-in-from-right-5 duration-500
      ${className}
    `}>
      <MagazineBookmark
        reportId={reportId}
        reportTitle={reportTitle}
        size="lg"
        className="drop-shadow-lg hover:drop-shadow-xl transition-all duration-300"
      />
    </div>
  );
}