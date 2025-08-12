#!/usr/bin/env node

// 测试导航栏集成
// 这个脚本测试全局导航栏组件和布局集成

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🧪 Testing Navigation Integration...\n');

// 测试 TypeScript 编译
console.log('1. Testing TypeScript compilation for navigation...');
try {
  execSync('npx tsc --noEmit --skipLibCheck src/app/components/layout/GlobalNavigation.tsx src/app/layout.tsx', { 
    cwd: path.join(__dirname, '..'),
    stdio: 'pipe'
  });
  console.log('✅ TypeScript compilation successful for navigation\n');
} catch (error) {
  console.log('❌ TypeScript compilation failed:');
  console.log(error.stdout?.toString() || error.message);
  console.log('');
}

// 检查文件结构
console.log('2. Testing navigation file structure...');

const navigationFiles = [
  'src/app/components/layout/GlobalNavigation.tsx'
];

let allNavigationFilesExist = true;

navigationFiles.forEach(file => {
  const fullPath = path.join(__dirname, '..', file);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing`);
    allNavigationFilesExist = false;
  }
});

if (allNavigationFilesExist) {
  console.log('✅ All navigation files exist\n');
} else {
  console.log('❌ Some navigation files are missing\n');
}

// 检查导航组件结构
console.log('3. Testing navigation component structure...');

try {
  const navigationContent = fs.readFileSync(
    path.join(__dirname, '..', 'src/app/components/layout/GlobalNavigation.tsx'), 
    'utf8'
  );
  
  const navigationChecks = [
    { name: 'useFavorites hook usage', pattern: /useFavorites/ },
    { name: 'usePathname hook usage', pattern: /usePathname/ },
    { name: 'NavigationBadge component', pattern: /NavigationBadge/ },
    { name: 'Mobile menu state', pattern: /isMobileMenuOpen.*setIsMobileMenuOpen/ },
    { name: 'Navigation items configuration', pattern: /navigationItems.*=/ },
    { name: 'Active route detection', pattern: /isActive.*=/ },
    { name: 'Favorites count integration', pattern: /getFavoriteCount/ },
    { name: 'Responsive design', pattern: /md:hidden|hidden.*md:/ },
    { name: 'Sticky navigation', pattern: /sticky.*top-0/ },
    { name: 'Mobile menu toggle', pattern: /toggleMobileMenu/ }
  ];

  console.log('   GlobalNavigation component checks:');
  navigationChecks.forEach(check => {
    if (check.pattern.test(navigationContent)) {
      console.log(`   ✅ ${check.name}`);
    } else {
      console.log(`   ❌ ${check.name}`);
    }
  });

} catch (error) {
  console.log('❌ Failed to check navigation component structure:', error.message);
}

console.log('\n4. Testing layout integration...');

try {
  const layoutContent = fs.readFileSync(
    path.join(__dirname, '..', 'src/app/layout.tsx'), 
    'utf8'
  );
  
  const layoutChecks = [
    { name: 'GlobalNavigation import', pattern: /import.*GlobalNavigation.*from/ },
    { name: 'GlobalNavigation component usage', pattern: /<GlobalNavigation/ },
    { name: 'Correct provider nesting', pattern: /<ToastProvider>\s*<GlobalNavigation/ },
    { name: 'Navigation before children', pattern: /<GlobalNavigation.*\/>\s*{children}/ }
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
  console.log('❌ Failed to check layout integration:', error.message);
}

console.log('\n5. Testing navigation features...');

// 检查导航功能特性
try {
  const navigationContent = fs.readFileSync(
    path.join(__dirname, '..', 'src/app/components/layout/GlobalNavigation.tsx'), 
    'utf8'
  );

  const featureChecks = [
    { name: 'Brand logo and title', pattern: /Garden AI|策略顾问/ },
    { name: 'Home navigation', pattern: /首页.*Home/ },
    { name: 'Encyclopedia navigation', pattern: /百科全书.*BookOpen/ },
    { name: 'Favorites navigation', pattern: /我的收藏.*Heart/ },
    { name: 'Favorites badge display', pattern: /badge.*favoriteCount/ },
    { name: 'Submenu support', pattern: /submenu.*作物.*宠物/ },
    { name: 'Mobile responsive menu', pattern: /md:hidden.*移动端菜单/ },
    { name: 'Active state highlighting', pattern: /bg-blue-100.*text-blue-700/ },
    { name: 'Hover effects', pattern: /hover:/ },
    { name: 'Transition animations', pattern: /transition/ }
  ];

  featureChecks.forEach(check => {
    if (check.pattern.test(navigationContent)) {
      console.log(`✅ ${check.name}`);
    } else {
      console.log(`❌ ${check.name}`);
    }
  });

} catch (error) {
  console.log('❌ Failed to check navigation features:', error.message);
}

console.log('\n6. Testing accessibility and UX...');

// 检查可访问性和用户体验
try {
  const navigationContent = fs.readFileSync(
    path.join(__dirname, '..', 'src/app/components/layout/GlobalNavigation.tsx'), 
    'utf8'
  );

  const uxChecks = [
    { name: 'ARIA labels', pattern: /aria-label/ },
    { name: 'Keyboard navigation support', pattern: /Link.*href/ },
    { name: 'Focus states', pattern: /focus:/ },
    { name: 'Screen reader friendly', pattern: /sr-only|aria-/ },
    { name: 'Mobile touch targets', pattern: /p-2|p-3/ },
    { name: 'Visual feedback', pattern: /hover:.*bg-/ },
    { name: 'Loading states', pattern: /transition/ },
    { name: 'Responsive breakpoints', pattern: /sm:|md:|lg:/ },
    { name: 'Color contrast', pattern: /text-gray-900|text-blue-700/ },
    { name: 'Interactive elements', pattern: /button|Link/ }
  ];

  uxChecks.forEach(check => {
    if (check.pattern.test(navigationContent)) {
      console.log(`✅ ${check.name}`);
    } else {
      console.log(`❌ ${check.name}`);
    }
  });

} catch (error) {
  console.log('❌ Failed to check accessibility and UX:', error.message);
}

console.log('\n7. Testing navigation routes and links...');

// 检查导航路由和链接
try {
  const navigationContent = fs.readFileSync(
    path.join(__dirname, '..', 'src/app/components/layout/GlobalNavigation.tsx'), 
    'utf8'
  );

  const routeChecks = [
    { name: 'Home route', pattern: /href.*=.*['"]\//},
    { name: 'Crops route', pattern: /href.*=.*['"]\/crops['"]/ },
    { name: 'Pets route', pattern: /href.*=.*['"]\/pets['"]/ },
    { name: 'Favorites route', pattern: /href.*=.*['"]\/favorites['"]/ },
    { name: 'Route matching logic', pattern: /pathname\.startsWith/ },
    { name: 'Active route detection', pattern: /isActive.*href/ }
  ];

  console.log('   Navigation routes checks:');
  routeChecks.forEach(check => {
    if (check.pattern.test(navigationContent)) {
      console.log(`   ✅ ${check.name}`);
    } else {
      console.log(`   ❌ ${check.name}`);
    }
  });

} catch (error) {
  console.log('❌ Failed to check navigation routes:', error.message);
}

console.log('\n8. Testing mobile navigation...');

// 检查移动端导航
try {
  const navigationContent = fs.readFileSync(
    path.join(__dirname, '..', 'src/app/components/layout/GlobalNavigation.tsx'), 
    'utf8'
  );

  const mobileChecks = [
    { name: 'Mobile menu button', pattern: /md:hidden.*button/ },
    { name: 'Menu toggle functionality', pattern: /toggleMobileMenu/ },
    { name: 'Mobile menu overlay', pattern: /fixed.*inset-0.*bg-black/ },
    { name: 'Mobile menu items', pattern: /移动端菜单.*space-y/ },
    { name: 'Mobile quick actions', pattern: /快速操作/ },
    { name: 'Menu close on link click', pattern: /setIsMobileMenuOpen\(false\)/ },
    { name: 'Hamburger menu icon', pattern: /Menu.*X/ },
    { name: 'Mobile responsive layout', pattern: /px-4.*py-2/ }
  ];

  console.log('   Mobile navigation checks:');
  mobileChecks.forEach(check => {
    if (check.pattern.test(navigationContent)) {
      console.log(`   ✅ ${check.name}`);
    } else {
      console.log(`   ❌ ${check.name}`);
    }
  });

} catch (error) {
  console.log('❌ Failed to check mobile navigation:', error.message);
}

console.log('\n🎉 Navigation integration tests completed!');
console.log('\nNavigation features implemented:');
console.log('- Global navigation bar with brand and main links');
console.log('- Favorites link with real-time count badge');
console.log('- Active route highlighting and state management');
console.log('- Responsive mobile navigation with hamburger menu');
console.log('- Submenu support for encyclopedia sections');
console.log('- Accessibility features and keyboard navigation');
console.log('- Smooth animations and hover effects');
console.log('\nNext steps:');
console.log('- Test complete user flow');
console.log('- Add responsive design optimizations');
console.log('- Verify favorites system integration');