#!/usr/bin/env node

/**
 * Check UserGuide.jsx syntax
 */

const fs = require('fs');

console.log('🔍 Checking UserGuide.jsx syntax...\n');

try {
  const content = fs.readFileSync('src/app/components/feature/UserGuide.jsx', 'utf8');
  
  // Basic syntax checks
  const checks = [
    {
      name: 'Balanced JSX tags',
      test: () => {
        const openTags = (content.match(/<[^/][^>]*>/g) || []).length;
        const closeTags = (content.match(/<\/[^>]*>/g) || []).length;
        const selfClosing = (content.match(/<[^>]*\/>/g) || []).length;
        return openTags === closeTags + selfClosing;
      }
    },
    {
      name: 'Proper JSX structure',
      test: () => !content.includes('}{') && !content.includes('{{')
    },
    {
      name: 'No unclosed braces',
      test: () => {
        const openBraces = (content.match(/{/g) || []).length;
        const closeBraces = (content.match(/}/g) || []).length;
        return openBraces === closeBraces;
      }
    },
    {
      name: 'Style jsx syntax',
      test: () => content.includes('<style jsx>{`') && content.includes('`}</style>')
    },
    {
      name: 'Component export',
      test: () => content.includes('export default UserGuide')
    }
  ];

  let allPassed = true;
  checks.forEach(check => {
    if (check.test()) {
      console.log(`✅ ${check.name}`);
    } else {
      console.log(`❌ ${check.name}`);
      allPassed = false;
    }
  });

  if (allPassed) {
    console.log('\n🎉 UserGuide.jsx syntax looks good!');
  } else {
    console.log('\n⚠️  Some syntax issues detected.');
  }

} catch (error) {
  console.error('❌ Error reading file:', error.message);
}