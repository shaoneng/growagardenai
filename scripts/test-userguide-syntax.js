#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Testing UserGuide.jsx syntax...');

try {
  // Read the UserGuide component
  const userGuidePath = path.join(__dirname, '../src/app/components/feature/UserGuide.jsx');
  const userGuideContent = fs.readFileSync(userGuidePath, 'utf8');
  
  console.log('✅ UserGuide.jsx file read successfully');
  console.log(`📄 File size: ${userGuideContent.length} characters`);
  
  // Basic syntax checks
  const openBraces = (userGuideContent.match(/{/g) || []).length;
  const closeBraces = (userGuideContent.match(/}/g) || []).length;
  const openParens = (userGuideContent.match(/\(/g) || []).length;
  const closeParens = (userGuideContent.match(/\)/g) || []).length;
  
  console.log(`🔧 Syntax check:`);
  console.log(`   Open braces: ${openBraces}, Close braces: ${closeBraces}`);
  console.log(`   Open parens: ${openParens}, Close parens: ${closeParens}`);
  
  if (openBraces === closeBraces && openParens === closeParens) {
    console.log('✅ Basic bracket/parentheses balance looks good');
  } else {
    console.log('❌ Bracket/parentheses mismatch detected');
  }
  
  // Check for common JSX issues
  if (userGuideContent.includes('</>') && userGuideContent.includes('<div>')) {
    console.log('✅ JSX fragment and div structure found');
  }
  
  if (userGuideContent.includes('export default UserGuide')) {
    console.log('✅ Default export found');
  }
  
  console.log('🎉 UserGuide.jsx syntax test completed!');
  
} catch (error) {
  console.error('❌ Error testing UserGuide syntax:', error.message);
  process.exit(1);
}