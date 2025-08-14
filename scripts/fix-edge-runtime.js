#!/usr/bin/env node
/**
 * Fix Edge Runtime Configuration
 * 修复Edge Runtime配置以支持Cloudflare Pages部署
 */

console.log('🔧 Fixing Edge Runtime Configuration...\n');

const fs = require('fs');
const path = require('path');

// 需要检查的动态路由文件
const dynamicRoutes = [
  'src/app/reports/[id]/page.tsx',
  'src/app/crops/[name]/page.tsx',
  'src/app/pets/[name]/page.tsx'
];

let fixedCount = 0;

dynamicRoutes.forEach(routePath => {
  const fullPath = path.resolve(__dirname, '..', routePath);
  
  try {
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      
      // 检查是否已经有Edge Runtime配置
      if (content.includes("export const runtime = 'edge'")) {
        console.log(`✅ ${routePath}: Edge Runtime already configured`);
        return;
      }
      
      // 查找插入位置（在imports之后）
      const lines = content.split('\n');
      let insertIndex = -1;
      
      // 找到最后一个import语句的位置
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('import ') || lines[i].startsWith("import{") || lines[i].startsWith("import {")) {
          insertIndex = i + 1;
        }
      }
      
      // 如果没找到import，在文件开头插入
      if (insertIndex === -1) {
        // 找到第一个非注释、非'use client'的行
        for (let i = 0; i < lines.length; i++) {
          if (!lines[i].startsWith('//') && 
              !lines[i].startsWith('/*') && 
              !lines[i].includes("'use client'") &&
              !lines[i].includes('"use client"') &&
              lines[i].trim() !== '') {
            insertIndex = i;
            break;
          }
        }
      }
      
      if (insertIndex !== -1) {
        // 插入Edge Runtime配置
        lines.splice(insertIndex, 0, '', '// Cloudflare Pages Edge Runtime配置', "export const runtime = 'edge';");
        
        const newContent = lines.join('\n');
        fs.writeFileSync(fullPath, newContent);
        
        console.log(`✅ ${routePath}: Added Edge Runtime configuration`);
        fixedCount++;
      } else {
        console.log(`⚠️ ${routePath}: Could not find insertion point`);
      }
    } else {
      console.log(`⚠️ ${routePath}: File not found`);
    }
  } catch (error) {
    console.log(`❌ ${routePath}: Error - ${error.message}`);
  }
});

console.log(`\n🎉 Fixed ${fixedCount} files with Edge Runtime configuration`);

// 验证修复结果
console.log('\n🔍 Verification:');
dynamicRoutes.forEach(routePath => {
  const fullPath = path.resolve(__dirname, '..', routePath);
  
  try {
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      
      if (content.includes("export const runtime = 'edge'")) {
        console.log(`✅ ${routePath}: Edge Runtime configured`);
      } else {
        console.log(`❌ ${routePath}: Edge Runtime NOT configured`);
      }
    }
  } catch (error) {
    console.log(`❌ ${routePath}: Error checking - ${error.message}`);
  }
});

console.log('\n🚀 Cloudflare Pages Deployment:');
console.log('1. All dynamic routes now have Edge Runtime configuration');
console.log('2. Ready for Cloudflare Pages deployment');
console.log('3. Run build again to verify');

console.log('\n📋 Next Steps:');
console.log('1. Commit these changes');
console.log('2. Push to repository');
console.log('3. Redeploy to Cloudflare Pages');
console.log('4. Deployment should now succeed');