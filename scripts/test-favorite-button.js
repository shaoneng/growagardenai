#!/usr/bin/env node

// 测试收藏按钮组件
// 这个脚本测试 FavoriteButton 组件的结构和功能

const { execSync } = require('child_process');
const path = require('path');

console.log('🧪 Testing Favorite Button Components...\n');

// 测试 TypeScript 编译
console.log('1. Testing TypeScript compilation for button components...');
try {
  execSync('npx tsc --noEmit --skipLibCheck src/app/components/ui/FavoriteButton.tsx src/app/components/ui/FavoritesBadge.tsx', { 
    cwd: path.join(__dirname, '..'),
    stdio: 'pipe'
  });
  console.log('✅ TypeScript compilation successful for button components\n');
} catch (error) {
  console.log('❌ TypeScript compilation failed:');
  console.log(error.stdout?.toString() || error.message);
  console.log('');
}

// 测试组件结构
console.log('2. Testing component structure...');

// 检查组件文件是否存在
const fs = require('fs');

const componentFiles = [
  'src/app/components/ui/FavoriteButton.tsx',
  'src/app/components/ui/FavoritesBadge.tsx'
];

let allFilesExist = true;

componentFiles.forEach(file => {
  const fullPath = path.join(__dirname, '..', file);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing`);
    allFilesExist = false;
  }
});

if (allFilesExist) {
  console.log('✅ All component files exist\n');
} else {
  console.log('❌ Some component files are missing\n');
}

// 测试组件内容结构
console.log('3. Testing component content structure...');

try {
  const favoriteButtonContent = fs.readFileSync(
    path.join(__dirname, '..', 'src/app/components/ui/FavoriteButton.tsx'), 
    'utf8'
  );
  
  const favoritesBadgeContent = fs.readFileSync(
    path.join(__dirname, '..', 'src/app/components/ui/FavoritesBadge.tsx'), 
    'utf8'
  );

  // 检查 FavoriteButton 组件的关键元素
  const buttonChecks = [
    { name: 'FavoriteButton export', pattern: /export function FavoriteButton/ },
    { name: 'CompactFavoriteButton export', pattern: /export function CompactFavoriteButton/ },
    { name: 'useFavoriteStatus hook', pattern: /useFavoriteStatus/ },
    { name: 'Heart icon import', pattern: /import.*Heart.*from.*lucide-react/ },
    { name: 'onClick handler', pattern: /onClick={toggleFavorite}/ },
    { name: 'Accessibility attributes', pattern: /aria-label/ },
    { name: 'Size variants', pattern: /size.*=.*'(sm|md|lg)'/ }
  ];

  console.log('   FavoriteButton component checks:');
  buttonChecks.forEach(check => {
    if (check.pattern.test(favoriteButtonContent)) {
      console.log(`   ✅ ${check.name}`);
    } else {
      console.log(`   ❌ ${check.name}`);
    }
  });

  // 检查 FavoritesBadge 组件的关键元素
  const badgeChecks = [
    { name: 'FavoritesBadge export', pattern: /export function FavoritesBadge/ },
    { name: 'SimpleBadge export', pattern: /export function SimpleBadge/ },
    { name: 'NavigationBadge export', pattern: /export function NavigationBadge/ },
    { name: 'Count formatting', pattern: /formatCount/ },
    { name: 'Conditional rendering', pattern: /if.*count.*===.*0/ },
    { name: 'Accessibility label', pattern: /aria-label/ }
  ];

  console.log('   FavoritesBadge component checks:');
  badgeChecks.forEach(check => {
    if (check.pattern.test(favoritesBadgeContent)) {
      console.log(`   ✅ ${check.name}`);
    } else {
      console.log(`   ❌ ${check.name}`);
    }
  });

} catch (error) {
  console.log('❌ Failed to read component files:', error.message);
}

console.log('\n4. Testing component variants...');

// 检查组件变体
const componentVariants = [
  'FavoriteButton',
  'CompactFavoriteButton', 
  'FavoriteButtonWithCount',
  'FavoriteToggle',
  'FavoriteButtonGroup',
  'FavoritesBadge',
  'SimpleBadge',
  'NavigationBadge',
  'FavoriteIndicator',
  'FavoritesStatsCard',
  'FavoritesProgress'
];

try {
  const allContent = fs.readFileSync(
    path.join(__dirname, '..', 'src/app/components/ui/FavoriteButton.tsx'), 
    'utf8'
  ) + fs.readFileSync(
    path.join(__dirname, '..', 'src/app/components/ui/FavoritesBadge.tsx'), 
    'utf8'
  );

  componentVariants.forEach(variant => {
    const pattern = new RegExp(`export function ${variant}`);
    if (pattern.test(allContent)) {
      console.log(`✅ ${variant} component variant exists`);
    } else {
      console.log(`❌ ${variant} component variant missing`);
    }
  });

} catch (error) {
  console.log('❌ Failed to check component variants:', error.message);
}

console.log('\n5. Testing styling and accessibility...');

// 检查样式和可访问性特性
const styleChecks = [
  { name: 'Tailwind CSS classes', pattern: /className.*=.*`[^`]*\b(bg-|text-|p-|m-|w-|h-|rounded|border|hover:|focus:)/ },
  { name: 'Responsive design', pattern: /(sm:|md:|lg:)/ },
  { name: 'Hover effects', pattern: /hover:/ },
  { name: 'Focus states', pattern: /focus:/ },
  { name: 'Transition animations', pattern: /transition/ },
  { name: 'ARIA labels', pattern: /aria-label/ },
  { name: 'ARIA pressed', pattern: /aria-pressed/ },
  { name: 'Screen reader support', pattern: /sr-only/ }
];

try {
  const allContent = fs.readFileSync(
    path.join(__dirname, '..', 'src/app/components/ui/FavoriteButton.tsx'), 
    'utf8'
  ) + fs.readFileSync(
    path.join(__dirname, '..', 'src/app/components/ui/FavoritesBadge.tsx'), 
    'utf8'
  );

  styleChecks.forEach(check => {
    if (check.pattern.test(allContent)) {
      console.log(`✅ ${check.name}`);
    } else {
      console.log(`❌ ${check.name}`);
    }
  });

} catch (error) {
  console.log('❌ Failed to check styling and accessibility:', error.message);
}

console.log('\n6. Testing component props and types...');

// 检查类型定义的使用
const typeChecks = [
  { name: 'FavoriteButtonProps import', pattern: /FavoriteButtonProps/ },
  { name: 'FavoritesBadgeProps import', pattern: /FavoritesBadgeProps/ },
  { name: 'Type annotations', pattern: /:\s*(string|number|boolean|FavoriteItemType)/ },
  { name: 'Optional props', pattern: /\?\s*:/ },
  { name: 'Default parameters', pattern: /=\s*['"`]/ }
];

try {
  const allContent = fs.readFileSync(
    path.join(__dirname, '..', 'src/app/components/ui/FavoriteButton.tsx'), 
    'utf8'
  ) + fs.readFileSync(
    path.join(__dirname, '..', 'src/app/components/ui/FavoritesBadge.tsx'), 
    'utf8'
  );

  typeChecks.forEach(check => {
    if (check.pattern.test(allContent)) {
      console.log(`✅ ${check.name}`);
    } else {
      console.log(`❌ ${check.name}`);
    }
  });

} catch (error) {
  console.log('❌ Failed to check types:', error.message);
}

console.log('\n🎉 Favorite Button component tests completed!');
console.log('\nNext steps:');
console.log('- Integrate FavoriteButton with encyclopedia cards');
console.log('- Add FavoritesProvider to app layout');
console.log('- Test button interactions in browser');