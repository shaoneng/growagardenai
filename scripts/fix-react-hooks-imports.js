#!/usr/bin/env node
/**
 * Fix React Hooks Imports
 * 修复React Hooks导入问题
 */

console.log('🔧 Fixing React Hooks Imports...\n');

const fs = require('fs');
const path = require('path');

// 需要检查的React hooks
const reactHooks = [
  'useState',
  'useEffect', 
  'useCallback',
  'useMemo',
  'useRef',
  'useContext',
  'useReducer',
  'useLayoutEffect',
  'useImperativeHandle',
  'useDebugValue'
];

// 递归查找所有React组件文件
function findReactFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      findReactFiles(fullPath, files);
    } else if (item.endsWith('.tsx') || item.endsWith('.jsx')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// 检查和修复单个文件
function fixFileImports(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    // 查找React导入行
    let reactImportLineIndex = -1;
    let reactImportLine = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('import React') && line.includes('from \'react\'')) {
        reactImportLineIndex = i;
        reactImportLine = line;
        break;
      }
    }
    
    if (reactImportLineIndex === -1) {
      return { fixed: false, reason: 'No React import found' };
    }
    
    // 检查文件中使用了哪些hooks
    const usedHooks = [];
    for (const hook of reactHooks) {
      if (content.includes(hook + '(')) {
        usedHooks.push(hook);
      }
    }
    
    if (usedHooks.length === 0) {
      return { fixed: false, reason: 'No hooks used' };
    }
    
    // 解析当前导入的hooks
    const currentImports = [];
    const importMatch = reactImportLine.match(/import React(?:,\s*\{([^}]+)\})?\s+from/);
    if (importMatch && importMatch[1]) {
      const hooksStr = importMatch[1];
      currentImports.push(...hooksStr.split(',').map(h => h.trim()));
    }
    
    // 找出缺失的hooks
    const missingHooks = usedHooks.filter(hook => !currentImports.includes(hook));
    
    if (missingHooks.length === 0) {
      return { fixed: false, reason: 'All hooks already imported' };
    }
    
    // 构建新的导入行
    const allHooks = [...new Set([...currentImports, ...missingHooks])].sort();
    const newImportLine = `import React, { ${allHooks.join(', ')} } from 'react';`;
    
    // 替换导入行
    lines[reactImportLineIndex] = newImportLine;
    const newContent = lines.join('\n');
    
    fs.writeFileSync(filePath, newContent);
    
    return { 
      fixed: true, 
      missingHooks, 
      oldImport: reactImportLine,
      newImport: newImportLine
    };
    
  } catch (error) {
    return { fixed: false, reason: `Error: ${error.message}` };
  }
}

// 主执行逻辑
const srcDir = path.resolve(__dirname, '../src');
const reactFiles = findReactFiles(srcDir);

console.log(`📁 Found ${reactFiles.length} React files to check\n`);

let fixedCount = 0;
const results = [];

for (const filePath of reactFiles) {
  const relativePath = path.relative(path.resolve(__dirname, '..'), filePath);
  const result = fixFileImports(filePath);
  
  if (result.fixed) {
    console.log(`✅ ${relativePath}`);
    console.log(`   Added hooks: ${result.missingHooks.join(', ')}`);
    console.log(`   Old: ${result.oldImport}`);
    console.log(`   New: ${result.newImport}\n`);
    fixedCount++;
  } else if (result.reason !== 'No hooks used' && result.reason !== 'All hooks already imported') {
    console.log(`⚠️ ${relativePath}: ${result.reason}`);
  }
  
  results.push({ file: relativePath, ...result });
}

console.log(`\n🎉 Fixed ${fixedCount} files with missing React hooks imports`);

// 显示统计信息
const fixedFiles = results.filter(r => r.fixed);
const errorFiles = results.filter(r => !r.fixed && r.reason.startsWith('Error'));

if (fixedFiles.length > 0) {
  console.log('\n✅ Fixed Files:');
  fixedFiles.forEach(f => {
    console.log(`  - ${f.file}: Added ${f.missingHooks.join(', ')}`);
  });
}

if (errorFiles.length > 0) {
  console.log('\n❌ Files with Errors:');
  errorFiles.forEach(f => {
    console.log(`  - ${f.file}: ${f.reason}`);
  });
}

console.log('\n🚀 Next Steps:');
console.log('1. Test the application to ensure hooks work correctly');
console.log('2. Check for any remaining runtime errors');
console.log('3. All React hooks should now be properly imported');