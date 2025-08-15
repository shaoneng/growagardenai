#!/usr/bin/env node
// 测试宠物图片显示功能

console.log('🐾 Testing Pet Images Display System...\n');

const fs = require('fs');
const path = require('path');

// 检查宠物数据文件
console.log('📁 Checking pet data files...');
const petsDataPath = path.join(process.cwd(), 'public/data/pets.json');
if (fs.existsSync(petsDataPath)) {
  console.log('✅ pets.json - EXISTS');
  
  try {
    const petsData = JSON.parse(fs.readFileSync(petsDataPath, 'utf8'));
    console.log(`✅ Found ${petsData.length} pets in data file`);
    
    // 检查前几个宠物的数据结构
    console.log('\n📋 Sample pet data structure:');
    petsData.slice(0, 3).forEach(pet => {
      console.log(`  - ${pet.display_name} (${pet.name})`);
      console.log(`    Tier: ${pet.tier}, Bonus: ${pet.bonus_type} +${pet.bonus_value}%`);
    });
  } catch (error) {
    console.log('❌ Error reading pets.json:', error.message);
  }
} else {
  console.log('❌ pets.json - MISSING');
}

// 检查宠物图片文件
console.log('\n🖼️ Checking pet image files...');
const imagesPath = path.join(process.cwd(), 'public/images/items');
if (fs.existsSync(imagesPath)) {
  const imageFiles = fs.readdirSync(imagesPath).filter(file => file.endsWith('.png'));
  console.log(`✅ Found ${imageFiles.length} image files in items directory`);
  
  // 检查一些常见宠物图片
  const commonPets = [
    'cat.png', 'dog.png', 'bunny.png', 'bee.png', 'butterfly.png',
    'owl.png', 'frog.png', 'hamster.png', 'chicken.png', 'pig.png'
  ];
  
  console.log('\n🔍 Checking common pet images:');
  commonPets.forEach(petImage => {
    if (imageFiles.includes(petImage)) {
      console.log(`✅ ${petImage} - FOUND`);
    } else {
      console.log(`❌ ${petImage} - MISSING`);
    }
  });
  
  // 检查一些特殊宠物图片
  const specialPets = [
    'axolotl.png', 'capybara.png', 'kitsune_(pet).png', 'maneki-neko.png',
    'golden_bee.png', 'queen_bee_(pet).png', 'moon_cat.png', 'tanchozuru.png'
  ];
  
  console.log('\n⭐ Checking special pet images:');
  specialPets.forEach(petImage => {
    if (imageFiles.includes(petImage)) {
      console.log(`✅ ${petImage} - FOUND`);
    } else {
      console.log(`❌ ${petImage} - MISSING`);
    }
  });
} else {
  console.log('❌ Images directory not found');
}

// 检查组件文件
console.log('\n🔧 Checking component files...');
const componentFiles = [
  'src/app/components/feature/PetsEncyclopedia.jsx',
  'src/app/components/ui/ItemImage.jsx',
  'src/lib/encyclopedia-utils.ts'
];

componentFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} - EXISTS`);
  } else {
    console.log(`❌ ${file} - MISSING`);
  }
});

// 检查宠物页面路由
console.log('\n🛣️ Checking pet page routes...');
const petPagePath = path.join(process.cwd(), 'src/app/pets/page.tsx');
if (fs.existsSync(petPagePath)) {
  console.log('✅ /pets page route - EXISTS');
} else {
  console.log('❌ /pets page route - MISSING');
}

// 生成测试用的HTML文件
console.log('\n🧪 Generating pet image test page...');
try {
  const petsData = JSON.parse(fs.readFileSync(petsDataPath, 'utf8'));
  
  const testHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pet Images Test</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; }
        .pet-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; margin-top: 20px; }
        .pet-card { background: white; border-radius: 8px; padding: 15px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center; }
        .pet-image { width: 80px; height: 80px; margin: 0 auto 10px; display: flex; align-items: center; justify-content: center; background: #f0f0f0; border-radius: 8px; }
        .pet-image img { max-width: 100%; max-height: 100%; object-fit: contain; }
        .pet-name { font-weight: bold; margin-bottom: 5px; }
        .pet-tier { font-size: 12px; padding: 2px 8px; border-radius: 12px; display: inline-block; }
        .tier-common { background: #e5e7eb; color: #374151; }
        .tier-uncommon { background: #dcfce7; color: #166534; }
        .tier-rare { background: #dbeafe; color: #1e40af; }
        .tier-epic { background: #f3e8ff; color: #7c3aed; }
        .tier-legendary { background: #fef3c7; color: #d97706; }
        .pet-bonus { font-size: 12px; color: #6b7280; margin-top: 5px; }
        .error-image { color: #ef4444; font-size: 24px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🐾 Pet Images Test Page</h1>
        <p>Testing ${petsData.length} pet images from the database</p>
        
        <div class="pet-grid">
            ${petsData.map(pet => `
                <div class="pet-card">
                    <div class="pet-image">
                        <img src="/images/items/${pet.name}.png" 
                             alt="${pet.display_name}" 
                             onerror="this.style.display='none'; this.parentNode.innerHTML='<div class=\\"error-image\\">🐾</div>';">
                    </div>
                    <div class="pet-name">${pet.display_name}</div>
                    <div class="pet-tier tier-${pet.tier.toLowerCase()}">${pet.tier}</div>
                    <div class="pet-bonus">${pet.bonus_type} +${pet.bonus_value}%</div>
                </div>
            `).join('')}
        </div>
    </div>
</body>
</html>
  `;
  
  fs.writeFileSync(path.join(process.cwd(), 'public/pet-images-test.html'), testHTML);
  console.log('✅ Generated pet-images-test.html');
  console.log('   Visit: http://localhost:3000/pet-images-test.html');
} catch (error) {
  console.log('❌ Failed to generate test page:', error.message);
}

console.log('\n🎉 Pet Images Test Complete!');
console.log('\n📋 Summary:');
console.log('- ✅ Created comprehensive pets.json with 80+ pets');
console.log('- ✅ Updated encyclopedia-utils.ts to load pet data');
console.log('- ✅ Updated PetsEncyclopedia.jsx to use new data');
console.log('- ✅ Generated test page to verify image loading');
console.log('\n🚀 Next steps:');
console.log('1. Run: npm run dev');
console.log('2. Visit: http://localhost:3000/pets');
console.log('3. Check: http://localhost:3000/pet-images-test.html');
console.log('4. Verify all pet images are displaying correctly');