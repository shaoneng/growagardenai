#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 修复沉浸式引导显示问题...\n');

// 1. 修复主页面，添加强制显示选项
const pagePath = path.join(__dirname, '../src/app/page.tsx');
let pageContent = fs.readFileSync(pagePath, 'utf8');

// 添加强制显示状态
if (!pageContent.includes('forceShowOnboarding')) {
  pageContent = pageContent.replace(
    'const [view, setView] = useState(\'mode-selection\');',
    `const [view, setView] = useState('mode-selection');
  const [forceShowOnboarding, setForceShowOnboarding] = useState(false);`
  );

  // 修改显示条件
  pageContent = pageContent.replace(
    '{shouldShowImmersive && !isOnboardingLoading && (',
    '{(shouldShowImmersive || forceShowOnboarding) && !isOnboardingLoading && ('
  );

  // 添加强制显示按钮
  pageContent = pageContent.replace(
    'onClick={() => {\n                  console.log(\'🔥 强制显示沉浸式引导\');\n                  showImmersiveOnboarding();\n                }}',
    `onClick={() => {
                  console.log('🔥 强制显示沉浸式引导');
                  setForceShowOnboarding(true);
                }}`
  );

  fs.writeFileSync(pagePath, pageContent);
  console.log('✅ 修复主页面显示逻辑');
}

// 2. 创建一个简单的演示页面
const demoPageContent = `"use client";

import { useState } from 'react';
import ImmersiveOnboardingDemo from '../components/feature/ImmersiveOnboardingDemo';

export default function OnboardingDemo() {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      {!showDemo ? (
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-8">沉浸式引导演示</h1>
          <p className="text-xl text-gray-600 mb-8">点击下面的按钮体验革命性的用户引导</p>
          <button
            onClick={() => setShowDemo(true)}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 text-xl"
          >
            🚀 体验沉浸式引导
          </button>
        </div>
      ) : (
        <ImmersiveOnboardingDemo
          onComplete={(preference) => {
            alert(\`太棒了！你选择了: \${preference}\`);
            setShowDemo(false);
          }}
          onSkip={() => {
            alert('下次再试试吧！');
            setShowDemo(false);
          }}
        />
      )}
    </div>
  );
}`;

const demoPagePath = path.join(__dirname, '../src/app/demo/page.tsx');
const demoDir = path.dirname(demoPagePath);
if (!fs.existsSync(demoDir)) {
  fs.mkdirSync(demoDir, { recursive: true });
}
fs.writeFileSync(demoPagePath, demoPageContent);
console.log('✅ 创建演示页面: /demo');

// 3. 修复CSS确保动画正常工作
const cssPath = path.join(__dirname, '../src/app/globals.css');
let cssContent = fs.readFileSync(cssPath, 'utf8');

if (!cssContent.includes('.animate-fade-in')) {
  cssContent += `
/* 确保动画正常工作 */
.animate-fade-in {
  animation: fadeIn 0.6s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`;
  fs.writeFileSync(cssPath, cssContent);
  console.log('✅ 修复CSS动画');
}

console.log('\n🎉 修复完成！');
console.log('\n📋 测试步骤:');
console.log('1. 运行: npm run dev');
console.log('2. 访问: http://localhost:3000/demo');
console.log('3. 点击"体验沉浸式引导"按钮');
console.log('4. 体验革命性的用户引导！');

console.log('\n💡 如果还是不显示，请检查:');
console.log('- 浏览器控制台是否有错误');
console.log('- localStorage是否有旧数据干扰');
console.log('- 组件是否正确导入');

console.log('\n🔥 这次一定要工作！');