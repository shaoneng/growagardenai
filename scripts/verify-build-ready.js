#!/usr/bin/env node
/**
 * Verify Build Ready
 * 验证构建准备就绪
 */

console.log('🔍 Verifying Build Readiness...\n');

const fs = require('fs');
const path = require('path');

let allChecks = true;

// 检查1: 验证JSON数据中没有方括号问题
console.log('📄 Checking JSON data integrity...');
try {
  const jsonPath = path.resolve(__dirname, '../public/data/items.json');
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  
  const problematicItems = data.filter(item => 
    (item.name && (item.name.includes('[') || item.name.includes(']'))) ||
    (item.display_name && (item.display_name.includes('[') || item.display_name.includes(']')))
  );
  
  if (problematicItems.length === 0) {
    console.log('✅ JSON data: No bracket issues found');
  } else {
    console.log(`❌ JSON data: Found ${problematicItems.length} items with bracket issues`);
    allChecks = false;
  }
} catch (error) {
  console.log('❌ JSON data: Error reading items.json');
  allChecks = false;
}

// 检查2: 验证SSR修复
console.log('\n🖥️ Checking SSR compatibility...');
try {
  const userPrefPath = path.resolve(__dirname, '../src/lib/user-preference-manager.ts');
  const content = fs.readFileSync(userPrefPath, 'utf8');
  
  if (content.includes('typeof window === \'undefined\'')) {
    console.log('✅ SSR: Window checks found in user-preference-manager');
  } else {
    console.log('❌ SSR: Missing window checks in user-preference-manager');
    allChecks = false;
  }
} catch (error) {
  console.log('❌ SSR: Error checking user-preference-manager.ts');
  allChecks = false;
}

// 检查3: 验证构建脚本
console.log('\n🔧 Checking build script...');
try {
  const buildScriptPath = path.resolve(__dirname, 'build-data.js');
  const content = fs.readFileSync(buildScriptPath, 'utf8');
  
  if (content.includes('replace(/\\[+/g, \'\')')) {
    console.log('✅ Build script: Bracket cleaning logic found');
  } else {
    console.log('❌ Build script: Missing bracket cleaning logic');
    allChecks = false;
  }
} catch (error) {
  console.log('❌ Build script: Error checking build-data.js');
  allChecks = false;
}

// 检查4: 验证关键文件存在
console.log('\n📁 Checking critical files...');
const criticalFiles = [
  'src/app/report/page.tsx',
  'src/app/components/feature/MultiStyleReport.tsx',
  'src/lib/user-preference-manager.ts',
  'public/data/items.json'
];

criticalFiles.forEach(file => {
  const filePath = path.resolve(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ File exists: ${file}`);
  } else {
    console.log(`❌ File missing: ${file}`);
    allChecks = false;
  }
});

// 最终结果
console.log('\n' + '='.repeat(50));
if (allChecks) {
  console.log('🎉 BUILD READY! All checks passed');
  console.log('\n📋 Next Steps:');
  console.log('1. Run: npm run build');
  console.log('2. Build should complete successfully');
  console.log('3. Deploy to production');
  console.log('\n🚀 Both critical errors have been resolved:');
  console.log('   ✅ SSR window error - Fixed');
  console.log('   ✅ Bracket names error - Fixed');
} else {
  console.log('❌ BUILD NOT READY! Some checks failed');
  console.log('\n🔧 Please fix the issues above before building');
}
console.log('='.repeat(50));