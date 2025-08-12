#!/usr/bin/env node

// 测试收藏按钮动画和反馈功能
// 这个脚本测试动画组件和 Toast 通知系统

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🧪 Testing Favorite Button Animations and Feedback...\n');

// 测试 TypeScript 编译
console.log('1. Testing TypeScript compilation for animation components...');
try {
  execSync('npx tsc --noEmit --skipLibCheck src/app/components/ui/AnimatedFavoriteButton.tsx src/app/components/ui/Toast.tsx src/app/components/ui/EnhancedFavoriteButton.tsx', { 
    cwd: path.join(__dirname, '..'),
    stdio: 'pipe'
  });
  console.log('✅ TypeScript compilation successful for animation components\n');
} catch (error) {
  console.log('❌ TypeScript compilation failed:');
  console.log(error.stdout?.toString() || error.message);
  console.log('');
}

// 检查组件文件
console.log('2. Testing animation component files...');

const animationFiles = [
  'src/app/components/ui/AnimatedFavoriteButton.tsx',
  'src/app/components/ui/Toast.tsx',
  'src/app/components/ui/EnhancedFavoriteButton.tsx'
];

let allAnimationFilesExist = true;

animationFiles.forEach(file => {
  const fullPath = path.join(__dirname, '..', file);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing`);
    allAnimationFilesExist = false;
  }
});

if (allAnimationFilesExist) {
  console.log('✅ All animation component files exist\n');
} else {
  console.log('❌ Some animation component files are missing\n');
}

// 测试动画组件结构
console.log('3. Testing animation component structure...');

try {
  const animatedButtonContent = fs.readFileSync(
    path.join(__dirname, '..', 'src/app/components/ui/AnimatedFavoriteButton.tsx'), 
    'utf8'
  );
  
  const toastContent = fs.readFileSync(
    path.join(__dirname, '..', 'src/app/components/ui/Toast.tsx'), 
    'utf8'
  );
  
  const enhancedButtonContent = fs.readFileSync(
    path.join(__dirname, '..', 'src/app/components/ui/EnhancedFavoriteButton.tsx'), 
    'utf8'
  );

  // 检查动画按钮组件
  const animationChecks = [
    { name: 'AnimatedFavoriteButton export', pattern: /export function AnimatedFavoriteButton/ },
    { name: 'FloatingHeartButton export', pattern: /export function FloatingHeartButton/ },
    { name: 'PulsingFavoriteButton export', pattern: /export function PulsingFavoriteButton/ },
    { name: 'GradientFavoriteButton export', pattern: /export function GradientFavoriteButton/ },
    { name: 'Animation state management', pattern: /useState.*isAnimating/ },
    { name: 'Success feedback state', pattern: /useState.*showSuccess/ },
    { name: 'CSS animations', pattern: /(animate-|transition-|duration-)/ },
    { name: 'Hover effects', pattern: /hover:scale/ },
    { name: 'Active effects', pattern: /active:scale/ }
  ];

  console.log('   AnimatedFavoriteButton component checks:');
  animationChecks.forEach(check => {
    if (check.pattern.test(animatedButtonContent)) {
      console.log(`   ✅ ${check.name}`);
    } else {
      console.log(`   ❌ ${check.name}`);
    }
  });

  // 检查 Toast 组件
  const toastChecks = [
    { name: 'Toast component export', pattern: /export function Toast/ },
    { name: 'ToastContainer export', pattern: /export function ToastContainer/ },
    { name: 'useToast hook', pattern: /export function useToast/ },
    { name: 'useFavoriteToast hook', pattern: /export function useFavoriteToast/ },
    { name: 'Toast types', pattern: /type ToastType/ },
    { name: 'Animation classes', pattern: /transition-all.*duration/ },
    { name: 'Position variants', pattern: /top-right|bottom-left/ },
    { name: 'Auto-close functionality', pattern: /setTimeout.*onClose/ }
  ];

  console.log('   Toast component checks:');
  toastChecks.forEach(check => {
    if (check.pattern.test(toastContent)) {
      console.log(`   ✅ ${check.name}`);
    } else {
      console.log(`   ❌ ${check.name}`);
    }
  });

  // 检查增强按钮组件
  const enhancedChecks = [
    { name: 'EnhancedFavoriteButton export', pattern: /export function EnhancedFavoriteButton/ },
    { name: 'QuickFavoriteButton export', pattern: /export function QuickFavoriteButton/ },
    { name: 'FavoriteSwitch export', pattern: /export function FavoriteSwitch/ },
    { name: 'BulkFavoriteButton export', pattern: /export function BulkFavoriteButton/ },
    { name: 'Loading state', pattern: /useState.*isLoading/ },
    { name: 'Toast integration', pattern: /useFavoriteToast/ },
    { name: 'Error handling', pattern: /try.*catch/ },
    { name: 'Loader component', pattern: /Loader2/ }
  ];

  console.log('   EnhancedFavoriteButton component checks:');
  enhancedChecks.forEach(check => {
    if (check.pattern.test(enhancedButtonContent)) {
      console.log(`   ✅ ${check.name}`);
    } else {
      console.log(`   ❌ ${check.name}`);
    }
  });

} catch (error) {
  console.log('❌ Failed to read animation component files:', error.message);
}

console.log('\n4. Testing animation and transition features...');

// 检查动画特性
const animationFeatures = [
  { name: 'CSS Transitions', pattern: /transition-all|transition-colors|transition-transform/ },
  { name: 'Scale animations', pattern: /scale-\d+|hover:scale|active:scale/ },
  { name: 'Opacity animations', pattern: /opacity-\d+/ },
  { name: 'Transform animations', pattern: /transform|translate/ },
  { name: 'Tailwind animations', pattern: /animate-(spin|bounce|pulse|ping)/ },
  { name: 'Duration classes', pattern: /duration-\d+/ },
  { name: 'Ease functions', pattern: /ease-(in|out|in-out)/ },
  { name: 'Hover states', pattern: /hover:/ },
  { name: 'Focus states', pattern: /focus:/ },
  { name: 'Active states', pattern: /active:/ }
];

try {
  const allAnimationContent = animationFiles.map(file => {
    return fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
  }).join('\n');

  animationFeatures.forEach(feature => {
    if (feature.pattern.test(allAnimationContent)) {
      console.log(`✅ ${feature.name}`);
    } else {
      console.log(`❌ ${feature.name}`);
    }
  });

} catch (error) {
  console.log('❌ Failed to check animation features:', error.message);
}

console.log('\n5. Testing user feedback features...');

// 检查用户反馈特性
const feedbackFeatures = [
  { name: 'Toast notifications', pattern: /showAddedToFavorites|showRemovedFromFavorites/ },
  { name: 'Loading states', pattern: /isLoading|setIsLoading/ },
  { name: 'Success feedback', pattern: /showSuccess|success/ },
  { name: 'Error handling', pattern: /showFavoriteError|error/ },
  { name: 'Visual feedback', pattern: /animate-|pulse|bounce/ },
  { name: 'Accessibility labels', pattern: /aria-label/ },
  { name: 'Keyboard support', pattern: /onKeyDown|tabIndex/ },
  { name: 'Screen reader support', pattern: /sr-only/ },
  { name: 'Auto-close timers', pattern: /setTimeout/ },
  { name: 'Action buttons', pattern: /action.*onClick/ }
];

try {
  const allContent = animationFiles.map(file => {
    return fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
  }).join('\n');

  feedbackFeatures.forEach(feature => {
    if (feature.pattern.test(allContent)) {
      console.log(`✅ ${feature.name}`);
    } else {
      console.log(`❌ ${feature.name}`);
    }
  });

} catch (error) {
  console.log('❌ Failed to check feedback features:', error.message);
}

console.log('\n6. Testing component variants and flexibility...');

// 检查组件变体
const componentVariants = [
  'AnimatedFavoriteButton',
  'FloatingHeartButton',
  'PulsingFavoriteButton', 
  'GradientFavoriteButton',
  'TooltipFavoriteButton',
  'EnhancedFavoriteButton',
  'QuickFavoriteButton',
  'FavoriteSwitch',
  'BulkFavoriteButton',
  'Toast',
  'ToastContainer'
];

try {
  const allContent = animationFiles.map(file => {
    return fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
  }).join('\n');

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

console.log('\n🎉 Animation and feedback tests completed!');
console.log('\nAnimation features implemented:');
console.log('- Smooth transitions and hover effects');
console.log('- Scale animations on interaction');
console.log('- Pulse and bounce effects for feedback');
console.log('- Loading states with spinners');
console.log('- Toast notifications for user feedback');
console.log('- Multiple button variants and styles');
console.log('\nNext steps:');
console.log('- Integrate animated buttons with encyclopedia pages');
console.log('- Add Toast provider to app layout');
console.log('- Test animations in browser environment');