#!/usr/bin/env node
// 测试 API 是否正常工作

const testApi = async () => {
  try {
    console.log('🧪 Testing API...');
    
    // 这里只是显示测试步骤，实际测试需要在浏览器中进行
    console.log('📋 Test Steps:');
    console.log('1. Run: npm run dev');
    console.log('2. Open browser to http://localhost:3000');
    console.log('3. Try to generate a report');
    console.log('4. Check browser console for API calls');
    console.log('5. Check server console for API logs');
    
    console.log('\n🔍 Expected Logs:');
    console.log('Browser: "🧪 AppContext: Testing API connection..."');
    console.log('Server: "🚀 API: Starting analysis..."');
    console.log('Server: "✅ API: Returning response"');
    console.log('Browser: "✅ AppContext: Gemini AI report received!"');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

testApi();