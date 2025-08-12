'use client';

// /src/app/components/ui/Toast.tsx
// Toast 通知组件，用于收藏操作反馈

import React, { useState, useEffect } from 'react';
import { X, Heart, Check, AlertCircle } from 'lucide-react';

/**
 * Toast 类型
 */
export type ToastType = 'success' | 'error' | 'info' | 'warning';

/**
 * Toast 数据接口
 */
export interface ToastData {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Toast 组件属性
 */
interface ToastProps {
  toast: ToastData;
  onClose: (id: string) => void;
}

/**
 * 单个 Toast 组件
 */
export function Toast({ toast, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // 进入动画
    const timer = setTimeout(() => setIsVisible(true), 10);
    
    // 自动关闭
    if (toast.duration && toast.duration > 0) {
      const autoCloseTimer = setTimeout(() => {
        handleClose();
      }, toast.duration);
      
      return () => {
        clearTimeout(timer);
        clearTimeout(autoCloseTimer);
      };
    }
    
    return () => clearTimeout(timer);
  }, [toast.duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose(toast.id);
    }, 300);
  };

  // 图标映射
  const icons = {
    success: <Check className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    info: <Heart className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />
  };

  // 样式映射
  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800'
  };

  const iconStyles = {
    success: 'text-green-500',
    error: 'text-red-500',
    info: 'text-blue-500',
    warning: 'text-yellow-500'
  };

  return (
    <div
      className={`
        relative flex items-start gap-3 p-4 rounded-lg border shadow-lg
        transition-all duration-300 ease-out
        ${styles[toast.type]}
        ${isVisible && !isLeaving 
          ? 'transform translate-x-0 opacity-100' 
          : 'transform translate-x-full opacity-0'
        }
      `}
    >
      {/* 图标 */}
      <div className={`flex-shrink-0 ${iconStyles[toast.type]}`}>
        {icons[toast.type]}
      </div>
      
      {/* 内容 */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium">{toast.title}</h4>
        {toast.message && (
          <p className="mt-1 text-sm opacity-90">{toast.message}</p>
        )}
        
        {/* 操作按钮 */}
        {toast.action && (
          <button
            type="button"
            className="mt-2 text-sm font-medium underline hover:no-underline"
            onClick={toast.action.onClick}
          >
            {toast.action.label}
          </button>
        )}
      </div>
      
      {/* 关闭按钮 */}
      <button
        type="button"
        className="flex-shrink-0 p-1 rounded-md hover:bg-black hover:bg-opacity-10 transition-colors"
        onClick={handleClose}
        aria-label="关闭通知"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

/**
 * Toast 容器组件
 */
interface ToastContainerProps {
  toasts: ToastData[];
  onClose: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

export function ToastContainer({ 
  toasts, 
  onClose, 
  position = 'top-right' 
}: ToastContainerProps) {
  const positionStyles = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
  };

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div
      className={`
        fixed z-50 flex flex-col gap-2 max-w-sm w-full
        ${positionStyles[position]}
      `}
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  );
}

/**
 * Toast Hook
 */
export function useToast() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = (toast: Omit<ToastData, 'id'>) => {
    const id = Date.now().toString();
    const newToast: ToastData = {
      id,
      duration: 4000, // 默认4秒
      ...toast
    };
    
    setToasts(prev => [...prev, newToast]);
    return id;
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const clearAllToasts = () => {
    setToasts([]);
  };

  // 便捷方法
  const success = (title: string, message?: string, options?: Partial<ToastData>) => {
    return addToast({ type: 'success', title, message, ...options });
  };

  const error = (title: string, message?: string, options?: Partial<ToastData>) => {
    return addToast({ type: 'error', title, message, ...options });
  };

  const info = (title: string, message?: string, options?: Partial<ToastData>) => {
    return addToast({ type: 'info', title, message, ...options });
  };

  const warning = (title: string, message?: string, options?: Partial<ToastData>) => {
    return addToast({ type: 'warning', title, message, ...options });
  };

  return {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    success,
    error,
    info,
    warning
  };
}

/**
 * 收藏专用 Toast Hook
 */
export function useFavoriteToast() {
  const { success, error, info } = useToast();

  const showAddedToFavorites = (itemName: string, itemType: 'crops' | 'pets' | 'reports') => {
    const typeText = itemType === 'crops' ? '作物' : itemType === 'pets' ? '宠物' : '策略报告';
    return success(
      '添加成功！',
      `${itemName} 已添加到${typeText}收藏`,
      {
        duration: 3000,
        action: {
          label: '查看收藏',
          onClick: () => {
            // 这里可以导航到收藏页面
            window.location.href = '/favorites';
          }
        }
      }
    );
  };

  const showRemovedFromFavorites = (itemName: string, itemType: 'crops' | 'pets' | 'reports') => {
    const typeText = itemType === 'crops' ? '作物' : itemType === 'pets' ? '宠物' : '策略报告';
    return info(
      '移除成功',
      `${itemName} 已从${typeText}收藏中移除`,
      { duration: 2000 }
    );
  };

  const showFavoriteError = (message: string = '操作失败，请重试') => {
    return error('收藏操作失败', message, { duration: 4000 });
  };

  return {
    showAddedToFavorites,
    showRemovedFromFavorites,
    showFavoriteError
  };
}