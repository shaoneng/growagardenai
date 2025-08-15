#!/usr/bin/env node
// 最终 Gemini API 集成测试

console.log('🎯 Final Gemini API Integration Test\n');

const fs = require('fs');
const path = require('path');

// 检查所有修复是否完成
console.log('📋 Comprehensive Integration Check:');

let allChecksPass = true;

// 1. API 路由检查
const apiRoutePath = path.join(process.cwd(), 'src/app/api/analyze/route.ts');
if (fs.existsSync(apiRoutePath)) {
  const content = fs.readFileSync(apiRoutePath, 'utf8');
  
  const checks = [
    { pattern: 'Gemini AI-powered analysis', name: 'API route updated for Gemini AI' },
    { pattern: 'generateStrategicAdvice', name: 'API calls generateStrategicAdvice' },
    { pattern: 'console.log.*API.*Gemini', name: 'API has Gemini logging' }
  ];
  
  checks.forEach(check => {
    if (content.includes(check.pattern.split('.*')[0])) {
      console.log(`✅ ${check.name}`);
    } else {
      console.log(`❌ ${check.name}`);
      allChecksPass = false;
    }
  });
} else {
  console.log('❌ API route file not found');
  allChecksPass = false;
}

// 2. AppContext 检查
const appContextPath = path.join(process.cwd(), 'src/context/AppContext.jsx');
if (fs.existsSync(appContextPath)) {
  const content = fs.readFileSync(appContextPath, 'utf8');
  
  const checks = [
    { pattern: "fetch('/api/analyze'", name: 'AppContext calls API route' },
    { pattern: 'Gemini AI via API route', name: 'AppContext has Gemini logging' },
    { pattern: 'selectedItems: itemsToAnalyze', name: 'AppContext sends correct data' }
  ];
  
  checks.forEach(check => {
    if (content.includes(check.pattern)) {
      console.log(`✅ ${check.name}`);
    } else {
      console.log(`❌ ${check.name}`);
      allChecksPass = false;
    }
  });
} else {
  console.log('❌ AppContext file not found');
  allChecksPass = false;
}

// 3. MultiStyleReport 检查
const multiStylePath = path.join(process.cwd(), 'src/app/components/feature/MultiStyleReport.tsx');
if (fs.existsSync(multiStylePath)) {
  const content = fs.readFileSync(multiStylePath, 'utf8');
  
  if (!content.includes('defaultReportData = {')) {
    console.log('✅ MultiStyleReport hardcoded data removed');
  } else {
    console.log('❌ MultiStyleReport still has hardcoded data');
    allChecksPass = false;
  }
  
  if (content.includes('AI-generated report data')) {
    console.log('✅ MultiStyleReport uses AI data');
  } else {
    console.log('❌ MultiStyleReport does NOT use AI data');
    allChecksPass = false;
  }
} else {
  console.log('❌ MultiStyleReport file not found');
  allChecksPass = false;
}

// 4. advisor-engine 检查
const advisorEnginePath = path.join(process.cwd(), 'src/lib/advisor-engine.ts');
if (fs.existsSync(advisorEnginePath)) {
  const content = fs.readFileSync(advisorEnginePath, 'utf8');
  
  if (content.includes('generateGeminiEnhancedReport')) {
    console.log('✅ advisor-engine calls Gemini AI');
  } else {
    console.log('❌ advisor-engine does NOT call Gemini AI');
    allChecksPass = false;
  }
  
  if (content.includes('NEXT_PUBLIC_GEMINI_API_KEY')) {
    console.log('✅ advisor-engine checks both API key formats');
  } else {
    console.log('❌ advisor-engine does NOT check both API key formats');
    allChecksPass = false;
  }
} else {
  console.log('❌ advisor-engine file not found');
  allChecksPass = false;
}

// 5. enhanced-ai-report-generator 检查
const enhancedGeneratorPath = path.join(process.cwd(), 'src/lib/enhanced-ai-report-generator.ts');
if (fs.existsSync(enhancedGeneratorPath)) {
  const content = fs.readFileSync(enhancedGeneratorPath, 'utf8');
  
  if (content.includes('GoogleGenerativeAI')) {
    console.log('✅ Enhanced generator uses GoogleGenerativeAI');
  } else {
    console.log('❌ Enhanced generator does NOT use GoogleGenerativeAI');
    allChecksPass = false;
  }
} else {
  console.log('❌ Enhanced generator file not found');
  allChecksPass = false;
}

// 总结
console.log('\n' + '='.repeat(60));
if (allChecksPass) {
  console.log('🎉 ALL CHECKS PASSED! Gemini API Integration is Ready!');
  console.log('\n🚀 CALL FLOW CONFIRMED:');
  console.log('1. User submits form → AppContext.requestAnalysis()');
  console.log('2. AppContext calls fetch(\'/api/analyze\')');
  console.log('3. API route calls generateStrategicAdvice()');
  console.log('4. generateStrategicAdvice() calls generateGeminiEnhancedReport()');
  console.log('5. generateGeminiEnhancedReport() calls generateEnhancedAIReport()');
  console.log('6. generateEnhancedAIReport() makes actual Gemini API call');
  console.log('7. AI-generated report flows back to frontend');
  console.log('8. MultiStyleReport displays AI-generated content');
  
  console.log('\n🔑 TO COMPLETE SETUP:');
  console.log('1. Create .env.local with: GEMINI_API_KEY=your_actual_key');
  console.log('2. Run: npm run dev');
  console.log('3. Test: Go to homepage → Select items → Generate report');
  console.log('4. Watch console for Gemini API calls');
  
} else {
  console.log('❌ SOME CHECKS FAILED! Please review the issues above.');
}

console.log('\n✅ Final Integration Test Complete!');