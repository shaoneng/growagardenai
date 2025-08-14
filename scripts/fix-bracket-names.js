#!/usr/bin/env node
/**
 * Fix Bracket Names in JSON Data
 * 修复JSON数据中的方括号名称问题
 */

console.log('🔧 Fixing bracket names in items.json...\n');

const fs = require('fs');
const path = require('path');

const jsonPath = path.resolve(__dirname, '../public/data/items.json');

try {
  // 读取JSON文件
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  
  let fixedCount = 0;
  
  // 修复每个项目的名称
  const fixedData = data.map(item => {
    let fixed = false;
    
    // 修复name字段
    if (item.name && (item.name.includes('[') || item.name.includes(']'))) {
      const originalName = item.name;
      // 移除所有方括号并清理
      item.name = item.name
        .replace(/\[+/g, '') // 移除开头的方括号
        .replace(/\]+/g, '') // 移除结尾的方括号
        .toLowerCase()
        .replace(/\s+/g, '_') // 空格替换为下划线
        .replace(/[^a-z0-9_]/g, ''); // 只保留字母、数字和下划线
      
      console.log(`✅ Fixed name: "${originalName}" → "${item.name}"`);
      fixed = true;
    }
    
    // 修复display_name字段
    if (item.display_name && (item.display_name.includes('[') || item.display_name.includes(']'))) {
      const originalDisplayName = item.display_name;
      // 移除所有方括号
      item.display_name = item.display_name
        .replace(/\[+/g, '') // 移除开头的方括号
        .replace(/\]+/g, ''); // 移除结尾的方括号
      
      console.log(`✅ Fixed display_name: "${originalDisplayName}" → "${item.display_name}"`);
      fixed = true;
    }
    
    if (fixed) {
      fixedCount++;
    }
    
    return item;
  });
  
  // 写回修复后的数据
  fs.writeFileSync(jsonPath, JSON.stringify(fixedData, null, 2));
  
  console.log(`\n🎉 Fixed ${fixedCount} items with bracket issues`);
  console.log(`📄 Updated file: ${jsonPath}`);
  
  // 验证修复结果
  console.log('\n🔍 Verification:');
  const problematicItems = fixedData.filter(item => 
    (item.name && (item.name.includes('[') || item.name.includes(']'))) ||
    (item.display_name && (item.display_name.includes('[') || item.display_name.includes(']')))
  );
  
  if (problematicItems.length === 0) {
    console.log('✅ No remaining bracket issues found');
  } else {
    console.log(`❌ Still found ${problematicItems.length} items with bracket issues:`);
    problematicItems.forEach(item => {
      console.log(`  - ID ${item.id}: name="${item.name}", display_name="${item.display_name}"`);
    });
  }
  
  console.log('\n🚀 Ready for build:');
  console.log('1. Run: npm run build');
  console.log('2. Build should now pass');
  console.log('3. Deploy successfully');
  
} catch (error) {
  console.error('❌ Error fixing bracket names:', error.message);
  process.exit(1);
}