#!/usr/bin/env node
/**
 * Check Favorites Badge Localization
 * 检查收藏徽章组件的英文化
 */

console.log('🔍 Checking FavoritesBadge Localization...\n');

const fs = require('fs');

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

try {
  const badgePath = './src/app/components/ui/FavoritesBadge.tsx';
  if (fs.existsSync(badgePath)) {
    const content = fs.readFileSync(badgePath, 'utf8');
    const chineseTexts = extractUIText(content);
    
    console.log('📄 FavoritesBadge Component:');
    if (chineseTexts.length === 0) {
      console.log('   ✅ No Chinese UI text found');
    } else {
      console.log(`   ⚠️  Found ${chineseTexts.length} Chinese UI text(s):`);
      chineseTexts.forEach(text => {
        console.log(`      - ${text.trim()}`);
      });
    }
    
    // 检查英文文本
    const englishTexts = [
      'My Favorites',
      'Total',
      'Crops',
      'Pets',
      'Strategy Reports',
      'favorite items',
      'Favorited',
      'Favorites Progress',
      'Goal achieved!'
    ];
    
    const foundEnglish = englishTexts.filter(text => content.includes(text));
    console.log(`\n   ✓ English texts found: ${foundEnglish.length}/${englishTexts.length}`);
    foundEnglish.forEach(text => console.log(`      - ${text}`));
    
    if (chineseTexts.length === 0 && foundEnglish.length >= 7) {
      console.log('\n   🎉 FavoritesBadge successfully localized to English!');
    } else {
      console.log('\n   ⚠️  FavoritesBadge localization needs attention');
    }
  } else {
    console.log('📄 FavoritesBadge: ❌ File not found');
  }
} catch (error) {
  console.log('📄 FavoritesBadge: ❌ Error -', error.message);
}

console.log('\n🌐 FavoritesBadge localization check complete!');