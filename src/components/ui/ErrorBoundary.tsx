'use client';

import React, { Component, ReactNode } from 'react';
import { AppError, ErrorType } from '@/lib/errors/types';
import { ErrorHandler } from '@/lib/errors/handler';

interface Props {
  children: ReactNode;
  fallback?: (error: AppError) => ReactNode;
  onError?: (error: AppError) => void;
}

interface State {
  hasError: boolean;
  error: AppError | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    const appError = ErrorHandler.handle(error, {
      component: 'ErrorBoundary',
      operation: 'render'
    });

    return {
      hasError: true,
      error: appError
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const appError = ErrorHandler.handle(error, {
      component: 'ErrorBoundary',
      operation: 'componentDidCatch',
      context: errorInfo
    });

    ErrorHandler.logError(appError);

    if (this.props.onError) {
      this.props.onError(appError);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  handleRefresh = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error);
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <svg
                  className="h-8 w-8 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">
                  Oops! Something went wrong
                </h3>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600">
                {this.state.error.userMessage}
              </p>
              {process.env.NODE_ENV === 'development' && (
                <details className="mt-2">
                  <summary className="text-xs text-gray-500 cursor-pointer">
                    Debug Info
                  </summary>
                  <pre className="text-xs text-gray-400 mt-1 overflow-auto">
                    {JSON.stringify(this.state.error, null, 2)}
                  </pre>
                </details>
              )}
            </div>

            <div className="flex space-x-3">
              {this.state.error.recoverable && (
                <button
                  onClick={this.handleRetry}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Try Again
                </button>
              )}
              <button
                onClick={this.handleRefresh}
                className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Refresh Page
              </button>
              <button
                onClick={this.handleGoHome}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Go Home
              </button>
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                Error ID: {this.state.error.debugInfo?.requestId}
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// 便捷的 Hook 版本
export function useErrorHandler() {
  const handleError = (error: unknown, context?: any) => {
    const appError = ErrorHandler.handle(error, context);
    ErrorHandler.logError(appError);
    return appError;
  };

  return { handleError };
}