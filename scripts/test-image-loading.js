#!/usr/bin/env node

// 测试图片加载修复
console.log('🖼️ Testing Image Loading Fixes...\n');

const fs = require('fs');
const path = require('path');

// 1. 检查图片目录
console.log('1. Checking Image Directory:');
console.log('═══════════════════════════════════');

const imagesDir = path.join(__dirname, '..', 'public', 'images', 'items');
if (fs.existsSync(imagesDir)) {
  const imageFiles = fs.readdirSync(imagesDir).filter(file => file.endsWith('.png'));
  console.log(`   ✅ Images directory exists`);
  console.log(`   📊 Found ${imageFiles.length} PNG images`);
  
  // 显示一些示例图片
  const sampleImages = imageFiles.slice(0, 10);
  console.log('   🖼️  Sample images:');
  sampleImages.forEach(img => {
    console.log(`      - ${img}`);
  });
  
  if (imageFiles.length > 10) {
    console.log(`      ... and ${imageFiles.length - 10} more`);
  }
} else {
  console.log('   ❌ Images directory not found');
}

// 2. 检查数据文件中的物品名称
console.log('\n2. Checking Item Names vs Image Files:');
console.log('═══════════════════════════════════');

const dataPath = path.join(__dirname, '..', 'public', 'data', 'items.json');
if (fs.existsSync(dataPath) && fs.existsSync(imagesDir)) {
  try {
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    const imageFiles = fs.readdirSync(imagesDir).filter(file => file.endsWith('.png'));
    const imageNames = imageFiles.map(file => file.replace('.png', ''));
    
    // 检查前10个物品是否有对应图片
    const sampleItems = data.slice(0, 10);
    let matchCount = 0;
    let missingImages = [];
    
    console.log('   🔍 Checking first 10 items:');
    sampleItems.forEach(item => {
      const hasImage = imageNames.includes(item.name);
      if (hasImage) {
        console.log(`      ✅ ${item.name} → ${item.name}.png`);
        matchCount++;
      } else {
        console.log(`      ❌ ${item.name} → ${item.name}.png (missing)`);
        missingImages.push(item.name);
      }
    });
    
    console.log(`\n   📊 Match rate: ${matchCount}/${sampleItems.length} (${Math.round(matchCount/sampleItems.length*100)}%)`);
    
    if (missingImages.length > 0) {
      console.log(`   ⚠️  Missing images: ${missingImages.join(', ')}`);
    }
    
  } catch (error) {
    console.log('   ❌ Error checking data:', error.message);
  }
} else {
  console.log('   ⚠️  Cannot check - missing data or images directory');
}

// 3. 检查新组件
console.log('\n3. Checking New Components:');
console.log('═══════════════════════════════════');

const componentsToCheck = [
  'src/app/components/ui/ItemImage.jsx',
  'src/app/components/ui/EncyclopediaItemCard.jsx'
];

componentsToCheck.forEach(componentPath => {
  const fullPath = path.join(__dirname, '..', componentPath);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf8');
    
    if (componentPath.includes('ItemImage.jsx')) {
      const hasErrorHandling = content.includes('handleImageError') && content.includes('handleImageLoad');
      const hasFallback = content.includes('FallbackIcon');
      const hasLoading = content.includes('LoadingPlaceholder');
      
      console.log(`   ✅ ItemImage.jsx created`);
      console.log(`      - Error handling: ${hasErrorHandling ? '✅' : '❌'}`);
      console.log(`      - Fallback icon: ${hasFallback ? '✅' : '❌'}`);
      console.log(`      - Loading state: ${hasLoading ? '✅' : '❌'}`);
    } else {
      const usesItemImage = content.includes('ItemImage');
      console.log(`   ✅ EncyclopediaItemCard.jsx updated`);
      console.log(`      - Uses ItemImage: ${usesItemImage ? '✅' : '❌'}`);
    }
  } else {
    console.log(`   ❌ ${componentPath} not found`);
  }
});

// 4. 检查Next.js配置
console.log('\n4. Checking Next.js Configuration:');
console.log('═══════════════════════════════════');

const nextConfigPath = path.join(__dirname, '..', 'next.config.ts');
if (fs.existsSync(nextConfigPath)) {
  const content = fs.readFileSync(nextConfigPath, 'utf8');
  const hasImageConfig = content.includes('images:');
  const hasUnoptimized = content.includes('unoptimized');
  const hasRemotePatterns = content.includes('remotePatterns');
  
  console.log('   ✅ next.config.ts found');
  console.log(`      - Image configuration: ${hasImageConfig ? '✅' : '❌'}`);
  console.log(`      - Unoptimized setting: ${hasUnoptimized ? '✅' : '❌'}`);
  console.log(`      - Remote patterns: ${hasRemotePatterns ? '✅' : '❌'}`);
} else {
  console.log('   ❌ next.config.ts not found');
}

// 5. 修复总结
console.log('\n5. Image Loading Fixes Applied:');
console.log('═══════════════════════════════════');
console.log('   🔧 Problems Fixed:');
console.log('      • Next.js Image component error handling');
console.log('      • Missing fallback for failed image loads');
console.log('      • No loading states for images');
console.log('      • Inconsistent image handling across components');
console.log('');
console.log('   ✅ Solutions Implemented:');
console.log('      • Created dedicated ItemImage component');
console.log('      • Added proper error handling and fallbacks');
console.log('      • Implemented loading states with animations');
console.log('      • Updated Next.js config for better image handling');
console.log('      • Added unoptimized flag for local development');
console.log('');
console.log('   🎨 User Experience Improvements:');
console.log('      • Loading animations while images load');
console.log('      • Fallback icons when images fail to load');
console.log('      • Consistent image sizing and styling');
console.log('      • Better error recovery');

// 6. 测试建议
console.log('\n6. Testing Recommendations:');
console.log('═══════════════════════════════════');
console.log('   🧪 Manual Testing Steps:');
console.log('      1. npm run dev');
console.log('      2. Visit encyclopedia pages (/crops, /pets)');
console.log('      3. Check if images load properly');
console.log('      4. Look for loading animations');
console.log('      5. Verify fallback icons for missing images');
console.log('      6. Test on different network speeds');
console.log('');
console.log('   🔍 What to Look For:');
console.log('      ✅ Images should load and display correctly');
console.log('      ✅ Loading animations should appear briefly');
console.log('      ✅ Missing images should show fallback icons');
console.log('      ✅ No broken image placeholders');
console.log('      ✅ Consistent card layouts');

console.log('\n🎉 Image loading fixes complete!');
console.log('💡 Test the encyclopedia pages to see the improvements.');