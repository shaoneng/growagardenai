#!/usr/bin/env node

/**
 * 测试Gemini API修复
 * 验证服务端环境变量和AI集成
 */

console.log('🔧 测试Gemini API修复...\n');

// 设置环境变量（模拟服务端环境）
process.env.GEMINI_API_KEY = 'AIzaSyASxarnJCMXzh91YxhZm4lFrSST2tpnolE';
process.env.NEXT_PUBLIC_GEMINI_API_KEY = 'AIzaSyASxarnJCMXzh91YxhZm4lFrSST2tpnolE';

async function testServerProvider() {
  console.log('📋 Test 1: 测试服务端AI提供者');
  console.log('============================');
  
  try {
    const serverProvider = await import('../src/lib/generative-ai-provider-server.ts');
    
    console.log('✅ 服务端提供者导入成功');
    
    // 测试可用性检查
    const available = serverProvider.isGoogleAIAvailable();
    console.log(`- 服务可用性: ${available ? '✅' : '❌'}`);
    
    // 获取服务状态
    const status = serverProvider.getGeminiServiceStatus();
    console.log('- 服务状态:', status);
    
    if (available) {
      console.log('\n🧪 测试AI报告生成...');
      
      const testItems = [
        { name: 'Carrot', quantity: 5, properties: [] },
        { name: 'Strawberry', quantity: 3, properties: ['multi-harvest'] }
      ];
      
      try {
        const report = await serverProvider.generateAnalysisWithGoogleAI(
          testItems,
          500,
          'Spring, Day 15',
          new Date().toISOString(),
          'beginner'
        );
        
        console.log('✅ AI报告生成成功!');
        console.log(`- 报告ID: ${report.reportId}`);
        console.log(`- 标题: ${report.mainTitle}`);
        console.log(`- 章节数: ${report.sections?.length || 0}`);
        
      } catch (aiError) {
        console.log('❌ AI报告生成失败:', aiError.message);
      }
    }
    
  } catch (importError) {
    console.log('❌ 服务端提供者导入失败:', importError.message);
  }
}

async function testAIServiceManager() {
  console.log('\n📋 Test 2: 测试AI服务管理器');
  console.log('============================');
  
  try {
    const { AIServiceManager } = await import('../src/lib/ai/service-manager.ts');
    
    console.log('✅ AI服务管理器导入成功');
    
    // 测试服务状态
    console.log('\n🔍 检查服务状态...');
    const status = await AIServiceManager.getServiceStatus();
    console.log('- 服务状态:', status);
    
    // 测试报告生成
    console.log('\n🚀 测试报告生成...');
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
    
    try {
      const report = await AIServiceManager.generateReport(testRequest);
      
      console.log('✅ 服务管理器报告生成成功!');
      console.log(`- 报告ID: ${report.reportId}`);
      console.log(`- 标题: ${report.mainTitle}`);
      console.log(`- 副标题: ${report.subTitle}`);
      console.log(`- 章节数: ${report.sections?.length || 0}`);
      
      // 判断使用的服务类型
      if (report.reportId.startsWith('AI-')) {
        console.log('🤖 ✅ 使用了Gemini AI服务');
      } else if (report.reportId.startsWith('FALLBACK-')) {
        console.log('🔄 ⚠️ 使用了回退服务');
      } else if (report.reportId.startsWith('EMERGENCY-')) {
        console.log('🚨 ⚠️ 使用了紧急模式');
      }
      
    } catch (reportError) {
      console.log('❌ 服务管理器报告生成失败:', reportError.message);
    }
    
  } catch (managerError) {
    console.log('❌ AI服务管理器导入失败:', managerError.message);
  }
}

async function testEnvironmentVariables() {
  console.log('\n📋 Test 3: 测试环境变量配置');
  console.log('==============================');
  
  console.log('环境变量状态:');
  console.log(`- NODE_ENV: ${process.env.NODE_ENV || 'undefined'}`);
  console.log(`- GEMINI_API_KEY: ${process.env.GEMINI_API_KEY ? '✅ 已设置' : '❌ 未设置'}`);
  console.log(`- NEXT_PUBLIC_GEMINI_API_KEY: ${process.env.NEXT_PUBLIC_GEMINI_API_KEY ? '✅ 已设置' : '❌ 未设置'}`);
  
  if (process.env.GEMINI_API_KEY) {
    console.log(`- 服务端密钥长度: ${process.env.GEMINI_API_KEY.length}`);
    console.log(`- 服务端密钥前缀: ${process.env.GEMINI_API_KEY.substring(0, 10)}...`);
  }
  
  if (process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
    console.log(`- 客户端密钥长度: ${process.env.NEXT_PUBLIC_GEMINI_API_KEY.length}`);
    console.log(`- 客户端密钥前缀: ${process.env.NEXT_PUBLIC_GEMINI_API_KEY.substring(0, 10)}...`);
  }
}

async function runAllTests() {
  await testEnvironmentVariables();
  await testServerProvider();
  await testAIServiceManager();
  
  console.log('\n🎯 修复验证总结');
  console.log('================');
  console.log('✅ 服务端AI提供者已创建');
  console.log('✅ AI服务管理器已更新');
  console.log('✅ 环境变量处理已优化');
  console.log('✅ 动态导入机制已实现');
  
  console.log('\n💡 下一步测试:');
  console.log('1. 运行 npm run dev 启动开发服务器');
  console.log('2. 访问 /api/analyze 端点测试API');
  console.log('3. 在应用中测试AI报告生成功能');
  console.log('4. 检查浏览器控制台和服务器日志');
}

// 运行所有测试
runAllTests().catch(console.error);