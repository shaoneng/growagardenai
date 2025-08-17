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

    const prompt = `你是${modeConfig.role}，服务于一款农场模拟游戏。${modeConfig.personality}

语言与风格：
- 全程使用流畅优雅的简体中文；
- 文风华丽但不夸饰，富有画面感；
- 先给行动，再解释理由，必要时点名“协同”道具；
- 所有建议必须与玩家的“实际道具与金币”强相关，可落地、可执行。

关键指令：
- 仅基于玩家‘实际选择’的道具生成独特建议；
- 只引用下列清单中的道具名称，禁止提及清单外道具；
- 每一条建议需结合具体道具名称、数量与金币预算展开；
- 若玩家选择了胡萝卜，就谈胡萝卜；不要谈草莓或其他未选道具。

玩家画像分析：
${playerAnalysis}

玩家的实际选择（仅能引用这些）：
${itemsDescription}

当前状态：
- 已选道具：${itemsDescription}
- 可用金币：${gold}
- 游戏日期：${inGameDate}
- 当前日期：${currentDate}
- 经验水平：${interactionMode}
- 优化目标：${expertOptions?.optimizationGoal || 'balanced'}
- 风险偏好：${expertOptions?.riskTolerance || 'moderate'}

模式补充要求：
${modeConfig.instructions}

请按如下JSON结构，用中文生成高度个性化的报告（仅内容为中文，字段名保持不变）：
{
  "reportId": "AI-${Date.now()}",
  "publicationDate": "${currentDate}",
  "mainTitle": "中文主标题（不超过18字，具象且个性化）",
  "subTitle": "中文副标题（不超过24字，贴合阶段与重心）",
  "visualAnchor": "单个Emoji",
  "playerProfile": {
    "title": "中文画像标题",
    "archetype": "中文画像名",
    "summary": "2-3句中文概述，基于‘实际道具选择’刻画策略取向与潜力"
  },
  "midBreakerQuote": "一句中文引言，诗意且切题，避免套话",
  "sections": [
    {
      "id": "immediate_actions",
      "title": "围绕${items.map(i => i.name).join('、')}的优先动作 🎯",
      "points": [
        {
          "action": "关于${itemsDescription}的具体动作（中文，明确数量与顺序）",
          "reasoning": "为何此举与${itemsDescription}及${gold}金币最契合（收益/风险/时机）",
          "tags": ["优先", "阶段性", "收益"]
        }
      ]
    },
    {
      "id": "strategic_planning",
      "title": "为${items.map(i => i.name).join('、')}而设的中长期规划 🗺️",
      "points": [
        {
          "action": "贴合${expertOptions?.optimizationGoal || 'balanced'}目标的长期路径（中文）",
          "reasoning": "连接到${itemsDescription}与${interactionMode}的解释（节奏/依赖/门槛）",
          "tags": ["战略", "个性化"]
        }
      ]
    },
    {
      "id": "optimization_tips",
      "title": "${items.map(i => i.name).join('、')}的效率优化 ✨",
      "points": [
        {
          "action": "面向${itemsDescription}与${gold}金币的效率改进（中文）",
          "reasoning": "说明其对${itemsDescription}的具体改善点",
          "tags": ["效率", "定制"]
        }
      ]
    }
  ],
  "footerAnalysis": {
    "title": "${items.map(i => i.name).join('、')}的策略裁断",
    "conclusion": "一段中文收束，针对${itemsDescription}总结潜力与取舍",
    "callToAction": "下一步动作（中文，明确到道具/数量/时点）"
  }
}

终检要点：
- 每个部分都要点名实际选择的道具：${itemsDescription}
- 禁止提及未在清单中的道具；
- 所有建议需与现实清单与金币约束强相关，可立即执行。`;

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
