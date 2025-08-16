#!/usr/bin/env node

/**
 * 修复常见的ESLint错误
 * 主要修复部署时遇到的代码质量问题
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 修复ESLint错误...\n');

// 需要修复的文件列表
const filesToFix = [
  'src/lib/generative-ai-provider-server.ts',
  'src/lib/personalized-ai-provider-server.ts'
];

function fixFile(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️ 文件不存在: ${filePath}`);
    return false;
  }
  
  try {
    let content = fs.readFileSync(fullPath, 'utf8');
    let modified = false;
    
    // 修复 prefer-const 错误
    const letRegex = /let\s+(\w+)\s*=\s*([^;]+);/g;
    const matches = [...content.matchAll(letRegex)];
    
    for (const match of matches) {
      const varName = match[1];
      const assignment = match[2];
      
      // 检查变量是否在后续代码中被重新赋值
      const reassignmentRegex = new RegExp(`\\b${varName}\\s*=(?!=)`, 'g');
      const afterDeclaration = content.substring(match.index + match[0].length);
      
      if (!reassignmentRegex.test(afterDeclaration)) {
        // 如果没有重新赋值，将 let 改为 const
        content = content.replace(match[0], `const ${varName} = ${assignment};`);
        modified = true;
        console.log(`✅ 修复 ${filePath}: 将 'let ${varName}' 改为 'const ${varName}'`);
      }
    }
    
    if (modified) {
      fs.writeFileSync(fullPath, content);
      console.log(`✅ 已保存修复后的文件: ${filePath}`);
    } else {
      console.log(`ℹ️ 文件无需修复: ${filePath}`);
    }
    
    return true;
  } catch (error) {
    console.log(`❌ 修复文件失败 ${filePath}:`, error.message);
    return false;
  }
}

function runFixes() {
  console.log('📋 开始修复ESLint错误');
  console.log('===================');
  
  let fixedCount = 0;
  let totalCount = 0;
  
  for (const filePath of filesToFix) {
    totalCount++;
    if (fixFile(filePath)) {
      fixedCount++;
    }
  }
  
  console.log('\n📊 修复结果');
  console.log('============');
  console.log(`- 处理文件数: ${totalCount}`);
  console.log(`- 成功修复: ${fixedCount}`);
  console.log(`- 失败数量: ${totalCount - fixedCount}`);
  
  if (fixedCount === totalCount) {
    console.log('\n🎉 所有ESLint错误已修复!');
    console.log('现在可以重新尝试部署了。');
  } else {
    console.log('\n⚠️ 部分文件修复失败，请手动检查。');
  }
}

// 运行修复
runFixes();