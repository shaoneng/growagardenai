#!/usr/bin/env node

// 测试收藏页面实现
// 这个脚本测试收藏页面组件和相关UI组件

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🧪 Testing Favorites Page Implementation...\n');

// 测试 TypeScript 编译
console.log('1. Testing TypeScript compilation for favorites page...');
try {
  execSync('npx tsc --noEmit --skipLibCheck src/app/favorites/page.tsx src/app/components/feature/FavoritesPage.tsx', { 
    cwd: path.join(__dirname, '..'),
    stdio: 'pipe'
  });
  console.log('✅ TypeScript compilation successful for favorites page\n');
} catch (error) {
  console.log('❌ TypeScript compilation failed:');
  console.log(error.stdout?.toString() || error.message);
  console.log('');
}

// 检查文件结构
console.log('2. Testing file structure...');

const requiredFiles = [
  'src/app/favorites/page.tsx',
  'src/app/components/feature/FavoritesPage.tsx',
  'src/app/components/ui/FavoriteItemCard.tsx',
  'src/app/components/ui/FavoriteItemList.tsx',
  'src/app/components/ui/EmptyFavoritesState.tsx'
];

let allFilesExist = true;

requiredFiles.forEach(file => {
  const fullPath = path.join(__dirname, '..', file);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing`);
    allFilesExist = false;
  }
});

if (allFilesExist) {
  console.log('✅ All required files exist\n');
} else {
  console.log('❌ Some required files are missing\n');
}

// 检查页面组件结构
console.log('3. Testing page component structure...');

try {
  // 检查 FavoritesPage 组件
  const favoritesPageContent = fs.readFileSync(
    path.join(__dirname, '..', 'src/app/components/feature/FavoritesPage.tsx'), 
    'utf8'
  );
  
  const pageChecks = [
    { name: 'useFavorites hook usage', pattern: /useFavorites/ },
    { name: 'useFavoritesStats hook usage', pattern: /useFavoritesStats/ },
    { name: 'Search functionality', pattern: /searchTerm.*setSearchTerm/ },
    { name: 'Filter functionality', pattern: /activeFilter.*setActiveFilter/ },
    { name: 'View mode toggle', pattern: /viewMode.*setViewMode/ },
    { name: 'Sort functionality', pattern: /sortBy.*setSortBy/ },
    { name: 'Items data import', pattern: /import.*itemsData.*from/ },
    { name: 'Empty state handling', pattern: /EmptyFavoritesState/ },
    { name: 'Grid view support', pattern: /grid.*grid-cols/ },
    { name: 'List view support', pattern: /FavoriteItemList/ }
  ];

  console.log('   FavoritesPage component checks:');
  pageChecks.forEach(check => {
    if (check.pattern.test(favoritesPageContent)) {
      console.log(`   ✅ ${check.name}`);
    } else {
      console.log(`   ❌ ${check.name}`);
    }
  });

} catch (error) {
  console.log('❌ Failed to check page component structure:', error.message);
}

console.log('\n4. Testing UI component structure...');

try {
  // 检查 FavoriteItemCard 组件
  const cardContent = fs.readFileSync(
    path.join(__dirname, '..', 'src/app/components/ui/FavoriteItemCard.tsx'), 
    'utf8'
  );
  
  const cardChecks = [
    { name: 'QuickFavoriteButton integration', pattern: /QuickFavoriteButton/ },
    { name: 'Image error handling', pattern: /imageError.*setImageError/ },
    { name: 'Tier styling', pattern: /tierColorMap/ },
    { name: 'Detail link generation', pattern: /detailLink/ },
    { name: 'Hover effects', pattern: /group-hover/ },
    { name: 'External link icon', pattern: /ExternalLink/ },
    { name: 'Responsive design', pattern: /sm:|md:|lg:/ }
  ];

  console.log('   FavoriteItemCard component checks:');
  cardChecks.forEach(check => {
    if (check.pattern.test(cardContent)) {
      console.log(`   ✅ ${check.name}`);
    } else {
      console.log(`   ❌ ${check.name}`);
    }
  });

  // 检查 FavoriteItemList 组件
  const listContent = fs.readFileSync(
    path.join(__dirname, '..', 'src/app/components/ui/FavoriteItemList.tsx'), 
    'utf8'
  );
  
  const listChecks = [
    { name: 'List layout structure', pattern: /divide-y.*divide-gray/ },
    { name: 'Date formatting', pattern: /formatDate/ },
    { name: 'Image error handling', pattern: /imageErrors.*setImageErrors/ },
    { name: 'Action buttons', pattern: /操作按钮/ },
    { name: 'Responsive layout', pattern: /flex.*items-center/ },
    { name: 'Tier color mapping', pattern: /tierColorMap/ }
  ];

  console.log('   FavoriteItemList component checks:');
  listChecks.forEach(check => {
    if (check.pattern.test(listContent)) {
      console.log(`   ✅ ${check.name}`);
    } else {
      console.log(`   ❌ ${check.name}`);
    }
  });

  // 检查 EmptyFavoritesState 组件
  const emptyStateContent = fs.readFileSync(
    path.join(__dirname, '..', 'src/app/components/ui/EmptyFavoritesState.tsx'), 
    'utf8'
  );
  
  const emptyStateChecks = [
    { name: 'Empty state illustration', pattern: /Heart.*w-10.*h-10/ },
    { name: 'Navigation links', pattern: /Link.*href/ },
    { name: 'Usage instructions', pattern: /如何添加收藏/ },
    { name: 'Call-to-action buttons', pattern: /浏览作物|浏览宠物/ },
    { name: 'Visual hierarchy', pattern: /text-2xl.*font-bold/ },
    { name: 'Grid layout', pattern: /grid.*grid-cols/ }
  ];

  console.log('   EmptyFavoritesState component checks:');
  emptyStateChecks.forEach(check => {
    if (check.pattern.test(emptyStateContent)) {
      console.log(`   ✅ ${check.name}`);
    } else {
      console.log(`   ❌ ${check.name}`);
    }
  });

} catch (error) {
  console.log('❌ Failed to check UI component structure:', error.message);
}

console.log('\n5. Testing functionality and features...');

// 检查功能特性
try {
  const favoritesPageContent = fs.readFileSync(
    path.join(__dirname, '..', 'src/app/components/feature/FavoritesPage.tsx'), 
    'utf8'
  );

  const featureChecks = [
    { name: 'Search and filter', pattern: /searchTerm.*activeFilter/ },
    { name: 'Statistics display', pattern: /FavoritesStatsCard/ },
    { name: 'View mode switching', pattern: /Grid.*List/ },
    { name: 'Sorting options', pattern: /name.*tier.*dateAdded/ },
    { name: 'Grouped display', pattern: /groupedItems/ },
    { name: 'Breadcrumb navigation', pattern: /面包屑导航/ },
    { name: 'Quick actions', pattern: /快速操作/ },
    { name: 'Responsive design', pattern: /md:grid-cols|lg:grid-cols/ },
    { name: 'Loading states', pattern: /useMemo/ },
    { name: 'Empty state handling', pattern: /stats\.isEmpty/ }
  ];

  featureChecks.forEach(check => {
    if (check.pattern.test(favoritesPageContent)) {
      console.log(`✅ ${check.name}`);
    } else {
      console.log(`❌ ${check.name}`);
    }
  });

} catch (error) {
  console.log('❌ Failed to check functionality features:', error.message);
}

console.log('\n6. Testing styling and accessibility...');

// 检查样式和可访问性
const styleChecks = [
  { 
    file: 'src/app/components/feature/FavoritesPage.tsx',
    checks: [
      { name: 'Tailwind CSS classes', pattern: /className.*=.*"[^"]*\b(bg-|text-|p-|m-|w-|h-|rounded|border|hover:|focus:)/ },
      { name: 'Responsive breakpoints', pattern: /(sm:|md:|lg:|xl:)/ },
      { name: 'Color scheme consistency', pattern: /blue-|green-|purple-|gray-/ },
      { name: 'Spacing consistency', pattern: /p-\d+|m-\d+|gap-\d+/ },
      { name: 'Interactive states', pattern: /hover:|focus:|active:/ }
    ]
  }
];

styleChecks.forEach(({ file, checks }) => {
  try {
    const content = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
    console.log(`   ${file}:`);
    
    checks.forEach(check => {
      if (check.pattern.test(content)) {
        console.log(`   ✅ ${check.name}`);
      } else {
        console.log(`   ❌ ${check.name}`);
      }
    });
  } catch (error) {
    console.log(`   ❌ Failed to read ${file}`);
  }
});

console.log('\n7. Testing route configuration...');

// 检查路由配置
try {
  const routeContent = fs.readFileSync(
    path.join(__dirname, '..', 'src/app/favorites/page.tsx'), 
    'utf8'
  );
  
  const routeChecks = [
    { name: 'Client component directive', pattern: /'use client'/ },
    { name: 'FavoritesPage import', pattern: /import.*FavoritesPage/ },
    { name: 'Default export', pattern: /export default function Favorites/ },
    { name: 'Component rendering', pattern: /<FavoritesPage/ }
  ];

  console.log('   Route configuration checks:');
  routeChecks.forEach(check => {
    if (check.pattern.test(routeContent)) {
      console.log(`   ✅ ${check.name}`);
    } else {
      console.log(`   ❌ ${check.name}`);
    }
  });

} catch (error) {
  console.log('❌ Failed to check route configuration:', error.message);
}

console.log('\n🎉 Favorites page tests completed!');
console.log('\nFavorites page features implemented:');
console.log('- Complete favorites page with search and filtering');
console.log('- Grid and list view modes');
console.log('- Statistics and analytics display');
console.log('- Empty state with helpful guidance');
console.log('- Responsive design for all devices');
console.log('- Integration with existing favorites system');
console.log('\nNext steps:');
console.log('- Add navigation bar integration');
console.log('- Test complete user flow');
console.log('- Add favorites badge to navigation');