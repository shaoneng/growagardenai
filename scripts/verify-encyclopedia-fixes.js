#!/usr/bin/env node

// 验证百科全书修复的完整性
console.log('🔍 Verifying Encyclopedia Fixes...\n');

const fs = require('fs');
const path = require('path');

// 检查所有相关文件
const filesToCheck = [
  {
    path: 'src/lib/encyclopedia-utils.ts',
    description: 'Encyclopedia utility functions',
    requiredContent: ['identifyPets', 'identifyCrops', 'enrichItemData']
  },
  {
    path: 'src/app/components/ui/EncyclopediaItemCard.jsx',
    description: 'Specialized encyclopedia item card',
    requiredContent: ['EncyclopediaItemCard', 'tierColorMap', 'bonusTypeColors']
  },
  {
    path: 'src/app/components/ui/NavigationHeader.jsx',
    description: 'Enhanced navigation header',
    requiredContent: ['leading-relaxed', 'max-w-3xl', 'px-4']
  },
  {
    path: 'src/app/components/feature/PetsEncyclopedia.jsx',
    description: 'Updated pets encyclopedia',
    requiredContent: ['identifyPets', 'enrichItemData', 'encyclopedia-utils']
  },
  {
    path: 'src/app/components/feature/CropsEncyclopedia.jsx',
    description: 'Updated crops encyclopedia',
    requiredContent: ['identifyCrops', 'enrichItemData', 'encyclopedia-utils']
  },
  {
    path: 'src/app/components/feature/EncyclopediaBase.jsx',
    description: 'Updated encyclopedia base component',
    requiredContent: ['EncyclopediaItemCard', 'bonus_type', 'type === \'pets\'']
  }
];

console.log('1. File Integrity Check:');
console.log('═══════════════════════════════════');

let allFilesOk = true;

filesToCheck.forEach(file => {
  const fullPath = path.join(__dirname, '..', file.path);
  
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf8');
    const missingContent = file.requiredContent.filter(required => 
      !content.includes(required)
    );
    
    if (missingContent.length === 0) {
      console.log(`   ✅ ${file.description}`);
    } else {
      console.log(`   ⚠️  ${file.description} - Missing: ${missingContent.join(', ')}`);
      allFilesOk = false;
    }
  } else {
    console.log(`   ❌ ${file.description} - File not found`);
    allFilesOk = false;
  }
});

// 检查数据文件
console.log('\n2. Data File Analysis:');
console.log('═══════════════════════════════════');

const dataPath = path.join(__dirname, '..', 'public/data/items.json');
if (fs.existsSync(dataPath)) {
  try {
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    console.log(`   ✅ Items data loaded: ${data.length} total items`);
    
    // 分析数据结构
    const sampleItem = data[0];
    const hasRequiredFields = sampleItem.id !== undefined && 
                             sampleItem.name && 
                             sampleItem.display_name && 
                             sampleItem.tier;
    
    if (hasRequiredFields) {
      console.log('   ✅ Data structure is valid');
    } else {
      console.log('   ⚠️  Data structure may be incomplete');
    }
    
    // 统计不同类型的物品
    const tiers = {};
    const sources = {};
    
    data.forEach(item => {
      tiers[item.tier] = (tiers[item.tier] || 0) + 1;
      sources[item.source] = (sources[item.source] || 0) + 1;
    });
    
    console.log('   📊 Item distribution:');
    Object.entries(tiers).forEach(([tier, count]) => {
      console.log(`      - ${tier}: ${count} items`);
    });
    
  } catch (error) {
    console.log('   ❌ Error parsing data file:', error.message);
    allFilesOk = false;
  }
} else {
  console.log('   ❌ Items data file not found');
  allFilesOk = false;
}

// 检查修复的具体问题
console.log('\n3. Specific Fixes Verification:');
console.log('═══════════════════════════════════');

const fixes = [
  {
    name: 'Subtitle Text Wrapping',
    check: () => {
      const headerPath = path.join(__dirname, '..', 'src/app/components/ui/NavigationHeader.jsx');
      if (fs.existsSync(headerPath)) {
        const content = fs.readFileSync(headerPath, 'utf8');
        return content.includes('leading-relaxed') && content.includes('max-w-3xl');
      }
      return false;
    }
  },
  {
    name: 'Data Filtering Logic',
    check: () => {
      const utilsPath = path.join(__dirname, '..', 'src/lib/encyclopedia-utils.ts');
      if (fs.existsSync(utilsPath)) {
        const content = fs.readFileSync(utilsPath, 'utf8');
        return content.includes('identifyPets') && content.includes('identifyCrops');
      }
      return false;
    }
  },
  {
    name: 'Enhanced Item Cards',
    check: () => {
      const cardPath = path.join(__dirname, '..', 'src/app/components/ui/EncyclopediaItemCard.jsx');
      if (fs.existsSync(cardPath)) {
        const content = fs.readFileSync(cardPath, 'utf8');
        return content.includes('bonusTypeColors') && content.includes('tierColorMap');
      }
      return false;
    }
  },
  {
    name: 'Component Integration',
    check: () => {
      const petsPath = path.join(__dirname, '..', 'src/app/components/feature/PetsEncyclopedia.jsx');
      const cropsPath = path.join(__dirname, '..', 'src/app/components/feature/CropsEncyclopedia.jsx');
      
      if (fs.existsSync(petsPath) && fs.existsSync(cropsPath)) {
        const petsContent = fs.readFileSync(petsPath, 'utf8');
        const cropsContent = fs.readFileSync(cropsPath, 'utf8');
        
        return petsContent.includes('encyclopedia-utils') && 
               cropsContent.includes('encyclopedia-utils');
      }
      return false;
    }
  }
];

fixes.forEach(fix => {
  if (fix.check()) {
    console.log(`   ✅ ${fix.name}`);
  } else {
    console.log(`   ❌ ${fix.name}`);
    allFilesOk = false;
  }
});

// 测试建议
console.log('\n4. Manual Testing Guide:');
console.log('═══════════════════════════════════');
console.log('   🧪 Steps to test:');
console.log('      1. npm run dev');
console.log('      2. Visit http://localhost:3000');
console.log('      3. Click "Crops Encyclopedia" card');
console.log('      4. Verify subtitle displays completely');
console.log('      5. Check that crop items are shown');
console.log('      6. Click "Pets Encyclopedia" card');
console.log('      7. Verify pet items are displayed');
console.log('      8. Test navigation buttons work');
console.log('      9. Check responsive design on mobile');

console.log('\n   🔍 What to look for:');
console.log('      • Complete subtitle text (no cut-off)');
console.log('      • Proper item categorization');
console.log('      • Enhanced card styling');
console.log('      • Working navigation');
console.log('      • No console errors');

// 最终状态
console.log('\n5. Fix Status Summary:');
console.log('═══════════════════════════════════');

if (allFilesOk) {
  console.log('   🎉 All fixes have been successfully applied!');
  console.log('   ✅ Files are in place and contain required content');
  console.log('   ✅ Data structure is valid');
  console.log('   ✅ Components are properly integrated');
  console.log('\n   🚀 Ready for testing!');
} else {
  console.log('   ⚠️  Some issues were detected');
  console.log('   💡 Please review the items marked with ❌ above');
  console.log('   🔧 Run the fixes again if needed');
}

console.log('\n═══════════════════════════════════');
console.log('Encyclopedia fixes verification complete!');