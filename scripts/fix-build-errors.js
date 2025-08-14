#!/usr/bin/env node
/**
 * Fix Build Errors
 * 修复构建错误
 */

console.log('🔧 Fixing Build Errors...\n');

const fs = require('fs');

// 修复撇号转义问题
function fixApostrophes(filePath) {
  if (!fs.existsSync(filePath)) {
    return false;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  
  // 修复常见的撇号问题
  const apostropheReplacements = [
    { from: /don't/g, to: "don&apos;t" },
    { from: /won't/g, to: "won&apos;t" },
    { from: /can't/g, to: "can&apos;t" },
    { from: /isn't/g, to: "isn&apos;t" },
    { from: /doesn't/g, to: "doesn&apos;t" },
    { from: /haven't/g, to: "haven&apos;t" },
    { from: /shouldn't/g, to: "shouldn&apos;t" },
    { from: /wouldn't/g, to: "wouldn&apos;t" },
    { from: /couldn't/g, to: "couldn&apos;t" },
    { from: /you're/g, to: "you&apos;re" },
    { from: /we're/g, to: "we&apos;re" },
    { from: /they're/g, to: "they&apos;re" },
    { from: /it's/g, to: "it&apos;s" },
    { from: /that's/g, to: "that&apos;s" },
    { from: /what's/g, to: "what&apos;s" },
    { from: /let's/g, to: "let&apos;s" }
  ];
  
  apostropheReplacements.forEach(replacement => {
    if (replacement.from.test(content)) {
      content = content.replace(replacement.from, replacement.to);
      changed = true;
    }
  });
  
  // 修复引号问题
  const quoteReplacements = [
    { from: /for "([^"]+)"/g, to: 'for &quot;$1&quot;' },
    { from: /ID为 "([^"]+)" 的/g, to: 'ID为 &quot;$1&quot; 的' },
    { from: /搜索 "([^"]+)" 的结果/g, to: '搜索 &quot;$1&quot; 的结果' }
  ];
  
  quoteReplacements.forEach(replacement => {
    if (replacement.from.test(content)) {
      content = content.replace(replacement.from, replacement.to);
      changed = true;
    }
  });
  
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  
  return false;
}

// 修复未使用的导入
function fixUnusedImports(filePath) {
  if (!fs.existsSync(filePath)) {
    return false;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  
  // 移除未使用的导入
  const unusedImports = [
    { from: /,\s*Search\s*(?=\})/g, to: '' },
    { from: /,\s*Filter\s*(?=\})/g, to: '' },
    { from: /,\s*useEffect\s*(?=\})/g, to: '' }
  ];
  
  unusedImports.forEach(removal => {
    if (removal.from.test(content)) {
      content = content.replace(removal.from, removal.to);
      changed = true;
    }
  });
  
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  
  return false;
}

// 要修复的文件列表
const filesToFix = [
  './src/app/components/feature/PlayerLevelOnboarding.tsx',
  './src/app/components/feature/styles/MinimalStyleReport_v3.tsx',
  './src/app/components/feature/styles/MagazineStyleReport.tsx',
  './src/app/reports/[id]/page.tsx',
  './src/app/components/layout/GlobalNavigation.tsx',
  './src/app/components/feature/FavoritesPage.tsx'
];

console.log('✅ Fixing Apostrophe and Quote Issues');
let fixedFiles = 0;

filesToFix.forEach(filePath => {
  try {
    const apostropheFixed = fixApostrophes(filePath);
    const importsFixed = fixUnusedImports(filePath);
    
    if (apostropheFixed || importsFixed) {
      console.log(`   ✅ Fixed: ${filePath}`);
      fixedFiles++;
    } else {
      console.log(`   ✓ Clean: ${filePath}`);
    }
  } catch (error) {
    console.log(`   ❌ Error fixing ${filePath}: ${error.message}`);
  }
});

console.log(`\n📊 Summary: Fixed ${fixedFiles} files`);

console.log('\n🎯 Next Steps:');
console.log('   1. Run npm run build to check for remaining errors');
console.log('   2. Fix any remaining TypeScript any types');
console.log('   3. Address unused variable warnings');

console.log('\n✨ Build errors should be significantly reduced!');