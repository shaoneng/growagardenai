#!/usr/bin/env node
// 测试 API 连接

console.log('🧪 Testing API Connection...\n');

// 模拟 fetch 请求测试
const testApiConnection = async () => {
  try {
    console.log('📡 Testing simple API connection...');
    
    // 测试数据
    const testData = {
      selectedItems: {
        1: 5,
        2: 3
      },
      gold: 100,
      inGameDate: 'Spring, Day 1',
      currentDate: new Date().toISOString(),
      interactionMode: 'advanced'
    };
    
    console.log('📊 Test data prepared:', JSON.stringify(testData, null, 2));
    
    // 注意：这个脚本在 Node.js 环境中运行，需要使用 node-fetch 或类似库
    // 但为了简单起见，我们只是显示测试步骤
    
    console.log('\n🔍 Manual Testing Steps:');
    console.log('1. Start the development server: npm run dev');
    console.log('2. Open browser developer tools');
    console.log('3. Go to the homepage and try to generate a report');
    console.log('4. Check the Network tab for API calls');
    console.log('5. Look for calls to /api/analyze or /api/test-analyze');
    
    console.log('\n🧪 Alternative: Test with curl:');
    console.log('curl -X POST http://localhost:3000/api/test-analyze \\');
    console.log('  -H "Content-Type: application/json" \\');
    console.log('  -d \'{"selectedItems":{"1":5,"2":3},"gold":100,"inGameDate":"Spring, Day 1","currentDate":"2024-01-01","interactionMode":"advanced"}\'');
    
    console.log('\n📋 Expected Response:');
    console.log('- Status: 200 OK');
    console.log('- Content-Type: application/json');
    console.log('- Body: JSON object with reportId, mainTitle, sections, etc.');
    
    console.log('\n❌ If you see HTML instead of JSON:');
    console.log('- Check server console for errors');
    console.log('- Verify API route file exists and has no syntax errors');
    console.log('- Check if Edge Runtime is causing issues');
    
  } catch (error) {
    console.error('❌ Test setup failed:', error);
  }
};

// 检查当前状态
console.log('📋 Current API Status Check:');

const fs = require('fs');
const path = require('path');

// 检查 API 路由文件
const apiPath = path.join(process.cwd(), 'src/app/api/analyze/route.ts');
const testApiPath = path.join(process.cwd(), 'src/app/api/test-analyze/route.ts');

if (fs.existsSync(apiPath)) {
  console.log('✅ Main API route exists');
  
  const content = fs.readFileSync(apiPath, 'utf8');
  if (content.includes("export const runtime = 'edge'")) {
    console.log('⚠️  Edge Runtime is enabled (may cause issues)');
  } else {
    console.log('✅ Edge Runtime is disabled');
  }
} else {
  console.log('❌ Main API route missing');
}

if (fs.existsSync(testApiPath)) {
  console.log('✅ Test API route created');
} else {
  console.log('❌ Test API route missing');
}

// 运行测试指导
testApiConnection();

console.log('\n✅ API Connection Test Setup Complete!');