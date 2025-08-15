#!/usr/bin/env node

/**
 * Cloudflare Pages Edge Runtime 自动配置脚本
 * 自动为动态路由和 API 路由添加 Edge Runtime 配置
 */

const fs = require('fs');
const path = require('path');

// 需要配置 Edge Runtime 的动态路由
const DYNAMIC_ROUTES = [
  'src/app/crops/[crop]/page.tsx',
  'src/app/pets/[pet]/page.tsx',
  'src/app/reports/[id]/page.tsx',
];

// 需要配置 Edge Runtime 的 API 路由
const API_ROUTES = [
  'src/app/api/analyze/route.ts',
];

// 特殊页面（如 not-found）
const SPECIAL_PAGES = [
  'src/app/not-found.tsx',
];

/**
 * 为指定文件添加 Edge Runtime 配置
 * @param {string} filePath - 文件路径
 */
function addEdgeRuntimeConfig(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.warn(`⚠️  File not found: ${filePath}`);
    return false;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // 检查是否已经有 Edge Runtime 配置
  if (content.includes("export const runtime = 'edge'")) {
    console.log(`✅ ${filePath} already has Edge Runtime config`);
    return true;
  }
  
  // 查找合适的插入位置
  const lines = content.split('\n');
  let insertIndex = 0;
  
  // 找到最后一个 import 语句的位置
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith('import ') || lines[i].trim().startsWith('import{')) {
      insertIndex = i + 1;
    }
  }
  
  // 如果没有找到 import 语句，在文件开头插入
  if (insertIndex === 0) {
    // 查找第一个非注释、非空行
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line && !line.startsWith('//') && !line.startsWith('/*') && !line.startsWith('*')) {
        insertIndex = i;
        break;
      }
    }
  }
  
  // 插入 Edge Runtime 配置
  const edgeConfig = [
    '',
    '// Cloudflare Pages Edge Runtime 配置',
    "export const runtime = 'edge';",
    ''
  ];
  
  lines.splice(insertIndex, 0, ...edgeConfig);
  
  const newContent = lines.join('\n');
  fs.writeFileSync(fullPath, newContent);
  
  console.log(`✅ Added Edge Runtime config to ${filePath}`);
  return true;
}

/**
 * 验证文件是否有 Edge Runtime 配置
 * @param {string} filePath - 文件路径
 */
function validateEdgeRuntimeConfig(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    return { valid: false, reason: 'File not found' };
  }
  
  const content = fs.readFileSync(fullPath, 'utf8');
  
  if (!content.includes("export const runtime = 'edge'")) {
    return { valid: false, reason: 'Missing Edge Runtime config' };
  }
  
  return { valid: true };
}

/**
 * 主函数
 */
function main() {
  console.log('🚀 Configuring Edge Runtime for Cloudflare Pages...\n');
  
  const allRoutes = [...DYNAMIC_ROUTES, ...API_ROUTES, ...SPECIAL_PAGES];
  let successCount = 0;
  let errorCount = 0;
  
  // 配置所有路由
  allRoutes.forEach(route => {
    try {
      if (addEdgeRuntimeConfig(route)) {
        successCount++;
      } else {
        errorCount++;
      }
    } catch (error) {
      console.error(`❌ Error configuring ${route}:`, error.message);
      errorCount++;
    }
  });
  
  console.log('\n📊 Configuration Summary:');
  console.log(`✅ Successfully configured: ${successCount} files`);
  console.log(`❌ Errors: ${errorCount} files`);
  
  // 验证配置
  console.log('\n🔍 Validating Edge Runtime configuration...');
  
  const validationErrors = [];
  allRoutes.forEach(route => {
    const validation = validateEdgeRuntimeConfig(route);
    if (!validation.valid) {
      validationErrors.push(`${route}: ${validation.reason}`);
    }
  });
  
  if (validationErrors.length === 0) {
    console.log('✅ All routes are properly configured for Edge Runtime!');
  } else {
    console.log('❌ Validation errors found:');
    validationErrors.forEach(error => console.log(`  - ${error}`));
    process.exit(1);
  }
  
  console.log('\n🎉 Edge Runtime configuration completed successfully!');
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

module.exports = {
  addEdgeRuntimeConfig,
  validateEdgeRuntimeConfig,
  DYNAMIC_ROUTES,
  API_ROUTES,
  SPECIAL_PAGES
};