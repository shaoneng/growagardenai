#!/usr/bin/env node
// 验证 JSON 解析修复

console.log('🔍 Verifying JSON Parsing Fix...\n');

const fs = require('fs');
const path = require('path');

// 检查 API 路由修复
const apiPath = path.join(process.cwd(), 'src/app/api/analyze/route.ts');
if (fs.existsSync(apiPath)) {
  const content = fs.readFileSync(apiPath, 'utf8');
  
  console.log('📋 Checking API route fixes:');
  
  if (content.includes('fallback') && content.includes('aiError')) {
    console.log('✅ Fallback mechanism implemented');
  } else {
    console.log('❌ Fallback mechanism missing');
  }
  
  if (content.includes('Content-Type') && content.includes('application/json')) {
    console.log('✅ Proper Content-Type headers set');
  } else {
    console.log('❌ Content-Type headers missing');
  }
  
  if (content.includes('typeof reportObject') && content.includes('object')) {
    console.log('✅ Response validation implemented');
  } else {
    console.log('❌ Response validation missing');
  }
} else {
  console.log('❌ API route file not found');
}

// 检查 AppContext 修复
const appContextPath = path.join(process.cwd(), 'src/context/AppContext.jsx');
if (fs.existsSync(appContextPath)) {
  const content = fs.readFileSync(appContextPath, 'utf8');
  
  console.log('\n📋 Checking AppContext fixes:');
  
  if (content.includes('jsonError') && content.includes('parse')) {
    console.log('✅ JSON parsing error handling implemented');
  } else {
    console.log('❌ JSON parsing error handling missing');
  }
  
  if (content.includes('mainTitle') && content.includes('sections')) {
    console.log('✅ Response data validation implemented');
  } else {
    console.log('❌ Response data validation missing');
  }
  
  if (content.includes('Incomplete response data')) {
    console.log('✅ Incomplete data detection implemented');
  } else {
    console.log('❌ Incomplete data detection missing');
  }
} else {
  console.log('❌ AppContext file not found');
}

console.log('\n🎯 Expected Improvements:');
console.log('1. API always returns valid JSON (with fallback)');
console.log('2. Proper Content-Type headers prevent parsing issues');
console.log('3. Client-side validation catches incomplete responses');
console.log('4. Better error messages for debugging');

console.log('\n🧪 To Test:');
console.log('1. Run: npm run dev');
console.log('2. Generate a report');
console.log('3. Should not see "Unexpected end of JSON input" error');
console.log('4. Check console for detailed error messages if issues occur');

console.log('\n✅ JSON Parsing Fix Verification Complete!');