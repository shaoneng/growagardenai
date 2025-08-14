#!/usr/bin/env node
/**
 * Test SSR Fix
 * 测试服务端渲染修复
 */

console.log('🔧 Testing SSR Fix...\n');

// 模拟服务端环境
global.window = undefined;
global.document = undefined;
global.navigator = undefined;

try {
  // 测试 UserContextDetector
  console.log('📱 Testing UserContextDetector...');
  
  // 动态导入以避免构建时错误
  const { UserContextDetector } = require('../src/lib/user-preference-manager.ts');
  
  const context = UserContextDetector.detectContext();
  console.log('✅ UserContextDetector works in SSR:', {
    deviceType: context.deviceType,
    screenSize: context.screenSize,
    timeOfDay: context.timeOfDay
  });

  // 测试 UserPreferenceManager
  console.log('\n⚙️ Testing UserPreferenceManager...');
  const { UserPreferenceManager } = require('../src/lib/user-preference-manager.ts');
  
  const manager = UserPreferenceManager.getInstance();
  const preferences = manager.getPreferences();
  console.log('✅ UserPreferenceManager works in SSR:', {
    preferredStyle: preferences.preferredStyle,
    historyLength: preferences.styleHistory.length
  });

  console.log('\n🎉 SSR Fix Test Passed!');
  console.log('\n📋 Next Steps:');
  console.log('1. Run: npm run build');
  console.log('2. Check if build passes');
  console.log('3. Deploy if successful');

} catch (error) {
  console.error('❌ SSR Fix Test Failed:', error.message);
  console.log('\n🔍 Error Details:');
  console.log('- Check for remaining window/document usage');
  console.log('- Ensure all browser APIs have SSR guards');
  console.log('- Verify TypeScript compilation');
}