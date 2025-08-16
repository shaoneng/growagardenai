#!/usr/bin/env node

const http = require('http');

const testData = {
  selectedItems: { "1": 5, "2": 3 },
  gold: 500,
  inGameDate: "Spring, Day 15",
  currentDate: new Date().toISOString(),
  interactionMode: "beginner"
};

const postData = JSON.stringify(testData);

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/debug-analyze',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('🧪 测试调试API端点...');

const req = http.request(options, (res) => {
  let data = '';
  
  console.log(`状态码: ${res.statusCode}`);
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      console.log('✅ 响应成功:');
      console.log(JSON.stringify(response, null, 2));
    } catch (e) {
      console.log('❌ JSON解析失败:');
      console.log(data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ 请求失败:', error.message);
  console.log('💡 请确保开发服务器正在运行: npm run dev');
});

req.write(postData);
req.end();
