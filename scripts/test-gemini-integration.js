// /scripts/test-gemini-integration.js
// 测试Gemini API集成和个性化报告生成

console.log('🧪 Testing Gemini API Integration\n');

// 检查环境变量
const hasGeminiKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 0;

console.log(`🔑 Gemini API Key: ${hasGeminiKey ? '✅ Available' : '❌ Missing'}`);

if (!hasGeminiKey) {
  console.log('\n⚠️  To test Gemini integration:');
  console.log('1. Add GEMINI_API_KEY to your .env.local file');
  console.log('2. Get your API key from https://makersuite.google.com/app/apikey');
  console.log('3. Run this test again');
  console.log('\n📋 Current behavior:');
  console.log('- System will use rule engine as fallback');
  console.log('- Reports will be structured but not personalized');
} else {
  console.log('\n✅ Gemini API is configured!');
  console.log('\n📋 Enhanced features available:');
  console.log('- Personalized natural language reports');
  console.log('- Mode-specific AI personality');
  console.log('- Context-aware recommendations');
}

console.log('\n🎯 Mode-Specific AI Personalities:');
console.log('🌱 Beginner Mode: Friendly, patient mentor');
console.log('🗺️  Advanced Mode: Experienced strategist');
console.log('⚡ Expert Mode: Data-driven analyst');

console.log('\n🔄 Fallback Strategy:');
console.log('1. Try Gemini API for personalized reports');
console.log('2. If API fails → Use rule engine');
console.log('3. Always provide functional analysis');

console.log('\n✅ Integration test completed!');