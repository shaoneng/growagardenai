#!/usr/bin/env node

/**
 * 调试Gemini AI响应问题
 * 测试AI生成和响应验证
 */

console.log('🔍 调试Gemini AI响应问题...\n');

// 设置环境变量
process.env.GEMINI_API_KEY = 'AIzaSyASxarnJCMXzh91YxhZm4lFrSST2tpnolE';
process.env.NEXT_PUBLIC_GEMINI_API_KEY = 'AIzaSyASxarnJCMXzh91YxhZm4lFrSST2tpnolE';

async function testGeminiResponse() {
  console.log('📋 Test 1: 测试Gemini AI响应');
  console.log('============================');
  
  try {
    // 动态导入服务端提供者
    const serverProvider = await import('../src/lib/generative-ai-provider-server.ts');
    
    console.log('✅ 服务端提供者导入成功');
    
    // 测试数据
    const testItems = [
      { name: 'Carrot', quantity: 5, properties: [] },
      { name: 'Strawberry', quantity: 3, properties: ['multi-harvest'] }
    ];
    
    console.log('🚀 开始AI生成测试...');
    console.log('测试数据:', {
      items: testItems,
      gold: 500,
      inGameDate: 'Spring, Day 15',
      interactionMode: 'beginner'
    });
    
    try {
      const report = await serverProvider.generateAnalysisWithGoogleAI(
        testItems,
        500,
        'Spring, Day 15',
        new Date().toISOString(),
        'beginner'
      );
      
      console.log('\\n✅ AI报告生成成功!');
      console.log('报告验证:');
      console.log(`- reportId: ${report.reportId ? '✅' : '❌'} (${report.reportId})`);
      console.log(`- mainTitle: ${report.mainTitle ? '✅' : '❌'} (${report.mainTitle})`);
      console.log(`- subTitle: ${report.subTitle ? '✅' : '❌'} (${report.subTitle})`);
      console.log(`- visualAnchor: ${report.visualAnchor ? '✅' : '❌'} (${report.visualAnchor})`);
      console.log(`- playerProfile: ${report.playerProfile ? '✅' : '❌'}`);
      console.log(`- sections: ${report.sections ? '✅' : '❌'} (${report.sections?.length || 0} 个)`);
      console.log(`- footerAnalysis: ${report.footerAnalysis ? '✅' : '❌'}`);
      
      // 详细检查sections
      if (report.sections && report.sections.length > 0) {
        console.log('\\n📊 Sections详细检查:');
        report.sections.forEach((section, index) => {
          console.log(`  Section ${index + 1}:`);
          console.log(`    - id: ${section.id ? '✅' : '❌'} (${section.id})`);
          console.log(`    - title: ${section.title ? '✅' : '❌'} (${section.title})`);
          console.log(`    - points: ${section.points ? '✅' : '❌'} (${section.points?.length || 0} 个)`);
          
          if (section.points && section.points.length > 0) {
            section.points.forEach((point, pIndex) => {
              console.log(`      Point ${pIndex + 1}:`);
              console.log(`        - action: ${point.action ? '✅' : '❌'}`);
              console.log(`        - reasoning: ${point.reasoning ? '✅' : '❌'}`);
              console.log(`        - tags: ${point.tags ? '✅' : '❌'} (${point.tags?.length || 0} 个)`);
            });
          }
        });
      }
      
      // 检查是否有缺失的必需字段
      const requiredFields = [
        'reportId', 'mainTitle', 'subTitle', 'visualAnchor', 
        'playerProfile', 'sections', 'footerAnalysis'
      ];
      
      const missingFields = requiredFields.filter(field => !report[field]);
      
      if (missingFields.length > 0) {
        console.log('\\n❌ 缺失的必需字段:', missingFields);
      } else {
        console.log('\\n✅ 所有必需字段都存在');
      }
      
      // 输出完整报告结构（截断长文本）
      console.log('\\n📄 完整报告结构:');
      console.log(JSON.stringify(report, (key, value) => {
        if (typeof value === 'string' && value.length > 100) {
          return value.substring(0, 100) + '...';
        }
        return value;
      }, 2));
      
    } catch (aiError) {
      console.log('❌ AI报告生成失败:', aiError.message);
      console.log('错误详情:', aiError);
      
      // 如果是JSON解析错误，尝试获取原始响应
      if (aiError.message.includes('parse')) {
        console.log('\\n🔍 这可能是JSON解析错误，检查原始响应格式');
      }
    }
    
  } catch (importError) {
    console.log('❌ 服务端提供者导入失败:', importError.message);
  }
}

async function testServiceManager() {
  console.log('\\n📋 Test 2: 测试AI服务管理器');
  console.log('============================');
  
  try {
    const { AIServiceManager } = await import('../src/lib/ai/service-manager.ts');
    
    console.log('✅ AI服务管理器导入成功');
    
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
    
    console.log('🚀 通过服务管理器生成报告...');
    
    try {
      const report = await AIServiceManager.generateReport(testRequest);
      
      console.log('✅ 服务管理器报告生成成功!');
      console.log(`- 报告ID: ${report.reportId}`);
      console.log(`- 标题: ${report.mainTitle}`);
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
      console.log('错误详情:', reportError);
    }
    
  } catch (managerError) {
    console.log('❌ AI服务管理器导入失败:', managerError.message);
  }
}

async function testResponseValidation() {
  console.log('\\n📋 Test 3: 测试响应验证逻辑');
  console.log('==============================');
  
  // 模拟不同的响应情况
  const testResponses = [
    {
      name: '完整响应',
      data: {
        reportId: 'AI-123456789',
        mainTitle: 'Test Report',
        subTitle: 'Test Subtitle',
        visualAnchor: '🌱',
        playerProfile: { title: 'Test', archetype: 'Test', summary: 'Test' },
        sections: [{ id: 'test', title: 'Test', points: [] }],
        footerAnalysis: { title: 'Test', conclusion: 'Test', callToAction: 'Test' }
      }
    },
    {
      name: '缺少reportId',
      data: {
        mainTitle: 'Test Report',
        sections: []
      }
    },
    {
      name: '缺少sections',
      data: {
        reportId: 'AI-123456789',
        mainTitle: 'Test Report'
      }
    },
    {
      name: '空sections',
      data: {
        reportId: 'AI-123456789',
        mainTitle: 'Test Report',
        sections: []
      }
    }
  ];
  
  testResponses.forEach(test => {
    console.log(`\\n测试: ${test.name}`);
    
    const hasReportId = !!test.data.reportId;
    const hasMainTitle = !!test.data.mainTitle;
    const hasSections = !!test.data.sections;
    
    const isValid = hasReportId && hasMainTitle && hasSections;
    
    console.log(`- reportId: ${hasReportId ? '✅' : '❌'}`);
    console.log(`- mainTitle: ${hasMainTitle ? '✅' : '❌'}`);
    console.log(`- sections: ${hasSections ? '✅' : '❌'}`);
    console.log(`- 整体验证: ${isValid ? '✅ 通过' : '❌ 失败'}`);
  });
}

async function runAllTests() {
  await testGeminiResponse();
  await testServiceManager();
  await testResponseValidation();
  
  console.log('\\n🎯 调试总结');
  console.log('============');
  console.log('1. 检查AI生成的原始响应格式');
  console.log('2. 验证JSON解析是否正确');
  console.log('3. 确认响应验证逻辑');
  console.log('4. 测试服务管理器集成');
  
  console.log('\\n💡 如果问题持续:');
  console.log('- 检查Gemini API配额和权限');
  console.log('- 验证API密钥是否有效');
  console.log('- 查看完整的错误日志');
  console.log('- 测试不同的prompt格式');
}

// 运行所有测试
runAllTests().catch(console.error);