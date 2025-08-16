// 配置验证器 - 验证环境变量和运行时配置
export interface ConfigValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  recommendations: string[];
}

export interface AppConfig {
  ai: {
    enabled: boolean;
    geminiApiKey?: string;
    timeout: number;
    retryAttempts: number;
    fallbackEnabled: boolean;
  };
  api: {
    timeout: number;
    rateLimit: number;
    enableCors: boolean;
  };
  monitoring: {
    enabled: boolean;
    logLevel: 'debug' | 'info' | 'warn' | 'error';
    errorReporting: boolean;
  };
  environment: {
    nodeEnv: string;
    isDevelopment: boolean;
    isProduction: boolean;
  };
}

export class ConfigValidator {
  private static readonly REQUIRED_ENV_VARS = [
    // 'NEXT_PUBLIC_GEMINI_API_KEY' // 不是必需的，因为有回退机制
  ];

  private static readonly OPTIONAL_ENV_VARS = [
    'NEXT_PUBLIC_GEMINI_API_KEY',
    'NODE_ENV',
    'NEXT_PUBLIC_APP_ENV'
  ];

  /**
   * 验证环境变量配置
   */
  static validateEnvironment(): ConfigValidationResult {
    const result: ConfigValidationResult = {
      valid: true,
      errors: [],
      warnings: [],
      recommendations: []
    };

    console.log('🔍 Validating environment configuration...');

    // 检查必需的环境变量
    for (const envVar of this.REQUIRED_ENV_VARS) {
      if (!process.env[envVar]) {
        result.errors.push(`Missing required environment variable: ${envVar}`);
        result.valid = false;
      }
    }

    // 检查可选的环境变量
    for (const envVar of this.OPTIONAL_ENV_VARS) {
      if (!process.env[envVar]) {
        if (envVar === 'NEXT_PUBLIC_GEMINI_API_KEY') {
          result.warnings.push(`${envVar} not configured - AI features will use fallback mode`);
          result.recommendations.push('Configure Gemini API key for enhanced AI features');
        } else {
          result.warnings.push(`Optional environment variable not set: ${envVar}`);
        }
      }
    }

    // 验证Gemini API密钥格式
    const geminiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (geminiKey) {
      if (geminiKey.length < 20) {
        result.warnings.push('Gemini API key appears to be too short');
      }
      if (!geminiKey.startsWith('AI')) {
        result.warnings.push('Gemini API key format may be incorrect (should start with "AI")');
      }
    }

    // 验证Node环境
    const nodeEnv = process.env.NODE_ENV;
    if (!nodeEnv) {
      result.warnings.push('NODE_ENV not set, defaulting to development');
    } else if (!['development', 'production', 'test'].includes(nodeEnv)) {
      result.warnings.push(`Unexpected NODE_ENV value: ${nodeEnv}`);
    }

    return result;
  }

  /**
   * 获取应用配置
   */
  static getAppConfig(): AppConfig {
    const nodeEnv = process.env.NODE_ENV || 'development';
    const isDevelopment = nodeEnv === 'development';
    const isProduction = nodeEnv === 'production';

    return {
      ai: {
        enabled: !!process.env.NEXT_PUBLIC_GEMINI_API_KEY,
        geminiApiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
        timeout: 10000, // 10秒
        retryAttempts: 2,
        fallbackEnabled: true
      },
      api: {
        timeout: 30000, // 30秒
        rateLimit: 100, // 每分钟100个请求
        enableCors: isDevelopment
      },
      monitoring: {
        enabled: isProduction,
        logLevel: isDevelopment ? 'debug' : 'info',
        errorReporting: isProduction
      },
      environment: {
        nodeEnv,
        isDevelopment,
        isProduction
      }
    };
  }

  /**
   * 验证运行时配置
   */
  static validateRuntimeConfig(config: AppConfig): ConfigValidationResult {
    const result: ConfigValidationResult = {
      valid: true,
      errors: [],
      warnings: [],
      recommendations: []
    };

    // 验证AI配置
    if (config.ai.enabled && !config.ai.geminiApiKey) {
      result.errors.push('AI enabled but no API key provided');
      result.valid = false;
    }

    if (config.ai.timeout < 1000) {
      result.warnings.push('AI timeout is very short, may cause frequent timeouts');
    }

    if (config.ai.timeout > 30000) {
      result.warnings.push('AI timeout is very long, may cause poor user experience');
    }

    // 验证API配置
    if (config.api.timeout < 5000) {
      result.warnings.push('API timeout is very short');
    }

    if (config.api.rateLimit < 10) {
      result.warnings.push('Rate limit is very low, may impact user experience');
    }

    // 验证监控配置
    if (config.environment.isProduction && !config.monitoring.enabled) {
      result.recommendations.push('Enable monitoring in production environment');
    }

    return result;
  }

  /**
   * 生成配置报告
   */
  static generateConfigReport(): {
    environment: ConfigValidationResult;
    runtime: ConfigValidationResult;
    config: AppConfig;
    summary: {
      status: 'healthy' | 'warning' | 'error';
      message: string;
    };
  } {
    console.log('📊 Generating configuration report...');

    const config = this.getAppConfig();
    const envValidation = this.validateEnvironment();
    const runtimeValidation = this.validateRuntimeConfig(config);

    let status: 'healthy' | 'warning' | 'error' = 'healthy';
    let message = 'Configuration is valid';

    if (envValidation.errors.length > 0 || runtimeValidation.errors.length > 0) {
      status = 'error';
      message = 'Configuration has errors that need to be fixed';
    } else if (envValidation.warnings.length > 0 || runtimeValidation.warnings.length > 0) {
      status = 'warning';
      message = 'Configuration has warnings but is functional';
    }

    return {
      environment: envValidation,
      runtime: runtimeValidation,
      config,
      summary: {
        status,
        message
      }
    };
  }

  /**
   * 打印配置状态到控制台
   */
  static logConfigStatus(): void {
    const report = this.generateConfigReport();
    
    console.log('\n🔧 Configuration Status Report');
    console.log('================================');
    
    console.log(`\n📊 Overall Status: ${report.summary.status.toUpperCase()}`);
    console.log(`Message: ${report.summary.message}`);
    
    console.log('\n🌍 Environment Configuration:');
    if (report.environment.errors.length > 0) {
      console.log('❌ Errors:');
      report.environment.errors.forEach(error => console.log(`  - ${error}`));
    }
    if (report.environment.warnings.length > 0) {
      console.log('⚠️ Warnings:');
      report.environment.warnings.forEach(warning => console.log(`  - ${warning}`));
    }
    if (report.environment.recommendations.length > 0) {
      console.log('💡 Recommendations:');
      report.environment.recommendations.forEach(rec => console.log(`  - ${rec}`));
    }
    
    console.log('\n⚙️ Runtime Configuration:');
    console.log(`AI Enabled: ${report.config.ai.enabled ? '✅' : '❌'}`);
    console.log(`Environment: ${report.config.environment.nodeEnv}`);
    console.log(`Monitoring: ${report.config.monitoring.enabled ? '✅' : '❌'}`);
    console.log(`Fallback Available: ${report.config.ai.fallbackEnabled ? '✅' : '❌'}`);
    
    if (report.runtime.errors.length > 0) {
      console.log('\n❌ Runtime Errors:');
      report.runtime.errors.forEach(error => console.log(`  - ${error}`));
    }
    if (report.runtime.warnings.length > 0) {
      console.log('\n⚠️ Runtime Warnings:');
      report.runtime.warnings.forEach(warning => console.log(`  - ${warning}`));
    }
    
    console.log('\n================================\n');
  }

  /**
   * 检查特定功能的可用性
   */
  static checkFeatureAvailability(): {
    aiReports: boolean;
    enhancedAI: boolean;
    fallbackReports: boolean;
    monitoring: boolean;
    errorReporting: boolean;
  } {
    const config = this.getAppConfig();
    
    return {
      aiReports: config.ai.enabled,
      enhancedAI: config.ai.enabled && !!config.ai.geminiApiKey,
      fallbackReports: config.ai.fallbackEnabled,
      monitoring: config.monitoring.enabled,
      errorReporting: config.monitoring.errorReporting
    };
  }
}