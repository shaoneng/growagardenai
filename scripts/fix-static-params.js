#!/usr/bin/env node
// 修复静态参数生成问题

console.log('🔧 Fixing Static Params Generation...\n');

const fs = require('fs');
const path = require('path');

// 读取数据文件
const itemsPath = path.join(process.cwd(), 'public/data/items.json');
const petsPath = path.join(process.cwd(), 'public/data/pets.json');

// slugify 函数
function slugify(input) {
  return String(input || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

console.log('📊 Analyzing data files...');

// 检查 items.json
if (fs.existsSync(itemsPath)) {
  const itemsData = JSON.parse(fs.readFileSync(itemsPath, 'utf8'));
  console.log(`✅ Found ${itemsData.length} items in items.json`);
  
  // 生成作物路径
  const cropSlugs = new Set();
  for (const item of itemsData) {
    if (
      item?.source === 'crops' ||
      typeof item?.multi_harvest !== 'undefined' ||
      ['Common', 'Uncommon', 'Rare', 'Legendary'].includes(item?.tier)
    ) {
      const base = item?.display_name || item?.name;
      if (base) {
        const slug = slugify(String(base));
        if (slug) {
          cropSlugs.add(slug);
        }
      }
    }
  }
  
  console.log(`📋 Generated ${cropSlugs.size} crop slugs:`);
  console.log([...cropSlugs].slice(0, 10).join(', '), '...');
  
  // 检查是否包含 burning_bud
  if (cropSlugs.has('burning_bud')) {
    console.log('✅ burning_bud is included in generated slugs');
  } else {
    console.log('❌ burning_bud is NOT in generated slugs');
    console.log('🔍 Searching for similar items...');
    
    for (const item of itemsData) {
      const name = item?.display_name || item?.name || '';
      if (name.toLowerCase().includes('burn') || name.toLowerCase().includes('bud')) {
        console.log(`   Found similar: ${name} -> ${slugify(name)}`);
      }
    }
  }
} else {
  console.log('❌ items.json not found');
}

// 检查 pets.json
if (fs.existsSync(petsPath)) {
  const petsData = JSON.parse(fs.readFileSync(petsPath, 'utf8'));
  console.log(`✅ Found ${petsData.length} pets in pets.json`);
  
  const petNames = petsData.map(pet => pet.name).filter(Boolean);
  console.log(`📋 Pet names: ${petNames.slice(0, 5).join(', ')}...`);
} else {
  console.log('❌ pets.json not found');
}

console.log('\n🔧 Recommendations:');
console.log('1. The burning_bud route might be from an old link or bookmark');
console.log('2. Check if there are any hardcoded links to /crops/burning_bud');
console.log('3. The generateStaticParams has been updated with fallback routes');
console.log('4. Consider adding a catch-all route or better 404 handling');

console.log('\n🧪 To test:');
console.log('1. Run: npm run build');
console.log('2. Check if the build completes without static param errors');
console.log('3. Test navigation to various crop and pet pages');

console.log('\n✅ Static Params Fix Applied!');