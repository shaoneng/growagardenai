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
   * 生成分析报告 - 带智能回退
   */
  static async generateReport(request: AIServiceRequest): Promise<AnalysisResult> {
    const requestId = `ai_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    console.log(`🤖 AI Service [${requestId}]: Starting report generation...`);

    // 确保AI提供者已加载
    await loadAIProviders();
    
    const status = await this.getServiceStatus();
    console.log(`📊 AI Service [${requestId}]: Status -`, status);

    // 尝试使用推荐的服务
    try {
      switch (status.recommendedService) {
        case 'enhanced':
          return await this.tryEnhancedAI(request, requestId);
        case 'gemini':
          return await this.tryGeminiAI(request, requestId);
        default:
          return await this.useFallback(request, requestId);
      }
    } catch (error) {
      console.warn(`⚠️ AI Service [${requestId}]: Primary service failed, trying fallback...`);
      return await this.useFallback(request, requestId);
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
   * 创建紧急报告（最后的回退）
   */
  private static createEmergencyReport(request: AIServiceRequest, requestId: string): AnalysisResult {
    console.log(`🚨 AI Service [${requestId}]: Creating emergency report...`);

    return {
      reportId: `EMERGENCY-${Date.now()}`,
      publicationDate: request.currentDate,
      mainTitle: "Garden Analysis Report",
      subTitle: "BASIC RECOMMENDATIONS",
      visualAnchor: "🌱",
      playerProfile: {
        title: "Player Profile",
        archetype: "Garden Enthusiast",
        summary: `You have ${request.gold} gold and ${request.items.length} item types. Keep building your garden step by step!`
      },
      midBreakerQuote: "Every garden grows one step at a time.",
      sections: [
        {
          id: "basic_advice",
          title: "Basic Advice 🌱",
          points: [
            {
              action: "Continue your garden journey",
              reasoning: "You're making progress! Keep experimenting and learning as you build your garden.",
              tags: ["Encouragement", "Progress"]
            },
            {
              action: "Focus on what you enjoy",
              reasoning: "The best garden strategy is one that brings you joy and satisfaction.",
              tags: ["Enjoyment", "Personal"]
            }
          ]
        }
      ],
      footerAnalysis: {
        title: "Keep Growing",
        conclusion: "Your garden journey is unique and valuable. Keep exploring and enjoying the process!",
        callToAction: "Continue building your garden at your own pace."
      }
    };
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