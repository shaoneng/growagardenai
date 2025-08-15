#!/usr/bin/env node
// 测试 Gemini API 修复

console.log('🧪 Testing Gemini API Integration Fix...\n');

const fs = require('fs');
const path = require('path');

// 检查修复状态
console.log('📋 Checking Fix Status:');

// 1. 检查 API 路由是否启用
const apiPath = path.join(process.cwd(), 'src/app/api');
const apiDisabledPath = path.join(process.cwd(), 'src/app/api.disabled');

if (fs.existsSync(apiPath)) {
  console.log('✅ API routes are ENABLED');
} else {
  console.log('❌ API routes are still DISABLED');
}

// 2. 检查 API 路由内容
const apiRoutePath = path.join(process.cwd(), 'src/app/api/analyze/route.ts');
if (fs.existsSync(apiRoutePath)) {
  const content = fs.readFileSync(apiRoutePath, 'utf8');
  
  if (content.includes('Gemini AI-powered analysis')) {
    console.log('✅ API route updated for Gemini AI');
  } else {
    console.log('❌ API route NOT updated for Gemini AI');
  }
  
  if (content.includes('console.log')) {
    console.log('✅ API route has logging for debugging');
  }
} else {
  console.log('❌ API route file not found');
}

// 3. 检查 AppContext 更新
const appContextPath = path.join(process.cwd(), 'src/context/AppContext.jsx');
if (fs.existsSync(appContextPath)) {
  const content = fs.readFileSync(appContextPath, 'utf8');
  
  if (content.includes("fetch('/api/analyze')")) {
    console.log('✅ AppContext calls API route');
  } else {
    console.log('❌ AppContext does NOT call API route');
  }
  
  if (content.includes('Gemini AI via API route')) {
    console.log('✅ AppContext updated with Gemini AI calls');
  } else {
    console.log('❌ AppContext NOT updated with Gemini AI calls');
  }
} else {
  console.log('❌ AppContext file not found');
}

// 4. 检查 MultiStyleReport 更新
const multiStylePath = path.join(process.cwd(), 'src/app/components/feature/MultiStyleReport.tsx');
if (fs.existsSync(multiStylePath)) {
  const content = fs.readFileSync(multiStylePath, 'utf8');
  
  if (content.includes('defaultReportData')) {
    console.log('⚠️  MultiStyleReport still contains hardcoded data');
  } else {
    console.log('✅ MultiStyleReport hardcoded data removed');
  }
  
  if (content.includes('AI-generated report data')) {
    console.log('✅ MultiStyleReport updated to use AI data');
  } else {
    console.log('❌ MultiStyleReport NOT updated to use AI data');
  }
} else {
  console.log('❌ MultiStyleReport file not found');
}

// 5. 检查环境配置示例
const envExamplePath = path.join(process.cwd(), '.env.example');
if (fs.existsSync(envExamplePath)) {
  console.log('✅ .env.example created');
} else {
  console.log('❌ .env.example not found');
}

// 6. 检查 advisor-engine 环境变量更新
const advisorEnginePath = path.join(process.cwd(), 'src/lib/advisor-engine.ts');
if (fs.existsSync(advisorEnginePath)) {
  const content = fs.readFileSync(advisorEnginePath, 'utf8');
  
  if (content.includes('NEXT_PUBLIC_GEMINI_API_KEY')) {
    console.log('✅ advisor-engine checks both API key formats');
  } else {
    console.log('❌ advisor-engine does NOT check both API key formats');
  }
} else {
  console.log('❌ advisor-engine file not found');
}

console.log('\n🎯 NEXT STEPS TO COMPLETE THE FIX:');
console.log('1. Create .env.local file with your Gemini API key:');
console.log('   GEMINI_API_KEY=your_actual_api_key_here');
console.log('');
console.log('2. Test the integration:');
console.log('   npm run dev');
console.log('   Go to homepage → Select items → Generate report');
console.log('');
console.log('3. Check browser console for:');
console.log('   "🚀 AppContext: Calling Gemini AI via API route..."');
console.log('   "✅ AppContext: Gemini AI report received!"');
console.log('');
console.log('4. Check server console for:');
console.log('   "🚀 API: Starting Gemini AI-powered analysis..."');
console.log('   "✅ API: Gemini AI report generated successfully!"');

console.log('\n✅ Gemini API Fix Verification Complete!');