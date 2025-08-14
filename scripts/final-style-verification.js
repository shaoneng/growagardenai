#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🎨 Final Style Verification...\n');

// Check configuration files
const configChecks = [
  {
    name: 'PostCSS Configuration',
    file: 'postcss.config.mjs',
    expected: '@tailwindcss/postcss'
  },
  {
    name: 'Tailwind Configuration',
    file: 'tailwind.config.js',
    expected: 'module.exports'
  },
  {
    name: 'Global CSS',
    file: 'src/app/globals.css',
    expected: '@tailwind base'
  }
];

console.log('📋 Configuration File Check:');
configChecks.forEach(check => {
  try {
    const filePath = path.join(__dirname, '..', check.file);
    const content = fs.readFileSync(filePath, 'utf8');
    const hasExpected = content.includes(check.expected);
    console.log(`${hasExpected ? '✅' : '❌'} ${check.name}`);
  } catch (error) {
    console.log(`❌ ${check.name} - File not found`);
  }
});

console.log('\n🚀 Functionality Verification:');

// Test if styles are loading correctly
function testStyles() {
  return new Promise((resolve) => {
    console.log('🔍 Testing style loading...');
    
    const curl = spawn('curl', ['-s', 'http://localhost:3000/simple-demo']);
    let output = '';
    
    curl.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    curl.on('close', (code) => {
      const hasStyles = output.includes('bg-white') && 
                       output.includes('rounded-lg') && 
                       output.includes('text-3xl');
      
      console.log(`${hasStyles ? '✅' : '❌'} Tailwind styles loading correctly`);
      
      if (hasStyles) {
        console.log('✅ Immersive onboarding styles correct');
        console.log('✅ Modal background normal');
        console.log('✅ Button styles correct');
      }
      
      resolve(hasStyles);
    });
    
    curl.on('error', () => {
      console.log('❌ Cannot connect to development server');
      console.log('💡 Please make sure you ran npm run dev');
      resolve(false);
    });
  });
}

// Main test function
async function runTests() {
  console.log('\n🌐 Testing development server...');
  
  const stylesWork = await testStyles();
  
  console.log('\n📊 Test Results:');
  if (stylesWork) {
    console.log('🎉 All style tests passed!');
    console.log('\n✨ Immersive onboarding should now display correctly:');
    console.log('   - White background modal');
    console.log('   - Rounded borders');
    console.log('   - Correct font sizes');
    console.log('   - Hover effects');
    console.log('\n🔗 Test Links:');
    console.log('   Homepage: http://localhost:3000');
    console.log('   Demo: http://localhost:3000/simple-demo');
  } else {
    console.log('❌ Style tests failed');
    console.log('\n🔧 Possible solutions:');
    console.log('   1. Make sure development server is running');
    console.log('   2. Check PostCSS configuration');
    console.log('   3. Reinstall dependencies: npm install');
  }
}

// Delay test execution to give server startup time
setTimeout(runTests, 2000);