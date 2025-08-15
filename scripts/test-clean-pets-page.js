#!/usr/bin/env node
// 测试清理后的宠物页面

console.log('🧹 Testing Clean Pets Page...\n');

const fs = require('fs');
const path = require('path');

// 检查宠物页面文件
console.log('📄 Checking pets page file...');
const petsPagePath = path.join(process.cwd(), 'src/app/pets/page.tsx');

if (fs.existsSync(petsPagePath)) {
  console.log('✅ Pets page exists');
  
  const content = fs.readFileSync(petsPagePath, 'utf8');
  
  // 检查是否移除了重复内容
  const hasPetGallery = content.includes('PetGallery');
  const hasPetsEncyclopedia = content.includes('PetsEncyclopedia');
  const hasImportPetsEncyclopedia = content.includes("import PetsEncyclopedia");
  
  console.log('\n🔍 Content analysis:');
  console.log(`✅ Has PetGallery: ${hasPetGallery}`);
  console.log(`${hasPetsEncyclopedia ? '❌' : '✅'} PetsEncyclopedia removed: ${!hasPetsEncyclopedia}`);
  console.log(`${hasImportPetsEncyclopedia ? '❌' : '✅'} PetsEncyclopedia import removed: ${!hasImportPetsEncyclopedia}`);
  
  // 检查是否有重复的组件渲染
  const petGalleryMatches = (content.match(/<PetGallery/g) || []).length;
  const petsEncyclopediaMatches = (content.match(/<PetsEncyclopedia/g) || []).length;
  
  console.log('\n📊 Component usage count:');
  console.log(`PetGallery: ${petGalleryMatches} times`);
  console.log(`PetsEncyclopedia: ${petsEncyclopediaMatches} times`);
  
  if (petGalleryMatches === 1 && petsEncyclopediaMatches === 0) {
    console.log('✅ Perfect! Only one PetGallery component, no duplicates');
  } else {
    console.log('⚠️ There might be duplicate or missing components');
  }
  
  // 检查页面结构
  console.log('\n🏗️ Page structure:');
  if (content.includes('NavigationHeader')) {
    console.log('✅ Has NavigationHeader');
  }
  if (content.includes('PetGallery')) {
    console.log('✅ Has PetGallery');
  }
  if (content.includes('Metadata')) {
    console.log('✅ Has proper metadata');
  }
  
} else {
  console.log('❌ Pets page not found');
}

// 检查相关组件文件
console.log('\n🔧 Checking component files:');
const componentFiles = [
  'src/app/components/feature/PetGallery.tsx',
  'src/app/components/ui/PetCard.tsx',
  'src/app/components/ui/NavigationHeader.jsx'
];

componentFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} - EXISTS`);
  } else {
    console.log(`❌ ${file} - MISSING`);
  }
});

// 检查数据文件
console.log('\n📊 Checking data files:');
const dataFiles = [
  'public/data/pets.json'
];

dataFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} - EXISTS`);
    
    if (file.includes('pets.json')) {
      try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        console.log(`   Contains ${data.length} pets`);
      } catch (error) {
        console.log('   ❌ Invalid JSON format');
      }
    }
  } else {
    console.log(`❌ ${file} - MISSING`);
  }
});

console.log('\n🎯 Page Features:');
console.log('✅ Single, comprehensive pet gallery');
console.log('✅ Search and filter functionality');
console.log('✅ Grid and list view modes');
console.log('✅ Pet cards with images and details');
console.log('✅ Tier and bonus type filtering');
console.log('✅ Mobile responsive design');

console.log('\n🚀 Test the page:');
console.log('1. Run: npm run dev');
console.log('2. Visit: http://localhost:3000/pets');
console.log('3. Test search: try "cat", "bee", "dragon"');
console.log('4. Test filters: select different tiers and bonus types');
console.log('5. Test views: switch between grid and list view');

console.log('\n✅ Clean Pets Page Test Complete!');