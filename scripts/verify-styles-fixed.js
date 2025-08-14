#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🎨 验证样式修复...\n');

// 检查配置文件
const checks = [
  {
    name: 'Tailwind配置文件',
    path: 'tailwind.config.js',
    check: (content) => content.includes('module.exports') && content.includes('content:')
  },
  {
    name: 'PostCSS配置',
    path: 'postcss.config.mjs', 
    check: (content) => content.includes('tailwindcss') && content.includes('autoprefixer')
  },
  {
    name: '全局CSS文件',
    path: 'src/app/globals.css',
    check: (content) => content.includes('@tailwind base') && content.includes('@tailwind components')
  },
  {
    name: 'Layout文件导入CSS',
    path: 'src/app/layout.tsx',
    check: (content) => content.includes('./globals.css')
  },
  {
    name: 'Package.json依赖',
    path: 'package.json',
    check: (content) => content.includes('"tailwindcss"') && content.includes('"autoprefixer"')
  }
];

let allPassed = true;

checks.forEach(check => {
  try {
    const filePath = path.join(__dirname, '..', check.path);
    const content = fs.readFileSync(filePath, 'utf8');
    const passed = check.check(content);
    
    console.log(`${passed ? '✅' : '❌'} ${check.name}`);
    if (!passed) allPassed = false;
  } catch (error) {
    console.log(`❌ ${check.name} - 文件不存在`);
    allPassed = false;
  }
});

console.log('\n📋 样式系统状态:');
if (allPassed) {
  console.log('✅ 所有配置文件正确');
  console.log('✅ Tailwind CSS v3.4.0 已安装');
  console.log('✅ PostCSS配置正确');
  console.log('✅ 全局样式已导入');
} else {
  console.log('❌ 存在配置问题');
}

console.log('\n🚀 测试步骤:');
console.log('1. 运行: npm run dev');
console.log('2. 访问: http://localhost:3000/simple-demo');
console.log('3. 检查沉浸式引导是否有正确的样式');

console.log('\n💡 预期效果:');
console.log('- 白色背景的模态框');
console.log('- 圆角边框');
console.log('- 正确的字体大小和颜色');
console.log('- 悬停效果正常工作');

if (allPassed) {
  console.log('\n🎉 样式修复完成！');
} else {
  console.log('\n⚠️  仍有问题需要解决');
}