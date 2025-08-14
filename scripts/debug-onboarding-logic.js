#!/usr/bin/env node

console.log('🔍 调试沉浸式引导逻辑...\n');

// 模拟浏览器环境
global.localStorage = {
  data: {},
  getItem(key) {
    return this.data[key] || null;
  },
  setItem(key, value) {
    this.data[key] = value;
  },
  removeItem(key) {
    delete this.data[key];
  }
};

// 导入管理器
const path = require('path');
const fs = require('fs');

// 读取管理器代码并执行
const managerPath = path.join(__dirname, '../src/lib/immersive-onboarding-manager.js');
let managerCode = fs.readFileSync(managerPath, 'utf8');

// 移除 export 语句，改为直接创建实例
managerCode = managerCode.replace('export default immersiveOnboardingManager;', '');

// 执行代码
eval(managerCode);

// 创建实例
const manager = new ImmersiveOnboardingManager();

console.log('📊 当前状态检查:');
console.log(`   新用户检查: ${manager.isNewUser()}`);
console.log(`   访问次数: ${manager.getVisitCount()}`);
console.log(`   已完成: ${manager.isCompleted()}`);
console.log(`   已跳过: ${manager.isSkipped()}`);
console.log(`   应该显示: ${manager.shouldShowOnboarding()}`);

console.log('\n🧪 测试场景:');

// 场景1: 全新用户
console.log('\n1. 全新用户场景:');
manager.reset();
console.log(`   重置后 - 新用户: ${manager.isNewUser()}`);
console.log(`   重置后 - 应该显示: ${manager.shouldShowOnboarding()}`);

// 场景2: 记录一次访问
console.log('\n2. 记录访问后:');
manager.recordVisit();
console.log(`   访问次数: ${manager.getVisitCount()}`);
console.log(`   新用户: ${manager.isNewUser()}`);
console.log(`   应该显示: ${manager.shouldShowOnboarding()}`);

// 场景3: 完成引导
console.log('\n3. 完成引导后:');
manager.markCompleted('profit');
console.log(`   已完成: ${manager.isCompleted()}`);
console.log(`   用户偏好: ${manager.getUserPreference()}`);
console.log(`   应该显示: ${manager.shouldShowOnboarding()}`);

console.log('\n🔧 修复建议:');
console.log('1. 确保新用户总是显示沉浸式引导');
console.log('2. 添加强制显示选项用于测试');
console.log('3. 简化判断逻辑，减少边界情况');

console.log('\n💡 问题分析:');
if (!manager.shouldShowOnboarding()) {
  console.log('❌ 引导没有显示的可能原因:');
  console.log('   - localStorage中可能已有旧数据');
  console.log('   - isNewUser()判断逻辑有问题');
  console.log('   - 浏览器缓存了完成状态');
} else {
  console.log('✅ 引导逻辑正常，问题可能在React组件层面');
}