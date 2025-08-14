'use client';

import React, { Component, ErrorInfo, ReactNode, useCallback } from 'react';

/**
 * 错误边界属性接口
 */
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetOnPropsChange?: boolean;
}

/**
 * 错误边界状态接口
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
}

/**
 * OnboardingErrorBoundary 组件
 * 
 * 专门用于引导系统的错误边界组件
 * 实现需求 8.1: 创建错误边界组件包装引导系统
 */
export class OnboardingErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private resetTimeoutId: number | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    };
  }

  /**
   * 捕获错误并更新状态
   */
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // 生成唯一的错误ID用于追踪
    const errorId = `onboarding-error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      hasError: true,
      error,
      errorId
    };
  }

  /**
   * 处理错误信息和日志记录
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 更新错误信息
    this.setState({
      errorInfo
    });

    // 记录错误到控制台
    console.error('Onboarding Error Boundary caught an error:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorId: this.state.errorId,
      timestamp: new Date().toISOString()
    });

    // 尝试记录错误到localStorage用于调试
    try {
      const errorRecord = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        errorId: this.state.errorId,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      };

      const existingErrors = JSON.parse(
        localStorage.getItem('grow-a-garden:onboarding:errors') || '[]'
      );
      
      existingErrors.push(errorRecord);
      
      // 只保留最近的10个错误记录
      if (existingErrors.length > 10) {
        existingErrors.splice(0, existingErrors.length - 10);
      }
      
      localStorage.setItem(
        'grow-a-garden:onboarding:errors', 
        JSON.stringify(existingErrors)
      );
    } catch (storageError) {
      console.warn('Failed to store error record:', storageError);
    }

    // 调用外部错误处理器
    if (this.props.onError) {
      try {
        this.props.onError(error, errorInfo);
      } catch (handlerError) {
        console.error('Error in onError handler:', handlerError);
      }
    }
  }

  /**
   * 检测props变化以重置错误状态
   */
  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (this.props.resetOnPropsChange && this.state.hasError) {
      // 如果children发生变化，重置错误状态
      if (prevProps.children !== this.props.children) {
        this.resetErrorBoundary();
      }
    }
  }

  /**
   * 组件卸载时清理定时器
   */
  componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
  }

  /**
   * 重置错误边界状态
   */
  resetErrorBoundary = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    });
  };

  /**
   * 自动重试机制
   */
  handleAutoRetry = () => {
    console.log('Attempting automatic retry...');
    this.resetErrorBoundary();
  };

  /**
   * 手动重试
   */
  handleManualRetry = () => {
    console.log('Manual retry requested by user');
    this.resetErrorBoundary();
  };

  /**
   * 跳过引导并继续
   */
  handleSkipOnboarding = () => {
    console.log('User chose to skip onboarding due to error');
    
    // 记录跳过事件
    try {
      const skipRecord = {
        reason: 'error',
        errorId: this.state.errorId,
        errorMessage: this.state.error?.message,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem(
        'grow-a-garden:onboarding:error-skip', 
        JSON.stringify(skipRecord)
      );
    } catch (error) {
      console.warn('Failed to record error skip:', error);
    }

    // 重新加载页面以跳过引导
    window.location.reload();
  };

  /**
   * 获取用户友好的错误消息
   */
  getUserFriendlyErrorMessage = (error: Error): string => {
    const message = error.message.toLowerCase();
    
    if (message.includes('network') || message.includes('fetch')) {
      return 'Network connection issue. Please check your internet connection.';
    }
    
    if (message.includes('storage') || message.includes('quota')) {
      return 'Storage issue detected. Your browser storage might be full.';
    }
    
    if (message.includes('permission')) {
      return 'Permission issue. Please refresh the page and try again.';
    }
    
    if (message.includes('timeout')) {
      return 'The operation took too long. Please try again.';
    }
    
    // 默认通用错误消息
    return 'Something went wrong with the onboarding process.';
  };

  /**
   * 获取错误恢复建议
   */
  getRecoveryActions = (): Array<{
    label: string;
    action: () => void;
    type: 'primary' | 'secondary' | 'danger';
    icon: string;
  }> => {
    const actions = [
      {
        label: 'Try Again',
        action: this.handleManualRetry,
        type: 'primary' as const,
        icon: '🔄'
      },
      {
        label: 'Skip Guide',
        action: this.handleSkipOnboarding,
        type: 'secondary' as const,
        icon: '⏭️'
      }
    ];

    // 根据错误类型添加特定的恢复选项
    const errorMessage = this.state.error?.message.toLowerCase() || '';
    
    if (errorMessage.includes('storage')) {
      actions.unshift({
        label: 'Clear Storage & Retry',
        action: () => {
          try {
            // 清除引导相关的存储
            const keysToRemove = [
              'grow-a-garden:onboarding:completed',
              'grow-a-garden:user:preferences',
              'grow-a-garden:onboarding:partial-state'
            ];
            
            keysToRemove.forEach(key => {
              localStorage.removeItem(key);
            });
            
            console.log('Storage cleared, retrying...');
            this.handleManualRetry();
          } catch (error) {
            console.error('Failed to clear storage:', error);
            this.handleManualRetry();
          }
        },
        type: 'secondary' as const,
        icon: '🗑️'
      });
    }

    return actions;
  };

  render() {
    if (this.state.hasError) {
      // 如果提供了自定义fallback，使用它
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 默认错误UI
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl">
            {/* 错误图标和标题 */}
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">😕</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Oops! Something went wrong
              </h2>
              <p className="text-gray-600">
                {this.getUserFriendlyErrorMessage(this.state.error!)}
              </p>
            </div>

            {/* 错误详情（开发模式） */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <details className="text-sm">
                  <summary className="font-medium text-gray-700 cursor-pointer mb-2">
                    Technical Details (Development)
                  </summary>
                  <div className="text-gray-600 space-y-2">
                    <div>
                      <strong>Error:</strong> {this.state.error.message}
                    </div>
                    <div>
                      <strong>Error ID:</strong> {this.state.errorId}
                    </div>
                    {this.state.error.stack && (
                      <div>
                        <strong>Stack:</strong>
                        <pre className="text-xs mt-1 overflow-x-auto">
                          {this.state.error.stack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              </div>
            )}

            {/* 恢复操作按钮 */}
            <div className="space-y-3">
              {this.getRecoveryActions().map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className={`w-full px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                    action.type === 'primary'
                      ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-100'
                      : action.type === 'secondary'
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-4 focus:ring-gray-100'
                      : 'bg-red-100 text-red-700 hover:bg-red-200 focus:ring-4 focus:ring-red-100'
                  }`}
                >
                  <span className="text-lg">{action.icon}</span>
                  <span>{action.label}</span>
                </button>
              ))}
            </div>

            {/* 帮助信息 */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                If this problem persists, try refreshing the page or clearing your browser cache.
                <br />
                Error ID: {this.state.errorId}
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * 高阶组件：为任何组件添加错误边界
 */
export const withOnboardingErrorBoundary = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  errorBoundaryProps?: Partial<ErrorBoundaryProps>
) => {
  const WithErrorBoundary = (props: P) => (
    <OnboardingErrorBoundary {...errorBoundaryProps}>
      <WrappedComponent {...props} />
    </OnboardingErrorBoundary>
  );

  WithErrorBoundary.displayName = `withOnboardingErrorBoundary(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return WithErrorBoundary;
};

/**
 * Hook：在函数组件中使用错误边界
 */
export const useOnboardingErrorHandler = () => {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const handleError = React.useCallback((error: Error) => {
    console.error('Onboarding error caught by hook:', error);
    setError(error);
  }, []);

  // 如果有错误，抛出它让错误边界捕获
  if (error) {
    throw error;
  }

  return { handleError, resetError };
};

export default OnboardingErrorBoundary;