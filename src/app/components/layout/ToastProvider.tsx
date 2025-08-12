'use client';

// /src/app/components/layout/ToastProvider.tsx
// Toast 通知提供者组件

import React, { createContext, useContext, ReactNode } from 'react';
import { useToast, ToastContainer } from '../ui/Toast';

/**
 * Toast 上下文类型
 */
interface ToastContextType {
  success: (title: string, message?: string, options?: any) => string;
  error: (title: string, message?: string, options?: any) => string;
  info: (title: string, message?: string, options?: any) => string;
  warning: (title: string, message?: string, options?: any) => string;
  addToast: (toast: any) => string;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
}

/**
 * Toast 上下文
 */
const ToastContext = createContext<ToastContextType | undefined>(undefined);

/**
 * Toast Provider 组件
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const toastMethods = useToast();

  return (
    <ToastContext.Provider value={toastMethods}>
      {children}
      <ToastContainer 
        toasts={toastMethods.toasts} 
        onClose={toastMethods.removeToast}
        position="top-right"
      />
    </ToastContext.Provider>
  );
}

/**
 * 使用 Toast 的 Hook
 */
export function useToastContext(): ToastContextType {
  const context = useContext(ToastContext);
  
  if (context === undefined) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  
  return context;
}