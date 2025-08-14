#!/usr/bin/env node
/**
 * Test React Hooks Fix
 * 测试React Hooks修复是否成功
 */

console.log('🧪 Testing React Hooks Fix...\n');

const fs = require('fs');
const path = require('path');

// 测试特定文件的hooks导入
const testFiles = [
  {
    path: 'src/app/components/feature/PlayerLevelOnboarding.tsx',
    expectedHooks: ['useState', 'useEffect'],
    description: 'PlayerLevelOnboarding component'
  },
  {
    path: 'src/app/components/ui/PersonalizedNavigation.tsx', 
    expectedHooks: ['useEffect'],
    description: 'PersonalizedNavigation component'
  },
  {
    path: 'src/app/components/ui/ResponsiveOnboardingLayout.tsx',
    expectedHooks: ['useState', 'useEffect'],
    description: 'ResponsiveOnboardingLayout component'
  },
  {
    path: 'src/contexts/FavoritesContext.tsx',
    expectedHooks: ['useState', 'useEffect', 'useCallback', 'useMemo'],
    description: 'FavoritesContext'
  }
];

let allTestsPassed = true;

console.log('📋 Testing React Hooks Imports:\n');

testFiles.forEach(testFile => {
  const fullPath = path.resolve(__dirname, '..', testFile.path);
  
  try {
    if (!fs.existsSync(fullPath)) {
      console.log(`❌ ${testFile.description}: File not found`);
      allTestsPassed = false;
      return;
    }
    
    const content = fs.readFileSync(fullPath, 'utf8');
    
    // 检查React导入行
    const reactImportMatch = content.match(/import React(?:,\s*\{([^}]+)\})?\s+from\s+['"]react['"]/);
    
    if (!reactImportMatch) {
      console.log(`❌ ${testFile.description}: No React import found`);
      allTestsPassed = false;
      return;
    }
    
    const importedHooks = [];
    if (reactImportMatch[1]) {
      importedHooks.push(...reactImportMatch[1].split(',').map(h => h.trim()));
    }
    
    // 检查是否所有期望的hooks都被导入
    const missingHooks = testFile.expectedHooks.filter(hook => !importedHooks.includes(hook));
    
    if (missingHooks.length === 0) {
      console.log(`✅ ${testFile.description}: All hooks imported correctly`);
      console.log(`   Imported: ${importedHooks.join(', ')}`);
    } else {
      console.log(`❌ ${testFile.description}: Missing hooks: ${missingHooks.join(', ')}`);
      console.log(`   Imported: ${importedHooks.join(', ')}`);
      console.log(`   Expected: ${testFile.expectedHooks.join(', ')}`);
      allTestsPassed = false;
    }
    
  } catch (error) {
    console.log(`❌ ${testFile.description}: Error - ${error.message}`);
    allTestsPassed = false;
  }
  
  console.log('');
});

// 测试原始错误是否修复
console.log('🔍 Specific Error Fix Verification:\n');

const playerOnboardingPath = path.resolve(__dirname, '../src/app/components/feature/PlayerLevelOnboarding.tsx');
try {
  const content = fs.readFileSync(playerOnboardingPath, 'utf8');
  
  // 检查useEffect是否被导入
  const hasUseEffectImport = content.includes('useEffect') && content.match(/import React.*useEffect.*from ['"]react['"]/);
  
  // 检查useEffect是否被使用
  const hasUseEffectUsage = content.includes('useEffect(');
  
  if (hasUseEffectImport && hasUseEffectUsage) {
    console.log('✅ PlayerLevelOnboarding: useEffect import and usage verified');
    console.log('   Original error "useEffect is not defined" should be resolved');
  } else {
    console.log('❌ PlayerLevelOnboarding: useEffect issue not fully resolved');
    console.log(`   Import found: ${hasUseEffectImport}`);
    console.log(`   Usage found: ${hasUseEffectUsage}`);
    allTestsPassed = false;
  }
} catch (error) {
  console.log(`❌ PlayerLevelOnboarding verification failed: ${error.message}`);
  allTestsPassed = false;
}

console.log('\n' + '='.repeat(50));

if (allTestsPassed) {
  console.log('🎉 ALL TESTS PASSED!');
  console.log('\n✅ React Hooks Fix Status:');
  console.log('   - useEffect import error resolved');
  console.log('   - All expected hooks properly imported');
  console.log('   - Components should work without runtime errors');
  console.log('\n🚀 Ready for Testing:');
  console.log('   1. Start development server: npm run dev');
  console.log('   2. Test PlayerLevelOnboarding component');
  console.log('   3. Verify no "useEffect is not defined" errors');
} else {
  console.log('❌ SOME TESTS FAILED!');
  console.log('\n🔧 Action Required:');
  console.log('   - Review failed tests above');
  console.log('   - Fix missing hook imports');
  console.log('   - Re-run this test script');
}

console.log('='.repeat(50));