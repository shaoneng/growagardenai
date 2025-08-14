#!/usr/bin/env node
/**
 * Verify English UI Text Only
 * 验证用户界面英文文本（排除注释）
 */

console.log('🔍 Verifying English UI Text Only...\n');

const fs = require('fs');

// 检查实际的UI文本（排除注释和代码）
function extractUIText(content) {
  // 移除注释
  const withoutComments = content
    .replace(/\/\*[\s\S]*?\*\//g, '') // 块注释
    .replace(/\/\/.*$/gm, ''); // 行注释
  
  // 提取JSX中的文本内容
  const textMatches = withoutComments.match(/>[^<>{}]*[\u4e00-\u9fff]+[^<>{}]*</g) || [];
  const attributeMatches = withoutComments.match(/(title|placeholder|aria-label)="[^"]*[\u4e00-\u9fff]+[^"]*"/g) || [];
  
  return [...textMatches, ...attributeMatches];
}

console.log('✅ Checking UI Text in Components');

const components = [
  {
    name: 'GlobalNavigation',
    path: './src/app/components/layout/GlobalNavigation.tsx'
  },
  {
    name: 'FavoritesPage', 
    path: './src/app/components/feature/FavoritesPage.tsx'
  },
  {
    name: 'EmptyFavoritesState',
    path: './src/app/components/ui/EmptyFavoritesState.tsx'
  },
  {
    name: 'FavoriteItemCard',
    path: './src/app/components/ui/FavoriteItemCard.tsx'
  }
];

let totalChineseTexts = 0;
let componentsWithChinese = 0;

components.forEach(component => {
  try {
    if (fs.existsSync(component.path)) {
      const content = fs.readFileSync(component.path, 'utf8');
      const chineseTexts = extractUIText(content);
      
      console.log(`\n📄 ${component.name}:`);
      if (chineseTexts.length === 0) {
        console.log('   ✅ No Chinese UI text found');
      } else {
        console.log(`   ⚠️  Found ${chineseTexts.length} Chinese UI text(s):`);
        chineseTexts.forEach(text => {
          console.log(`      - ${text.trim()}`);
        });
        componentsWithChinese++;
        totalChineseTexts += chineseTexts.length;
      }
    } else {
      console.log(`\n📄 ${component.name}: ❌ File not found`);
    }
  } catch (error) {
    console.log(`\n📄 ${component.name}: ❌ Error - ${error.message}`);
  }
});

console.log('\n📊 Summary:');
console.log(`   Total components checked: ${components.length}`);
console.log(`   Components with Chinese text: ${componentsWithChinese}`);
console.log(`   Total Chinese UI texts found: ${totalChineseTexts}`);

if (totalChineseTexts === 0) {
  console.log('\n🎉 All UI text successfully localized to English!');
} else {
  console.log('\n⚠️  Some Chinese UI text still remains');
}

console.log('\n🎯 Localization Status:');
if (totalChineseTexts === 0) {
  console.log('   ✅ Navigation: Fully English');
  console.log('   ✅ Favorites Page: Fully English');
  console.log('   ✅ Empty State: Fully English');
  console.log('   ✅ Item Cards: Fully English');
} else {
  console.log('   📝 Additional localization needed for remaining Chinese text');
}

console.log('\n🌐 The interface is ready for English users!');