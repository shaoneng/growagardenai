#!/usr/bin/env node

/**
 * Gemini API 深度诊断脚本
 * 测试API连接、配置和响应
 */

const https = require('https');
const fs = require('path');

console.log('🔍 Gemini API 深度诊断开始...\n');

// 读取环境变量
function loadEnvVars() {
  try {
    const envPath = '.env.local';
    if (require('fs').existsSync(envPath)) {
      const envContent = require('fs').readFileSync(envPath, 'utf8');
      const lines = envContent.split('\n');
      const env = {};
      
      lines.forEach(line => {
        const match = line.match(/^([^#][^=]*?)=(.*)$/);
        if (match) {
          const key = match[1].trim();
          const value = match[2].trim();
          env[key] = value;
          process.env[key] = value;
        }
      });
      
      return env;
    }
  } catch (error) {
    console.error('❌ 无法读取环境变量:', error.message);
  }
  return {};
}

// 测试1: 检查环境变量配置
console.log('📋 Test 1: 检查环境变量配置');
console.log('================================');

const env = loadEnvVars();
const geminiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

console.log('环境变量状态:');
console.log(`- GEMINI_API_KEY: ${process.env.GEMINI_API_KEY ? '✅ 已设置' : '❌ 未设置'}`);
console.log(`- NEXT_PUBLIC_GEMINI_API_KEY: ${process.env.NEXT_PUBLIC_GEMINI_API_KEY ? '✅ 已设置' : '❌ 未设置'}`);

if (geminiKey) {
  console.log(`- API Key 长度: ${geminiKey.length} 字符`);
  console.log(`- API Key 前缀: ${geminiKey.substring(0, 10)}...`);
  console.log(`- API Key 格式: ${geminiKey.startsWith('AIza') ? '✅ 正确' : '❌ 可能错误'}`);
} else {
  console.log('❌ 没有找到 Gemini API Key');
  console.log('\n💡 解决方案:');
  console.log('1. 确保 .env.local 文件存在');
  console.log('2. 添加 NEXT_PUBLIC_GEMINI_API_KEY=your_api_key');
  console.log('3. 从 Google AI Studio 获取有效的 API Key');
  return;
}

// 测试2: 测试API连接
console.log('\n📋 Test 2: 测试 Gemini API 连接');
console.log('================================');

function testGeminiConnection() {
  return new Promise((resolve, reject) => {
    const testData = JSON.stringify({
      contents: [{
        parts: [{
          text: "Hello, this is a test. Please respond with 'API connection successful' in JSON format: {\"message\": \"API connection successful\"}"
        }]
      }],
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      port: 443,
      path: `/v1beta/models/gemini-2.5-pro:generateContent?key=${geminiKey}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(testData)
      }
    };

    console.log('🚀 发送测试请求到 Gemini API...');
    console.log(`- 端点: ${options.hostname}${options.path.split('?')[0]}`);
    console.log(`- 模型: gemini-2.5-pro`);

    const req = https.request(options, (res) => {
      let data = '';
      
      console.log(`- 响应状态: ${res.statusCode}`);
      console.log(`- 响应头: ${JSON.stringify(res.headers, null, 2)}`);

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve({ statusCode: res.statusCode, data: response });
        } catch (parseError) {
          resolve({ statusCode: res.statusCode, data, parseError: true });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(testData);
    req.end();
  });
}

// 执行API连接测试
testGeminiConnection()
  .then(result => {
    console.log('\n📊 API 响应结果:');
    
    if (result.statusCode === 200) {
      console.log('✅ API 连接成功!');
      
      if (result.parseError) {
        console.log('⚠️ 响应不是有效的 JSON:');
        console.log(result.data);
      } else {
        console.log('✅ JSON 解析成功');
        
        if (result.data.candidates && result.data.candidates[0]) {
          const content = result.data.candidates[0].content;
          console.log('✅ 获得 AI 响应:');
          console.log(JSON.stringify(content, null, 2));
          
          try {
            const aiResponse = JSON.parse(content.parts[0].text);
            if (aiResponse.message === 'API connection successful') {
              console.log('🎉 Gemini AI 完全正常工作!');
            }
          } catch (e) {
            console.log('⚠️ AI 响应格式不符合预期');
          }
        } else {
          console.log('⚠️ 响应结构异常:');
          console.log(JSON.stringify(result.data, null, 2));
        }
      }
    } else {
      console.log(`❌ API 请求失败 (状态码: ${result.statusCode})`);
      
      if (result.data.error) {
        console.log('错误详情:');
        console.log(`- 错误代码: ${result.data.error.code}`);
        console.log(`- 错误消息: ${result.data.error.message}`);
        console.log(`- 错误状态: ${result.data.error.status}`);
        
        // 常见错误解决方案
        if (result.data.error.code === 400) {
          console.log('\n💡 可能的解决方案:');
          console.log('- 检查 API Key 是否正确');
          console.log('- 确认请求格式是否符合 API 规范');
          console.log('- 检查模型名称是否正确 (gemini-2.5-pro)');
        } else if (result.data.error.code === 403) {
          console.log('\n💡 可能的解决方案:');
          console.log('- API Key 可能无效或已过期');
          console.log('- 检查 API Key 的权限设置');
          console.log('- 确认 Google AI Studio 中的配置');
        } else if (result.data.error.code === 429) {
          console.log('\n💡 可能的解决方案:');
          console.log('- API 调用频率超限，请稍后重试');
          console.log('- 检查 API 配额和限制');
        }
      }
    }
  })
  .catch(error => {
    console.log('❌ 网络连接失败:');
    console.log(`- 错误类型: ${error.code}`);
    console.log(`- 错误消息: ${error.message}`);
    
    console.log('\n💡 可能的解决方案:');
    console.log('- 检查网络连接');
    console.log('- 确认防火墙设置');
    console.log('- 验证 DNS 解析');
  });

// 测试3: 检查应用中的AI集成
console.log('\n📋 Test 3: 检查应用中的 AI 集成');
console.log('==================================');

const aiFiles = [
  'src/lib/generative-ai-provider.ts',
  'src/lib/enhanced-ai-report-generator.ts',
  'src/lib/ai/service-manager.ts',
  'src/lib/fallback/report-generator.ts'
];

aiFiles.forEach(file => {
  try {
    const filePath = require('path').join(process.cwd(), file);
    if (require('fs').existsSync(filePath)) {
      const content = require('fs').readFileSync(filePath, 'utf8');
      
      console.log(`\n📄 ${file}:`);
      
      // 检查模型名称
      if (content.includes('gemini-2.5-pro')) {
        console.log('  ✅ 使用正确的模型名称 (gemini-2.5-pro)');
      } else if (content.includes('gemini-')) {
        console.log('  ⚠️ 可能使用了错误的模型名称');
        const modelMatch = content.match(/gemini-[^"']*/);
        if (modelMatch) {
          console.log(`  - 发现模型: ${modelMatch[0]}`);
        }
      }
      
      // 检查API Key使用
      if (content.includes('NEXT_PUBLIC_GEMINI_API_KEY')) {
        console.log('  ✅ 正确使用环境变量');
      } else {
        console.log('  ⚠️ 可能没有正确使用环境变量');
      }
      
      // 检查错误处理
      if (content.includes('try') && content.includes('catch')) {
        console.log('  ✅ 包含错误处理');
      } else {
        console.log('  ⚠️ 缺少错误处理');
      }
      
    } else {
      console.log(`❌ ${file} 文件不存在`);
    }
  } catch (error) {
    console.log(`❌ 检查 ${file} 时出错: ${error.message}`);
  }
});

console.log('\n🎯 诊断总结');
console.log('============');
console.log('1. 如果 API 连接测试成功，但应用中无法生成报告，问题可能在于:');
console.log('   - 前端请求格式不正确');
console.log('   - API 路由中的错误处理过于严格');
console.log('   - AI 服务管理器的回退逻辑问题');
console.log('');
console.log('2. 如果 API 连接测试失败，需要:');
console.log('   - 检查 API Key 的有效性');
console.log('   - 确认网络连接和防火墙设置');
console.log('   - 验证 Google AI Studio 的配置');
console.log('');
console.log('3. 建议的下一步:');
console.log('   - 运行 npm run dev 启动开发服务器');
console.log('   - 在浏览器中测试报告生成功能');
console.log('   - 检查浏览器控制台和服务器日志');
console.log('   - 使用 node scripts/test-api-endpoints.js 测试 API 端点');