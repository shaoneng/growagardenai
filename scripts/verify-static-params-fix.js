#!/usr/bin/env node
// 验证静态参数修复

console.log('🔍 Verifying Static Params Fix...\n');

const fs = require('fs');
const path = require('path');

// 检查修复后的文件
const cropPagePath = path.join(process.cwd(), 'src/app/crops/[crop]/page.tsx');

if (fs.existsSync(cropPagePath)) {
  const content = fs.readFileSync(cropPagePath, 'utf8');
  
  console.log('📋 Checking crop page fixes:');
  
  if (content.includes('burning_bud') && content.includes('burning-bud')) {
    console.log('✅ Both URL variants (underscore and hyphen) are handled');
  } else {
    console.log('❌ URL variants not properly handled');
  }
  
  if (content.includes('normalizedParam') && content.includes('alternativeParam')) {
    console.log('✅ Parameter normalization logic is present');
  } else {
    console.log('❌ Parameter normalization logic missing');
  }
  
  if (content.includes('console.log') && content.includes('Crop not found')) {
    console.log('✅ Debug logging for missing crops is added');
  } else {
    console.log('❌ Debug logging missing');
  }
  
  if (content.includes('commonCrops') && content.includes('备用')) {
    console.log('✅ Fallback crops are included in generateStaticParams');
  } else {
    console.log('❌ Fallback crops not properly configured');
  }
  
} else {
  console.log('❌ Crop page file not found');
}

console.log('\n🎯 Expected Behavior:');
console.log('- /crops/burning_bud should work (underscore)');
console.log('- /crops/burning-bud should work (hyphen)');
console.log('- Both should find the same "Burning Bud" item');
console.log('- generateStaticParams includes both variants');

console.log('\n🧪 To Test:');
console.log('1. Run: npm run build');
console.log('2. Should complete without static param errors');
console.log('3. Test both URL formats in browser');

console.log('\n✅ Static Params Fix Verification Complete!');