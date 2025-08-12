'use client';

// /src/app/components/ui/FavoriteButton.tsx
// 收藏按钮组件

import React from 'react';
import { Heart } from 'lucide-react';
import { FavoriteButtonProps } from '@/types';
import { useFavoriteStatus } from '@/contexts/FavoritesContext';

/**
 * 收藏按钮组件
 * 支持不同尺寸和样式，提供收藏/取消收藏功能
 */
export function FavoriteButton({
  itemId,
  itemType,
  size = 'md',
  showLabel = false,
  className = ''
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavoriteStatus(itemId, itemType);

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

  // 图标样式
  const iconStyles = `${currentSize.icon} transition-colors duration-200`;

  // 文本内容
  const getButtonText = () => {
    if (!showLabel) return null;
    
    return (
      <span className={`${currentSize.text} font-medium`}>
        {isFavorite ? '已收藏' : '收藏'}
      </span>
    );
  };

  // 可访问性属性
  const ariaLabel = isFavorite 
    ? `从收藏中移除 ${itemId}` 
    : `添加 ${itemId} 到收藏`;

  const ariaPressed = isFavorite;

  return (
    <button
      type="button"
      className={`${buttonBaseStyles} ${buttonVariantStyles} ${className}`}
      onClick={toggleFavorite}
      aria-label={ariaLabel}
      aria-pressed={ariaPressed}
      title={ariaLabel}
    >
      <Heart
        className={iconStyles}
        fill={isFavorite ? 'currentColor' : 'none'}
        strokeWidth={isFavorite ? 1 : 2}
      />
      {getButtonText()}
    </button>
  );
}

/**
 * 紧凑型收藏按钮（仅图标）
 * 适用于卡片和列表项
 */
export function CompactFavoriteButton({
  itemId,
  itemType,
  className = ''
}: Omit<FavoriteButtonProps, 'size' | 'showLabel'>) {
  const { isFavorite, toggleFavorite } = useFavoriteStatus(itemId, itemType);

  const ariaLabel = isFavorite 
    ? `从收藏中移除 ${itemId}` 
    : `添加 ${itemId} 到收藏`;

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
      onClick={toggleFavorite}
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
 * 收藏按钮（带计数）
 * 显示收藏状态和总收藏数（如果需要）
 */
export function FavoriteButtonWithCount({
  itemId,
  itemType,
  showCount = false,
  size = 'md',
  className = ''
}: FavoriteButtonProps & { showCount?: boolean }) {
  const { isFavorite, toggleFavorite } = useFavoriteStatus(itemId, itemType);

  // 这里可以添加获取特定物品收藏数的逻辑
  // 目前先显示收藏状态
  const favoriteCount = 0; // 占位符

  const sizeStyles = {
    sm: { button: 'px-3 py-1.5 text-sm', icon: 'w-4 h-4' },
    md: { button: 'px-4 py-2 text-base', icon: 'w-5 h-5' },
    lg: { button: 'px-6 py-3 text-lg', icon: 'w-6 h-6' }
  };

  const currentSize = sizeStyles[size];

  const ariaLabel = isFavorite 
    ? `从收藏中移除 ${itemId}` 
    : `添加 ${itemId} 到收藏`;

  return (
    <button
      type="button"
      className={`
        inline-flex items-center gap-2 rounded-lg border-2 
        transition-all duration-200 hover:scale-105 active:scale-95
        focus:outline-none focus:ring-2 focus:ring-offset-2
        ${currentSize.button}
        ${isFavorite
          ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100 hover:border-red-300 focus:ring-red-500'
          : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300 focus:ring-gray-500'
        }
        ${className}
      `}
      onClick={toggleFavorite}
      aria-label={ariaLabel}
      aria-pressed={isFavorite}
      title={ariaLabel}
    >
      <Heart
        className={`${currentSize.icon} transition-colors duration-200`}
        fill={isFavorite ? 'currentColor' : 'none'}
        strokeWidth={isFavorite ? 1 : 2}
      />
      <span className="font-medium">
        {isFavorite ? '已收藏' : '收藏'}
      </span>
      {showCount && favoriteCount > 0 && (
        <span className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full text-xs font-medium">
          {favoriteCount}
        </span>
      )}
    </button>
  );
}

/**
 * 收藏切换开关
 * 类似开关的样式，适用于设置页面
 */
export function FavoriteToggle({
  itemId,
  itemType,
  label,
  className = ''
}: FavoriteButtonProps & { label?: string }) {
  const { isFavorite, toggleFavorite } = useFavoriteStatus(itemId, itemType);

  const displayLabel = label || `收藏 ${itemId}`;

  return (
    <label className={`inline-flex items-center gap-3 cursor-pointer ${className}`}>
      <div className="relative">
        <input
          type="checkbox"
          checked={isFavorite}
          onChange={toggleFavorite}
          className="sr-only"
          aria-label={displayLabel}
        />
        <div
          className={`
            w-11 h-6 rounded-full transition-colors duration-200
            ${isFavorite ? 'bg-red-500' : 'bg-gray-300'}
          `}
        >
          <div
            className={`
              absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full 
              transition-transform duration-200 flex items-center justify-center
              ${isFavorite ? 'translate-x-5' : 'translate-x-0'}
            `}
          >
            <Heart
              className="w-3 h-3 text-gray-400"
              fill={isFavorite ? 'currentColor' : 'none'}
              strokeWidth={2}
            />
          </div>
        </div>
      </div>
      <span className="text-sm font-medium text-gray-700">
        {displayLabel}
      </span>
    </label>
  );
}

/**
 * 收藏按钮组
 * 用于批量操作或相关物品组
 */
export function FavoriteButtonGroup({
  items,
  itemType,
  className = ''
}: {
  items: Array<{ id: string; name?: string }>;
  itemType: 'crops' | 'pets';
  className?: string;
}) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {items.map((item) => (
        <CompactFavoriteButton
          key={item.id}
          itemId={item.id}
          itemType={itemType}
          className="bg-white shadow-sm hover:shadow-md"
        />
      ))}
    </div>
  );
}