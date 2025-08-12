#!/usr/bin/env node

// 最终图片修复验证
console.log('🎯 Final Image Fix Verification\n');
console.log('═══════════════════════════════════════════════════════════\n');

const fs = require('fs');
const path = require('path');

// 检查所有相关文件的修复状态
const filesToCheck = [
  {
    path: 'src/app/components/ui/EncyclopediaItemCard.jsx',
    name: 'EncyclopediaItemCard',
    shouldContain: ['<img', 'onError', 'console.log', '/images/items/'],
    shouldNotContain: ['Next.js Image', 'import Image']
  },
  {
    path: 'src/app/components/ui/ItemCard.jsx', 
    name: 'ItemCard',
    shouldContain: ['<img', 'onError', '/images/items/'],
    shouldNotContain: ['import Image from']
  },
  {
    path: 'src/app/components/ui/ItemImage.jsx',
    name: 'ItemImage (simplified)',
    shouldContain: ['<img', 'onError', 'objectFit'],
    shouldNotContain: ['import Image', 'useState', 'complex logic']
  }
];

console.log('1. File Modification Check:');
console.log('═══════════════════════════════════');

let allGood = true;

filesToCheck.forEach(file => {
  const fullPath = path.join(__dirname, '..', file.path);
  
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf8');
    
    console.log(`\n   📄 ${file.name}:`);
    
    // 检查应该包含的内容
    const hasRequired = file.shouldContain.every(required => {
      const has = content.includes(required);
      console.log(`      ${has ? '✅' : '❌'} Contains: ${required}`);
      return has;
    });
    
    // 检查不应该包含的内容
    const lacksUnwanted = file.shouldNotContain.every(unwanted => {
      const lacks = !content.includes(unwanted);
      console.log(`      ${lacks ? '✅' : '❌'} Removed: ${unwanted}`);
      return lacks;
    });
    
    if (!hasRequired || !lacksUnwanted) {
      allGood = false;
    }
    
  } else {
    console.log(`   ❌ ${file.name}: File not found`);
    allGood = false;
  }
});

// 检查图片文件
console.log('\n2. Image Files Verification:');
console.log('═══════════════════════════════════');

const imagesDir = path.join(__dirname, '..', 'public', 'images', 'items');
if (fs.existsSync(imagesDir)) {
  const imageFiles = fs.readdirSync(imagesDir).filter(f => f.endsWith('.png'));
  console.log(`   ✅ Found ${imageFiles.length} PNG images`);
  
  // 检查一些关键图片
  const keyImages = ['carrot.png', 'strawberry.png', 'blueberry.png', 'rose.png'];
  keyImages.forEach(img => {
    const exists = imageFiles.includes(img);
    console.log(`   ${exists ? '✅' : '❌'} ${img}`);
  });
} else {
  console.log('   ❌ Images directory not found');
  allGood = false;
}

// 创建测试页面
console.log('\n3. Creating Debug Test Page:');
console.log('═══════════════════════════════════');

const debugHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Image Debug Test</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            padding: 20px; 
            background: #f5f5f5; 
        }
        .test-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); 
            gap: 15px; 
            margin: 20px 0; 
        }
        .test-card { 
            background: white; 
            border: 2px solid #ddd; 
            border-radius: 8px; 
            padding: 10px; 
            text-align: center;
            transition: border-color 0.3s;
        }
        .test-card.success { border-color: #22c55e; }
        .test-card.error { border-color: #ef4444; }
        .test-card img { 
            width: 64px; 
            height: 64px; 
            object-fit: contain; 
            background: #f3f4f6;
            border-radius: 4px;
        }
        .test-card .name { 
            margin-top: 8px; 
            font-size: 12px; 
            font-weight: bold; 
        }
        .stats { 
            background: white; 
            padding: 15px; 
            border-radius: 8px; 
            margin: 20px 0; 
        }
    </style>
</head>
<body>
    <h1>🖼️ Image Loading Debug Test</h1>
    <p>This page tests if images load correctly outside of React components.</p>
    
    <div class="stats" id="stats">
        <strong>Loading...</strong>
    </div>
    
    <div class="test-grid" id="testGrid">
        <!-- Images will be loaded here -->
    </div>
    
    <script>
        const testItems = [
            'carrot', 'strawberry', 'blueberry', 'rose', 'orange_tulip',
            'dezen', 'artichoke', 'onion', 'tomato', 'daffodil'
        ];
        
        let loaded = 0;
        let failed = 0;
        
        function updateStats() {
            document.getElementById('stats').innerHTML = 
                \`<strong>Results:</strong> \${loaded} loaded, \${failed} failed, \${testItems.length - loaded - failed} pending\`;
        }
        
        function createTestCard(itemName) {
            const card = document.createElement('div');
            card.className = 'test-card';
            card.id = \`test-\${itemName}\`;
            
            const img = document.createElement('img');
            img.src = \`/images/items/\${itemName}.png\`;
            img.alt = itemName;
            
            img.onload = () => {
                card.className = 'test-card success';
                loaded++;
                updateStats();
                console.log(\`✅ Loaded: \${itemName}\`);
            };
            
            img.onerror = () => {
                card.className = 'test-card error';
                img.style.display = 'none';
                card.innerHTML += '<div style="width:64px;height:64px;display:flex;align-items:center;justify-content:center;background:#fee2e2;border-radius:4px;font-size:24px;">❌</div>';
                failed++;
                updateStats();
                console.log(\`❌ Failed: \${itemName}\`);
            };
            
            const name = document.createElement('div');
            name.className = 'name';
            name.textContent = itemName;
            
            card.appendChild(img);
            card.appendChild(name);
            
            return card;
        }
        
        // Load test images
        const grid = document.getElementById('testGrid');
        testItems.forEach(itemName => {
            grid.appendChild(createTestCard(itemName));
        });
        
        updateStats();
        
        // Final check after 5 seconds
        setTimeout(() => {
            console.log(\`Final results: \${loaded}/\${testItems.length} images loaded successfully\`);
            if (loaded === testItems.length) {
                document.body.style.background = '#dcfce7';
                alert('🎉 All images loaded successfully! The issue is likely in React components.');
            } else if (loaded === 0) {
                document.body.style.background = '#fef2f2';
                alert('❌ No images loaded. Check if dev server is running and serving static files.');
            } else {
                document.body.style.background = '#fef3c7';
                alert(\`⚠️ \${loaded}/\${testItems.length} images loaded. Some images may be missing or corrupted.\`);
            }
        }, 5000);
    </script>
</body>
</html>`;

const debugPath = path.join(__dirname, '..', 'public', 'debug-images.html');
fs.writeFileSync(debugPath, debugHtml);
console.log('   ✅ Created debug test page: /debug-images.html');

// 最终状态报告
console.log('\n4. Final Status Report:');
console.log('═══════════════════════════════════');

if (allGood) {
  console.log('   🎉 All fixes applied successfully!');
  console.log('   ✅ Components updated to use simple img tags');
  console.log('   ✅ Next.js Image components removed');
  console.log('   ✅ Error handling and fallbacks added');
  console.log('   ✅ Console logging for debugging');
  console.log('   ✅ Image files verified');
} else {
  console.log('   ⚠️  Some issues detected in the fixes');
  console.log('   💡 Review the items marked with ❌ above');
}

console.log('\n5. Testing Instructions:');
console.log('═══════════════════════════════════');
console.log('   1. Start dev server: npm run dev');
console.log('   2. Test static images: http://localhost:3000/debug-images.html');
console.log('   3. Test React components: http://localhost:3000/crops');
console.log('   4. Open browser console to see debug logs');
console.log('   5. If static test works but React doesn\'t, the issue is in components');

console.log('\n6. Expected Results:');
console.log('═══════════════════════════════════');
console.log('   ✅ Debug page: All images should load');
console.log('   ✅ Encyclopedia: Images or emoji fallbacks');
console.log('   ✅ Console: "Image loaded" or "Image failed" messages');
console.log('   ❌ No more black squares!');

console.log('\n═══════════════════════════════════════════════════════════');
console.log('🔧 Image loading fixes complete - ready for testing!');