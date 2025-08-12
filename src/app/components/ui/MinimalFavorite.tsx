'use client';
// /src/app/components/ui/MinimalFavorite.tsx
// 极简风格的收藏组件

import React from 'react';
import { Heart } from 'lucide-react';
import { useFavoriteStatus } from '@/contexts/FavoritesContext';

interface MinimalFavoriteProps {
  reportId: string;
  reportTitle?: string;
  className?: string;
  integrated?: boolean; // 是否集成在标题中
}

export default function MinimalFavorite({
  reportId,
  reportTitle,
  className = '',
  integrated = true
}: MinimalFavoriteProps) {
  const { isFavorite, toggleFavorite } = useFavoriteStatus(reportId, 'reports');

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite();
  };

  if (integrated) {
    // 集成在标题中的版本
    return (
      <button
        type="button"
        className={`
          inline-flex items-center justify-center
          w-4 h-4 ml-2 transition-all duration-150
          ${isFavorite 
            ? 'text-black opacity-100' 
            : 'text-gray-400 opacity-30 hover:opacity-80'
          }
          ${className}
        `}
        onClick={handleToggle}
        aria-label={isFavorite ? '取消收藏' : '收藏报告'}
        title={reportTitle}
      >
        <Heart 
          className={`w-3 h-3 transition-all duration-150 ${
            isFavorite ? 'fill-current' : ''
          }`}
        />
      </button>
    );
  }

  // 独立显示的版本
  return (
    <button
      type="button"
      className={`
        flex items-center justify-center
        w-8 h-8 transition-all duration-150
        ${isFavorite 
          ? 'text-black opacity-100' 
          : 'text-gray-400 opacity-50 hover:opacity-100'
        }
        ${className}
      `}
      onClick={handleToggle}
      aria-label={isFavorite ? '取消收藏' : '收藏报告'}
      title={reportTitle}
    >
      <Heart 
        className={`w-4 h-4 transition-all duration-150 ${
          isFavorite ? 'fill-current' : ''
        }`}
      />
    </button>
  );
}

/**
 * 极简风格的浮动收藏按钮
 */
export function MinimalFloatingFavorite({
  reportId,
  reportTitle,
  className = ''
}: Omit<MinimalFavoriteProps, 'integrated'>) {
  const { isFavorite, toggleFavorite } = useFavoriteStatus(reportId, 'reports');

  return (
    <button
      type="button"
      className={`
        fixed top-4 right-4 z-50
        w-10 h-10 rounded-full
        flex items-center justify-center
        transition-all duration-150
        ${isFavorite 
          ? 'bg-black text-white' 
          : 'bg-white text-gray-400 hover:text-black border border-gray-200'
        }
        shadow-sm hover:shadow-md
        ${className}
      `}
      onClick={toggleFavorite}
      aria-label={isFavorite ? '取消收藏' : '收藏报告'}
      title={reportTitle}
    >
      <Heart 
        className={`w-4 h-4 transition-all duration-150 ${
          isFavorite ? 'fill-current' : ''
        }`}
      />
    </button>
  );
}

/**
 * 极简风格的文本收藏按钮
 */
export function MinimalTextFavorite({
  reportId,
  reportTitle,
  className = ''
}: Omit<MinimalFavoriteProps, 'integrated'>) {
  const { isFavorite, toggleFavorite } = useFavoriteStatus(reportId, 'reports');

  return (
    <button
      type="button"
      className={`
        text-sm transition-all duration-150
        ${isFavorite 
          ? 'text-black font-medium' 
          : 'text-gray-500 hover:text-black'
        }
        ${className}
      `}
      onClick={toggleFavorite}
      aria-label={isFavorite ? '取消收藏' : '收藏报告'}
      title={reportTitle}
    >
      {isFavorite ? '已收藏' : '收藏'}
    </button>
  );
}