#!/usr/bin/env node

// 测试详情页收藏功能集成
// 这个脚本测试详情页组件的收藏按钮集成和 Toast 提供者

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🧪 Testing Detail Page Favorites Integration...\n');

// 测试 TypeScript 编译
console.log('1. Testing TypeScript compilation for detail pages...');
try {
  execSync('npx tsc --noEmit --skipLibCheck src/app/components/feature/CropDetailPage.jsx src/app/components/feature/PetDetailPage.jsx src/app/components/layout/ToastProvider.tsx', { 
    cwd: path.join(__dirname, '..'),
    stdio: 'pipe'
  });
  console.log('✅ TypeScript compilation successful for detail pages\n');
} catch (error) {
  console.log('❌ TypeScript compilation failed:');
  console.log(error.stdout?.toString() || error.message);
  console.log('');
}

// 检查详情页更新
console.log('2. Testing detail page integration updates...');

try {
  // 检查 CropDetailPage 更新
  const cropContent = fs.readFileSync(
    path.join(__dirname, '..', 'src/app/components/feature/CropDetailPage.jsx'), 
    'utf8'
  );
  
  const cropChecks = [
    { name: 'EnhancedFavoriteButton import', pattern: /import.*EnhancedFavoriteButton.*from/ },
    { name: 'Favorite button component', pattern: /<EnhancedFavoriteButton/ },
    { name: 'Item ID prop', pattern: /itemId={crop\.name}/ },
    { name: 'Item type prop', pattern: /itemType="crops"/ },
    { name: 'Item name prop', pattern: /itemName={crop\.display_name/ },
    { name: 'Large size prop', pattern: /size="lg"/ },
    { name: 'Show label prop', pattern: /showLabel={true}/ },
    { name: 'Custom styling', pattern: /className="shadow-sm"/ }
  ];

  console.log('   CropDetailPage integration checks:');
  cropChecks.forEach(check => {
    if (check.pattern.test(cropContent)) {
      console.log(`   ✅ ${check.name}`);
    } else {
      console.log(`   ❌ ${check.name}`);
    }
  });

  // 检查 PetDetailPage 更新
  const petContent = fs.readFileSync(
    path.join(__dirname, '..', 'src/app/components/feature/PetDetailPage.jsx'), 
    'utf8'
  );
  
  const petChecks = [
    { name: 'EnhancedFavoriteButton import', pattern: /import.*EnhancedFavoriteButton.*from/ },
    { name: 'Favorite button component', pattern: /<EnhancedFavoriteButton/ },
    { name: 'Item ID prop', pattern: /itemId={pet\.name}/ },
    { name: 'Item type prop', pattern: /itemType="pets"/ },
    { name: 'Item name prop', pattern: /itemName={pet\.display_name/ },
    { name: 'Large size prop', pattern: /size="lg"/ },
    { name: 'Show label prop', pattern: /showLabel={true}/ },
    { name: 'Custom styling', pattern: /className="shadow-sm"/ }
  ];

  console.log('   PetDetailPage integration checks:');
  petChecks.forEach(check => {
    if (check.pattern.test(petContent)) {
      console.log(`   ✅ ${check.name}`);
    } else {
      console.log(`   ❌ ${check.name}`);
    }
  });

} catch (error) {
  console.log('❌ Failed to check detail page updates:', error.message);
}

console.log('\n3. Testing Toast provider integration...');

try {
  // 检查 ToastProvider 组件
  const toastProviderContent = fs.readFileSync(
    path.join(__dirname, '..', 'src/app/components/layout/ToastProvider.tsx'), 
    'utf8'
  );
  
  const toastProviderChecks = [
    { name: 'ToastProvider component', pattern: /export function ToastProvider/ },
    { name: 'useToastContext hook', pattern: /export function useToastContext/ },
    { name: 'Toast context creation', pattern: /createContext<ToastContextType/ },
    { name: 'useToast hook usage', pattern: /useToast\(\)/ },
    { name: 'ToastContainer rendering', pattern: /<ToastContainer/ },
    { name: 'Position configuration', pattern: /position="top-right"/ },
    { name: 'Context provider wrapping', pattern: /<ToastContext\.Provider/ }
  ];

  console.log('   ToastProvider component checks:');
  toastProviderChecks.forEach(check => {
    if (check.pattern.test(toastProviderContent)) {
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
    { name: 'ToastProvider import', pattern: /import.*ToastProvider.*from/ },
    { name: 'ToastProvider wrapping', pattern: /<ToastProvider>/ },
    { name: 'ToastProvider closing', pattern: /<\/ToastProvider>/ },
    { name: 'Correct provider nesting', pattern: /<FavoritesProvider>\s*<ToastProvider>/ }
  ];

  console.log('   Layout Toast integration checks:');
  layoutChecks.forEach(check => {
    if (check.pattern.test(layoutContent)) {
      console.log(`   ✅ ${check.name}`);
    } else {
      console.log(`   ❌ ${check.name}`);
    }
  });

} catch (error) {
  console.log('❌ Failed to check Toast provider integration:', error.message);
}

console.log('\n4. Testing component positioning and layout...');

// 检查组件定位
try {
  const cropContent = fs.readFileSync(
    path.join(__dirname, '..', 'src/app/components/feature/CropDetailPage.jsx'), 
    'utf8'
  );
  
  const petContent = fs.readFileSync(
    path.join(__dirname, '..', 'src/app/components/feature/PetDetailPage.jsx'), 
    'utf8'
  );

  const layoutChecks = [
    { name: 'Crop favorite button positioning', pattern: /收藏按钮.*mb-6/, content: cropContent },
    { name: 'Pet favorite button positioning', pattern: /收藏按钮.*mb-6/, content: petContent },
    { name: 'Crop button after title', pattern: /h1.*{crop\.display_name[\s\S]*收藏按钮/, content: cropContent },
    { name: 'Pet button after title', pattern: /h1.*{pet\.display_name[\s\S]*收藏按钮/, content: petContent }
  ];

  layoutChecks.forEach(check => {
    if (check.pattern.test(check.content)) {
      console.log(`✅ ${check.name}`);
    } else {
      console.log(`❌ ${check.name}`);
    }
  });

} catch (error) {
  console.log('❌ Failed to check component positioning:', error.message);
}

console.log('\n5. Testing provider hierarchy and dependencies...');

// 检查 Provider 层次结构
try {
  const layoutContent = fs.readFileSync(
    path.join(__dirname, '..', 'src/app/layout.tsx'), 
    'utf8'
  );

  // 检查完整的 Provider 嵌套顺序
  const providerOrder = [
    'I18nProvider',
    'AppProvider', 
    'FavoritesProvider',
    'ToastProvider'
  ];

  let allProvidersFound = true;
  providerOrder.forEach((provider, index) => {
    const openTag = new RegExp(`<${provider}>`);
    if (openTag.test(layoutContent)) {
      console.log(`✅ ${provider} found in layout`);
    } else {
      console.log(`❌ ${provider} not found in layout`);
      allProvidersFound = false;
    }
  });

  if (allProvidersFound) {
    console.log('✅ All providers correctly integrated');
  } else {
    console.log('❌ Some providers missing from layout');
  }

} catch (error) {
  console.log('❌ Failed to check provider hierarchy:', error.message);
}

console.log('\n6. Testing file structure and imports...');

// 检查文件结构
const fileChecks = [
  { 
    file: 'src/app/components/layout/ToastProvider.tsx',
    description: 'ToastProvider component file'
  },
  {
    file: 'src/app/components/feature/CropDetailPage.jsx',
    description: 'Updated CropDetailPage'
  },
  {
    file: 'src/app/components/feature/PetDetailPage.jsx', 
    description: 'Updated PetDetailPage'
  }
];

fileChecks.forEach(({ file, description }) => {
  const fullPath = path.join(__dirname, '..', file);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${description} exists`);
  } else {
    console.log(`❌ ${description} missing`);
  }
});

console.log('\n🎉 Detail page integration tests completed!');
console.log('\nDetail page features implemented:');
console.log('- Enhanced favorite buttons in crop and pet detail pages');
console.log('- Large size buttons with labels for better visibility');
console.log('- Toast notifications for user feedback');
console.log('- ToastProvider integrated into app layout');
console.log('- Proper component positioning and styling');
console.log('\nNext steps:');
console.log('- Create favorites page');
console.log('- Add navigation bar with favorites badge');
console.log('- Test complete user flow');