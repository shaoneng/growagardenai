#!/usr/bin/env node
/**
 * Verify Edge Runtime Fix
 * 验证Edge Runtime修复
 */

console.log('🔍 Verifying Edge Runtime Configuration...\n');

const fs = require('fs');
const path = require('path');

const routes = [
  { path: 'src/app/crops/[name]/page.tsx', shouldHaveEdge: false, reason: 'Uses generateStaticParams' },
  { path: 'src/app/pets/[name]/page.tsx', shouldHaveEdge: false, reason: 'Uses generateStaticParams' },
  { path: 'src/app/reports/[id]/page.tsx', shouldHaveEdge: true, reason: 'Dynamic user content' }
];

let allCorrect = true;

routes.forEach(route => {
  const fullPath = path.resolve(__dirname, '..', route.path);
  
  try {
    const content = fs.readFileSync(fullPath, 'utf8');
    const hasEdgeRuntime = content.includes("export const runtime = 'edge'");
    const hasGenerateStaticParams = content.includes('generateStaticParams');
    
    console.log(`📄 ${route.path}:`);
    
    if (route.shouldHaveEdge) {
      if (hasEdgeRuntime && !hasGenerateStaticParams) {
        console.log(`   ✅ Correct: Edge Runtime enabled, no static params`);
      } else {
        console.log(`   ❌ Issue: Should have Edge Runtime only`);
        allCorrect = false;
      }
    } else {
      if (!hasEdgeRuntime && hasGenerateStaticParams) {
        console.log(`   ✅ Correct: Static generation enabled, no Edge Runtime`);
      } else if (hasEdgeRuntime && hasGenerateStaticParams) {
        console.log(`   ❌ Conflict: Both Edge Runtime and generateStaticParams`);
        allCorrect = false;
      } else {
        console.log(`   ⚠️ Check: Edge=${hasEdgeRuntime}, Static=${hasGenerateStaticParams}`);
      }
    }
    
    console.log(`   📝 Reason: ${route.reason}\n`);
    
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}\n`);
    allCorrect = false;
  }
});

if (allCorrect) {
  console.log('🎉 All routes configured correctly!');
  console.log('\n🚀 Ready for deployment:');
  console.log('   - Static routes: crops, pets (Node.js runtime)');
  console.log('   - Dynamic routes: reports (Edge runtime)');
  console.log('   - No conflicts detected');
} else {
  console.log('❌ Configuration issues detected');
  console.log('\n🔧 Manual fix may be required');
}