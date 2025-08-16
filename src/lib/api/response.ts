import { NextResponse } from 'next/server';
import { AppError, ErrorType } from '@/lib/errors/types';
import { ErrorHandler } from '@/lib/errors/handler';

// 标准 API 响应格式
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    type: string;
    message: string;
    userMessage: string;
    recoverable: boolean;
    requestId: string;
  };
  metadata: {
    timestamp: string;
    version: string;
    requestId: string;
    processingTime?: number;
  };
}

export class ResponseBuilder {
  private static generateRequestId(): string {
    return `api_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  static success<T>(data: T, processingTime?: number): NextResponse<APIResponse<T>> {
    const requestId = this.generateRequestId();
    const response: APIResponse<T> = {
      success: true,
      data,
      metadata: {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        requestId,
        processingTime
      }
    };

    console.log(`✅ API Success [${requestId}]:`, {
      dataType: typeof data,
      processingTime: processingTime ? `${processingTime}ms` : 'N/A'
    });

    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Request-ID': requestId
      }
    });
  }

  static error(
    error: AppError | unknown,
    status: number = 500
  ): NextResponse<APIResponse<never>> {
    const requestId = this.generateRequestId();
    let appError: AppError;

    if (error instanceof Error || typeof error === 'object') {
      appError = ErrorHandler.handle(error, {
        component: 'API',
        operation: 'response'
      });
    } else {
      appError = ErrorHandler.createError(
        ErrorType.UNKNOWN_ERROR,
        'Unknown error occurred',
        error
      );
    }

    // 记录错误
    ErrorHandler.logError(appError);

    const response: APIResponse<never> = {
      success: false,
      error: {
        type: appError.type,
        message: appError.message,
        userMessage: appError.userMessage,
        recoverable: appError.recoverable,
        requestId
      },
      metadata: {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        requestId
      }
    };

    console.error(`❌ API Error [${requestId}]:`, {
      type: appError.type,
      message: appError.message,
      status
    });

    return NextResponse.json(response, {
      status,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Request-ID': requestId
      }
    });
  }

  static validation(message: string, details?: any): NextResponse<APIResponse<never>> {
    const error = ErrorHandler.createError(
      ErrorType.VALIDATION_ERROR,
      message,
      details
    );
    return this.error(error, 400);
  }

  static notFound(resource: string = 'Resource'): NextResponse<APIResponse<never>> {
    const error = ErrorHandler.createError(
      ErrorType.ROUTE_ERROR,
      `${resource} not found`,
      { resource }
    );
    return this.error(error, 404);
  }

  static timeout(operation: string = 'Operation'): NextResponse<APIResponse<never>> {
    const error = ErrorHandler.createError(
      ErrorType.API_ERROR,
      `${operation} timed out`,
      { operation, timeout: true }
    );
    return this.error(error, 408);
  }
}

// 请求验证工具
export class RequestValidator {
  static validateRequired(data: any, fields: string[]): string[] {
    const missing: string[] = [];
    for (const field of fields) {
      if (data[field] === undefined || data[field] === null || data[field] === '') {
        missing.push(field);
      }
    }
    return missing;
  }

  static validateTypes(data: any, schema: Record<string, string>): string[] {
    const errors: string[] = [];
    for (const [field, expectedType] of Object.entries(schema)) {
      const value = data[field];
      const actualType = typeof value;
      if (value !== undefined && actualType !== expectedType) {
        errors.push(`${field} should be ${expectedType}, got ${actualType}`);
      }
    }
    return errors;
  }

  static validateRange(value: number, min: number, max: number, fieldName: string): string | null {
    if (value < min || value > max) {
      return `${fieldName} must be between ${min} and ${max}`;
    }
    return null;
  }

  static validateEnum(value: any, allowedValues: any[], fieldName: string): string | null {
    if (!allowedValues.includes(value)) {
      return `${fieldName} must be one of: ${allowedValues.join(', ')}`;
    }
    return null;
  }
}

// API 性能监控
export class APIMonitor {
  private static startTime = new Map<string, number>();

  static startTimer(requestId: string): void {
    this.startTime.set(requestId, Date.now());
  }

  static endTimer(requestId: string): number {
    const start = this.startTime.get(requestId);
    if (!start) return 0;

    const duration = Date.now() - start;
    this.startTime.delete(requestId);

    // 记录性能指标
    console.log(`⏱️ API Performance [${requestId}]: ${duration}ms`);

    // 如果响应时间过长，记录警告
    if (duration > 5000) {
      console.warn(`🐌 Slow API response [${requestId}]: ${duration}ms`);
    }

    return duration;
  }
}