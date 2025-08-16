// 统一错误类型定义
export enum ErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  API_ERROR = 'API_ERROR',
  AI_ERROR = 'AI_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  DATA_ERROR = 'DATA_ERROR',
  ROUTE_ERROR = 'ROUTE_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export interface AppError {
  type: ErrorType;
  message: string;
  details?: any;
  timestamp: string;
  recoverable: boolean;
  userMessage: string;
  debugInfo?: {
    stack?: string;
    context?: any;
    requestId?: string;
  };
}

export interface ErrorRecoveryAction {
  label: string;
  action: () => void | Promise<void>;
  primary?: boolean;
}

export interface ErrorContext {
  component?: string;
  operation?: string;
  userId?: string;
  sessionId?: string;
  userAgent?: string;
  url?: string;
}