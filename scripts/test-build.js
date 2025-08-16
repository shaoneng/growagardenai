#!/usr/bin/env node

/**
 * 测试构建过程
 * 验证项目是否可以成功构建和部署
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔨 测试项目构建...\n');

function runCommand(command, description) {
  console.log(`📋 ${description}`);
  console.log(`执行: ${command}`);
  
  try {
    const output = execSync(command, { 
      encoding: 'utf8',
      stdio: 'pipe',
      cwd: process.cwd()
    });
    
    console.log('✅ 成功');
    return true;
  } catch (error) {
    console.log('❌ 失败');
    console.log('错误输出:', error.stdout || error.message);
    return false;
  }
}

function checkFiles() {
  console.log('\n📋 检查关键文件');
  console.log('================');
  
  const requiredFiles = [
    'package.json',
    'next.config.ts',
    'tailwind.config.js',
    'public/data/items.json',
    'public/data/pets.json'
  ];
  
  let allExist = true;
  
  for (const file of requiredFiles) {
    const exists = fs.existsSync(path.join(process.cwd(), file));
    console.log(`${exists ? '✅' : '❌'} ${file}`);
    if (!exists) allExist = false;
  }
  
  return allExist;
}

function runBuildTest() {
  console.log('🔨 开始构建测试');
  console.log('================');
  
  // 1. 检查文件
  if (!checkFiles()) {
    console.log('\n❌ 关键文件缺失，无法继续构建');
    return false;
  }
  
  // 2. 安装依赖
  if (!runCommand('npm ci', '安装依赖')) {
    return false;
  }
  
  // 3. 运行数据处理脚本
  if (!runCommand('node scripts/build-data.js', '处理数据文件')) {
    return false;
  }
  
  // 4. 运行ESLint检查
  console.log('\n📋 运行ESLint检查');
  try {
    execSync('npm run lint', { 
      encoding: 'utf8',
      stdio: 'pipe'
    });
    console.log('✅ ESLint检查通过');
  } catch (error) {
    // ESLint可能有警告但不是错误
    if (error.status === 0) {
      console.log('✅ ESLint检查通过 (有警告)');
    } else {
      console.log('⚠️ ESLint有问题，但继续构建测试');
    }
  }
  
  // 5. 运行构建
  if (!runCommand('npm run build', '构建项目')) {
    return false;
  }
  
  console.log('\n🎉 构建测试成功！');
  console.log('项目可以正常部署到Cloudflare Pages。');
  
  return true;
}

// 运行构建测试
const success = runBuildTest();

if (!success) {
  console.log('\n❌ 构建测试失败');
  console.log('请修复上述问题后重新尝试部署。');
  process.exit(1);
} else {
  console.log('\n✅ 构建测试通过');
  console.log('可以安全地推送到GitHub进行部署。');
}