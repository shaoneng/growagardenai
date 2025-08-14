#!/usr/bin/env node
/**
 * Debug script for Button Click Issue
 * 调试按钮点击问题
 */

console.log('🔍 Debugging Button Click Issue...\n');

const fs = require('fs');

// Test 1: 检查BeginnerGuide组件的按钮实现
console.log('✅ Test 1: BeginnerGuide Button Implementation');
try {
  const beginnerGuidePath = './src/app/components/feature/BeginnerGuide.jsx';
  if (fs.existsSync(beginnerGuidePath)) {
    const beginnerGuideContent = fs.readFileSync(beginnerGuidePath, 'utf8');
    
    const buttonFeatures = [
      'onClick={handleGetPersonalizedAdvice}',
      'handleGetPersonalizedAdvice.*async',
      'requestAnalysisWithParams.*true.*playerGold.*gameDate',
      'disabled={isLoading}',
      'Create My Personal Plan',
      'useAppContext'
    ];
    
    const foundFeatures = buttonFeatures.filter(feature => 
      new RegExp(feature.replace('*', '.*')).test(beginnerGuideContent)
    );
    
    console.log(`   ✓ Button features found: ${foundFeatures.length}/${buttonFeatures.length}`);
    foundFeatures.forEach(feature => console.log(`      - ${feature}`));
    
    if (foundFeatures.length >= 5) {
      console.log('   ✅ Button implementation looks correct');
    } else {
      console.log('   ⚠️  Button implementation may have issues');
    }
  } else {
    console.log('   ❌ BeginnerGuide component not found');
  }
} catch (error) {
  console.log('   ❌ Error checking BeginnerGuide:', error.message);
}

// Test 2: 检查AppContext中的requestAnalysisWithParams实现
console.log('\n✅ Test 2: AppContext requestAnalysisWithParams Implementation');
try {
  const appContextPath = './src/context/AppContext.jsx';
  if (fs.existsSync(appContextPath)) {
    const appContextContent = fs.readFileSync(appContextPath, 'utf8');
    
    const contextFeatures = [
      'requestAnalysisWithParams.*async',
      'useBeginnerDefaults.*goldAmount.*gameDateParam',
      'fetch.*\\/api\\/analyze',
      'method.*POST',
      'Content-Type.*application\\/json',
      'selectedItems.*itemsToAnalyze',
      'setIsLoading.*true',
      'setIsLoading.*false',
      'router.push.*\\/report',
      'catch.*error'
    ];
    
    const foundContext = contextFeatures.filter(feature => 
      new RegExp(feature.replace('*', '.*').replace('\\/', '\\/')).test(appContextContent)
    );
    
    console.log(`   ✓ Context features found: ${foundContext.length}/${contextFeatures.length}`);
    foundContext.forEach(feature => console.log(`      - ${feature}`));
    
    if (foundContext.length >= 8) {
      console.log('   ✅ AppContext implementation looks correct');
    } else {
      console.log('   ⚠️  AppContext implementation may have issues');
    }
  } else {
    console.log('   ❌ AppContext file not found');
  }
} catch (error) {
  console.log('   ❌ Error checking AppContext:', error.message);
}

// Test 3: 检查API路由是否存在
console.log('\n✅ Test 3: API Route Existence');
try {
  const apiPaths = [
    './src/app/api/analyze/route.js',
    './src/app/api/analyze/route.ts',
    './src/pages/api/analyze.js',
    './src/pages/api/analyze.ts'
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
    const apiFeatures = [
      'POST.*export',
      'selectedItems',
      'gold',
      'inGameDate',
      'interactionMode',
      'Response.*json'
    ];
    
    const foundApi = apiFeatures.filter(feature => 
      new RegExp(feature.replace('*', '.*')).test(apiContent)
    );
    
    console.log(`   ✓ API features found: ${foundApi.length}/${apiFeatures.length}`);
    if (foundApi.length >= 4) {
      console.log('   ✅ API implementation looks correct');
    } else {
      console.log('   ⚠️  API implementation may have issues');
    }
  } else {
    console.log('   ❌ API route not found in any expected location');
    console.log('   📝 Expected locations:');
    apiPaths.forEach(path => console.log(`      - ${path}`));
  }
} catch (error) {
  console.log('   ❌ Error checking API route:', error.message);
}

// Test 4: 检查可能的JavaScript错误
console.log('\n✅ Test 4: Potential JavaScript Issues');
try {
  const beginnerGuideContent = fs.readFileSync('./src/app/components/feature/BeginnerGuide.jsx', 'utf8');
  
  const potentialIssues = [
    {
      name: 'Missing await keyword',
      pattern: /requestAnalysisWithParams\(.*\);(?!\s*await)/,
      severity: 'warning'
    },
    {
      name: 'Undefined useAppContext',
      pattern: /useAppContext.*undefined/,
      severity: 'error'
    },
    {
      name: 'Missing error handling',
      pattern: /handleGetPersonalizedAdvice.*{[^}]*}$/m,
      severity: 'warning'
    },
    {
      name: 'Button disabled state',
      pattern: /disabled={isLoading}/,
      severity: 'info'
    }
  ];
  
  console.log('   🔍 Checking for potential issues:');
  potentialIssues.forEach(issue => {
    const found = issue.pattern.test(beginnerGuideContent);
    const status = found ? '✓' : '✗';
    const severity = issue.severity === 'error' ? '❌' : issue.severity === 'warning' ? '⚠️' : 'ℹ️';
    console.log(`      ${status} ${severity} ${issue.name}`);
  });
  
} catch (error) {
  console.log('   ❌ Error checking for JavaScript issues:', error.message);
}

// Test 5: 检查控制台错误的常见原因
console.log('\n✅ Test 5: Common Console Error Causes');
console.log('   🔍 Potential causes for button not responding:');
console.log('      1. JavaScript errors preventing event handlers from working');
console.log('      2. API endpoint not responding or returning errors');
console.log('      3. Missing dependencies in useAppContext');
console.log('      4. Network issues preventing API calls');
console.log('      5. Button disabled due to loading state');
console.log('      6. Event propagation being stopped by parent elements');

console.log('\n🛠️ Debugging Steps to Try:');
console.log('   1. Open browser DevTools (F12)');
console.log('   2. Check Console tab for JavaScript errors');
console.log('   3. Check Network tab when clicking the button');
console.log('   4. Verify API endpoint is accessible');
console.log('   5. Check if button is actually disabled');
console.log('   6. Add console.log in handleGetPersonalizedAdvice function');

console.log('\n🔧 Quick Fixes to Try:');
console.log('   1. Add error handling to handleGetPersonalizedAdvice');
console.log('   2. Add console.log to verify function is being called');
console.log('   3. Check if API route exists and is working');
console.log('   4. Verify useAppContext is properly imported');
console.log('   5. Check if there are any blocking CSS styles');

console.log('\n🎯 Next Steps:');
console.log('   1. Check browser console for errors');
console.log('   2. Verify API endpoint is working');
console.log('   3. Add debugging logs to track function execution');
console.log('   4. Test with simplified button click handler');

console.log('\n🔍 Button Click Debug Complete!');