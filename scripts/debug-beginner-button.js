#!/usr/bin/env node
/**
 * Debug Beginner Guide Button Issue
 * 调试新手指南按钮问题
 */

console.log('🔧 Debugging Beginner Guide Button Issue...\n');

const fs = require('fs');

// Test 1: 检查BeginnerGuide组件的按钮实现
console.log('✅ Test 1: BeginnerGuide Button Implementation');
try {
  const beginnerGuidePath = './src/app/components/feature/BeginnerGuide.jsx';
  if (fs.existsSync(beginnerGuidePath)) {
    const beginnerGuideContent = fs.readFileSync(beginnerGuidePath, 'utf8');
    
    const buttonFeatures = [
      'onClick.*handleGetPersonalizedAdvice',
      'disabled.*isLoading',
      'handleGetPersonalizedAdvice.*async',
      'await requestAnalysisWithParams',
      'useAppContext.*from.*@/context/AppContext'
    ];
    
    const foundFeatures = buttonFeatures.filter(feature => 
      new RegExp(feature.replace('*', '.*')).test(beginnerGuideContent)
    );
    
    console.log(`   ✓ Button features found: ${foundFeatures.length}/${buttonFeatures.length}`);
    foundFeatures.forEach(feature => console.log(`      - ${feature}`));
    
    // 检查按钮的具体实现
    const buttonMatch = beginnerGuideContent.match(/<button[^>]*onClick[^>]*>[\s\S]*?<\/button>/);
    if (buttonMatch) {
      console.log('   ✓ Button element found');
      console.log('   📝 Button implementation:');
      console.log('      ' + buttonMatch[0].substring(0, 200) + '...');
    } else {
      console.log('   ❌ Button element not found');
    }
    
  } else {
    console.log('   ❌ BeginnerGuide component not found');
  }
} catch (error) {
  console.log('   ❌ Error checking BeginnerGuide:', error.message);
}

// Test 2: 检查AppContext的requestAnalysisWithParams实现
console.log('\n✅ Test 2: AppContext requestAnalysisWithParams');
try {
  const appContextPath = './src/context/AppContext.jsx';
  if (fs.existsSync(appContextPath)) {
    const appContextContent = fs.readFileSync(appContextPath, 'utf8');
    
    const contextFeatures = [
      'requestAnalysisWithParams.*async',
      'useBeginnerDefaults.*=.*false',
      'goldAmount.*=.*null',
      'gameDateParam.*=.*null',
      'interactionMode.*===.*beginner',
      'router\\.push.*report'
    ];
    
    const foundContext = contextFeatures.filter(feature => 
      new RegExp(feature.replace('*', '.*').replace('\\\\', '\\')).test(appContextContent)
    );
    
    console.log(`   ✓ Context features found: ${foundContext.length}/${contextFeatures.length}`);
    foundContext.forEach(feature => console.log(`      - ${feature}`));
    
    // 检查函数导出
    if (appContextContent.includes('requestAnalysisWithParams,')) {
      console.log('   ✅ requestAnalysisWithParams is exported');
    } else {
      console.log('   ❌ requestAnalysisWithParams not exported');
    }
    
  } else {
    console.log('   ❌ AppContext not found');
  }
} catch (error) {
  console.log('   ❌ Error checking AppContext:', error.message);
}

// Test 3: 检查可能的问题
console.log('\n✅ Test 3: Potential Issues Analysis');

try {
  const beginnerGuideContent = fs.readFileSync('./src/app/components/feature/BeginnerGuide.jsx', 'utf8');
  const appContextContent = fs.readFileSync('./src/context/AppContext.jsx', 'utf8');
  
  const issues = [];
  
  // 检查interactionMode设置
  if (!beginnerGuideContent.includes('setInteractionMode')) {
    issues.push('BeginnerGuide不设置interactionMode为beginner');
  }
  
  // 检查按钮禁用逻辑
  if (beginnerGuideContent.includes('disabled={isLoading}')) {
    console.log('   ✓ Button has loading state handling');
  } else {
    issues.push('按钮缺少loading状态处理');
  }
  
  // 检查错误处理
  if (beginnerGuideContent.includes('try') && beginnerGuideContent.includes('catch')) {
    console.log('   ✓ Error handling present');
  } else {
    issues.push('缺少错误处理');
  }
  
  // 检查API路由
  if (appContextContent.includes('/api/analyze')) {
    console.log('   ✓ API route configured');
  } else {
    issues.push('API路由配置问题');
  }
  
  if (issues.length > 0) {
    console.log('   ⚠️  Potential issues found:');
    issues.forEach(issue => console.log(`      - ${issue}`));
  } else {
    console.log('   ✅ No obvious issues found');
  }
  
} catch (error) {
  console.log('   ❌ Error analyzing issues:', error.message);
}

// Test 4: 检查API路由是否存在
console.log('\n✅ Test 4: API Route Check');
try {
  const apiPaths = [
    './src/app/api/analyze/route.ts',
    './src/app/api/analyze/route.js',
    './pages/api/analyze.js',
    './pages/api/analyze.ts'
  ];
  
  let apiFound = false;
  let apiPath = '';
  
  for (const path of apiPaths) {
    if (fs.existsSync(path)) {
      apiFound = true;
      apiPath = path;
      break;
    }
  }
  
  if (apiFound) {
    console.log(`   ✅ API route found at: ${apiPath}`);
    
    const apiContent = fs.readFileSync(apiPath, 'utf8');
    if (apiContent.includes('POST') || apiContent.includes('post')) {
      console.log('   ✅ POST method supported');
    } else {
      console.log('   ⚠️  POST method may not be supported');
    }
  } else {
    console.log('   ❌ API route not found');
    console.log('   📝 Expected locations:');
    apiPaths.forEach(path => console.log(`      - ${path}`));
  }
} catch (error) {
  console.log('   ❌ Error checking API route:', error.message);
}

console.log('\n🎯 Diagnosis Summary:');
console.log('   🔍 CHECKING: Button click functionality in BeginnerGuide');
console.log('   📋 COMPONENTS: BeginnerGuide.jsx, AppContext.jsx, API route');
console.log('   🎯 FOCUS: requestAnalysisWithParams function call');

console.log('\n🔧 Possible Solutions:');
console.log('   1. 确保interactionMode设置为"beginner"');
console.log('   2. 检查API路由是否正常工作');
console.log('   3. 验证requestAnalysisWithParams参数传递');
console.log('   4. 检查按钮的CSS样式是否阻止点击');
console.log('   5. 确认没有JavaScript错误阻止执行');

console.log('\n🚀 Next Steps:');
console.log('   1. 运行开发服务器并检查浏览器控制台');
console.log('   2. 测试按钮点击是否触发console.log');
console.log('   3. 检查网络请求是否发送到API');
console.log('   4. 验证API响应是否正常');