#!/usr/bin/env node
// 测试静态参数生成

console.log('🔧 Testing Static Params Generation...\n');

const fs = require('fs');
const path = require('path');

// 检查宠物数据
console.log('📊 Checking pets data for static generation...');
try {
  const petsData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public/data/pets.json'), 'utf8'));
  console.log(`✅ Found ${petsData.length} pets in database`);
  
  // 模拟 generateStaticParams 函数
  const params = [];
  for (const pet of petsData) {
    if (pet?.name) {
      params.push({ pet: pet.name });
    }
  }
  
  console.log(`✅ Generated ${params.length} static params`);
  
  // 显示前10个参数
  console.log('\n📋 Sample static params:');
  params.slice(0, 10).forEach((param, index) => {
    console.log(`  ${index + 1}. /pets/${param.pet}`);
  });
  
  if (params.length > 10) {
    console.log(`  ... and ${params.length - 10} more`);
  }
  
  // 检查是否有重复的参数
  const uniqueParams = new Set(params.map(p => p.pet));
  if (uniqueParams.size !== params.length) {
    console.log(`⚠️ Found ${params.length - uniqueParams.size} duplicate params`);
  } else {
    console.log('✅ All params are unique');
  }
  
  // 检查参数格式
  const invalidParams = params.filter(p => !p.pet || typeof p.pet !== 'string' || p.pet.includes(' '));
  if (invalidParams.length > 0) {
    console.log(`❌ Found ${invalidParams.length} invalid params:`, invalidParams.slice(0, 3));
  } else {
    console.log('✅ All params have valid format');
  }
  
} catch (error) {
  console.log('❌ Error reading pets data:', error.message);
}

// 检查动态路由文件
console.log('\n📁 Checking dynamic route files...');
const dynamicRoutePath = path.join(process.cwd(), 'src/app/pets/[pet]/page.tsx');
if (fs.existsSync(dynamicRoutePath)) {
  console.log('✅ Dynamic route file exists: /pets/[pet]/page.tsx');
  
  // 检查文件内容
  const content = fs.readFileSync(dynamicRoutePath, 'utf8');
  if (content.includes('generateStaticParams')) {
    console.log('✅ generateStaticParams function found');
  } else {
    console.log('❌ generateStaticParams function missing');
  }
  
  if (content.includes('petsData')) {
    console.log('✅ Uses pets.json data');
  } else {
    console.log('⚠️ May not be using pets.json data');
  }
} else {
  console.log('❌ Dynamic route file missing');
}

// 检查Next.js配置
console.log('\n⚙️ Checking Next.js configuration...');
const nextConfigPath = path.join(process.cwd(), 'next.config.js');
if (fs.existsSync(nextConfigPath)) {
  const configContent = fs.readFileSync(nextConfigPath, 'utf8');
  if (configContent.includes('output: "export"') || configContent.includes("output: 'export'")) {
    console.log('✅ Static export configuration found');
    console.log('ℹ️ This requires generateStaticParams for dynamic routes');
  } else {
    console.log('ℹ️ No static export configuration found');
  }
} else {
  console.log('⚠️ next.config.js not found');
}

console.log('\n🎯 Recommendations:');
console.log('1. Ensure all dynamic routes have generateStaticParams');
console.log('2. Use consistent parameter naming (pet names without spaces)');
console.log('3. Test the build process: npm run build');
console.log('4. Verify all pet pages are accessible');

console.log('\n🚀 Test URLs to verify:');
const testPets = ['cat', 'dog', 'bunny', 'bee', 'axolotl'];
testPets.forEach(pet => {
  console.log(`  http://localhost:3000/pets/${pet}`);
});

console.log('\n✅ Static Params Test Complete!');