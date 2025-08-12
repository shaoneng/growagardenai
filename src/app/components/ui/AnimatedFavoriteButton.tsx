'use client';

// /src/app/components/ui/AnimatedFavoriteButton.tsx
// 带动画效果的收藏按钮组件

import React, { useState, useEffect } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { FavoriteButtonProps } from '@/types';
import { useFavoriteStatus } from '@/contexts/FavoritesContext';

/**
 * 带动画效果的收藏按钮
 * 包含点击动画、状态过渡动画和成功反馈
 */
export function AnimatedFavoriteButton({
  itemId,
  itemType,
  size = 'md',
  showLabel = false,
  className = ''
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavoriteStatus(itemId, itemType);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // 处理点击动画
  const handleClick = async () => {
    setIsAnimating(true);
    
    // 执行收藏切换
    const wasNotFavorite = !isFavorite;
    toggleFavorite();
    
    // 如果是添加到收藏，显示成功反馈
    if (wasNotFavorite) {
      setTimeout(() => {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      }, 300);
    }
    
    // 重置动画状态
    setTimeout(() => setIsAnimating(false), 600);
  };

  // 尺寸样式
  const sizeStyles = {
    sm: {
      button: 'p-2 text-sm',
      icon: 'w-4 h-4',
      text: 'text-xs'
    },
    md: {
      button: 'p-3 text-base',
      icon: 'w-5 h-5',
      text: 'text-sm'
    },
    lg: {
      button: 'p-4 text-lg',
      icon: 'w-6 h-6',
      text: 'text-base'
    }
  };

  const currentSize = sizeStyles[size];

  // 动画样式类
  const getAnimationClasses = () => {
    let classes = 'transition-all duration-300 ease-out ';
    
    if (isAnimating) {
      classes += 'scale-110 ';
    }
    
    if (isFavorite) {
      classes += 'animate-pulse ';
    }
    
    return classes;
  };

  // 按钮样式
  const buttonStyles = `
    relative inline-flex items-center justify-center gap-2 
    rounded-xl border-2 font-medium
    hover:scale-105 active:scale-95
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    ${currentSize.button}
    ${getAnimationClasses()}
    ${isFavorite
      ? 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200 text-red-600 hover:from-red-100 hover:to-pink-100 hover:border-red-300 focus:ring-red-500'
      : 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200 text-gray-600 hover:from-gray-100 hover:to-gray-200 hover:border-gray-300 focus:ring-gray-500'
    }
    ${className}
  `;

  return (
    <div className="relative">
      <button
        type="button"
        className={buttonStyles}
        onClick={handleClick}
        disabled={isAnimating}
        aria-label={isFavorite ? `从收藏中移除 ${itemId}` : `添加 ${itemId} 到收藏`}
        aria-pressed={isFavorite}
      >
        {/* 主要图标 */}
        <Heart
          className={`${currentSize.icon} transition-all duration-300 ${
            isFavorite ? 'text-red-500 scale-110' : 'text-gray-400'
          }`}
          fill={isFavorite ? 'currentColor' : 'none'}
          strokeWidth={isFavorite ? 1 : 2}
        />
        
        {/* 文本标签 */}
        {showLabel && (
          <span className={`${currentSize.text} transition-colors duration-300`}>
            {isFavorite ? '已收藏' : '收藏'}
          </span>
        )}
        
        {/* 点击波纹效果 */}
        {isAnimating && (
          <div className="absolute inset-0 rounded-xl bg-red-200 opacity-30 animate-ping" />
        )}
      </button>
      
      {/* 成功提示 */}
      {showSuccess && (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm font-medium shadow-lg animate-bounce">
            <div className="flex items-center gap-1">
              <Sparkles className="w-4 h-4" />
              <span>已添加到收藏！</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * 浮动爱心动画按钮
 * 点击时会有爱心飞出的效果
 */
export function FloatingHeartButton({
  itemId,
  itemType,
  className = ''
}: Omit<FavoriteButtonProps, 'size' | 'showLabel'>) {
  const { isFavorite, toggleFavorite } = useFavoriteStatus(itemId, itemType);
  const [hearts, setHearts] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const handleClick = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // 如果是添加到收藏，创建飞出的爱心
    if (!isFavorite) {
      const newHearts = Array.from({ length: 5 }, (_, i) => ({
        id: Date.now() + i,
        x: centerX + (Math.random() - 0.5) * 60,
        y: centerY + (Math.random() - 0.5) * 60
      }));
      
      setHearts(prev => [...prev, ...newHearts]);
      
      // 清理动画完成的爱心
      setTimeout(() => {
        setHearts(prev => prev.filter(heart => !newHearts.includes(heart)));
      }, 1000);
    }
    
    toggleFavorite();
  };

  return (
    <div className="relative">
      <button
        type="button"
        className={`
          relative p-3 rounded-full transition-all duration-300
          hover:scale-110 active:scale-95
          focus:outline-none focus:ring-2 focus:ring-offset-2
          ${isFavorite
            ? 'bg-red-100 text-red-500 hover:bg-red-200 focus:ring-red-500'
            : 'bg-gray-100 text-gray-400 hover:bg-gray-200 focus:ring-gray-500'
          }
          ${className}
        `}
        onClick={handleClick}
        aria-label={isFavorite ? `从收藏中移除 ${itemId}` : `添加 ${itemId} 到收藏`}
      >
        <Heart
          className="w-6 h-6 transition-all duration-300"
          fill={isFavorite ? 'currentColor' : 'none'}
          strokeWidth={isFavorite ? 1 : 2}
        />
      </button>
      
      {/* 飞出的爱心动画 */}
      {hearts.map(heart => (
        <Heart
          key={heart.id}
          className="absolute w-4 h-4 text-red-500 pointer-events-none animate-ping"
          style={{
            left: heart.x,
            top: heart.y,
            animation: 'float-up 1s ease-out forwards'
          }}
          fill="currentColor"
        />
      ))}
      
      <style jsx>{`
        @keyframes float-up {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-30px) scale(0.5);
          }
        }
      `}</style>
    </div>
  );
}

/**
 * 脉冲收藏按钮
 * 收藏状态时会有脉冲效果
 */
export function PulsingFavoriteButton({
  itemId,
  itemType,
  size = 'md',
  className = ''
}: Omit<FavoriteButtonProps, 'showLabel'>) {
  const { isFavorite, toggleFavorite } = useFavoriteStatus(itemId, itemType);

  const sizeClasses = {
    sm: 'p-2 w-8 h-8',
    md: 'p-2.5 w-10 h-10',
    lg: 'p-3 w-12 h-12'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <button
      type="button"
      className={`
        relative rounded-full transition-all duration-300
        hover:scale-110 active:scale-95
        focus:outline-none focus:ring-2 focus:ring-offset-2
        ${sizeClasses[size]}
        ${isFavorite
          ? 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 animate-pulse'
          : 'bg-white border-2 border-gray-300 text-gray-400 hover:border-gray-400 hover:text-gray-600 focus:ring-gray-500'
        }
        ${className}
      `}
      onClick={toggleFavorite}
      aria-label={isFavorite ? `从收藏中移除 ${itemId}` : `添加 ${itemId} 到收藏`}
    >
      <Heart
        className={`${iconSizes[size]} transition-all duration-300`}
        fill={isFavorite ? 'currentColor' : 'none'}
        strokeWidth={isFavorite ? 1 : 2}
      />
      
      {/* 脉冲环效果 */}
      {isFavorite && (
        <div className="absolute inset-0 rounded-full border-2 border-red-300 animate-ping opacity-75" />
      )}
    </button>
  );
}

/**
 * 渐变收藏按钮
 * 带有渐变背景和平滑过渡效果
 */
export function GradientFavoriteButton({
  itemId,
  itemType,
  showLabel = true,
  className = ''
}: Omit<FavoriteButtonProps, 'size'>) {
  const { isFavorite, toggleFavorite } = useFavoriteStatus(itemId, itemType);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      type="button"
      className={`
        relative inline-flex items-center gap-2 px-6 py-3 rounded-full
        font-medium text-white transition-all duration-500
        hover:scale-105 active:scale-95
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500
        ${isFavorite
          ? 'bg-gradient-to-r from-red-500 via-pink-500 to-red-500 bg-size-200 bg-pos-0 hover:bg-pos-100'
          : 'bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600'
        }
        ${className}
      `}
      onClick={toggleFavorite}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={isFavorite ? `从收藏中移除 ${itemId}` : `添加 ${itemId} 到收藏`}
    >
      <Heart
        className={`w-5 h-5 transition-all duration-300 ${
          isHovered ? 'scale-110' : 'scale-100'
        }`}
        fill={isFavorite ? 'currentColor' : 'none'}
        strokeWidth={isFavorite ? 1 : 2}
      />
      
      {showLabel && (
        <span className="transition-all duration-300">
          {isFavorite ? '已收藏' : '收藏'}
        </span>
      )}
      
      {/* 光泽效果 */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white to-transparent opacity-0 hover:opacity-20 transition-opacity duration-500 transform -skew-x-12" />
    </button>
  );
}

/**
 * 收藏按钮工具提示
 * 带有工具提示的收藏按钮
 */
export function TooltipFavoriteButton({
  itemId,
  itemType,
  tooltipText,
  className = ''
}: Omit<FavoriteButtonProps, 'size' | 'showLabel'> & { tooltipText?: string }) {
  const { isFavorite, toggleFavorite } = useFavoriteStatus(itemId, itemType);
  const [showTooltip, setShowTooltip] = useState(false);

  const defaultTooltip = isFavorite ? '从收藏中移除' : '添加到收藏';
  const tooltip = tooltipText || defaultTooltip;

  return (
    <div className="relative">
      <button
        type="button"
        className={`
          p-2 rounded-lg transition-all duration-200
          hover:scale-110 active:scale-95
          focus:outline-none focus:ring-2 focus:ring-offset-2
          ${isFavorite
            ? 'text-red-500 hover:bg-red-50 focus:ring-red-500'
            : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600 focus:ring-gray-500'
          }
          ${className}
        `}
        onClick={toggleFavorite}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        aria-label={tooltip}
      >
        <Heart
          className="w-5 h-5 transition-colors duration-200"
          fill={isFavorite ? 'currentColor' : 'none'}
          strokeWidth={isFavorite ? 1 : 2}
        />
      </button>
      
      {/* 工具提示 */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-10">
          <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            {tooltip}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
          </div>
        </div>
      )}
    </div>
  );
}