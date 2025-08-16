import { AppError, ErrorType, ErrorContext } from './types';

export class ErrorHandler {
  private static generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  static createError(
    type: ErrorType,
    message: string,
    details?: any,
    context?: ErrorContext
  ): AppError {
    const timestamp = new Date().toISOString();
    const requestId = this.generateRequestId();

    return {
      type,
      message,
      details,
      timestamp,
      recoverable: this.isRecoverable(type),
      userMessage: this.getUserMessage(type, message),
      debugInfo: {
        stack: details?.stack,
        context,
        requestId
      }
    };
  }

  static handle(error: unknown, context?: ErrorContext): AppError {
    console.error('🚨 Error occurred:', error, context);

    if (error instanceof Error) {
      // 网络错误
      if (error.message.includes('fetch') || error.message.includes('network')) {
        return this.createError(
          ErrorType.NETWORK_ERROR,
          'Network connection failed',
          error,
          context
        );
      }

      // API 错误
      if (error.message.includes('API') || error.message.includes('server')) {
        return this.createError(
          ErrorType.API_ERROR,
          'Server request failed',
          error,
          context
        );
      }

      // AI 错误
      if (error.message.includes('AI') || error.message.includes('Gemini')) {
        return this.createError(
          ErrorType.AI_ERROR,
          'AI service unavailable',
          error,
          context
        );
      }

      // 验证错误
      if (error.message.includes('validation') || error.message.includes('invalid')) {
        return this.createError(
          ErrorType.VALIDATION_ERROR,
          'Input validation failed',
          error,
          context
        );
      }

      // 数据错误
      if (error.message.includes('JSON') || error.message.includes('parse')) {
        return this.createError(
          ErrorType.DATA_ERROR,
          'Data processing failed',
          error,
          context
        );
      }

      // 路由错误
      if (error.message.includes('route') || error.message.includes('404')) {
        return this.createError(
          ErrorType.ROUTE_ERROR,
          'Page not found',
          error,
          context
        );
      }

      // 通用错误
      return this.createError(
        ErrorType.UNKNOWN_ERROR,
        error.message,
        error,
        context
      );
    }

    // 非 Error 对象
    return this.createError(
      ErrorType.UNKNOWN_ERROR,
      'An unexpected error occurred',
      error,
      context
    );
  }

  private static isRecoverable(type: ErrorType): boolean {
    switch (type) {
      case ErrorType.NETWORK_ERROR:
      case ErrorType.API_ERROR:
      case ErrorType.AI_ERROR:
        return true;
      case ErrorType.VALIDATION_ERROR:
      case ErrorType.DATA_ERROR:
        return true;
      case ErrorType.ROUTE_ERROR:
      case ErrorType.UNKNOWN_ERROR:
        return false;
      default:
        return false;
    }
  }

  private static getUserMessage(type: ErrorType, originalMessage: string): string {
    switch (type) {
      case ErrorType.NETWORK_ERROR:
        return 'Connection failed. Please check your internet connection and try again.';
      case ErrorType.API_ERROR:
        return 'Server is temporarily unavailable. Please try again in a moment.';
      case ErrorType.AI_ERROR:
        return 'AI service is currently unavailable. Using alternative recommendations.';
      case ErrorType.VALIDATION_ERROR:
        return 'Please check your input and try again.';
      case ErrorType.DATA_ERROR:
        return 'Data processing failed. Please refresh the page and try again.';
      case ErrorType.ROUTE_ERROR:
        return 'The requested page could not be found.';
      case ErrorType.UNKNOWN_ERROR:
        return 'Something went wrong. Please try again or contact support if the problem persists.';
      default:
        return originalMessage;
    }
  }

  static logError(error: AppError): void {
    const logData = {
      timestamp: error.timestamp,
      type: error.type,
      message: error.message,
      recoverable: error.recoverable,
      requestId: error.debugInfo?.requestId,
      context: error.debugInfo?.context
    };

    // 在生产环境中，这里应该发送到日志服务
    console.error('📊 Error logged:', logData);

    // 如果是严重错误，可以发送到监控服务
    if (!error.recoverable) {
      console.error('🚨 Critical error detected:', logData);
    }
  }

  static getRecoveryActions(error: AppError): Array<{
    label: string;
    action: string;
    primary?: boolean;
  }> {
    switch (error.type) {
      case ErrorType.NETWORK_ERROR:
        return [
          { label: 'Retry', action: 'retry', primary: true },
          { label: 'Check Connection', action: 'check_connection' }
        ];
      case ErrorType.API_ERROR:
        return [
          { label: 'Try Again', action: 'retry', primary: true },
          { label: 'Refresh Page', action: 'refresh' }
        ];
      case ErrorType.AI_ERROR:
        return [
          { label: 'Use Basic Mode', action: 'fallback', primary: true },
          { label: 'Try Again', action: 'retry' }
        ];
      case ErrorType.VALIDATION_ERROR:
        return [
          { label: 'Fix Input', action: 'fix_input', primary: true }
        ];
      case ErrorType.DATA_ERROR:
        return [
          { label: 'Refresh Page', action: 'refresh', primary: true },
          { label: 'Clear Cache', action: 'clear_cache' }
        ];
      case ErrorType.ROUTE_ERROR:
        return [
          { label: 'Go Home', action: 'go_home', primary: true },
          { label: 'Go Back', action: 'go_back' }
        ];
      default:
        return [
          { label: 'Try Again', action: 'retry', primary: true },
          { label: 'Refresh Page', action: 'refresh' }
        ];
    }
  }
}