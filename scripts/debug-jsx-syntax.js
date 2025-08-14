#!/usr/bin/env node

/**
 * Debug JSX syntax issues
 */

const fs = require('fs');

console.log('🔍 Debugging JSX syntax issues...\n');

try {
  const content = fs.readFileSync('src/app/components/feature/UserGuide.jsx', 'utf8');
  
  // Count different types of tags
  const openTags = content.match(/<[^/!][^>]*[^/]>/g) || [];
  const closeTags = content.match(/<\/[^>]*>/g) || [];
  const selfClosingTags = content.match(/<[^>]*\/>/g) || [];
  
  console.log('Tag Analysis:');
  console.log(`Open tags: ${openTags.length}`);
  console.log(`Close tags: ${closeTags.length}`);
  console.log(`Self-closing tags: ${selfClosingTags.length}`);
  
  console.log('\nOpen tags found:');
  openTags.forEach((tag, i) => {
    console.log(`${i + 1}: ${tag}`);
  });
  
  console.log('\nClose tags found:');
  closeTags.forEach((tag, i) => {
    console.log(`${i + 1}: ${tag}`);
  });
  
  console.log('\nSelf-closing tags found:');
  selfClosingTags.forEach((tag, i) => {
    console.log(`${i + 1}: ${tag}`);
  });
  
  // Check for specific issues
  const lines = content.split('\n');
  console.log('\n🔍 Checking for specific issues:');
  
  lines.forEach((line, i) => {
    const lineNum = i + 1;
    
    // Check for unclosed JSX expressions
    if (line.includes('{') && !line.includes('}') && line.includes('<')) {
      console.log(`⚠️  Line ${lineNum}: Possible unclosed JSX expression: ${line.trim()}`);
    }
    
    // Check for malformed tags
    if (line.includes('<') && line.includes('>')) {
      const tagMatches = line.match(/<[^>]*>/g);
      if (tagMatches) {
        tagMatches.forEach(tag => {
          if (tag.includes('{{') || tag.includes('}}')) {
            console.log(`⚠️  Line ${lineNum}: Malformed tag with double braces: ${tag}`);
          }
        });
      }
    }
  });

} catch (error) {
  console.error('❌ Error reading file:', error.message);
}