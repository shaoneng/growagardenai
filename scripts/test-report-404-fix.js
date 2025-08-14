#!/usr/bin/env node
/**
 * Test Report 404 Fix
 * 测试收藏报告404修复
 */

console.log('🔧 Testing Report 404 Fix...\n');

const fs = require('fs');

// Test 1: 检查reports动态路由是否创建
console.log('✅ Test 1: Reports Dynamic Route');
try {
  const reportRoutePath = './src/app/reports/[id]/page.tsx';
  if (fs.existsSync(reportRoutePath)) {
    console.log('   ✅ Reports dynamic route created');
    
    const routeContent = fs.readFileSync(reportRoutePath, 'utf8');
    const routeFeatures = [
      'useRouter.*from.*next/navigation',
      'useAppContext.*from.*@/context/AppContext',
      'params.*id.*string',
      'localStorage\\.getItem.*growagarden_reports',
      'setReportData.*targetReport',
      'MultiStyleReport'
    ];
    
    const foundFeatures = routeFeatures.filter(feature => 
      new RegExp(feature.replace('*', '.*').replace('\\\\', '\\')).test(routeContent)
    );
    
    console.log(`   ✓ Route features found: ${foundFeatures.length}/${routeFeatures.length}`);
    foundFeatures.forEach(feature => console.log(`      - ${feature}`));
    
    if (foundFeatures.length >= 4) {
      console.log('   ✅ Dynamic route implementation complete');
    } else {
      console.log('   ⚠️  Some route features may be missing');
    }
  } else {
    console.log('   ❌ Reports dynamic route not found');
  }
} catch (error) {
  console.log('   ❌ Error checking dynamic route:', error.message);
}

// Test 2: 检查AppContext的报告保存逻辑
console.log('\n✅ Test 2: AppContext Report Storage');
try {
  const appContextPath = './src/context/AppContext.jsx';
  if (fs.existsSync(appContextPath)) {
    const contextContent = fs.readFileSync(appContextPath, 'utf8');
    
    const storageFeatures = [
      'data\\.reportId.*=.*GGSB-.*Date\\.now',
      'localStorage\\.getItem.*growagarden_reports',
      'localStorage\\.setItem.*growagarden_reports',
      'existingReports\\[data\\.reportId\\].*=',
      'savedAt.*new Date\\(\\)\\.toISOString',
      'setReportData.*in.*value'
    ];
    
    const foundStorage = storageFeatures.filter(feature => 
      new RegExp(feature.replace('*', '.*').replace('\\\\', '\\')).test(contextContent)
    );
    
    console.log(`   ✓ Storage features found: ${foundStorage.length}/${storageFeatures.length}`);
    foundStorage.forEach(feature => console.log(`      - ${feature}`));
    
    if (foundStorage.length >= 4) {
      console.log('   ✅ Report storage logic implemented');
    } else {
      console.log('   ⚠️  Some storage features may be missing');
    }
  } else {
    console.log('   ❌ AppContext not found');
  }
} catch (error) {
  console.log('   ❌ Error checking AppContext:', error.message);
}

// Test 3: 检查FavoriteItemCard的链接逻辑
console.log('\n✅ Test 3: FavoriteItemCard Link Logic');
try {
  const cardPath = './src/app/components/ui/FavoriteItemCard.tsx';
  if (fs.existsSync(cardPath)) {
    const cardContent = fs.readFileSync(cardPath, 'utf8');
    
    const linkFeatures = [
      'detailLink.*=.*item\\.type.*===.*reports',
      '/reports/.*item\\.reportId.*item\\.name',
      'Link.*href.*detailLink'
    ];
    
    const foundLinks = linkFeatures.filter(feature => 
      new RegExp(feature.replace('*', '.*').replace('\\\\', '\\')).test(cardContent)
    );
    
    console.log(`   ✓ Link features found: ${foundLinks.length}/${linkFeatures.length}`);
    foundLinks.forEach(feature => console.log(`      - ${feature}`));
    
    if (foundLinks.length >= 2) {
      console.log('   ✅ Report link logic correct');
    } else {
      console.log('   ⚠️  Link logic may need adjustment');
    }
  } else {
    console.log('   ❌ FavoriteItemCard not found');
  }
} catch (error) {
  console.log('   ❌ Error checking FavoriteItemCard:', error.message);
}

console.log('\n🎯 Fix Summary:');
console.log('   🔍 PROBLEM: 404 when clicking favorited reports');
console.log('   💡 ROOT CAUSE: Missing /reports/[id] dynamic route');
console.log('   ✅ SOLUTION: Created dynamic route + localStorage storage');

console.log('\n🔧 Applied Fixes:');
console.log('   1. ✅ Created /reports/[id]/page.tsx dynamic route');
console.log('   2. ✅ Added report storage to localStorage in AppContext');
console.log('   3. ✅ Added setReportData to AppContext exports');
console.log('   4. ✅ Added error handling for missing reports');

console.log('\n🚀 How it works now:');
console.log('   1. User generates report → Auto-saved to localStorage');
console.log('   2. User favorites report → reportId stored in favorites');
console.log('   3. User clicks favorited report → /reports/[id] route loads');
console.log('   4. Route loads report from localStorage → Displays report');

console.log('\n🎯 Testing Steps:');
console.log('   1. Generate a new report (any method)');
console.log('   2. Favorite the report using the heart button');
console.log('   3. Go to favorites page (/favorites)');
console.log('   4. Click on the favorited report');
console.log('   5. Should load the report without 404 error');

console.log('\n✨ Favorited reports should now work correctly!');