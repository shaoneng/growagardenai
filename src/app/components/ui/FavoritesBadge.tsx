'use client';

// /src/app/components/ui/FavoritesBadge.tsx
// 收藏数量徽章组件

import React from 'react';
import { Heart } from 'lucide-react';
import { FavoritesBadgeProps } from '@/types';

/**
 * 收藏数量徽章组件
 * 用于导航栏等位置显示收藏总数
 */
export function FavoritesBadge({
  count,
  showZero = false,
  className = ''
}: FavoritesBadgeProps) {
  // 如果数量为0且不显示0，则不渲染
  if (count === 0 && !showZero) {
    return null;
  }

  // 格式化数量显示
  const formatCount = (num: number): string => {
    if (num < 1000) return num.toString();
    if (num < 10000) return `${(num / 1000).toFixed(1)}k`;
    return `${Math.floor(num / 1000)}k`;
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1 px-2 py-1 
        bg-red-100 text-red-700 rounded-full text-xs font-medium
        ${className}
      `}
      aria-label={`${count} favorite items`}
    >
      <Heart className="w-3 h-3" fill="currentColor" />
      <span>{formatCount(count)}</span>
    </span>
  );
}

/**
 * 简单的数字徽章
 * 仅显示数字，适用于图标旁边
 */
export function SimpleBadge({
  count,
  showZero = false,
  className = ''
}: FavoritesBadgeProps) {
  if (count === 0 && !showZero) {
    return null;
  }

  return (
    <span
      className={`
        inline-flex items-center justify-center 
        min-w-[1.25rem] h-5 px-1.5 
        bg-red-500 text-white text-xs font-bold rounded-full
        ${className}
      `}
      aria-label={`${count} favorite items`}
    >
      {count > 99 ? '99+' : count}
    </span>
  );
}

/**
 * 导航徽章
 * 专门用于导航栏的收藏数量显示
 */
export function NavigationBadge({
  count,
  showZero = false,
  className = ''
}: FavoritesBadgeProps) {
  if (count === 0 && !showZero) {
    return null;
  }

  return (
    <span
      className={`
        absolute -top-1 -right-1 
        inline-flex items-center justify-center 
        min-w-[1.125rem] h-[1.125rem] px-1
        bg-red-500 text-white text-xs font-bold rounded-full
        ring-2 ring-white
        ${className}
      `}
      aria-label={`${count} favorite items`}
    >
      {count > 9 ? '9+' : count}
    </span>
  );
}

/**
 * 收藏状态指示器
 * 显示收藏状态的小圆点
 */
export function FavoriteIndicator({
  isFavorite,
  className = ''
}: {
  isFavorite: boolean;
  className?: string;
}) {
  if (!isFavorite) {
    return null;
  }

  return (
    <span
      className={`
        inline-block w-2 h-2 bg-red-500 rounded-full
        ${className}
      `}
      aria-label="Favorited"
    />
  );
}

/**
 * 收藏统计卡片
 * 显示详细的收藏统计信息
 */
export function FavoritesStatsCard({
  totalCount,
  cropsCount,
  petsCount,
  reportsCount = 0,
  className = ''
}: {
  totalCount: number;
  cropsCount: number;
  petsCount: number;
  reportsCount?: number;
  className?: string;
}) {
  return (
    <div
      className={`
        bg-white rounded-lg border border-gray-200 p-4 shadow-sm
        ${className}
      `}
    >
      <div className="flex items-center gap-2 mb-3">
        <Heart className="w-5 h-5 text-red-500" fill="currentColor" />
        <h3 className="text-lg font-semibold text-gray-900">My Favorites</h3>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Total</span>
          <span className="text-lg font-bold text-gray-900">{totalCount}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">🌱 Crops</span>
          <span className="text-sm font-medium text-gray-700">{cropsCount}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">🐾 Pets</span>
          <span className="text-sm font-medium text-gray-700">{petsCount}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">📊 Strategy Reports</span>
          <span className="text-sm font-medium text-gray-700">{reportsCount}</span>
        </div>
      </div>
    </div>
  );
}

/**
 * 收藏进度条
 * 显示收藏进度（如果有目标的话）
 */
export function FavoritesProgress({
  current,
  target,
  label = 'Favorites Progress',
  className = ''
}: {
  current: number;
  target: number;
  label?: string;
  className?: string;
}) {
  const percentage = Math.min((current / target) * 100, 100);
  
  return (
    <div className={`${className}`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm text-gray-500">
          {current}/{target}
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-red-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {percentage === 100 && (
        <div className="flex items-center gap-1 mt-2 text-green-600">
          <Heart className="w-4 h-4" fill="currentColor" />
          <span className="text-sm font-medium">Goal achieved!</span>
        </div>
      )}
    </div>
  );
}