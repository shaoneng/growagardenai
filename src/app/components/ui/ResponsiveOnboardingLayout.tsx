'use client';

import React, { useEffect, useState } from 'react';

/**
 * 响应式布局组件属性
 */
interface ResponsiveLayoutProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * 响应式网格布局组件属性
 */
interface ResponsiveGridProps {
  children: React.ReactNode;
  itemCount: number;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl';
}

/**
 * 响应式卡片组件属性
 */
interface ResponsiveCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
}

/**
 * 响应式容器组件
 * 实现需求 6.3: 移动设备的单列布局适配
 */
export const ResponsiveContainer: React.FC<ResponsiveLayoutProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`
      w-full
      px-4 sm:px-6 lg:px-8
      py-4 sm:py-6 lg:py-8
      mx-auto
      ${className}
    `}>
      {children}
    </div>
  );
};

/**
 * 响应式网格布局
 * 根据项目数量自动调整网格列数
 */
export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({ 
  children, 
  itemCount, 
  className = '',
  maxWidth = '6xl'
}) => {
  // 根据项目数量智能选择网格布局
  const getGridClasses = (count: number): string => {
    if (count === 1) {
      return 'grid-cols-1 max-w-md mx-auto';
    } else if (count === 2) {
      return 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto';
    } else if (count === 3) {
      return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto';
    } else if (count === 4) {
      return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto';
    } else {
      return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-6xl mx-auto';
    }
  };

  const maxWidthClass = {
    'sm': 'max-w-sm',
    'md': 'max-w-md', 
    'lg': 'max-w-lg',
    'xl': 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
    '6xl': 'max-w-6xl'
  }[maxWidth];

  return (
    <div className={`
      grid
      ${getGridClasses(itemCount)}
      gap-4 sm:gap-6 lg:gap-8
      ${maxWidthClass}
      ${className}
    `}>
      {children}
    </div>
  );
};

/**
 * 响应式卡片组件
 * 实现需求 6.4: 模态对话框的背景遮罩效果
 * 实现需求 6.5: hover和focus状态的视觉反馈
 */
export const ResponsiveCard: React.FC<ResponsiveCardProps> = ({ 
  children, 
  className = '',
  variant = 'default',
  size = 'md',
  interactive = false
}) => {
  const baseClasses = `
    rounded-xl
    transition-all duration-300 ease-out
    ${interactive ? 'cursor-pointer' : ''}
  `;

  const variantClasses = {
    default: `
      bg-white 
      border-2 border-gray-200
      ${interactive ? 'hover:border-blue-500 hover:shadow-xl hover:scale-105' : ''}
    `,
    elevated: `
      bg-white 
      shadow-lg
      ${interactive ? 'hover:shadow-2xl hover:scale-105' : ''}
    `,
    outlined: `
      bg-white 
      border border-gray-300
      ${interactive ? 'hover:border-blue-500 hover:shadow-md' : ''}
    `,
    gradient: `
      bg-gradient-to-br from-blue-50 to-indigo-50
      border border-blue-100
      ${interactive ? 'hover:from-blue-100 hover:to-indigo-100 hover:shadow-lg' : ''}
    `
  };

  const sizeClasses = {
    sm: 'p-4 sm:p-6',
    md: 'p-6 sm:p-8',
    lg: 'p-8 sm:p-10'
  };

  const focusClasses = interactive ? `
    focus:outline-none 
    focus:ring-4 
    focus:ring-blue-100 
    focus:border-blue-500
  ` : '';

  return (
    <div className={`
      ${baseClasses}
      ${variantClasses[variant]}
      ${sizeClasses[size]}
      ${focusClasses}
      ${className}
    `}>
      {children}
    </div>
  );
};

/**
 * 响应式模态背景
 * 实现需求 6.4: 模态对话框的背景遮罩效果
 */
export const ResponsiveModalBackdrop: React.FC<ResponsiveLayoutProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`
      fixed inset-0 
      bg-black bg-opacity-50 
      backdrop-blur-sm
      flex items-center justify-center 
      z-50
      p-4 sm:p-6 lg:p-8
      ${className}
    `}>
      <div className="
        w-full 
        max-w-4xl 
        max-h-[90vh] 
        overflow-y-auto
        scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent
      ">
        {children}
      </div>
    </div>
  );
};

/**
 * 响应式文本组件
 * 实现需求 6.5: 优化文本层次和字体大小
 */
interface ResponsiveTextProps {
  children: React.ReactNode;
  variant: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption' | 'small';
  className?: string;
  color?: 'primary' | 'secondary' | 'muted' | 'accent';
}

export const ResponsiveText: React.FC<ResponsiveTextProps> = ({ 
  children, 
  variant, 
  className = '',
  color = 'primary'
}) => {
  const variantClasses = {
    h1: 'text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight',
    h2: 'text-xl sm:text-2xl lg:text-3xl font-bold leading-tight',
    h3: 'text-lg sm:text-xl lg:text-2xl font-semibold leading-tight',
    h4: 'text-base sm:text-lg lg:text-xl font-semibold leading-tight',
    body: 'text-sm sm:text-base lg:text-lg leading-relaxed',
    caption: 'text-xs sm:text-sm leading-relaxed',
    small: 'text-xs leading-tight'
  };

  const colorClasses = {
    primary: 'text-gray-900',
    secondary: 'text-gray-700',
    muted: 'text-gray-600',
    accent: 'text-blue-700'
  };

  const Component = variant.startsWith('h') ? variant as keyof JSX.IntrinsicElements : 'p';

  return React.createElement(Component, {
    className: `${variantClasses[variant]} ${colorClasses[color]} ${className}`
  }, children);
};

/**
 * 响应式按钮组件
 * 实现需求 6.5: hover和focus状态的视觉反馈
 */
interface ResponsiveButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  icon?: string;
}

export const ResponsiveButton: React.FC<ResponsiveButtonProps> = ({ 
  children, 
  onClick,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  className = '',
  icon
}) => {
  const baseClasses = `
    inline-flex items-center justify-center
    font-medium rounded-lg
    transition-all duration-200
    focus:outline-none focus:ring-4
    disabled:opacity-50 disabled:cursor-not-allowed
    ${fullWidth ? 'w-full' : ''}
  `;

  const variantClasses = {
    primary: `
      bg-blue-600 text-white
      hover:bg-blue-700 focus:ring-blue-100
      disabled:hover:bg-blue-600
    `,
    secondary: `
      bg-gray-100 text-gray-700
      hover:bg-gray-200 focus:ring-gray-100
      disabled:hover:bg-gray-100
    `,
    tertiary: `
      bg-transparent text-gray-500
      hover:text-gray-700 hover:bg-gray-50 focus:ring-gray-100
      disabled:hover:bg-transparent disabled:hover:text-gray-500
    `,
    danger: `
      bg-red-100 text-red-700
      hover:bg-red-200 focus:ring-red-100
      disabled:hover:bg-red-100
    `
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {icon && (
        <span className="mr-2 text-lg">{icon}</span>
      )}
      {children}
    </button>
  );
};

/**
 * 响应式进度指示器
 */
interface ResponsiveProgressProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

export const ResponsiveProgress: React.FC<ResponsiveProgressProps> = ({ 
  steps, 
  currentStep, 
  className = '' 
}) => {
  return (
    <div className={`flex flex-col items-center mb-6 sm:mb-8 ${className}`}>
      {/* 步骤指示器 */}
      <div className="flex space-x-2 sm:space-x-4 mb-4">
        {steps.map((step, index) => (
          <div
            key={step}
            className={`
              w-6 h-6 sm:w-8 sm:h-8 
              rounded-full 
              flex items-center justify-center 
              text-xs sm:text-sm font-medium 
              transition-all duration-300 
              ${index < currentStep
                ? 'bg-green-600 text-white scale-110'
                : index === currentStep
                ? 'bg-blue-600 text-white shadow-lg scale-110'
                : 'bg-gray-200 text-gray-600'
              }
            `}
          >
            {index < currentStep ? (
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              index + 1
            )}
          </div>
        ))}
      </div>
      
      {/* 步骤标签（仅在较大屏幕显示） */}
      <div className="hidden sm:flex space-x-4 text-xs text-gray-500">
        {steps.map((step, index) => (
          <span 
            key={step}
            className={`
              ${index === currentStep ? 'text-blue-600 font-medium' : ''}
              ${index < currentStep ? 'text-green-600' : ''}
            `}
          >
            {step}
          </span>
        ))}
      </div>
    </div>
  );
};

/**
 * 响应式间距组件
 */
interface ResponsiveSpacingProps {
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const ResponsiveSpacing: React.FC<ResponsiveSpacingProps> = ({ 
  size, 
  className = '' 
}) => {
  const spacingClasses = {
    xs: 'h-2 sm:h-3',
    sm: 'h-4 sm:h-6',
    md: 'h-6 sm:h-8',
    lg: 'h-8 sm:h-12',
    xl: 'h-12 sm:h-16'
  };

  return <div className={`${spacingClasses[size]} ${className}`} />;
};

/**
 * 响应式工具函数
 */
export const useResponsiveBreakpoint = () => {
  const [breakpoint, setBreakpoint] = React.useState<'sm' | 'md' | 'lg' | 'xl'>('md');

  React.useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 640) setBreakpoint('sm');
      else if (width < 768) setBreakpoint('md');
      else if (width < 1024) setBreakpoint('lg');
      else setBreakpoint('xl');
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return breakpoint;
};

/**
 * 检测移动设备
 */
export const useIsMobile = () => {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};