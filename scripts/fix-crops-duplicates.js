#!/usr/bin/env node

/**
 * 检测并修复作物数据中的重复项
 * 分析 items.json 文件中的重复作物条目并清理
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 检测作物数据中的重复项...\n');

function loadItemsData() {
  const itemsPath = path.join(process.cwd(), 'public/data/items.json');
  
  if (!fs.existsSync(itemsPath)) {
    console.log('❌ items.json 文件不存在');
    return null;
  }
  
  try {
    const data = fs.readFileSync(itemsPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.log('❌ 读取items.json失败:', error.message);
    return null;
  }
}

function detectDuplicates(items) {
  console.log('📋 检测重复项');
  console.log('==============');
  
  const seen = new Map();
  const duplicates = [];
  const unique = [];
  
  items.forEach((item, index) => {
    // 使用名称作为唯一标识符
    const key = item.name.toLowerCase().trim();
    
    if (seen.has(key)) {
      const originalIndex = seen.get(key);
      duplicates.push({
        name: item.name,
        display_name: item.display_name,
        originalIndex,
        duplicateIndex: index,
        original: items[originalIndex],
        duplicate: item
      });
      console.log(`❌ 发现重复: "${item.display_name}" (${item.name}) - ID ${items[originalIndex].id} 和 ID ${item.id}`);
    } else {
      seen.set(key, index);
      unique.push(item);
    }
  });
  
  console.log(`\n📊 统计结果:`);
  console.log(`- 总条目数: ${items.length}`);
  console.log(`- 唯一条目数: ${unique.length}`);
  console.log(`- 重复条目数: ${duplicates.length}`);
  
  return { duplicates, unique };
}

function analyzeDuplicates(duplicates, items) {
  if (duplicates.length === 0) {
    console.log('\n✅ 没有发现重复项');
    return;
  }
  
  console.log('\n📋 重复项详细分析');
  console.log('==================');
  
  duplicates.forEach((dup, index) => {
    console.log(`\n重复项 ${index + 1}: ${dup.display_name} (${dup.name})`);
    console.log('原始条目:');
    console.log(`  ID: ${dup.original.id}`);
    console.log(`  名称: ${dup.original.name}`);
    console.log(`  显示名: ${dup.original.display_name}`);
    console.log(`  稀有度: ${dup.original.tier}`);
    console.log(`  来源: ${dup.original.source}`);
    console.log(`  多次收获: ${dup.original.multi_harvest}`);
    
    console.log('重复条目:');
    console.log(`  ID: ${dup.duplicate.id}`);
    console.log(`  名称: ${dup.duplicate.name}`);
    console.log(`  显示名: ${dup.duplicate.display_name}`);
    console.log(`  稀有度: ${dup.duplicate.tier}`);
    console.log(`  来源: ${dup.duplicate.source}`);
    console.log(`  多次收获: ${dup.duplicate.multi_harvest}`);
    
    // 检查是否完全相同
    const isIdentical = JSON.stringify(dup.original) === JSON.stringify(dup.duplicate);
    console.log(`  完全相同: ${isIdentical ? '是' : '否'}`);
    
    // 检查差异
    if (!isIdentical) {
      const differences = [];
      if (dup.original.tier !== dup.duplicate.tier) {
        differences.push(`稀有度不同: ${dup.original.tier} vs ${dup.duplicate.tier}`);
      }
      if (dup.original.source !== dup.duplicate.source) {
        differences.push(`来源不同: ${dup.original.source} vs ${dup.duplicate.source}`);
      }
      if (dup.original.multi_harvest !== dup.duplicate.multi_harvest) {
        differences.push(`多次收获不同: ${dup.original.multi_harvest} vs ${dup.duplicate.multi_harvest}`);
      }
      if (differences.length > 0) {
        console.log(`  主要差异: ${differences.join(', ')}`);
      }
    }
  });
}\n\nfunction removeDuplicates(items) {
  console.log('\n🔧 移除重复项');
  console.log('==============');
  
  const seen = new Set();
  const cleaned = [];
  let removedCount = 0;
  
  items.forEach((item, index) => {
    const key = item.name.toLowerCase().trim();
    
    if (!seen.has(key)) {
      seen.add(key);
      cleaned.push(item);
    } else {
      console.log(`🗑️ 移除重复项: "${item.display_name}" (ID: ${item.id}, 索引: ${index})`);
      removedCount++;
    }
  });
  
  console.log(`\n✅ 清理完成:`);
  console.log(`- 移除了 ${removedCount} 个重复项`);
  console.log(`- 保留了 ${cleaned.length} 个唯一条目`);
  
  return cleaned;
}\n\nfunction validateCleanedData(cleaned) {
  console.log('\n📋 验证清理后的数据');
  console.log('====================');
  
  // 检查ID唯一性
  const ids = cleaned.map(item => item.id);
  const uniqueIds = new Set(ids);
  
  if (ids.length !== uniqueIds.size) {
    console.log('⚠️ 警告: 仍有重复的ID');
    
    // 找出重复的ID
    const idCounts = {};
    ids.forEach(id => {
      idCounts[id] = (idCounts[id] || 0) + 1;
    });
    
    const duplicateIds = Object.keys(idCounts).filter(id => idCounts[id] > 1);
    console.log('重复的ID:', duplicateIds);
  } else {
    console.log('✅ 所有ID都是唯一的');
  }
  
  // 检查名称唯一性
  const names = cleaned.map(item => item.name.toLowerCase().trim());
  const uniqueNames = new Set(names);
  
  if (names.length !== uniqueNames.size) {
    console.log('⚠️ 警告: 仍有重复的名称');
  } else {
    console.log('✅ 所有名称都是唯一的');
  }
  
  // 检查必需字段
  const requiredFields = ['id', 'name', 'display_name', 'tier', 'source', 'multi_harvest'];
  let missingFields = 0;
  
  cleaned.forEach((item, index) => {
    requiredFields.forEach(field => {
      if (item[field] === undefined || item[field] === null) {
        console.log(`⚠️ 条目 ${index} (ID: ${item.id}) 缺少字段: ${field}`);
        missingFields++;
      }
    });
  });
  
  if (missingFields === 0) {
    console.log('✅ 所有必需字段都存在');
  }
  
  return missingFields === 0 && ids.length === uniqueIds.size && names.length === uniqueNames.size;
}\n\nfunction saveCleanedData(cleaned) {
  const itemsPath = path.join(process.cwd(), 'public/data/items.json');
  const backupPath = path.join(process.cwd(), 'public/data/items.json.backup');
  
  try {
    // 创建备份
    fs.copyFileSync(itemsPath, backupPath);
    console.log('✅ 已创建备份文件: items.json.backup');
    
    // 保存清理后的数据
    fs.writeFileSync(itemsPath, JSON.stringify(cleaned, null, 2));
    console.log('✅ 已保存清理后的数据到 items.json');
    
    return true;
  } catch (error) {
    console.log('❌ 保存失败:', error.message);
    return false;
  }
}\n\nfunction generateSummaryReport(originalCount, cleanedCount, duplicatesCount) {
  console.log('\n🎯 修复总结报告');
  console.log('================');
  
  console.log(`📊 数据统计:`);
  console.log(`- 原始条目数: ${originalCount}`);
  console.log(`- 清理后条目数: ${cleanedCount}`);
  console.log(`- 移除重复项: ${duplicatesCount}`);
  console.log(`- 数据减少: ${((duplicatesCount / originalCount) * 100).toFixed(1)}%`);
  
  console.log(`\n🔍 修复效果:`);
  console.log(`- ✅ 移除了所有重复的作物名称`);
  console.log(`- ✅ 保留了每个作物的第一个出现`);
  console.log(`- ✅ 创建了原始数据备份`);
  console.log(`- ✅ 数据完整性验证通过`);
  
  console.log(`\n💡 下一步:`);
  console.log(`1. 重启开发服务器: npm run dev`);
  console.log(`2. 访问 http://localhost:3000/crops/`);
  console.log(`3. 确认页面不再显示重复的作物`);
  console.log(`4. 检查作物列表的完整性`);
  
  console.log('\n🎉 Crops页面重复项修复完成!');
}\n\nfunction runDuplicateDetection() {
  const items = loadItemsData();
  
  if (!items) {
    return;
  }
  
  console.log(`📊 加载了 ${items.length} 个作物条目\n`);
  
  // 检测重复项
  const { duplicates, unique } = detectDuplicates(items);
  
  // 分析重复项
  analyzeDuplicates(duplicates, items);
  
  if (duplicates.length > 0) {
    // 移除重复项
    const cleaned = removeDuplicates(items);
    
    // 验证清理后的数据
    const isValid = validateCleanedData(cleaned);
    
    if (isValid) {
      // 保存清理后的数据
      const saved = saveCleanedData(cleaned);
      
      if (saved) {
        generateSummaryReport(items.length, cleaned.length, duplicates.length);
      }
    } else {
      console.log('\n❌ 数据验证失败，未保存更改');
    }
  } else {
    console.log('\n✅ 数据已经是干净的，无需修复');
  }
}

// 运行重复项检测和修复
runDuplicateDetection();"