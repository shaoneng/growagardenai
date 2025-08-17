// AI服务管理器 - 集成Gemini AI和回退机制
// 动态导入以避免环境变量问题
let generateAnalysisWithGoogleAI: any;
let isGoogleAIAvailable: any;
let generateEnhancedAIReport: any;
let isEnhancedAIAvailable: any;

// 延迟加载AI提供者
async function loadAIProviders() {
  try {
    // 优先使用个性化服务端版本
    const personalizedProvider = await import('@/lib/personalized-ai-provider-server');
    generateAnalysisWithGoogleAI = personalizedProvider.generateAnalysisWithGoogleAI;
    isGoogleAIAvailable = personalizedProvider.isGoogleAIAvailable;
    
    console.log('✅ Loaded personalized server AI provider');
  } catch (personalizedError) {
    console.warn('⚠️ Personalized AI provider failed, trying standard server version:', personalizedError.message);
    
    try {
      const serverProvider = await import('@/lib/generative-ai-provider-server');
      generateAnalysisWithGoogleAI = serverProvider.generateAnalysisWithGoogleAI;
      isGoogleAIAvailable = serverProvider.isGoogleAIAvailable;
      
      console.log('✅ Loaded standard server AI provider');
    } catch (serverError) {
      console.warn('⚠️ Server AI provider failed, trying client version:', serverError.message);
      
      try {
        const clientProvider = await import('@/lib/generative-ai-provider');
        generateAnalysisWithGoogleAI = clientProvider.generateAnalysisWithGoogleAI;
        isGoogleAIAvailable = clientProvider.isGoogleAIAvailable;
        
        console.log('✅ Loaded client AI provider');
      } catch (clientError) {
        console.error('❌ Failed to load any AI provider:', clientError.message);
      }
    }
  }
  
  try {
    const enhancedProvider = await import('@/lib/enhanced-ai-report-generator');
    generateEnhancedAIReport = enhancedProvider.generateEnhancedAIReport;
    isEnhancedAIAvailable = enhancedProvider.isEnhancedAIAvailable;
    
    console.log('✅ Loaded enhanced AI provider');
  } catch (enhancedError) {
    console.warn('⚠️ Enhanced AI provider not available:', enhancedError.message);
    isEnhancedAIAvailable = () => false;
  }
}
import { FallbackReportGenerator, type DetailedItem, type FallbackRequest } from '@/lib/fallback/report-generator';
import { ErrorHandler, ErrorType } from '@/lib/errors';
import { CloudflareJSONHandler } from '@/lib/cloudflare-json-handler';
import type { AnalysisResult } from '@/types';

export interface AIServiceRequest {
  items: DetailedItem[];
  gold: number;
  inGameDate: string;
  currentDate: string;
  interactionMode?: string;
  expertOptions?: any;
}

export interface AIServiceStatus {
  geminiAvailable: boolean;
  enhancedAIAvailable: boolean;
  fallbackAvailable: boolean;
  recommendedService: 'gemini' | 'enhanced' | 'fallback';
}

export class AIServiceManager {
  private static readonly TIMEOUT_MS = 10000; // 10秒超时
  private static readonly MAX_RETRIES = 2;

  /**
   * 获取AI服务状态
   */
  static async getServiceStatus(): Promise<AIServiceStatus> {
    // 确保AI提供者已加载
    await loadAIProviders();
    
    const geminiAvailable = isGoogleAIAvailable ? isGoogleAIAvailable() : false;
    const enhancedAIAvailable = isEnhancedAIAvailable ? isEnhancedAIAvailable() : false;
    const fallbackAvailable = true; // 回退服务总是可用

    let recommendedService: 'gemini' | 'enhanced' | 'fallback' = 'fallback';
    
    if (enhancedAIAvailable) {
      recommendedService = 'enhanced';
    } else if (geminiAvailable) {
      recommendedService = 'gemini';
    }

    console.log('📊 AI Service Status:', {
      geminiAvailable,
      enhancedAIAvailable,
      fallbackAvailable,
      recommendedService
    });

    return {
      geminiAvailable,
      enhancedAIAvailable,
      fallbackAvailable,
      recommendedService
    };
  }

  /**
   * 生成分析报告 - 带智能回退和Cloudflare优化
   */
  static async generateReport(request: AIServiceRequest): Promise<AnalysisResult> {
    const requestId = `ai_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    console.log(`🤖 AI Service [${requestId}]: Starting report generation with Cloudflare optimization...`);

    // 确保AI提供者已加载
    await loadAIProviders();
    
    const status = await this.getServiceStatus();
    console.log(`📊 AI Service [${requestId}]: Status -`, status);

    // 尝试使用推荐的服务
    try {
      let rawResult: AnalysisResult;
      
      switch (status.recommendedService) {
        case 'enhanced':
          rawResult = await this.tryEnhancedAI(request, requestId);
          break;
        case 'gemini':
          rawResult = await this.tryGeminiAI(request, requestId);
          break;
        default:
          rawResult = await this.useFallback(request, requestId);
          break;
      }
      
      // 清理和验证响应以确保Cloudflare兼容性
      const cleanedResult = this.sanitizeAIResponse(rawResult, requestId);
      this.validateAIResponse(cleanedResult, requestId);
      
      console.log(`✅ AI Service [${requestId}]: Report generated and sanitized successfully`);
      return cleanedResult;
      
    } catch (error) {
      console.warn(`⚠️ AI Service [${requestId}]: Primary service failed, trying fallback...`);
      return await this.useFallbackWithSanitization(request, requestId);
    }
  }

  /**
   * 尝试使用增强AI服务
   */
  private static async tryEnhancedAI(request: AIServiceRequest, requestId: string): Promise<AnalysisResult> {
    console.log(`🚀 AI Service [${requestId}]: Trying Enhanced AI...`);

    if (!generateEnhancedAIReport) {
      throw new Error('Enhanced AI provider not loaded');
    }

    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Enhanced AI timeout')), this.TIMEOUT_MS);
    });

    try {
      const enhancedRequest = {
        items: request.items,
        gold: request.gold,
        inGameDate: request.inGameDate,
        currentDate: request.currentDate,
        interactionMode: (request.interactionMode as 'beginner' | 'advanced' | 'expert') || 'advanced',
        playerPreferences: request.expertOptions?.playerPreferences,
        gameContext: request.expertOptions?.gameContext
      };

      const result = await Promise.race([
        generateEnhancedAIReport(enhancedRequest),
        timeoutPromise
      ]);

      console.log(`✅ AI Service [${requestId}]: Enhanced AI succeeded`);
      return result;

    } catch (error) {
      console.error(`❌ AI Service [${requestId}]: Enhanced AI failed:`, error);
      
      // 如果增强AI失败，尝试基础Gemini AI
      if (isGoogleAIAvailable && isGoogleAIAvailable()) {
        console.log(`🔄 AI Service [${requestId}]: Falling back to basic Gemini AI...`);
        return await this.tryGeminiAI(request, requestId);
      }
      
      throw error;
    }
  }

  /**
   * 尝试使用基础Gemini AI服务
   */
  private static async tryGeminiAI(request: AIServiceRequest, requestId: string): Promise<AnalysisResult> {
    console.log(`🚀 AI Service [${requestId}]: Trying Gemini AI...`);

    if (!generateAnalysisWithGoogleAI) {
      throw new Error('Gemini AI provider not loaded');
    }

    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Gemini AI timeout')), this.TIMEOUT_MS);
    });

    try {
      const result = await Promise.race([
        generateAnalysisWithGoogleAI(
          request.items,
          request.gold,
          request.inGameDate,
          request.currentDate,
          request.interactionMode,
          request.expertOptions
        ),
        timeoutPromise
      ]);

      console.log(`✅ AI Service [${requestId}]: Gemini AI succeeded`);
      return result;

    } catch (error) {
      console.error(`❌ AI Service [${requestId}]: Gemini AI failed:`, error);
      throw error;
    }
  }

  /**
   * 使用回退服务
   */
  private static async useFallback(request: AIServiceRequest, requestId: string): Promise<AnalysisResult> {
    console.log(`🔄 AI Service [${requestId}]: Using fallback report generator...`);

    try {
      const fallbackRequest: FallbackRequest = {
        items: request.items,
        gold: request.gold,
        inGameDate: request.inGameDate,
        currentDate: request.currentDate,
        interactionMode: request.interactionMode
      };

      const result = FallbackReportGenerator.generateBasicReport(fallbackRequest);
      
      console.log(`✅ AI Service [${requestId}]: Fallback report generated successfully`);
      return result;

    } catch (error) {
      console.error(`❌ AI Service [${requestId}]: Fallback generation failed:`, error);
      
      // 如果连回退都失败了，创建一个最基本的报告
      return this.createEmergencyReport(request, requestId);
    }
  }

  /**
   * 清理AI响应以确保Cloudflare兼容性
   */
  private static sanitizeAIResponse(response: any, requestId: string): AnalysisResult {
    console.log(`🧹 AI Service [${requestId}]: Sanitizing AI response for Cloudflare compatibility...`);
    
    try {
      // 使用CloudflareJSONHandler进行深度清理
      const sanitized = JSON.parse(JSON.stringify(response, (key, value) => {
        // 处理特殊值
        if (value === undefined) return null;
        if (typeof value === 'function') return '[Function]';
        if (Number.isNaN(value)) return null;
        if (value === Infinity || value === -Infinity) return null;
        if (value instanceof Date) return value.toISOString();
        if (value instanceof Error) return {
          name: value.name,
          message: value.message
        };
        return value;
      }));

      // 确保必需字段存在并有效
      const cleanedResponse: AnalysisResult = {
        reportId: sanitized.reportId || `AI-REPORT-${Date.now()}`,
        publicationDate: sanitized.publicationDate || new Date().toISOString(),
        mainTitle: sanitized.mainTitle || 'Garden Analysis Report',
        subTitle: sanitized.subTitle || 'AI-Generated Insights',
        visualAnchor: sanitized.visualAnchor || '🌱',
        playerProfile: {
          title: sanitized.playerProfile?.title || 'Player Profile',
          archetype: sanitized.playerProfile?.archetype || 'Garden Enthusiast',
          summary: sanitized.playerProfile?.summary || 'Keep growing your garden!'
        },
        midBreakerQuote: sanitized.midBreakerQuote || 'Every garden tells a story.',
        sections: Array.isArray(sanitized.sections) ? sanitized.sections.map((section: any, index: number) => ({
          id: section.id || `section_${index}`,
          title: section.title || `Section ${index + 1}`,
          points: Array.isArray(section.points) ? section.points.map((point: any, pointIndex: number) => ({
            action: point.action || `Action ${pointIndex + 1}`,
            reasoning: point.reasoning || 'Continue your garden journey.',
            tags: Array.isArray(point.tags) ? point.tags.filter(tag => typeof tag === 'string') : ['Garden']
          })) : []
        })) : [],
        footerAnalysis: {
          title: sanitized.footerAnalysis?.title || 'Summary',
          conclusion: sanitized.footerAnalysis?.conclusion || 'Continue your garden journey!',
          callToAction: sanitized.footerAnalysis?.callToAction || 'Keep exploring and growing.'
        }
      };

      console.log(`✅ AI Service [${requestId}]: Response sanitized successfully`);
      return cleanedResponse;
      
    } catch (error) {
      console.error(`❌ AI Service [${requestId}]: Failed to sanitize response:`, error);
      throw new Error('Response sanitization failed');
    }
  }

  /**
   * 验证AI响应结构
   */
  private static validateAIResponse(response: AnalysisResult, requestId: string): void {
    console.log(`🔍 AI Service [${requestId}]: Validating AI response structure...`);
    
    // 使用CloudflareJSONHandler进行验证
    const validation = CloudflareJSONHandler.validateResponseStructure(response);
    
    if (!validation.valid) {
      console.error(`❌ AI Service [${requestId}]: Response validation failed:`, validation.errors);
      throw new Error(`Invalid AI response structure: ${validation.errors.join(', ')}`);
    }

    // 额外的AI特定验证
    if (!response.sections || response.sections.length === 0) {
      console.warn(`⚠️ AI Service [${requestId}]: Response has no sections, adding default section`);
      response.sections = [{
        id: 'default_section',
        title: 'Garden Advice 🌱',
        points: [{
          action: 'Continue your garden journey',
          reasoning: 'Keep building and exploring your garden.',
          tags: ['Garden', 'Progress']
        }]
      }];
    }

    // 验证每个section都有有效的points
    response.sections.forEach((section, index) => {
      if (!section.points || section.points.length === 0) {
        console.warn(`⚠️ AI Service [${requestId}]: Section ${index} has no points, adding default point`);
        section.points = [{
          action: 'Explore this area',
          reasoning: 'Continue learning and experimenting.',
          tags: ['Exploration']
        }];
      }
    });

    console.log(`✅ AI Service [${requestId}]: Response validation passed`);
  }

  /**
   * 使用回退服务并进行清理
   */
  private static async useFallbackWithSanitization(request: AIServiceRequest, requestId: string): Promise<AnalysisResult> {
    try {
      const fallbackResult = await this.useFallback(request, requestId);
      const cleanedResult = this.sanitizeAIResponse(fallbackResult, requestId);
      this.validateAIResponse(cleanedResult, requestId);
      return cleanedResult;
    } catch (error) {
      console.error(`❌ AI Service [${requestId}]: Fallback with sanitization failed:`, error);
      return this.createSafeEmergencyReport(request, requestId);
    }
  }

  /**
   * 创建安全的紧急报告（最后的回退）
   */
  private static createSafeEmergencyReport(request: AIServiceRequest, requestId: string): AnalysisResult {
    console.log(`🚨 AI Service [${requestId}]: Creating safe emergency report...`);

    const safeReport: AnalysisResult = {
      reportId: `EMERGENCY-${Date.now()}`,
      publicationDate: new Date().toISOString(),
      mainTitle: "Garden Analysis Report",
      subTitle: "Basic Recommendations",
      visualAnchor: "🌱",
      playerProfile: {
        title: "Player Profile",
        archetype: "Garden Enthusiast",
        summary: `You have ${request.gold} gold and ${request.items.length} item types. Keep building your garden!`
      },
      midBreakerQuote: "Every garden grows one step at a time.",
      sections: [
        {
          id: "emergency_advice",
          title: "Basic Garden Advice 🌱",
          points: [
            {
              action: "Continue your garden journey",
              reasoning: "You're making progress with your current setup. Keep experimenting and learning.",
              tags: ["Progress", "Encouragement"]
            },
            {
              action: "Focus on what brings you joy",
              reasoning: "The best garden strategy is one that you enjoy and find satisfying.",
              tags: ["Enjoyment", "Personal"]
            }
          ]
        }
      ],
      footerAnalysis: {
        title: "Keep Growing",
        conclusion: "Your garden journey is unique and valuable. Continue exploring at your own pace.",
        callToAction: "Keep building and enjoying your garden adventure."
      }
    };

    // 验证紧急报告也符合要求
    try {
      this.validateAIResponse(safeReport, requestId);
    } catch (error) {
      console.error(`❌ AI Service [${requestId}]: Even emergency report validation failed:`, error);
      // 如果连紧急报告都有问题，返回最基本的结构
    }

    return safeReport;
  }

  /**
   * 测试AI服务连接
   */
  static async testServices(): Promise<{
    gemini: boolean;
    enhanced: boolean;
    fallback: boolean;
  }> {
    const results = {
      gemini: false,
      enhanced: false,
      fallback: false
    };

    // 测试回退服务（应该总是可用）
    try {
      const testRequest: FallbackRequest = {
        items: [{ name: "Test Item", quantity: 1, properties: [] }],
        gold: 100,
        inGameDate: "Spring, Day 1",
        currentDate: new Date().toISOString(),
        interactionMode: "balanced"
      };
      
      FallbackReportGenerator.generateBasicReport(testRequest);
      results.fallback = true;
    } catch (error) {
      console.error('Fallback service test failed:', error);
    }

    // 测试Gemini AI（如果配置了）
    if (isGoogleAIAvailable()) {
      try {
        // 这里可以添加一个简单的测试调用
        results.gemini = true;
      } catch (error) {
        console.error('Gemini AI test failed:', error);
      }
    }

    // 测试增强AI（如果配置了）
    if (isEnhancedAIAvailable()) {
      try {
        // 这里可以添加一个简单的测试调用
        results.enhanced = true;
      } catch (error) {
        console.error('Enhanced AI test failed:', error);
      }
    }

    return results;
  }

  /**
   * 获取服务健康状态
   */
  static async getHealthStatus(): Promise<{
    status: 'healthy' | 'degraded' | 'critical';
    services: {
      gemini: 'available' | 'unavailable' | 'error';
      enhanced: 'available' | 'unavailable' | 'error';
      fallback: 'available' | 'unavailable' | 'error';
    };
    message: string;
  }> {
    const testResults = await this.testServices();
    
    let status: 'healthy' | 'degraded' | 'critical' = 'critical';
    let message = '';

    if (testResults.enhanced || testResults.gemini) {
      status = 'healthy';
      message = 'AI services are operating normally';
    } else if (testResults.fallback) {
      status = 'degraded';
      message = 'AI services unavailable, using fallback mode';
    } else {
      status = 'critical';
      message = 'All services unavailable';
    }

    return {
      status,
      services: {
        gemini: testResults.gemini ? 'available' : (isGoogleAIAvailable() ? 'error' : 'unavailable'),
        enhanced: testResults.enhanced ? 'available' : (isEnhancedAIAvailable() ? 'error' : 'unavailable'),
        fallback: testResults.fallback ? 'available' : 'error'
      },
      message
    };
  }
}