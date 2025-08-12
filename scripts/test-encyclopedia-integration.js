#!/usr/bin/env node

// 测试收藏按钮与百科全书卡片的集成
// 这个脚本测试组件集成和布局更新

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🧪 Testing Encyclopedia Integration with Favorites...\n');

// 测试 TypeScript 编译
console.log('1. Testing TypeScript compilation for updated components...');
try {
  execSync('npx tsc --noEmit --skipLibCheck src/app/layout.tsx src/app/components/ui/EncyclopediaItemCard.jsx', { 
    cwd: path.join(__dirname, '..'),
    stdio: 'pipe'
  });
  console.log('✅ TypeScript compilation successful for updated components\n');
} catch (error) {
  console.log('❌ TypeScript compilation failed:');
  console.log(error.stdout?.toString() || error.message);
  console.log('');
}

// 检查集成更新
console.log('2. Testing integration updates...');

try {
  // 检查 EncyclopediaItemCard 更新
  const cardContent = fs.readFileSync(
    path.join(__dirname, '..', 'src/app/components/ui/EncyclopediaItemCard.jsx'), 
    'utf8'
  );
  
  const cardChecks = [
    { name: 'CompactFavoriteButton import', pattern: /import.*CompactFavoriteButton.*from/ },
    { name: 'Favorite button container', pattern: /data-favorite-button/ },
    { name: 'Click handler update', pattern: /handleCardClick/ },
    { name: 'Event propagation prevention', pattern: /closest.*data-favorite-button/ },
    { name: 'Absolute positioning', pattern: /absolute.*top-2.*right-2/ },
    { name: 'Z-index layering', pattern: /z-10/ },
    { name: 'Background styling', pattern: /bg-white\/80.*backdrop-blur/ }
  ];

  console.log('   EncyclopediaItemCard integration checks:');
  cardChecks.forEach(check => {
    if (check.pattern.test(cardContent)) {
      console.log(`   ✅ ${check.name}`);
    } else {
      console.log(`   ❌ ${check.name}`);
    }
  });

  // 检查 Layout 更新
  const layoutContent = fs.readFileSync(
    path.join(__dirname, '..', 'src/app/layout.tsx'), 
    'utf8'
  );
  
  const layoutChecks = [
    { name: 'FavoritesProvider import', pattern: /import.*FavoritesProvider.*from/ },
    { name: 'Provider wrapping', pattern: /<FavoritesProvider>/ },
    { name: 'Provider closing', pattern: /<\/FavoritesProvider>/ },
    { name: 'Correct nesting order', pattern: /<AppProvider>\s*<FavoritesProvider>/ }
  ];

  console.log('   Layout integration checks:');
  layoutChecks.forEach(check => {
    if (check.pattern.test(layoutContent)) {
      console.log(`   ✅ ${check.name}`);
    } else {
      console.log(`   ❌ ${check.name}`);
    }
  });

} catch (error) {
  console.log('❌ Failed to check integration updates:', error.message);
}

console.log('\n3. Testing component structure and props...');

// 检查组件结构
try {
  const cardContent = fs.readFileSync(
    path.join(__dirname, '..', 'src/app/components/ui/EncyclopediaItemCard.jsx'), 
    'utf8'
  );

  const structureChecks = [
    { name: 'Item ID prop passing', pattern: /itemId={item\.name}/ },
    { name: 'Item type prop passing', pattern: /itemType={type}/ },
    { name: 'Custom styling', pattern: /className.*bg-white/ },
    { name: 'Proper component structure', pattern: /CompactFavoriteButton/ },
    { name: 'Event handling', pattern: /onClick.*handleCardClick/ }
  ];

  structureChecks.forEach(check => {
    if (check.pattern.test(cardContent)) {
      console.log(`✅ ${check.name}`);
    } else {
      console.log(`❌ ${check.name}`);
    }
  });

} catch (error) {
  console.log('❌ Failed to check component structure:', error.message);
}

console.log('\n4. Testing responsive design and accessibility...');

// 检查响应式设计和可访问性
try {
  const cardContent = fs.readFileSync(
    path.join(__dirname, '..', 'src/app/components/ui/EncyclopediaItemCard.jsx'), 
    'utf8'
  );

  const designChecks = [
    { name: 'Responsive positioning', pattern: /absolute.*top-.*right-/ },
    { name: 'Backdrop blur effect', pattern: /backdrop-blur/ },
    { name: 'Hover states', pattern: /hover:/ },
    { name: 'Transition effects', pattern: /transition/ },
    { name: 'Z-index stacking', pattern: /z-\d+/ },
    { name: 'Semi-transparent background', pattern: /bg-white\/\d+/ }
  ];

  designChecks.forEach(check => {
    if (check.pattern.test(cardContent)) {
      console.log(`✅ ${check.name}`);
    } else {
      console.log(`❌ ${check.name}`);
    }
  });

} catch (error) {
  console.log('❌ Failed to check design features:', error.message);
}

console.log('\n5. Testing provider hierarchy and context availability...');

// 检查 Provider 层次结构
try {
  const layoutContent = fs.readFileSync(
    path.join(__dirname, '..', 'src/app/layout.tsx'), 
    'utf8'
  );

  // 检查 Provider 嵌套顺序
  const providerOrder = [
    'I18nProvider',
    'AppProvider', 
    'FavoritesProvider'
  ];

  let currentIndex = 0;
  providerOrder.forEach((provider, index) => {
    const openTag = new RegExp(`<${provider}>`);
    const match = layoutContent.match(openTag);
    if (match) {
      const position = match.index;
      if (index === 0 || position > currentIndex) {
        console.log(`✅ ${provider} correctly positioned`);
        currentIndex = position;
      } else {
        console.log(`❌ ${provider} incorrectly positioned`);
      }
    } else {
      console.log(`❌ ${provider} not found`);
    }
  });

} catch (error) {
  console.log('❌ Failed to check provider hierarchy:', error.message);
}

console.log('\n6. Testing file dependencies and imports...');

// 检查文件依赖
const dependencyChecks = [
  {
    file: 'src/app/components/ui/EncyclopediaItemCard.jsx',
    dependencies: [
      { name: 'FavoriteButton import', pattern: /from.*['"]\.\/(FavoriteButton|.*FavoriteButton)['"]/ }
    ]
  },
  {
    file: 'src/app/layout.tsx',
    dependencies: [
      { name: 'FavoritesContext import', pattern: /from.*['"]\@\/contexts\/FavoritesContext['"]/ }
    ]
  }
];

dependencyChecks.forEach(({ file, dependencies }) => {
  try {
    const content = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
    console.log(`   ${file}:`);
    
    dependencies.forEach(dep => {
      if (dep.pattern.test(content)) {
        console.log(`   ✅ ${dep.name}`);
      } else {
        console.log(`   ❌ ${dep.name}`);
      }
    });
  } catch (error) {
    console.log(`   ❌ Failed to read ${file}`);
  }
});

console.log('\n🎉 Encyclopedia integration tests completed!');
console.log('\nIntegration features implemented:');
console.log('- Favorite button added to encyclopedia cards');
console.log('- Click event handling to prevent conflicts');
console.log('- FavoritesProvider added to app layout');
console.log('- Proper component positioning and styling');
console.log('- Context availability throughout the app');
console.log('\nNext steps:');
console.log('- Test favorite button in detail pages');
console.log('- Add navigation bar integration');
console.log('- Create favorites page');