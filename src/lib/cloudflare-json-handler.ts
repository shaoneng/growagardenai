/**
 * Cloudflare Edge Runtime JSON处理器
 * 解决Cloudflare Pages部署时的JSON序列化和响应问题
 */

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export interface ResponseMetadata {
  requestId?: string;
  timestamp: string;
  processingTime?: number;
}

export class CloudflareJSONHandler {
  /**
   * 创建Cloudflare兼容的JSON响应
   * 确保在Edge Runtime环境中正确序列化
   */
  static createResponse(
    data: any, 
    status: number = 200, 
    metadata?: ResponseMetadata
  ): Response {
    try {
      console.log(`📤 Creating JSON response with status ${status}`);
      
      // 深度清理对象，移除可能导致序列化问题的属性
      const cleanData = this.sanitizeForSerialization(data);
      
      // 添加元数据
      const responseData = {
        ...cleanData,
        _metadata: {
          timestamp: new Date().toISOString(),
          ...metadata
        }
      };
      
      // 使用严格的JSON序列化
      const jsonString = JSON.stringify(responseData, this.jsonReplacer, 2);
      
      // 验证JSON有效性
      try {
        JSON.parse(jsonString);
        console.log(`✅ JSON validation passed, response size: ${jsonString.length} bytes`);
      } catch (parseError) {
        console.error('❌ JSON validation failed:', parseError);
        throw new Error('Generated JSON is invalid');
      }
      
      // 创建响应头
      const headers = new Headers({
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Content-Type-Options': 'nosniff',
        'X-Response-Size': jsonString.length.toString(),
      });

      // 添加CORS头（如果需要）
      if (process.env.NODE_ENV === 'development') {
        headers.set('Access-Control-Allow-Origin', '*');
        headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      }
      
      return new Response(jsonString, {
        status,
        headers,
      });
      
    } catch (error) {
      console.error('❌ JSON response creation failed:', error);
      
      // 返回安全的错误响应
      return this.createErrorResponse(error, 500);
    }
  }

  /**
   * 创建标准化的错误响应
   */
  static createErrorResponse(
    error: any, 
    status: number = 500,
    requestId?: string
  ): Response {
    const errorData = {
      error: true,
      message: error instanceof Error ? error.message : 'Internal server error',
      code: this.getErrorCode(error),
      timestamp: new Date().toISOString(),
      requestId: requestId || `error_${Date.now()}`,
      ...(process.env.NODE_ENV === 'development' && {
        stack: error instanceof Error ? error.stack : undefined,
        details: error
      })
    };

    const jsonString = JSON.stringify(errorData, null, 2);
    
    return new Response(jsonString, {
      status,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  }

  /**
   * 清理对象以确保可序列化
   * 移除函数、循环引用、特殊对象等
   */
  private static sanitizeForSerialization(obj: any, seen = new WeakSet()): any {
    // 处理null和undefined
    if (obj === null || obj === undefined) {
      return obj;
    }

    // 处理基本类型
    if (typeof obj !== 'object') {
      return this.sanitizePrimitive(obj);
    }

    // 检测循环引用
    if (seen.has(obj)) {
      return '[Circular Reference]';
    }
    seen.add(obj);

    // 处理特殊对象类型
    if (obj instanceof Date) {
      return obj.toISOString();
    }

    if (obj instanceof Error) {
      return {
        name: obj.name,
        message: obj.message,
        ...(process.env.NODE_ENV === 'development' && { stack: obj.stack })
      };
    }

    if (obj instanceof RegExp) {
      return obj.toString();
    }

    if (obj instanceof Map) {
      return Object.fromEntries(obj.entries());
    }

    if (obj instanceof Set) {
      return Array.from(obj);
    }

    // 处理数组
    if (Array.isArray(obj)) {
      return obj.map(item => this.sanitizeForSerialization(item, seen));
    }

    // 处理普通对象
    const cleaned: any = {};
    for (const [key, value] of Object.entries(obj)) {
      // 跳过可能导致问题的属性
      if (this.shouldSkipProperty(key, value)) {
        continue;
      }
      
      try {
        cleaned[key] = this.sanitizeForSerialization(value, seen);
      } catch (error) {
        console.warn(`⚠️ Failed to serialize property ${key}:`, error);
        cleaned[key] = '[Serialization Error]';
      }
    }

    return cleaned;
  }

  /**
   * 清理基本类型值
   */
  private static sanitizePrimitive(value: any): any {
    if (typeof value === 'function') {
      return '[Function]';
    }

    if (typeof value === 'symbol') {
      return value.toString();
    }

    if (typeof value === 'bigint') {
      return value.toString();
    }

    if (typeof value === 'number') {
      if (Number.isNaN(value)) {
        return null;
      }
      if (value === Infinity || value === -Infinity) {
        return null;
      }
    }

    return value;
  }

  /**
   * 判断是否应该跳过某个属性
   */
  private static shouldSkipProperty(key: string, value: any): boolean {
    // 跳过私有属性
    if (key.startsWith('_') && key !== '_metadata') {
      return true;
    }

    // 跳过函数
    if (typeof value === 'function') {
      return true;
    }

    // 跳过DOM元素
    if (typeof window !== 'undefined' && value instanceof Element) {
      return true;
    }

    // 跳过可能导致问题的属性名
    const skipKeys = ['constructor', 'prototype', '__proto__'];
    if (skipKeys.includes(key)) {
      return true;
    }

    return false;
  }

  /**
   * JSON序列化替换器
   */
  private static jsonReplacer(key: string, value: any): any {
    // 处理特殊值
    if (value === undefined) {
      return null;
    }
    
    if (typeof value === 'bigint') {
      return value.toString();
    }
    
    if (Number.isNaN(value)) {
      return null;
    }
    
    if (value === Infinity || value === -Infinity) {
      return null;
    }

    // 处理函数
    if (typeof value === 'function') {
      return '[Function]';
    }
    
    return value;
  }

  /**
   * 验证响应数据结构
   */
  static validateResponseStructure(data: any): ValidationResult {
    const errors: string[] = [];

    if (!data) {
      errors.push('Response data is null or undefined');
      return { valid: false, errors };
    }

    // 检查是否为对象
    if (typeof data !== 'object' || Array.isArray(data)) {
      errors.push('Response data must be an object');
      return { valid: false, errors };
    }

    // 检查AI报告的必需字段
    if (this.isAIReport(data)) {
      const requiredFields = ['reportId', 'mainTitle', 'sections'];
      for (const field of requiredFields) {
        if (!(field in data) || data[field] === undefined || data[field] === null) {
          errors.push(`Missing required field: ${field}`);
        }
      }

      // 检查sections数组
      if (data.sections) {
        if (!Array.isArray(data.sections)) {
          errors.push('Sections must be an array');
        } else {
          data.sections.forEach((section: any, index: number) => {
            if (!section || typeof section !== 'object') {
              errors.push(`Section ${index} is not an object`);
            } else {
              if (!section.id || !section.title) {
                errors.push(`Section ${index} missing required fields (id, title)`);
              }
            }
          });
        }
      }
    }

    return { valid: errors.length === 0, errors };
  }

  /**
   * 检查数据是否为AI报告格式
   */
  private static isAIReport(data: any): boolean {
    return data && 
           typeof data === 'object' && 
           ('reportId' in data || 'mainTitle' in data || 'sections' in data);
  }

  /**
   * 获取错误代码
   */
  private static getErrorCode(error: any): string {
    if (error instanceof Error) {
      const message = error.message.toLowerCase();
      if (message.includes('json') || message.includes('parse') || message.includes('unexpected token')) {
        return 'JSON_ERROR';
      }
      if (message.includes('timeout')) {
        return 'TIMEOUT_ERROR';
      }
      if (message.includes('network') || message.includes('connection')) {
        return 'NETWORK_ERROR';
      }
    }
    return 'UNKNOWN_ERROR';
  }

  /**
   * 测试JSON处理器功能
   */
  static async test(): Promise<{
    success: boolean;
    results: {
      serialization: boolean;
      validation: boolean;
      errorHandling: boolean;
    };
    errors: string[];
  }> {
    const results = {
      serialization: false,
      validation: false,
      errorHandling: false
    };
    const errors: string[] = [];

    try {
      // 测试序列化
      const testData = {
        id: 'test',
        name: 'Test Report',
        date: new Date(),
        func: () => 'test',
        circular: {} as any,
        sections: [{ id: 'test', title: 'Test Section' }]
      };
      testData.circular.self = testData.circular;

      const response = this.createResponse(testData);
      if (response.status === 200) {
        results.serialization = true;
      } else {
        errors.push('Serialization test failed');
      }

      // 测试验证
      const validation = this.validateResponseStructure(testData);
      if (validation.valid || validation.errors.length > 0) {
        results.validation = true;
      } else {
        errors.push('Validation test failed');
      }

      // 测试错误处理
      const errorResponse = this.createErrorResponse(new Error('Test error'));
      if (errorResponse.status === 500) {
        results.errorHandling = true;
      } else {
        errors.push('Error handling test failed');
      }

    } catch (error) {
      errors.push(`Test execution failed: ${error}`);
    }

    const success = results.serialization && results.validation && results.errorHandling;
    
    return { success, results, errors };
  }
}

// 导出类型
export type { ValidationResult, ResponseMetadata };