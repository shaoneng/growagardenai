import { useState, useCallback } from 'react';
import { AppError } from '@/lib/errors/types';
import { ErrorHandler } from '@/lib/errors/handler';
import { APIResponse } from '@/lib/api/response';

interface UseAPICallOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: AppError) => void;
  retryAttempts?: number;
  retryDelay?: number;
}

export function useAPICall<T>(endpoint: string, options: UseAPICallOptions = {}) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<AppError | null>(null);
  const [loading, setLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const { onSuccess, onError, retryAttempts = 2, retryDelay = 1000 } = options;

  const call = useCallback(async (payload: any, attempt = 0): Promise<T | null> => {
    setLoading(true);
    setError(null);

    try {
      console.log(`🚀 API Call [${endpoint}] - Attempt ${attempt + 1}`);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      // 检查响应状态
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result: APIResponse<T> = await response.json();

      // 检查API响应格式
      if (!result.success) {
        const apiError = ErrorHandler.createError(
          result.error?.type as any || 'API_ERROR',
          result.error?.message || 'API request failed',
          result.error
        );
        throw apiError;
      }

      // 成功处理
      const responseData = result.data as T;
      setData(responseData);
      setRetryCount(0);

      if (onSuccess) {
        onSuccess(responseData);
      }

      console.log(`✅ API Call [${endpoint}] - Success`);
      return responseData;

    } catch (err) {
      console.error(`❌ API Call [${endpoint}] - Error:`, err);

      const appError = ErrorHandler.handle(err, {
        component: 'useAPICall',
        operation: 'fetch',
        url: endpoint
      });

      // 重试逻辑
      if (appError.recoverable && attempt < retryAttempts) {
        console.log(`🔄 Retrying in ${retryDelay}ms... (${attempt + 1}/${retryAttempts})`);
        
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        setRetryCount(attempt + 1);
        return call(payload, attempt + 1);
      }

      // 最终错误处理
      setError(appError);
      ErrorHandler.logError(appError);

      if (onError) {
        onError(appError);
      }

      return null;
    } finally {
      setLoading(false);
    }
  }, [endpoint, onSuccess, onError, retryAttempts, retryDelay]);

  const retry = useCallback(() => {
    if (error && error.recoverable) {
      setError(null);
      // 注意：这里需要保存最后的payload来重试
      // 在实际使用中，可能需要更复杂的状态管理
      console.log('🔄 Manual retry requested');
    }
  }, [error]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
    setRetryCount(0);
  }, []);

  return {
    data,
    error,
    loading,
    retryCount,
    call,
    retry,
    reset
  };
}

// 专门用于分析API的Hook
export function useAnalysisAPI() {
  return useAPICall('/api/analyze', {
    onSuccess: (data) => {
      console.log('📊 Analysis completed successfully:', data.mainTitle);
    },
    onError: (error) => {
      console.error('📊 Analysis failed:', error.userMessage);
    },
    retryAttempts: 2,
    retryDelay: 1500
  });
}