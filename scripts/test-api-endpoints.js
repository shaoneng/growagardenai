#!/usr/bin/env node

/**
 * API端点实际测试脚本
 * 测试修复后的API是否正常工作
 */

const http = require('http');

console.log('🚀 Testing API Endpoints...\n');

// 测试配置
const API_BASE = 'http://localhost:3000';
const ANALYZE_ENDPOINT = '/api/analyze';

// 测试数据
const testCases = [
  {
    name: '✅ Valid Request',
    data: {
      selectedItems: { "1": 5, "2": 3, "3": 2 },
      gold: 500,
      inGameDate: "Spring, Day 15",
      currentDate: "2024-01-15",
      interactionMode: "beginner"
    },
    expectedStatus: 200
  },
  {
    name: '❌ Missing Required Fields',
    data: {
      selectedItems: { "1": 5 },
      gold: 500
      // missing inGameDate and currentDate
    },
    expectedStatus: 400
  },
  {
    name: '❌ Invalid Gold Type',
    data: {
      selectedItems: { "1": 5 },
      gold: "invalid",
      inGameDate: "Spring, Day 15",
      currentDate: "2024-01-15"
    },
    expectedStatus: 400
  },
  {
    name: '❌ Empty Items',
    data: {
      selectedItems: {},
      gold: 500,
      inGameDate: "Spring, Day 15",
      currentDate: "2024-01-15"
    },
    expectedStatus: 400
  },
  {
    name: '❌ Invalid JSON',
    data: 'invalid json',
    expectedStatus: 400,
    isInvalidJson: true
  }
];

// HTTP请求函数
function makeRequest(endpoint, data, isInvalidJson = false) {
  return new Promise((resolve, reject) => {
    const postData = isInvalidJson ? data : JSON.stringify(data);
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: endpoint,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: parsedData
          });
        } catch (parseError) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: responseData,
            parseError: true
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

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

// 运行测试
async function runTests() {
  console.log('🔍 Checking if server is running...');
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    console.log('❌ Server is not running on localhost:3000');
    console.log('💡 Please start the development server with: npm run dev');
    return;
  }
  
  console.log('✅ Server is running\n');
  
  console.log('🧪 Running API tests...\n');
  
  let passedTests = 0;
  let totalTests = testCases.length;
  
  for (const testCase of testCases) {
    try {
      console.log(`Testing: ${testCase.name}`);
      
      const response = await makeRequest(
        ANALYZE_ENDPOINT, 
        testCase.data, 
        testCase.isInvalidJson
      );
      
      // 检查状态码
      const statusMatch = response.status === testCase.expectedStatus;
      console.log(`  Status: ${response.status} (expected: ${testCase.expectedStatus}) ${statusMatch ? '✅' : '❌'}`);
      
      // 检查响应格式
      if (!response.parseError && typeof response.data === 'object') {
        const hasSuccess = 'success' in response.data;
        const hasMetadata = 'metadata' in response.data;
        const hasRequestId = response.headers['x-request-id'];
        
        console.log(`  Response format: ${hasSuccess && hasMetadata ? '✅' : '❌'}`);
        console.log(`  Request ID: ${hasRequestId ? '✅' : '❌'}`);
        
        // 成功响应检查
        if (response.data.success) {
          const hasData = 'data' in response.data;
          const hasReportStructure = hasData && response.data.data.mainTitle;
          console.log(`  Report structure: ${hasReportStructure ? '✅' : '❌'}`);
        }
        
        // 错误响应检查
        if (!response.data.success) {
          const hasError = 'error' in response.data;
          const hasUserMessage = hasError && response.data.error.userMessage;
          console.log(`  Error structure: ${hasError ? '✅' : '❌'}`);
          console.log(`  User message: ${hasUserMessage ? '✅' : '❌'}`);
        }
      }
      
      if (statusMatch) {
        passedTests++;
        console.log(`  Result: ✅ PASSED\n`);
      } else {
        console.log(`  Result: ❌ FAILED\n`);
      }
      
    } catch (error) {
      console.log(`  Error: ${error.message}`);
      console.log(`  Result: ❌ FAILED\n`);
    }
  }
  
  // 测试总结
  console.log('📊 Test Summary:');
  console.log(`Passed: ${passedTests}/${totalTests}`);
  console.log(`Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 All tests passed! API stability fix is working correctly.');
  } else {
    console.log('\n⚠️ Some tests failed. Please check the implementation.');
  }
  
  console.log('\n🔧 Additional Manual Tests:');
  console.log('1. Open browser and test the UI');
  console.log('2. Check browser console for errors');
  console.log('3. Verify error messages are user-friendly');
  console.log('4. Test error recovery actions');
}

// 运行测试
runTests().catch(console.error);