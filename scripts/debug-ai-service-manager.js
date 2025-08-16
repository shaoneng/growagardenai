#!/usr/bin/env node

/**
 * AI服务管理器调试脚本
 * 测试AI服务的选择和回退逻辑
 */

console.log('🔧 AI服务管理器调试开始...\n');

// 设置环境变量
process.env.NEXT_PUBLIC_GEMINI_API_KEY = 'AIzaSyASxarnJCMXzh91YxhZm4lFrSST2tpnolE';

async function testAIServiceManager() {
  try {
    console.log('📋 Test 1: 导入AI服务管理器');
    console.log('============================');
    
    // 动态导入模块
    const { AIServiceManager } = await import('../src/lib/ai/service-manager.ts');
    console.log('✅ AI服务管理器导入成功');
    
    console.log('\n📋 Test 2: 检查服务状态');
    console.log('========================');
    
    const status = AIServiceManager.getServiceStatus();
    console.log('服务状态:');
    console.log(`- Gemini AI 可用: ${status.geminiAvailable ? '✅' : '❌'}`);
    console.log(`- Enhanced AI 可用: ${status.enhancedAIAvailable ? '✅' : '❌'}`);
    console.log(`- 回退服务可用: ${status.fallbackAvailable ? '✅' : '❌'}`);
    console.log(`- 推荐服务: ${status.recommendedService}`);
    
    console.log('\n📋 Test 3: 测试报告生成');
    console.log('========================');
    
    const testRequest = {
      items: [
        { name: 'Carrot', quantity: 5, properties: [] },
        { name: 'Strawberry', quantity: 3, properties: ['multi-harvest'] }
      ],
      gold: 500,
      inGameDate: 'Spring, Day 15',
      currentDate: new Date().toISOString(),
      interactionMode: 'beginner'
    };
    
    console.log('测试请求数据:');
    console.log(JSON.stringify(testRequest, null, 2));
    
    console.log('\n🚀 开始生成报告...');
    const startTime = Date.now();
    
    try {
      const report = await AIServiceManager.generateReport(testRequest);
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      console.log(`✅ 报告生成成功! (耗时: ${duration}ms)`);
      console.log('\n📊 报告信息:');
      console.log(`- 报告ID: ${report.reportId}`);
      console.log(`- 标题: ${report.mainTitle}`);
      console.log(`- 副标题: ${report.subTitle}`);
      console.log(`- 章节数: ${report.sections?.length || 0}`);
      
      // 判断使用的服务类型
      if (report.reportId.startsWith('AI-')) {
        console.log('🤖 ✅ 使用了 Enhanced AI 服务');
      } else if (report.reportId.startsWith('GGSB-')) {
        console.log('🤖 ✅ 使用了 Gemini AI 服务');
      } else if (report.reportId.startsWith('FALLBACK-')) {
        console.log('🔄 ⚠️ 使用了回退服务');
      } else if (report.reportId.startsWith('EMERGENCY-')) {
        console.log('🚨 ⚠️ 使用了紧急模式');
      } else {
        console.log(`❓ 未知的报告类型: ${report.reportId}`);
      }
      
      if (report.sections && report.sections.length > 0) {
        console.log('\n📝 报告章节预览:');
        report.sections.forEach((section, index) => {
          console.log(`  ${index + 1}. ${section.title}`);
          if (section.points && section.points.length > 0) {
            console.log(`     - ${section.points[0].action}`);
          }
        });
      }
      
    } catch (reportError) {
      console.log('❌ 报告生成失败:');
      console.log(`- 错误类型: ${reportError.name}`);
      console.log(`- 错误消息: ${reportError.message}`);
      console.log(`- 错误堆栈: ${reportError.stack}`);
    }
    
    console.log('\n📋 Test 4: 测试服务健康状态');
    console.log('============================');
    
    try {
      const healthStatus = await AIServiceManager.getHealthStatus();
      console.log('健康状态:');
      console.log(`- 整体状态: ${healthStatus.status}`);
      console.log(`- 状态消息: ${healthStatus.message}`);
      console.log('各服务状态:');
      console.log(`  - Gemini: ${healthStatus.services.gemini}`);
      console.log(`  - Enhanced: ${healthStatus.services.enhanced}`);
      console.log(`  - Fallback: ${healthStatus.services.fallback}`);
    } catch (healthError) {
      console.log('❌ 健康检查失败:', healthError.message);
    }
    
  } catch (importError) {
    console.log('❌ 导入失败:');
    console.log(`- 错误类型: ${importError.name}`);
    console.log(`- 错误消息: ${importError.message}`);
    
    if (importError.message.includes('Cannot resolve module')) {
      console.log('\n💡 可能的解决方案:');
      console.log('1. 检查文件路径是否正确');
      console.log('2. 确认所有依赖模块都存在');
      console.log('3. 检查 TypeScript 配置');
    }
  }
}

// 测试各个AI提供者的可用性
async function testIndividualProviders() {
  console.log('\n📋 Test 5: 测试各个AI提供者');
  console.log('============================');
  
  try {
    // 测试基础Gemini AI
    console.log('\n🧪 测试基础 Gemini AI:');
    const { isGoogleAIAvailable, generateAnalysisWithGoogleAI } = await import('../src/lib/generative-ai-provider.ts');
    
    console.log(`- 可用性: ${isGoogleAIAvailable() ? '✅' : '❌'}`);
    
    if (isGoogleAIAvailable()) {
      try {
        const testItems = [
          { name: 'Test Item', quantity: 1, properties: [] }
        ];
        
        console.log('- 尝试生成测试报告...');
        const geminiReport = await generateAnalysisWithGoogleAI(
          testItems,
          100,
          'Spring, Day 1',
          new Date().toISOString(),
          'beginner'
        );
        
        console.log(`✅ Gemini AI 测试成功: ${geminiReport.mainTitle}`);
      } catch (geminiError) {
        console.log(`❌ Gemini AI 测试失败: ${geminiError.message}`);
      }
    }
    
    // 测试增强AI
    console.log('\n🧪 测试增强 AI:');
    const { isEnhancedAIAvailable, generateEnhancedAIReport } = await import('../src/lib/enhanced-ai-report-generator.ts');
    
    console.log(`- 可用性: ${isEnhancedAIAvailable() ? '✅' : '❌'}`);
    
    if (isEnhancedAIAvailable()) {
      try {
        const enhancedRequest = {
          items: [{ name: 'Test Item', quantity: 1, properties: [] }],
          gold: 100,
          inGameDate: 'Spring, Day 1',
          currentDate: new Date().toISOString(),
          interactionMode: 'beginner'
        };
        
        console.log('- 尝试生成测试报告...');
        const enhancedReport = await generateEnhancedAIReport(enhancedRequest);
        
        console.log(`✅ Enhanced AI 测试成功: ${enhancedReport.mainTitle}`);
      } catch (enhancedError) {
        console.log(`❌ Enhanced AI 测试失败: ${enhancedError.message}`);
      }
    }
    
    // 测试回退服务
    console.log('\n🧪 测试回退服务:');
    const { FallbackReportGenerator } = await import('../src/lib/fallback/report-generator.ts');
    
    try {
      const fallbackRequest = {
        items: [{ name: 'Test Item', quantity: 1, properties: [] }],
        gold: 100,
        inGameDate: 'Spring, Day 1',
        currentDate: new Date().toISOString(),
        interactionMode: 'beginner'
      };
      
      console.log('- 尝试生成回退报告...');
      const fallbackReport = FallbackReportGenerator.generateBasicReport(fallbackRequest);
      
      console.log(`✅ 回退服务测试成功: ${fallbackReport.mainTitle}`);
    } catch (fallbackError) {
      console.log(`❌ 回退服务测试失败: ${fallbackError.message}`);
    }
    
  } catch (providerError) {
    console.log('❌ 提供者测试失败:', providerError.message);
  }
}

// 运行所有测试
async function runAllTests() {
  await testAIServiceManager();
  await testIndividualProviders();
  
  console.log('\n🎯 调试总结');
  console.log('============');
  console.log('如果所有测试都通过，但API端点仍然无法工作，可能的原因:');
  console.log('1. API路由中的动态导入问题');
  console.log('2. Next.js环境变量在服务端的可用性问题');
  console.log('3. 模块解析路径问题');
  console.log('4. TypeScript编译问题');
  console.log('');
  console.log('建议的下一步:');
  console.log('1. 检查开发服务器的控制台输出');
  console.log('2. 在API路由中添加更多调试日志');
  console.log('3. 测试简化版本的API路由');
}

runAllTests().catch(console.error);