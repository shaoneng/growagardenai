// 个性化服务端 Gemini AI 提供者
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { AnalysisResult } from '@/types';

const MODEL_NAME = "gemini-2.5-pro";

// 个性化配置系统
interface ModeConfiguration {
  role: string;
  personality: string;
  instructions: string;
  titleStyle: string;
  archetype: string;
}

function getModeConfiguration(interactionMode: string, expertOptions?: any): ModeConfiguration {
  const optimizationGoal = expertOptions?.optimizationGoal || 'balanced';
  const riskTolerance = expertOptions?.riskTolerance || 'moderate';
  
  switch (interactionMode) {
    case 'beginner':
      return {
        role: 'a friendly gardening mentor',
        personality: 'You speak in simple, encouraging terms and focus on safe, proven strategies.',
        instructions: `
BEGINNER MODE REQUIREMENTS:
- Use simple language and explain WHY each action helps
- Focus on low-risk, high-success strategies
- Provide step-by-step guidance
- Emphasize learning and building confidence
- Avoid complex optimization strategies
- Include encouraging, supportive tone`,
        titleStyle: 'Beginner-Friendly Garden Guide',
        archetype: 'Nurturing Mentor'
      };
      
    case 'expert':
      return {
        role: 'an advanced agricultural strategist',
        personality: 'You provide data-driven, sophisticated analysis with complex optimization strategies.',
        instructions: `
EXPERT MODE REQUIREMENTS:
- Use technical terminology and advanced concepts
- Focus on ${optimizationGoal} optimization with ${riskTolerance} risk tolerance
- Provide mathematical analysis and profit calculations
- Suggest complex multi-season strategies
- Include market timing and efficiency metrics
- Assume deep game knowledge`,
        titleStyle: 'Advanced Strategic Analysis',
        archetype: 'Strategic Optimizer'
      };
      
    default: // advanced
      return {
        role: 'an experienced garden advisor',
        personality: 'You balance practical advice with strategic thinking, suitable for intermediate players.',
        instructions: `
ADVANCED MODE REQUIREMENTS:
- Balance simplicity with strategic depth
- Focus on ${optimizationGoal} approach with ${riskTolerance} risk level
- Provide both immediate and long-term strategies
- Explain trade-offs and alternatives
- Include moderate complexity optimizations
- Assume good basic game knowledge`,
        titleStyle: 'Strategic Garden Analysis',
        archetype: 'Balanced Strategist'
      };
  }
}

function analyzePlayerChoices(items: Array<{ name: string; quantity: number; properties: string[] }>, gold: number, inGameDate: string): string {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const uniqueItems = items.length;
  const hasMultiHarvest = items.some(item => item.properties.includes('multi-harvest'));
  const hasHighValue = items.some(item => item.properties.includes('high-value'));
  
  const analysis = `Player Profile Analysis:
- Investment Scale: ${gold < 500 ? 'Conservative (Low Budget)' : gold < 2000 ? 'Moderate Investment' : 'High Investment Strategy'}
- Diversification: ${uniqueItems < 3 ? 'Focused Approach' : uniqueItems < 6 ? 'Balanced Portfolio' : 'Highly Diversified'}
- Strategy Type: ${hasMultiHarvest ? 'Long-term Efficiency Focus' : 'Quick Turnover Preference'}
- Risk Profile: ${hasHighValue ? 'Growth-Oriented' : 'Stability-Focused'}
- Season Context: ${inGameDate}
- Total Items: ${totalItems} units across ${uniqueItems} varieties`;

  return analysis;
}

// 服务端环境变量检查
function getGeminiApiKey(): string | null {
  const serverKey = process.env.GEMINI_API_KEY;
  const publicKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  
  console.log('🔑 Server API Key check:', {
    hasServerKey: !!serverKey,
    hasPublicKey: !!publicKey,
    serverKeyLength: serverKey?.length || 0,
    publicKeyLength: publicKey?.length || 0
  });
  
  return serverKey || publicKey || null;
}

export function isGoogleAIAvailable(): boolean {
  const apiKey = getGeminiApiKey();
  const available = !!apiKey && apiKey.length > 20;
  
  console.log('🤖 Google AI availability check:', {
    available,
    keyExists: !!apiKey,
    keyLength: apiKey?.length || 0
  });
  
  return available;
}

export async function generatePersonalizedAnalysis(
  items: Array<{ name: string; quantity: number; properties: string[] }>,
  gold: number,
  inGameDate: string,
  currentDate: string,
  interactionMode: string = 'balanced',
  expertOptions?: any
): Promise<AnalysisResult> {
  console.log('🚀 Personalized Gemini AI: Starting generation...');
  
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error('Gemini API key not available on server');
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: MODEL_NAME,
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.8, // 增加创造性
        topP: 0.9
      }
    });

    console.log(`🤖 Personalized Gemini AI: Using model ${MODEL_NAME} in ${interactionMode} mode`);
    console.log(`📊 Personalized Gemini AI: Processing ${items.length} items, ${gold} gold`);

    // 获取个性化配置
    const modeConfig = getModeConfiguration(interactionMode, expertOptions);
    
    // 分析玩家选择
    const playerAnalysis = analyzePlayerChoices(items, gold, inGameDate);
    
    // 构建详细的物品描述
    const itemsDescription = items.map(item =>
      `${item.name} (quantity: ${item.quantity}${item.properties.length > 0 ? `, properties: ${item.properties.join(', ')}` : ''})`
    ).join(', ');

    const prompt = `You are ${modeConfig.role} for a farming simulation game. ${modeConfig.personality}

CRITICAL INSTRUCTIONS: 
- Generate COMPLETELY UNIQUE advice based on the EXACT items the player selected
- ONLY reference the specific items listed below - DO NOT mention any other items
- NEVER suggest items that are not in their current selection
- Tailor every recommendation to their exact item choices, quantities, and budget
- Make the advice feel personal and specific to their actual selections
- If they selected Carrots, talk about Carrots - not Strawberries or other items

${playerAnalysis}

PLAYER'S ACTUAL SELECTIONS (REFERENCE ONLY THESE):
${itemsDescription}

Current Player Situation:
- Their Exact Selected Items: ${itemsDescription}
- Available Gold: ${gold}
- Game Date: ${inGameDate}
- Real Date: ${currentDate}
- Player Experience Level: ${interactionMode}
- Optimization Goal: ${expertOptions?.optimizationGoal || 'balanced'}
- Risk Tolerance: ${expertOptions?.riskTolerance || 'moderate'}

${modeConfig.instructions}

REMEMBER: Only give advice about the items they actually selected. Do not mention any items not in their selection list above.

Generate a JSON response with this structure:
{
  "reportId": "AI-${Date.now()}",
  "publicationDate": "${currentDate}",
  "mainTitle": "${modeConfig.titleStyle}",
  "subTitle": "PERSONALIZED FOR YOUR GARDEN STRATEGY",
  "visualAnchor": "🌱",
  "playerProfile": {
    "title": "Your Garden Profile",
    "archetype": "${modeConfig.archetype}",
    "summary": "Analyze this specific player's approach based on their EXACT item choices: ${itemsDescription}"
  },
  "midBreakerQuote": "Create an inspiring quote that relates to their SPECIFIC chosen items: ${itemsDescription}",
  "sections": [
    {
      "id": "immediate_actions",
      "title": "Priority Actions for Your ${items.map(i => i.name).join(' & ')} Selection 🎯",
      "points": [
        {
          "action": "Specific advice about ${itemsDescription} - mention these exact items by name",
          "reasoning": "Explain why this advice applies to their ${itemsDescription} and ${gold} gold budget",
          "tags": ["Immediate", "Specific"]
        }
      ]
    },
    {
      "id": "strategic_planning", 
      "title": "Strategic Planning for Your ${items.map(i => i.name).join(' & ')} Garden 🗺️",
      "points": [
        {
          "action": "Long-term strategy for ${itemsDescription} based on their ${expertOptions?.optimizationGoal || 'balanced'} goal",
          "reasoning": "Connect this to their specific ${itemsDescription} selection and ${interactionMode} experience level",
          "tags": ["Strategy", "Personalized"]
        }
      ]
    },
    {
      "id": "optimization_tips",
      "title": "Optimization Tips for Your ${items.map(i => i.name).join(' & ')} Setup ✨", 
      "points": [
        {
          "action": "Efficiency improvements specific to ${itemsDescription} and ${gold} gold budget",
          "reasoning": "Explain how this applies to their exact ${itemsDescription} situation",
          "tags": ["Efficiency", "Tailored"]
        }
      ]
    }
  ],
  "footerAnalysis": {
    "title": "Your ${items.map(i => i.name).join(' & ')} Garden Assessment",
    "conclusion": "Provide a conclusion that specifically addresses their ${itemsDescription} choices and potential",
    "callToAction": "Give next steps specific to their ${itemsDescription} selection and ${interactionMode} experience level"
  }
}

CRITICAL FINAL CHECK: 
- Every section MUST mention their exact selected items: ${itemsDescription}
- DO NOT mention any items they did not select
- If they chose Carrots, only talk about Carrots - not Strawberries or other crops
- Make every piece of advice specific to their actual selections and budget`;

    console.log('📝 Personalized Gemini AI: Sending personalized prompt...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('📥 Personalized Gemini AI: Received response');
    console.log(`📏 Personalized Gemini AI: Response length: ${text.length} characters`);

    try {
      const parsedResult = JSON.parse(text);
      
      // 验证响应结构
      if (!parsedResult.reportId || !parsedResult.mainTitle || !parsedResult.sections) {
        console.warn('⚠️ Personalized Gemini AI: Invalid response structure, using fallback');
        throw new Error('Invalid AI response structure');
      }

      console.log('✅ Personalized Gemini AI: Successfully generated personalized report');
      console.log(`📊 Personalized Gemini AI: Report "${parsedResult.mainTitle}" with ${parsedResult.sections?.length || 0} sections`);
      
      return parsedResult as AnalysisResult;

    } catch (parseError) {
      console.error('❌ Personalized Gemini AI: JSON parse error:', parseError);
      console.log('📄 Personalized Gemini AI: Raw response:', text.substring(0, 500) + '...');
      throw new Error(`Failed to parse AI response: ${parseError.message}`);
    }

  } catch (error) {
    console.error('❌ Personalized Gemini AI: Generation failed:', error);
    
    if (error.message?.includes('API key')) {
      throw new Error('Invalid or missing Gemini API key');
    } else if (error.message?.includes('quota')) {
      throw new Error('Gemini API quota exceeded');
    } else if (error.message?.includes('timeout')) {
      throw new Error('Gemini API request timeout');
    } else {
      throw new Error(`Gemini AI service error: ${error.message}`);
    }
  }
}

// 向后兼容的函数名
export const generateAnalysisWithGoogleAI = generatePersonalizedAnalysis;

// 测试连接函数
export async function testGeminiConnection(): Promise<boolean> {
  console.log('🧪 Personalized Gemini AI: Testing connection...');
  
  if (!isGoogleAIAvailable()) {
    console.log('❌ Personalized Gemini AI: API key not available');
    return false;
  }

  try {
    const testResult = await generatePersonalizedAnalysis(
      [{ name: 'Test Crop', quantity: 1, properties: [] }],
      100,
      'Spring, Day 1',
      new Date().toISOString(),
      'test'
    );

    const isValid = testResult && testResult.reportId && testResult.mainTitle;
    console.log(`${isValid ? '✅' : '❌'} Personalized Gemini AI: Connection test ${isValid ? 'passed' : 'failed'}`);
    return isValid;

  } catch (error) {
    console.error('❌ Personalized Gemini AI: Connection test failed:', error.message);
    return false;
  }
}

// 获取服务状态
export function getGeminiServiceStatus() {
  const apiKey = getGeminiApiKey();
  return {
    available: isGoogleAIAvailable(),
    configured: !!apiKey,
    keyLength: apiKey?.length || 0,
    model: MODEL_NAME,
    environment: process.env.NODE_ENV || 'unknown',
    personalized: true
  };
}