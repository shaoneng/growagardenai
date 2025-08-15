#!/usr/bin/env node
// 验证 Gemini API 集成状态

console.log('🔍 Verifying Gemini API Integration Status...\n');

const fs = require('fs');
const path = require('path');

// 检查关键问题
console.log('📋 Integration Status Check:');

// 1. 检查 API 路由状态
const apiPath = path.join(process.cwd(), 'src/app/api');
const apiDisabledPath = path.join(process.cwd(), 'src/app/api.disabled');

if (fs.existsSync(apiPath)) {
  console.log('✅ API routes are ENABLED');
} else if (fs.existsSync(apiDisabledPath)) {
  console.log('❌ API routes are DISABLED (in api.disabled folder)');
  console.log('   This means frontend cannot call Gemini API via server routes');
} else {
  console.log('❌ No API routes found');
}

// 2. 检查前端组件是否调用 API
console.log('\n🔍 Checking frontend components for API calls...');

const componentsToCheck = [
  'src/app/components/feature/MultiStyleReport.tsx',
  'src/app/components/feature/styles/DashboardStyleReport.tsx',
  'src/app/components/feature/styles/MinimalStyleReport.tsx',
  'src/app/components/feature/styles/MagazineStyleReport.tsx'
];

let foundApiCalls = false;
let foundHardcodedData = false;

componentsToCheck.forEach(componentPath => {
  const filePath = path.join(process.cwd(), componentPath);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // 检查是否有 API 调用
    if (content.includes("fetch('/api/analyze')") || content.includes("fetch(\"/api/analyze\")")) {
      console.log(`✅ ${componentPath} - Makes API calls`);
      foundApiCalls = true;
    } else {
      console.log(`❌ ${componentPath} - No API calls found`);
    }
    
    // 检查是否有硬编码数据
    if (content.includes('defaultReportData') || content.includes('Strategic Briefing')) {
      console.log(`⚠️  ${componentPath} - Contains hardcoded report data`);
      foundHardcodedData = true;
    }
  }
});

// 3. 检查 advisor-engine 是否调用 Gemini
console.log('\n🤖 Checking advisor-engine for Gemini integration...');

const advisorEnginePath = path.join(process.cwd(), 'src/lib/advisor-engine.ts');
if (fs.existsSync(advisorEnginePath)) {
  const content = fs.readFileSync(advisorEnginePath, 'utf8');
  
  if (content.includes('generateGeminiEnhancedReport')) {
    console.log('✅ advisor-engine calls generateGeminiEnhancedReport');
  } else {
    console.log('❌ advisor-engine does NOT call generateGeminiEnhancedReport');
  }
  
  if (content.includes('generateEnhancedAIReport')) {
    console.log('✅ advisor-engine imports enhanced AI report generator');
  } else {
    console.log('❌ advisor-engine does NOT import enhanced AI report generator');
  }
  
  if (content.includes('GEMINI_API_KEY')) {
    console.log('✅ advisor-engine checks for Gemini API key');
  } else {
    console.log('❌ advisor-engine does NOT check for Gemini API key');
  }
} else {
  console.log('❌ advisor-engine.ts not found');
}

// 4. 检查环境配置
console.log('\n🔑 Checking environment configuration...');

const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  if (envContent.includes('NEXT_PUBLIC_GEMINI_API_KEY') || envContent.includes('GEMINI_API_KEY')) {
    console.log('✅ Gemini API key is configured');
  } else {
    console.log('❌ Gemini API key is NOT configured');
  }
} else {
  console.log('❌ .env.local file not found');
}

// 5. 检查增强的 AI 报告生成器
console.log('\n🚀 Checking enhanced AI report generator...');

const enhancedGeneratorPath = path.join(process.cwd(), 'src/lib/enhanced-ai-report-generator.ts');
if (fs.existsSync(enhancedGeneratorPath)) {
  const content = fs.readFileSync(enhancedGeneratorPath, 'utf8');
  
  if (content.includes('GoogleGenerativeAI')) {
    console.log('✅ Enhanced generator uses GoogleGenerativeAI');
  } else {
    console.log('❌ Enhanced generator does NOT use GoogleGenerativeAI');
  }
  
  if (content.includes('generateContent')) {
    console.log('✅ Enhanced generator calls generateContent');
  } else {
    console.log('❌ Enhanced generator does NOT call generateContent');
  }
} else {
  console.log('❌ enhanced-ai-report-generator.ts not found');
}

// 总结问题
console.log('\n📊 DIAGNOSIS SUMMARY:');
console.log('='.repeat(50));

if (!fs.existsSync(apiPath) && fs.existsSync(apiDisabledPath)) {
  console.log('🚨 CRITICAL ISSUE: API routes are disabled');
  console.log('   Frontend cannot call server-side Gemini API');
}

if (!foundApiCalls) {
  console.log('🚨 CRITICAL ISSUE: Frontend components do not make API calls');
  console.log('   Components use hardcoded data instead of Gemini AI');
}

if (foundHardcodedData) {
  console.log('⚠️  WARNING: Components contain hardcoded report data');
  console.log('   This overrides any potential AI-generated content');
}

// 解决方案
console.log('\n🔧 SOLUTION STEPS:');
console.log('1. Enable API routes: mv src/app/api.disabled src/app/api');
console.log('2. Update frontend components to call /api/analyze endpoint');
console.log('3. Remove hardcoded report data from components');
console.log('4. Ensure GEMINI_API_KEY is set in .env.local');
console.log('5. Test the full flow: Frontend → API → Gemini AI → Response');

console.log('\n✅ Gemini API Integration Verification Complete!');