#!/usr/bin/env node

/**
 * 详细测试 /api/analyze 端点
 * 模拟真实的前端请求
 */

const http = require('http');

console.log('🧪 详细测试 /api/analyze 端点...\n');

// 测试数据 - 模拟真实的前端请求
const testRequest = {
  selectedItems: {
    "1": 5,
    "2": 3,
    "3": 2
  },
  gold: 500,
  inGameDate: "Spring, Day 15",
  currentDate: new Date().toISOString(),
  interactionMode: "beginner"
};

console.log('📋 测试请求数据:');
console.log(JSON.stringify(testRequest, null, 2));

function makeAPIRequest(data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/analyze',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    console.log('\n🚀 发送请求到 /api/analyze...');
    console.log(`- URL: http://${options.hostname}:${options.port}${options.path}`);
    console.log(`- Method: ${options.method}`);
    console.log(`- Content-Length: ${options.headers['Content-Length']}`);

    const req = http.request(options, (res) => {
      let responseData = '';
      
      console.log(`\n📊 响应信息:`);
      console.log(`- 状态码: ${res.statusCode}`);
      console.log(`- 状态消息: ${res.statusMessage}`);
      console.log(`- 响应头:`, res.headers);
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: parsedData,
            rawData: responseData
          });
        } catch (parseError) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: responseData,
            parseError: true,
            rawData: responseData
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.on('timeout', () => {
      reject(new Error('Request timeout'));
    });

    req.setTimeout(30000); // 30秒超时

    req.write(postData);
    req.end();
  });
}

// 检查服务器是否运行
function checkServer() {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/',
      method: 'GET',
      timeout: 2000
    }, (res) => {
      resolve(true);
    });

    req.on('error', () => {
      resolve(false);
    });

    req.on('timeout', () => {
      resolve(false);
    });

    req.end();
  });
}

async function runTest() {
  console.log('\n🔍 检查开发服务器状态...');
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    console.log('❌ 开发服务器未运行');
    console.log('💡 请先运行: npm run dev');
    console.log('然后重新执行此测试脚本');
    return;
  }
  
  console.log('✅ 开发服务器正在运行');
  
  try {
    const startTime = Date.now();
    const response = await makeAPIRequest(testRequest);
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`\n⏱️ 请求耗时: ${duration}ms`);
    
    console.log('\n📋 响应分析:');
    
    if (response.parseError) {
      console.log('❌ JSON 解析失败');
      console.log('原始响应数据:');
      console.log(response.rawData);
      return;
    }
    
    // 检查响应格式
    if (response.data.success !== undefined) {
      console.log(`✅ 标准化响应格式: success = ${response.data.success}`);
      
      if (response.data.success) {
        console.log('🎉 请求成功!');
        
        // 检查报告数据
        if (response.data.data) {
          const report = response.data.data;
          console.log('\n📊 报告数据分析:');
          console.log(`- 报告ID: ${report.reportId}`);
          console.log(`- 标题: ${report.mainTitle}`);
          console.log(`- 副标题: ${report.subTitle}`);
          console.log(`- 视觉锚点: ${report.visualAnchor}`);
          console.log(`- 章节数量: ${report.sections?.length || 0}`);
          
          if (report.sections && report.sections.length > 0) {
            console.log('\n📝 报告章节:');
            report.sections.forEach((section, index) => {
              console.log(`  ${index + 1}. ${section.title} (${section.points?.length || 0} 个要点)`);
            });
          }
          
          // 检查是否是AI生成还是回退生成
          if (report.reportId.startsWith('AI-')) {
            console.log('\n🤖 ✅ 使用了 AI 生成 (Enhanced AI 或 Gemini AI)');
          } else if (report.reportId.startsWith('FALLBACK-')) {
            console.log('\n🔄 ⚠️ 使用了回退生成 (规则引擎)');
            console.log('这意味着 AI 服务可能不可用或失败了');
          } else if (report.reportId.startsWith('EMERGENCY-')) {
            console.log('\n🚨 ⚠️ 使用了紧急模式');
            console.log('这意味着所有服务都失败了');
          } else if (report.reportId.startsWith('STABLE-')) {
            console.log('\n📊 ℹ️ 使用了稳定模式 (可能绕过了 AI 服务管理器)');
          }
          
        } else {
          console.log('❌ 响应中缺少报告数据');
        }
        
        // 检查元数据
        if (response.data.metadata) {
          console.log('\n📋 元数据:');
          console.log(`- 时间戳: ${response.data.metadata.timestamp}`);
          console.log(`- 请求ID: ${response.data.metadata.requestId}`);
          console.log(`- 处理时间: ${response.data.metadata.processingTime}ms`);
        }
        
      } else {
        console.log('❌ 请求失败');
        if (response.data.error) {
          console.log('错误信息:');
          console.log(`- 类型: ${response.data.error.type}`);
          console.log(`- 消息: ${response.data.error.message}`);
          console.log(`- 用户消息: ${response.data.error.userMessage}`);
          console.log(`- 可恢复: ${response.data.error.recoverable}`);
        }
      }
    } else {
      console.log('⚠️ 非标准响应格式');
      console.log('响应数据:');
      console.log(JSON.stringify(response.data, null, 2));
    }
    
  } catch (error) {
    console.log('\n❌ 请求失败:');
    console.log(`- 错误类型: ${error.code || error.name}`);
    console.log(`- 错误消息: ${error.message}`);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 解决方案:');
      console.log('1. 确保开发服务器正在运行: npm run dev');
      console.log('2. 检查端口 3000 是否被占用');
      console.log('3. 确认服务器启动没有错误');
    }
  }
}

// 运行测试
runTest().catch(console.error);