// /scripts/test-interaction-modes.js
// 测试三种交互模式的脚本

const { generateStrategicAdvice, InteractionMode } = require('../src/lib/advisor-engine.ts');

async function testInteractionModes() {
  console.log('🧪 Testing Three Interaction Modes\n');

  const mockItems = [
    { name: 'Carrot', quantity: 2, properties: [] },
    { name: 'Tomato', quantity: 1, properties: ['multi-harvest'] }
  ];

  // Test Beginner Mode
  console.log('🌱 BEGINNER MODE:');
  try {
    const beginnerResult = await generateStrategicAdvice(
      mockItems,
      150,
      'Spring, Day 1',
      '2025-01-01',
      'beginner'
    );
    console.log(`Title: ${beginnerResult.mainTitle}`);
    console.log(`Sections: ${beginnerResult.sections.length}`);
    console.log(`First section: ${beginnerResult.sections[0]?.title}\n`);
  } catch (error) {
    console.log(`Error: ${error.message}\n`);
  }

  // Test Advanced Mode
  console.log('🗺️ ADVANCED MODE:');
  try {
    const advancedResult = await generateStrategicAdvice(
      mockItems,
      500,
      'Summer, Day 5',
      '2025-01-01',
      'advanced'
    );
    console.log(`Title: ${advancedResult.mainTitle}`);
    console.log(`Sections: ${advancedResult.sections.length}`);
    console.log(`First section: ${advancedResult.sections[0]?.title}\n`);
  } catch (error) {
    console.log(`Error: ${error.message}\n`);
  }

  // Test Expert Mode
  console.log('⚡ EXPERT MODE:');
  try {
    const expertResult = await generateStrategicAdvice(
      mockItems,
      1000,
      'Autumn, Day 10',
      '2025-01-01',
      'expert',
      {
        optimizationGoal: 'profit',
        riskTolerance: 'aggressive',
        timeHorizon: 'long'
      }
    );
    console.log(`Title: ${expertResult.mainTitle}`);
    console.log(`Sections: ${expertResult.sections.length}`);
    console.log(`First section: ${expertResult.sections[0]?.title}\n`);
  } catch (error) {
    console.log(`Error: ${error.message}\n`);
  }

  console.log('✅ Testing completed!');
}

testInteractionModes();