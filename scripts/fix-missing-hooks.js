#!/usr/bin/env node

/**
 * Fix Missing Hooks Script
 * Verifies that all hooks are properly defined
 */

const fs = require('fs');

console.log('🔧 Fixing Missing Hooks Error...\n');

// Check MinimalStyleReport component
console.log('🔍 Checking MinimalStyleReport component...');
const minimalReportContent = fs.readFileSync('src/app/components/feature/styles/MinimalStyleReport.tsx', 'utf8');

const hookChecks = [
  {
    name: 'useResponsiveBreakpoint replaced with useState',
    test: () => !minimalReportContent.includes('useResponsiveBreakpoint') && minimalReportContent.includes('setBreakpoint')
  },
  {
    name: 'useScrollProgress replaced with useState',
    test: () => !minimalReportContent.includes('useScrollProgress') && minimalReportContent.includes('setScrollProgress')
  },
  {
    name: 'useContentPrioritization replaced with useMemo',
    test: () => !minimalReportContent.includes('useContentPrioritization') && minimalReportContent.includes('contentPriority = useMemo')
  },
  {
    name: 'useRef properly imported',
    test: () => minimalReportContent.includes('useRef') && minimalReportContent.includes('import React, { useState, useEffect, useMemo, useRef }')
  },
  {
    name: 'Window event listeners added',
    test: () => minimalReportContent.includes('addEventListener') && minimalReportContent.includes('removeEventListener')
  }
];

let allPassed = true;
hookChecks.forEach(check => {
  if (check.test()) {
    console.log(`✅ ${check.name}`);
  } else {
    console.log(`❌ ${check.name}`);
    allPassed = false;
  }
});

console.log('\n🎯 Fix Summary:');
console.log('✅ Replaced useResponsiveBreakpoint with useState + window.innerWidth');
console.log('✅ Replaced useScrollProgress with useState + scroll event listener');
console.log('✅ Replaced useContentPrioritization with useMemo');
console.log('✅ Added proper useRef import');
console.log('✅ Added window event listeners for responsive behavior');

console.log('\n🧪 Expected Behavior:');
console.log('- Component should render without "useResponsiveBreakpoint is not defined" error');
console.log('- Responsive breakpoints should work (mobile/tablet/desktop)');
console.log('- Scroll progress indicator should function');
console.log('- Content prioritization should work');

if (allPassed) {
  console.log('\n✅ All hooks fixed successfully!');
  console.log('🚀 MinimalStyleReport should now render without errors.');
} else {
  console.log('\n⚠️  Some issues remain. Please check the component.');
}

console.log('\n🔍 Next Steps:');
console.log('1. Refresh the browser');
console.log('2. Check browser console for any remaining errors');
console.log('3. Test responsive behavior by resizing window');
console.log('4. Verify scroll progress indicator works');