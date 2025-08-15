#!/usr/bin/env node
// 最终验证 Gemini AI 集成

console.log('🔍 Final Gemini AI Integration Verification...\n');

const fs = require('fs');
const path = require('path');

// 1. 检查环境变量
console.log('🔑 Checking Environment Variables:');
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  if (envContent.includes('GEMINI_API_KEY=AIzaSy')) {
    console.log('✅ GEMINI_API_KEY is configured');
  } else {
    console.log('❌ GEMINI_API_KEY is NOT configured');
  }
  
  if (envContent.includes('NEXT_PUBLIC_GEMINI_API_KEY=AIzaSy')) {
    console.log('✅ NEXT_PUBLIC_GEMINI_API_KEY is configured');
  } else {
    console.log('❌ NEXT_PUBLIC_GEMINI_API_KEY is NOT configured');
  }
} else {
  console.log('❌ .env.local file not found');
}

// 2. 检查 API 路由
console.log('\n🚀 Checking API Route:');
const apiPath = path.join(process.cwd(), 'src/app/api/analyze/route.ts');
if (fs.existsSync(apiPath)) {
  const content = fs.readFileSync(apiPath, 'utf8');
  
  if (content.includes('generateStrategicAdvice')) {
    console.log('✅ API calls generateStrategicAdvice');
  } else {
    console.log('❌ API does NOT call generateStrategicAdvice');
  }
  
  if (content.includes('Gemini AI-powered analysis')) {
    console.log('✅ API is configured for Gemini AI');
  } else {
    console.log('❌ API is NOT configured for Gemini AI');
  }
  
  if (content.includes('简单的响应')) {
    console.log('⚠️  API still has simplified response (should be removed)');
  } else {
    console.log('✅ API uses full Gemini integration');
  }
} else {
  console.log('❌ API route file not found');
}

// 3. 检查 advisor-engine
console.log('\n🤖 Checking Advisor Engine:');
const advisorPath = path.join(process.cwd(), 'src/lib/advisor-engine.ts');
if (fs.existsSync(advisorPath)) {
  const content = fs.readFileSync(advisorPath, 'utf8');
  
  if (content.includes('generateGeminiEnhancedReport')) {
    console.log('✅ Advisor engine calls Gemini AI');
  } else {
    console.log('❌ Advisor engine does NOT call Gemini AI');
  }
  
  if (content.includes('useGeminiEnhancement')) {
    console.log('✅ Advisor engine checks for Gemini availability');
  } else {
    console.log('❌ Advisor engine does NOT check for Gemini availability');
  }
} else {
  console.log('❌ Advisor engine file not found');
}

// 4. 检查增强的 AI 报告生成器
console.log('\n🚀 Checking Enhanced AI Report Generator:');
const enhancedPath = path.join(process.cwd(), 'src/lib/enhanced-ai-report-generator.ts');
if (fs.existsSync(enhancedPath)) {
  const content = fs.readFileSync(enhancedPath, 'utf8');
  
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
  console.log('❌ Enhanced generator file not found');
}

// 5. 检查 AppContext
console.log('\n📱 Checking AppContext:');
const appContextPath = path.join(process.cwd(), 'src/context/AppContext.jsx');
if (fs.existsSync(appContextPath)) {
  const content = fs.readFileSync(appContextPath, 'utf8');
  
  if (content.includes("fetch('/api/analyze')")) {
    console.log('✅ AppContext calls API route');
  } else {
    console.log('❌ AppContext does NOT call API route');
  }
} else {
  console.log('❌ AppContext file not found');
}

console.log('\n🎯 Expected Call Flow:');
console.log('1. User generates report → AppContext.requestAnalysis()');
console.log('2. AppContext calls fetch(\'/api/analyze\')');
console.log('3. API route calls generateStrategicAdvice()');
console.log('4. generateStrategicAdvice() calls generateGeminiEnhancedReport()');
console.log('5. generateGeminiEnhancedReport() calls generateEnhancedAIReport()');
console.log('6. generateEnhancedAIReport() makes actual Gemini API call');
console.log('7. AI-generated report flows back to frontend');

console.log('\n🧪 To Test:');
console.log('1. Run: npm run dev');
console.log('2. Open browser and generate a report');
console.log('3. Check browser console for:');
console.log('   "🚀 AppContext: Calling Gemini AI via API route..."');
console.log('   "✅ AppContext: Gemini AI report received!"');
console.log('4. Check server console for:');
console.log('   "🚀 API: Starting Gemini AI-powered analysis..."');
console.log('   "🤖 API: Calling Gemini AI via generateStrategicAdvice..."');
console.log('   "🚀 Generating enhanced AI report with full context..."');
console.log('   "✅ Enhanced AI report generated successfully"');
console.log('   "✅ API: Gemini AI report generated successfully!"');

console.log('\n✅ Gemini AI Integration Verification Complete!');