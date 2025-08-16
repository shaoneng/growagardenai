#!/usr/bin/env node
// 全面诊断系统问题

console.log('🔍 Comprehensive System Diagnosis...\n');

const fs = require('fs');
const path = require('path');

// 1. 检查文件结构
console.log('📁 Checking File Structure:');

const criticalPaths = [
  'src/app/api/analyze/route.ts',
  'src/context/AppContext.jsx',
  'src/app/components/feature/MultiStyleReport.tsx',
  '.env.local'
];

criticalPaths.forEach(filePath => {
  const fullPath = path.join(process.cwd(), filePath);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${filePath} - EXISTS`);
  } else {
    console.log(`❌ ${filePath} - MISSING`);
  }
});

// 2. 检查 API 路由内容
console.log('\n🚀 Checking API Route:');
const apiPath = path.join(process.cwd(), 'src/app/api/analyze/route.ts');
if (fs.existsSync(apiPath)) {
  const content = fs.readFileSync(apiPath, 'utf8');
  
  if (content.includes('export async function POST')) {
    console.log('✅ POST function exported');
  } else {
    console.log('❌ POST function NOT exported');
  }
  
  if (content.includes('NextResponse.json')) {
    console.log('✅ Returns NextResponse.json');
  } else {
    console.log('❌ Does NOT return NextResponse.json');
  }
  
  if (content.includes('Content-Type')) {
    console.log('✅ Sets Content-Type header');
  } else {
    console.log('❌ Does NOT set Content-Type header');
  }
} else {
  console.log('❌ API route file missing');
}

// 3. 检查 AppContext 调用
console.log('\n📱 Checking AppContext:');
const appContextPath = path.join(process.cwd(), 'src/context/AppContext.jsx');
if (fs.existsSync(appContextPath)) {
  const content = fs.readFileSync(appContextPath, 'utf8');
  
  if (content.includes("fetch('/api/analyze'")) {
    console.log('✅ Calls /api/analyze endpoint');
  } else {
    console.log('❌ Does NOT call /api/analyze endpoint');
  }
  
  if (content.includes('POST')) {
    console.log('✅ Uses POST method');
  } else {
    console.log('❌ Does NOT use POST method');
  }
  
  if (content.includes('Content-Type')) {
    console.log('✅ Sets Content-Type header');
  } else {
    console.log('❌ Does NOT set Content-Type header');
  }
} else {
  console.log('❌ AppContext file missing');
}

// 4. 检查环境变量
console.log('\n🔑 Checking Environment:');
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  console.log('✅ .env.local exists');
  const envContent = fs.readFileSync(envPath, 'utf8');
  if (envContent.includes('GEMINI_API_KEY')) {
    console.log('✅ GEMINI_API_KEY configured');
  } else {
    console.log('❌ GEMINI_API_KEY NOT configured');
  }
} else {
  console.log('❌ .env.local missing');
}

console.log('\n🎯 DIAGNOSIS SUMMARY:');
console.log('Based on the errors, the most likely issues are:');
console.log('1. API route not properly configured or accessible');
console.log('2. Request/response format mismatch');
console.log('3. Server-side errors causing incomplete responses');
console.log('4. Routing configuration issues');

console.log('\n✅ Diagnosis Complete!');