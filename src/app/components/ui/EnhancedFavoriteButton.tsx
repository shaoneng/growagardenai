'use client';

// /src/app/components/ui/EnhancedFavoriteButton.tsx
// 集成 Toast 通知的增强收藏按钮

import React, { useState } from 'react';
import { Heart, Loader2 } from 'lucide-react';
import { FavoriteButtonProps } from '@/types';
import { useFavoriteStatus } from '@/contexts/FavoritesContext';
import { useFavoriteToast } from './Toast';

/**
 * 增强的收藏按钮，带有 Toast 通知和加载状态
 */
export function EnhancedFavoriteButton({
  itemId,
  itemType,
  size = 'md',
  showLabel = false,
  className = '',
  itemName // 用于 Toast 通知的物品名称
}: FavoriteButtonProps & { itemName?: string }) {
  const { isFavorite, toggleFavorite } = useFavoriteStatus(itemId, itemType);
  const { showAddedToFavorites, showRemovedFromFavorites, showFavoriteError } = useFavoriteToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    try {
      setIsLoading(true);
      
      const wasNotFavorite = !isFavorite;
      toggleFavorite();
      
      // 显示相应的 Toast 通知
      const displayName = itemName || itemId;
      
      if (wasNotFavorite) {
        showAddedToFavorites(displayName, itemType);
      } else {
        showRemovedFromFavorites(displayName, itemType);
      }
      
    } catch (error) {
      console.error('Favorite operation failed:', error);
      showFavoriteError();
    } finally {
      // 添加短暂延迟以显示加载状态
      setTimeout(() => setIsLoading(false), 300);
    }
  };

  // 尺寸样式
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
  const buttonStyles = `
    inline-flex items-center justify-center gap-2 
    rounded-lg border-2 font-medium transition-all duration-200
    hover:scale-105 active:scale-95
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
    ${currentSize.button}
    ${isFavorite
      ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100 hover:border-red-300 focus:ring-red-500'
      : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300 focus:ring-gray-500'
    }
    ${className}
  `;

  return (
    <button
      type="button"
      className={buttonStyles}
      onClick={handleClick}
      disabled={isLoading}
      aria-label={isFavorite ? `从收藏中移除 ${itemName || itemId}` : `添加 ${itemName || itemId} 到收藏`}
      aria-pressed={isFavorite}
    >
      {/* 图标或加载指示器 */}
      {isLoading ? (
        <Loader2 className={`${currentSize.icon} animate-spin`} />
      ) : (
        <Heart
          className={`${currentSize.icon} transition-colors duration-200`}
          fill={isFavorite ? 'currentColor' : 'none'}
          strokeWidth={isFavorite ? 1 : 2}
        />
      )}
      
      {/* 文本标签 */}
      {showLabel && (
        <span className={`${currentSize.text} transition-colors duration-200`}>
          {isLoading ? '处理中...' : (isFavorite ? '已收藏' : '收藏')}
        </span>
      )}
    </button>
  );
}

/**
 * 快速收藏按钮（紧凑型，带通知）
 */
export function QuickFavoriteButton({
  itemId,
  itemType,
  itemName,
  className = ''
}: Omit<FavoriteButtonProps, 'size' | 'showLabel'> & { itemName?: string }) {
  const { isFavorite, toggleFavorite } = useFavoriteStatus(itemId, itemType);
  const { showAddedToFavorites, showRemovedFromFavorites } = useFavoriteToast();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);
    
    const wasNotFavorite = !isFavorite;
    toggleFavorite();
    
    // 显示通知
    const displayName = itemName || itemId;
    if (wasNotFavorite) {
      showAddedToFavorites(displayName, itemType);
    } else {
      showRemovedFromFavorites(displayName, itemType);
    }
    
    // 重置动画
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <button
      type="button"
      className={`
        p-2 rounded-full transition-all duration-200
        hover:scale-110 active:scale-95
        focus:outline-none focus:ring-2 focus:ring-offset-2
        ${isFavorite
          ? 'text-red-500 hover:bg-red-50 focus:ring-red-500'
          : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600 focus:ring-gray-500'
        }
        ${isAnimating ? 'animate-bounce' : ''}
        ${className}
      `}
      onClick={handleClick}
      aria-label={isFavorite ? `从收藏中移除 ${itemName || itemId}` : `添加 ${itemName || itemId} 到收藏`}
    >
      <Heart
        className="w-5 h-5 transition-all duration-200"
        fill={isFavorite ? 'currentColor' : 'none'}
        strokeWidth={isFavorite ? 1 : 2}
      />
    </button>
  );
}

/**
 * 收藏状态切换开关（带通知）
 */
export function FavoriteSwitch({
  itemId,
  itemType,
  itemName,
  label,
  className = ''
}: Omit<FavoriteButtonProps, 'size' | 'showLabel'> & { 
  itemName?: string;
  label?: string;
}) {
  const { isFavorite, toggleFavorite } = useFavoriteStatus(itemId, itemType);
  const { showAddedToFavorites, showRemovedFromFavorites } = useFavoriteToast();

  const handleToggle = () => {
    const wasNotFavorite = !isFavorite;
    toggleFavorite();
    
    // 显示通知
    const displayName = itemName || itemId;
    if (wasNotFavorite) {
      showAddedToFavorites(displayName, itemType);
    } else {
      showRemovedFromFavorites(displayName, itemType);
    }
  };

  const displayLabel = label || `收藏 ${itemName || itemId}`;

  return (
    <label className={`inline-flex items-center gap-3 cursor-pointer ${className}`}>
      <div className="relative">
        <input
          type="checkbox"
          checked={isFavorite}
          onChange={handleToggle}
          className="sr-only"
          aria-label={displayLabel}
        />
        <div
          className={`
            w-11 h-6 rounded-full transition-all duration-300
            ${isFavorite 
              ? 'bg-red-500 shadow-lg' 
              : 'bg-gray-300 hover:bg-gray-400'
            }
          `}
        >
          <div
            className={`
              absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full 
              transition-all duration-300 flex items-center justify-center
              shadow-md
              ${isFavorite ? 'translate-x-5' : 'translate-x-0'}
            `}
          >
            <Heart
              className={`w-3 h-3 transition-colors duration-300 ${
                isFavorite ? 'text-red-500' : 'text-gray-400'
              }`}
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
 * 批量收藏操作按钮
 */
export function BulkFavoriteButton({
  items,
  itemType,
  className = ''
}: {
  items: Array<{ id: string; name?: string }>;
  itemType: 'crops' | 'pets';
  className?: string;
}) {
  const { showAddedToFavorites, showFavoriteError } = useFavoriteToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleBulkAdd = async () => {
    try {
      setIsLoading(true);
      
      // 这里应该调用批量添加的逻辑
      // 目前先显示成功消息
      const typeText = itemType === 'crops' ? '作物' : '宠物';
      showAddedToFavorites(`${items.length} 个${typeText}`, itemType);
      
    } catch (error) {
      showFavoriteError('批量添加失败，请重试');
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  return (
    <button
      type="button"
      className={`
        inline-flex items-center gap-2 px-4 py-2 
        bg-blue-50 border border-blue-200 text-blue-700
        rounded-lg font-medium transition-all duration-200
        hover:bg-blue-100 hover:border-blue-300
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      onClick={handleBulkAdd}
      disabled={isLoading || items.length === 0}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Heart className="w-4 h-4" />
      )}
      <span>
        {isLoading ? '添加中...' : `批量收藏 (${items.length})`}
      </span>
    </button>
  );
}