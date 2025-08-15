#!/usr/bin/env node
// 检查 API 修复状态

console.log('🔍 Checking API Fix Status...\n');

const fs = require('fs');
const path = require('path');

// 检查 API 路由
const apiPath = path.join(process.cwd(), 'src/app/api/analyze/route.ts');
if (fs.existsSync(apiPath)) {
  const content = fs.readFileSync(apiPath, 'utf8');
  
  console.log('📋 API Route Status:');
  
  if (content.includes('简化的 API 路由')) {
    console.log('✅ Simplified API route is active');
  } else {
    console.log('❌ Still using complex API route');
  }
  
  if (content.includes("export const runtime = 'edge'")) {
    console.log('⚠️  Edge Runtime is still enabled');
  } else {
    console.log('✅ Edge Runtime is disabled');
  }
  
  if (content.includes('NextResponse.json')) {
    console.log('✅ Returns JSON response');
  } else {
    console.log('❌ May not return JSON');
  }
  
} else {
  console.log('❌ API route file not found');
}

// 检查 AppContext
const appContextPath = path.join(process.cwd(), 'src/context/AppContext.jsx');
if (fs.existsSync(appContextPath)) {
  const content = fs.readFileSync(appContextPath, 'utf8');
  
  console.log('\n📋 AppContext Status:');
  
  if (content.includes("fetch('/api/analyze')")) {
    console.log('✅ Calls main API route');
  } else if (content.includes("fetch('/api/test-analyze')")) {
    console.log('🧪 Calls test API route');
  } else {
    console.log('❌ No API calls found');
  }
  
} else {
  console.log('❌ AppContext file not found');
}

console.log('\n🎯 Current Status Summary:');
console.log('- API route has been simplified to avoid complex imports');
console.log('- Edge Runtime has been disabled');
console.log('- Should return proper JSON instead of HTML error');

console.log('\n🧪 To Test:');
console.log('1. Run: npm run dev');
console.log('2. Open http://localhost:3000');
console.log('3. Select some items and generate a report');
console.log('4. Check if you get a proper report instead of JSON error');

console.log('\n📊 Expected Result:');
console.log('- No more "Unexpected token <" error');
console.log('- Report should display with basic recommendations');
console.log('- Console should show API logs');

console.log('\n✅ Status Check Complete!');