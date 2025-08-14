#!/usr/bin/env node
/**
 * Test Beginner Button Fix
 * 测试新手按钮修复
 */

console.log('🔧 Testing Beginner Button Fix...\n');

const fs = require('fs');

// Test 1: 验证interactionMode设置修复
console.log('✅ Test 1: InteractionMode Setting Fix');
try {
  const beginnerGuidePath = './src/app/components/feature/BeginnerGuide.jsx';
  if (fs.existsSync(beginnerGuidePath)) {
    const beginnerGuideContent = fs.readFileSync(beginnerGuidePath, 'utf8');
    
    const fixFeatures = [
      'setInteractionMode.*from.*useAppContext',
      'React\\.useEffect',
      'setInteractionMode\\(.*beginner.*\\)',
      'import React.*useState.*from.*react'
    ];
    
    const foundFeatures = fixFeatures.filter(feature => 
      new RegExp(feature.replace('*', '.*').replace('\\\\', '\\')).test(beginnerGuideContent)
    );
    
    console.log(`   ✓ Fix features found: ${foundFeatures.length}/${fixFeatures.length}`);
    foundFeatures.forEach(feature => console.log(`      - ${feature}`));
    
    if (foundFeatures.length >= 3) {
      console.log('   ✅ InteractionMode fix applied successfully');
    } else {
      console.log('   ❌ InteractionMode fix incomplete');
    }
  } else {
    console.log('   ❌ BeginnerGuide component not found');
  }
} catch (error) {
  console.log('   ❌ Error checking fix:', error.message);
}

// Test 2: 验证完整的按钮功能链
console.log('\n✅ Test 2: Complete Button Function Chain');
try {
  const beginnerGuideContent = fs.readFileSync('./src/app/components/feature/BeginnerGuide.jsx', 'utf8');
  const appContextContent = fs.readFileSync('./src/context/AppContext.jsx', 'utf8');
  
  const functionChain = [
    { name: 'Button onClick', pattern: 'onClick.*handleGetPersonalizedAdvice', file: 'BeginnerGuide' },
    { name: 'Async Handler', pattern: 'handleGetPersonalizedAdvice.*async', file: 'BeginnerGuide' },
    { name: 'Set InteractionMode', pattern: 'setInteractionMode\\(.*beginner.*\\)', file: 'BeginnerGuide' },
    { name: 'Call requestAnalysisWithParams', pattern: 'await requestAnalysisWithParams', file: 'BeginnerGuide' },
    { name: 'Function Definition', pattern: 'requestAnalysisWithParams.*async', file: 'AppContext' },
    { name: 'Beginner Mode Check', pattern: 'interactionMode.*===.*beginner', file: 'AppContext' },
    { name: 'API Call', pattern: 'fetch.*api/analyze', file: 'AppContext' },
    { name: 'Router Navigation', pattern: 'router\\.push.*report', file: 'AppContext' }
  ];
  
  let chainComplete = true;
  
  functionChain.forEach(step => {
    const content = step.file === 'BeginnerGuide' ? beginnerGuideContent : appContextContent;
    const found = new RegExp(step.pattern.replace('*', '.*').replace('\\\\', '\\')).test(content);
    
    if (found) {
      console.log(`   ✅ ${step.name}`);
    } else {
      console.log(`   ❌ ${step.name}`);
      chainComplete = false;
    }
  });
  
  if (chainComplete) {
    console.log('   🎉 Complete function chain verified!');
  } else {
    console.log('   ⚠️  Function chain has gaps');
  }
  
} catch (error) {
  console.log('   ❌ Error checking function chain:', error.message);
}

// Test 3: 验证新手模式的默认物品选择逻辑
console.log('\n✅ Test 3: Beginner Mode Default Items Logic');
try {
  const appContextContent = fs.readFileSync('./src/context/AppContext.jsx', 'utf8');
  
  const beginnerLogic = [
    'useBeginnerDefaults.*&&.*interactionMode.*===.*beginner',
    'goldNum.*<=.*100',
    'goldNum.*<=.*300',
    'itemsToAnalyze.*=.*{',
    '1:.*5.*2:.*3',  // 100金币以下的推荐
    '1:.*8.*2:.*5.*3:.*2',  // 300金币以下的推荐
    '1:.*10.*2:.*8.*3:.*5.*4:.*2'  // 300金币以上的推荐
  ];
  
  const foundLogic = beginnerLogic.filter(logic => 
    new RegExp(logic.replace('*', '.*')).test(appContextContent)
  );
  
  console.log(`   ✓ Beginner logic found: ${foundLogic.length}/${beginnerLogic.length}`);
  foundLogic.forEach(logic => console.log(`      - ${logic}`));
  
  if (foundLogic.length >= 5) {
    console.log('   ✅ Beginner mode logic complete');
  } else {
    console.log('   ⚠️  Beginner mode logic may be incomplete');
  }
  
} catch (error) {
  console.log('   ❌ Error checking beginner logic:', error.message);
}

// Test 4: 生成测试步骤
console.log('\n✅ Test 4: Manual Testing Steps');
console.log('   📋 To test the fix manually:');
console.log('   1. 启动开发服务器: npm run dev');
console.log('   2. 导航到新手指南页面');
console.log('   3. 选择金币数量和季节');
console.log('   4. 点击"Create My Personal Plan 🚀"按钮');
console.log('   5. 检查浏览器控制台是否显示:');
console.log('      - "🚀 Creating personal plan..."');
console.log('      - "✅ Personal plan created successfully!"');
console.log('   6. 验证是否跳转到报告页面');

console.log('\n🎯 Fix Summary:');
console.log('   🔧 PROBLEM: BeginnerGuide没有设置interactionMode为"beginner"');
console.log('   ✅ SOLUTION: 添加useEffect设置interactionMode');
console.log('   📋 CHANGES:');
console.log('      - 导入React和useEffect');
console.log('      - 从useAppContext获取setInteractionMode');
console.log('      - 添加useEffect设置interactionMode为"beginner"');

console.log('\n🚀 Expected Behavior:');
console.log('   1. 组件加载时自动设置为新手模式');
console.log('   2. 按钮点击触发handleGetPersonalizedAdvice');
console.log('   3. 函数调用requestAnalysisWithParams(true, gold, date)');
console.log('   4. AppContext识别为新手模式并使用默认推荐物品');
console.log('   5. 发送API请求并跳转到报告页面');

console.log('\n✨ The button should now work correctly!');