#!/usr/bin/env node

// 调试图片加载问题
console.log('🔍 Debugging Image Loading Issues...\n');

const fs = require('fs');
const path = require('path');

// 1. 检查具体的图片文件
console.log('1. Checking Specific Image Files:');
console.log('═══════════════════════════════════');

const testItems = ['carrot', 'strawberry', 'blueberry', 'rose', 'orange_tulip'];
const imagesDir = path.join(__dirname, '..', 'public', 'images', 'items');

testItems.forEach(itemName => {
  const imagePath = path.join(imagesDir, `${itemName}.png`);
  const exists = fs.existsSync(imagePath);
  const publicPath = `/images/items/${itemName}.png`;
  
  console.log(`   ${exists ? '✅' : '❌'} ${itemName}`);
  console.log(`      File: ${imagePath}`);
  console.log(`      URL:  ${publicPath}`);
  
  if (exists) {
    const stats = fs.statSync(imagePath);
    console.log(`      Size: ${Math.round(stats.size / 1024)}KB`);
  }
  console.log('');
});

// 2. 创建一个简单的HTML测试页面
console.log('2. Creating Test HTML Page:');
console.log('═══════════════════════════════════');

const testHtml = `<!DOCTYPE html>
<html>
<head>
    <title>Image Test</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .image-test { 
            display: inline-block; 
            margin: 10px; 
            border: 2px solid #ccc; 
            padding: 10px;
            text-align: center;
        }
        .image-test img { 
            width: 64px; 
            height: 64px; 
            object-fit: contain;
            background: #f0f0f0;
        }
        .error { border-color: red; }
        .success { border-color: green; }
    </style>
</head>
<body>
    <h1>Image Loading Test</h1>
    <p>Testing if images load correctly in browser:</p>
    
    ${testItems.map(itemName => `
    <div class="image-test" id="test-${itemName}">
        <img src="/images/items/${itemName}.png" 
             alt="${itemName}" 
             onload="document.getElementById('test-${itemName}').className='image-test success'"
             onerror="document.getElementById('test-${itemName}').className='image-test error'">
        <br>${itemName}
    </div>
    `).join('')}
    
    <script>
        console.log('Image test page loaded');
        setTimeout(() => {
            const tests = document.querySelectorAll('.image-test');
            let success = 0, error = 0;
            tests.forEach(test => {
                if (test.className.includes('success')) success++;
                if (test.className.includes('error')) error++;
            });
            console.log(\`Results: \${success} success, \${error} errors\`);
        }, 2000);
    </script>
</body>
</html>`;

const testHtmlPath = path.join(__dirname, '..', 'public', 'image-test.html');
fs.writeFileSync(testHtmlPath, testHtml);
console.log('   ✅ Created test HTML page: /image-test.html');
console.log('   💡 Visit http://localhost:3000/image-test.html to test images');

// 3. 检查开发服务器是否能访问图片
console.log('\n3. Image Access Test:');
console.log('═══════════════════════════════════');
console.log('   🌐 Test URLs (visit these in browser):');
testItems.forEach(itemName => {
  console.log(`      http://localhost:3000/images/items/${itemName}.png`);
});

// 4. 简化的组件建议
console.log('\n4. Simplified Component Approach:');
console.log('═══════════════════════════════════');
console.log('   💡 Try this simple component:');
console.log(`
   function SimpleItemImage({ item }) {
     return (
       <div style={{ width: '64px', height: '64px', background: '#f0f0f0' }}>
         <img 
           src={\`/images/items/\${item.name}.png\`}
           alt={item.display_name}
           style={{ width: '100%', height: '100%', objectFit: 'contain' }}
           onError={(e) => {
             e.target.style.display = 'none';
             e.target.parentNode.innerHTML = '🌱';
           }}
         />
       </div>
     );
   }
`);

console.log('\n5. Quick Fix Steps:');
console.log('═══════════════════════════════════');
console.log('   1. Start dev server: npm run dev');
console.log('   2. Visit: http://localhost:3000/image-test.html');
console.log('   3. Check browser console for errors');
console.log('   4. Try direct image URLs listed above');
console.log('   5. If images work in test page, the issue is in React components');

console.log('\n🔧 Most likely fixes:');
console.log('   • Replace Next.js Image with regular img tag');
console.log('   • Remove image optimization in development');
console.log('   • Check for CSS conflicts hiding images');
console.log('   • Verify image paths are correct');

console.log('\n🎯 Debug complete! Check the test page to isolate the issue.');