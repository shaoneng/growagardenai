#!/usr/bin/env node
/**
 * Pre-Build Check
 * 构建前检查
 */

console.log('🔍 Pre-Build Check...');

const fs = require('fs');

// 检查关键文件是否存在
const criticalFiles = [
  './src/app/layout.tsx',
  './src/app/page.tsx',
  './src/app/report/page.tsx',
  './src/app/favorites/page.tsx',
  './src/context/AppContext.jsx',
  './src/contexts/FavoritesContext.tsx'
];

let allFilesExist = true;

criticalFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ Missing: ${file}`);
    allFilesExist = false;
  }
});

if (allFilesExist) {
  console.log('\n🎉 All critical files present - Build should succeed');
  process.exit(0);
} else {
  console.log('\n❌ Missing critical files - Build may fail');
  process.exit(1);
}
