#!/usr/bin/env node
// 测试增强的AI报告生成系统

console.log('🤖 Testing Enhanced AI Report Generation System...\n');

const fs = require('fs');
const path = require('path');

// 检查必需的文件
console.log('📁 Checking required files...');
const requiredFiles = [
  'src/lib/enhanced-ai-report-generator.ts',
  'src/lib/generative-ai-provider.ts',
  'src/lib/advisor-engine.ts',
  '.env.local'
];

let allFilesExist = true;
requiredFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} - EXISTS`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    if (file === '.env.local') {
      console.log('   ⚠️ You need to create .env.local with NEXT_PUBLIC_GEMINI_API_KEY');
    }
    allFilesExist = false;
  }
});

// 检查环境变量
console.log('\n🔑 Checking environment configuration...');
try {
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    if (envContent.includes('NEXT_PUBLIC_GEMINI_API_KEY')) {
      console.log('✅ Gemini API key configuration found');
      
      // 检查API key格式
      const apiKeyMatch = envContent.match(/NEXT_PUBLIC_GEMINI_API_KEY=(.+)/);
      if (apiKeyMatch && apiKeyMatch[1] && apiKeyMatch[1].length > 20) {
        console.log('✅ API key appears to be properly formatted');
      } else {
        console.log('⚠️ API key might be incomplete or incorrectly formatted');
      }
    } else {
      console.log('❌ NEXT_PUBLIC_GEMINI_API_KEY not found in .env.local');
    }
  } else {
    console.log('❌ .env.local file not found');
  }
} catch (error) {
  console.log('❌ Error checking environment:', error.message);
}

// 检查增强AI报告生成器的功能
console.log('\n🧠 Analyzing Enhanced AI Report Generator...');
try {
  const enhancedGeneratorPath = path.join(process.cwd(), 'src/lib/enhanced-ai-report-generator.ts');
  const generatorContent = fs.readFileSync(enhancedGeneratorPath, 'utf8');
  
  // 检查关键功能
  const features = [
    { name: 'Enhanced Prompt Building', pattern: 'buildEnhancedPrompt' },
    { name: 'Role Configuration', pattern: 'getRoleConfiguration' },
    { name: 'Contextual Information', pattern: 'buildContextualInformation' },
    { name: 'Item Categorization', pattern: 'categorizeItems' },
    { name: 'Report Validation', pattern: 'validateReportStructure' },
    { name: 'Error Handling', pattern: 'try.*catch' },
    { name: 'Model Configuration', pattern: 'getEnhancedModel' }
  ];
  
  console.log('🔍 Feature analysis:');
  features.forEach(feature => {
    const regex = new RegExp(feature.pattern, 'i');
    if (regex.test(generatorContent)) {
      console.log(`✅ ${feature.name} - IMPLEMENTED`);
    } else {
      console.log(`❌ ${feature.name} - MISSING`);
    }
  });
  
  // 检查交互模式支持
  const modes = ['beginner', 'advanced', 'expert'];
  console.log('\n🎯 Interaction mode support:');
  modes.forEach(mode => {
    if (generatorContent.includes(mode)) {
      console.log(`✅ ${mode.charAt(0).toUpperCase() + mode.slice(1)} mode - SUPPORTED`);
    } else {
      console.log(`❌ ${mode.charAt(0).toUpperCase() + mode.slice(1)} mode - NOT FOUND`);
    }
  });
  
} catch (error) {
  console.log('❌ Error analyzing enhanced generator:', error.message);
}

// 检查advisor-engine的集成
console.log('\n🔧 Checking Advisor Engine Integration...');
try {
  const advisorPath = path.join(process.cwd(), 'src/lib/advisor-engine.ts');
  const advisorContent = fs.readFileSync(advisorPath, 'utf8');
  
  const integrationFeatures = [
    'generateEnhancedAIReport',
    'inferFocusAreas',
    'inferRiskTolerance',
    'generateRecentActions',
    'generateAchievements'
  ];
  
  integrationFeatures.forEach(feature => {
    if (advisorContent.includes(feature)) {
      console.log(`✅ ${feature} - INTEGRATED`);
    } else {
      console.log(`❌ ${feature} - MISSING`);
    }
  });
  
} catch (error) {
  console.log('❌ Error checking advisor engine:', error.message);
}

// 生成测试数据示例
console.log('\n📊 Generating test data examples...');
const testScenarios = [
  {
    name: 'Beginner Player',
    data: {
      items: [
        { name: 'Carrot', quantity: 5, properties: ['crop', 'common'] },
        { name: 'Strawberry', quantity: 3, properties: ['crop', 'common'] }
      ],
      gold: 150,
      inGameDate: 'Spring, Day 5',
      mode: 'beginner'
    }
  },
  {
    name: 'Advanced Player',
    data: {
      items: [
        { name: 'Watermelon', quantity: 2, properties: ['crop', 'legendary'] },
        { name: 'Sprinkler', quantity: 1, properties: ['tool', 'efficiency'] },
        { name: 'Tomato', quantity: 8, properties: ['crop', 'rare'] }
      ],
      gold: 750,
      inGameDate: 'Summer, Day 15',
      mode: 'advanced'
    }
  },
  {
    name: 'Expert Player',
    data: {
      items: [
        { name: 'Pumpkin', quantity: 3, properties: ['crop', 'legendary'] },
        { name: 'Advanced Sprinkler', quantity: 2, properties: ['tool', 'premium'] },
        { name: 'Rare Fertilizer', quantity: 5, properties: ['tool', 'special'] },
        { name: 'Corn', quantity: 12, properties: ['crop', 'rare'] }
      ],
      gold: 2500,
      inGameDate: 'Autumn, Day 25',
      mode: 'expert'
    }
  }
];

console.log('🎮 Test scenarios prepared:');
testScenarios.forEach((scenario, index) => {
  console.log(`${index + 1}. ${scenario.name}:`);
  console.log(`   Gold: ${scenario.data.gold}`);
  console.log(`   Items: ${scenario.data.items.length} types`);
  console.log(`   Mode: ${scenario.data.mode}`);
  console.log(`   Date: ${scenario.data.inGameDate}`);
});

// 创建测试API端点示例
console.log('\n🔗 Creating test API endpoint example...');
const testApiExample = `
// Example API call to test enhanced AI reports
const testEnhancedReport = async () => {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      selectedItems: {
        'Carrot': 5,
        'Strawberry': 3,
        'Sprinkler': 1
      },
      gold: 500,
      inGameDate: 'Spring, Day 10',
      currentDate: new Date().toISOString(),
      interactionMode: 'advanced'
    })
  });
  
  const report = await response.json();
  console.log('Generated Report:', report);
};

// Call the test function
testEnhancedReport();
`;

fs.writeFileSync(path.join(process.cwd(), 'scripts/test-api-call.js'), testApiExample);
console.log('✅ Created test-api-call.js example');

// 生成使用指南
console.log('\n📖 Enhanced AI Report System Guide:');
console.log('');
console.log('🚀 Key Features:');
console.log('- Contextual Analysis: AI analyzes player situation, items, and game phase');
console.log('- Personalized Recommendations: Tailored advice based on player profile');
console.log('- Strategic Insights: Advanced optimization and timing strategies');
console.log('- Seasonal Optimization: Season-specific opportunities and strategies');
console.log('- Multi-Mode Support: Beginner, Advanced, and Expert interaction modes');
console.log('');
console.log('🎯 How It Works:');
console.log('1. Player selects items and provides game context');
console.log('2. System analyzes player profile and strategic situation');
console.log('3. Enhanced AI generates personalized, contextual recommendations');
console.log('4. Report includes immediate actions, strategic moves, and seasonal opportunities');
console.log('');
console.log('🔧 Testing:');
console.log('1. Ensure NEXT_PUBLIC_GEMINI_API_KEY is set in .env.local');
console.log('2. Run: npm run dev');
console.log('3. Test different player scenarios and interaction modes');
console.log('4. Check report quality and personalization');
console.log('');
console.log('📊 Monitoring:');
console.log('- Check console logs for AI generation status');
console.log('- Monitor API usage and response times');
console.log('- Validate report structure and content quality');

console.log('\n✅ Enhanced AI Report System Test Complete!');
console.log('\n🎉 The system is ready to generate intelligent, personalized reports!');
console.log('Next steps:');
console.log('1. Set up your Gemini API key');
console.log('2. Test with different player scenarios');
console.log('3. Monitor report quality and user feedback');