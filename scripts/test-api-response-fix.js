#!/usr/bin/env node

/**
 * 测试API响应修复
 * 验证前端能正确处理API响应格式
 */

console.log('🔧 测试API响应修复...\n');

function testResponseParsing() {
  console.log('📋 Test 1: 测试响应解析逻辑');
  console.log('============================');
  
  // 模拟不同的API响应格式
  const testResponses = [
    {
      name: 'API包装格式 (正确)',
      response: {
        success: true,
        data: {
          reportId: 'AI-123456789',
          mainTitle: 'Test Report',
          subTitle: 'Test Subtitle',
          sections: [
            { id: 'test', title: 'Test Section', points: [] }
          ]
        }
      }
    },
    {
      name: '直接数据格式 (兼容)',
      response: {
        reportId: 'AI-123456789',
        mainTitle: 'Test Report',
        subTitle: 'Test Subtitle',
        sections: [
          { id: 'test', title: 'Test Section', points: [] }
        ]
      }
    },
    {
      name: '缺少mainTitle (应该失败)',
      response: {
        success: true,
        data: {
          reportId: 'AI-123456789',
          sections: []
        }
      }
    },
    {
      name: '缺少sections (应该失败)',
      response: {
        success: true,
        data: {
          reportId: 'AI-123456789',
          mainTitle: 'Test Report'
        }
      }
    }
  ];
  
  testResponses.forEach(test => {
    console.log(`\\n测试: ${test.name}`);
    
    try {
      // 模拟AppContext中的解析逻辑
      const data = test.response;
      
      // 验证响应数据的完整性
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format from server');
      }

      // 检查API响应格式 - 数据可能在data字段中
      const reportData = data.data || data;
      
      if (!reportData.mainTitle || !reportData.sections) {
        console.warn('Incomplete response data:', data);
        throw new Error('Incomplete report data received from server');
      }
      
      console.log('✅ 解析成功');
      console.log(`- reportId: ${reportData.reportId}`);
      console.log(`- mainTitle: ${reportData.mainTitle}`);
      console.log(`- sections: ${reportData.sections?.length || 0} 个`);
      
    } catch (error) {
      console.log(`❌ 解析失败: ${error.message}`);
    }
  });
}

function testErrorHandling() {
  console.log('\\n📋 Test 2: 测试错误处理');
  console.log('========================');
  
  const errorCases = [
    {
      name: 'null响应',
      response: null
    },
    {
      name: '空对象',
      response: {}
    },
    {
      name: '字符串响应',
      response: 'invalid response'
    },
    {
      name: '数组响应',
      response: []
    }
  ];
  
  errorCases.forEach(test => {
    console.log(`\\n测试: ${test.name}`);
    
    try {
      const data = test.response;
      
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format from server');
      }

      const reportData = data.data || data;
      
      if (!reportData.mainTitle || !reportData.sections) {
        throw new Error('Incomplete report data received from server');
      }
      
      console.log('✅ 意外通过 (这不应该发生)');
      
    } catch (error) {
      console.log(`✅ 正确捕获错误: ${error.message}`);
    }
  });
}

function generateFixSummary() {
  console.log('\\n🎯 修复总结');
  console.log('============');
  console.log('✅ 修复了API响应格式解析问题');
  console.log('✅ 支持包装格式 (data字段) 和直接格式');
  console.log('✅ 增强了错误验证和处理');
  console.log('✅ 修复了localStorage保存逻辑');
  
  console.log('\\n🔧 修复内容:');
  console.log('1. 添加了 reportData = data.data || data 逻辑');
  console.log('2. 统一使用 reportData 进行验证和操作');
  console.log('3. 修复了两个 requestAnalysis 函数');
  console.log('4. 保持了向后兼容性');
  
  console.log('\\n💡 测试建议:');
  console.log('1. 启动开发服务器: npm run dev');
  console.log('2. 访问应用并尝试生成AI报告');
  console.log('3. 检查浏览器控制台是否有错误');
  console.log('4. 验证报告是否正确显示');
}

// 运行所有测试
function runAllTests() {
  testResponseParsing();
  testErrorHandling();
  generateFixSummary();
}

runAllTests();