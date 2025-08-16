// 服务端专用的 Gemini AI 提供者 - 个性化版本
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
- Season Context: ${inGameDate}`;

    return analysis;
}

// 服务端环境变量检查 - 优先使用服务端变量
function getGeminiApiKey(): string | null {
    // 在服务端API路由中，优先使用不带NEXT_PUBLIC前缀的环境变量
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

export async function generateAnalysisWithGoogleAI(
    items: Array<{ name: string; quantity: number; properties: string[] }>,
    gold: number,
    inGameDate: string,
    currentDate: string,
    interactionMode: string = 'balanced',
    expertOptions?: any
): Promise<AnalysisResult> {
    console.log('🚀 Server Gemini AI: Starting generation...');

    const apiKey = getGeminiApiKey();
    if (!apiKey) {
        throw new Error('Gemini API key not available on server');
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: MODEL_NAME,
            generationConfig: {
                responseMimeType: "application/json"
            }
        });

        console.log(`🤖 Server Gemini AI: Using model ${MODEL_NAME}`);
        console.log(`📊 Server Gemini AI: Processing ${items.length} items, ${gold} gold`);

        // 构建详细的提示
        const itemsDescription = items.map(item =>
            `${item.name} (quantity: ${item.quantity}${item.properties.length > 0 ? `, properties: ${item.properties.join(', ')}` : ''})`
        ).join(', ');

        const prompt = `You are an expert garden strategist for a farming simulation game. Generate a comprehensive analysis report in JSON format.

Player Context:
- Items: ${itemsDescription}
- Gold: ${gold}
- Game Date: ${inGameDate}
- Real Date: ${currentDate}
- Interaction Mode: ${interactionMode}

Generate a JSON response with this exact structure:
{
  "reportId": "AI-${Date.now()}",
  "publicationDate": "${currentDate}",
  "mainTitle": "AI Garden Analysis Report",
  "subTitle": "PERSONALIZED STRATEGIC RECOMMENDATIONS",
  "visualAnchor": "🤖",
  "playerProfile": {
    "title": "Player Profile",
    "archetype": "Strategic Gardener",
    "summary": "Brief analysis of player's current situation and approach"
  },
  "midBreakerQuote": "Inspirational quote about gardening strategy",
  "sections": [
    {
      "id": "immediate_actions",
      "title": "Priority Actions 🎯",
      "points": [
        {
          "action": "Specific actionable advice",
          "reasoning": "Detailed explanation of why this action is recommended",
          "tags": ["Priority", "Strategic"]
        }
      ]
    },
    {
      "id": "strategic_planning",
      "title": "Strategic Planning 🗺️",
      "points": [
        {
          "action": "Long-term strategic advice",
          "reasoning": "Explanation of strategic benefits",
          "tags": ["Growth", "Planning"]
        }
      ]
    },
    {
      "id": "optimization_tips",
      "title": "Optimization Tips ✨",
      "points": [
        {
          "action": "Efficiency improvement suggestion",
          "reasoning": "How this improves overall performance",
          "tags": ["Efficiency", "Optimization"]
        }
      ]
    }
  ],
  "footerAnalysis": {
    "title": "Strategic Assessment",
    "conclusion": "Overall assessment of player's situation and potential",
    "callToAction": "Specific next steps for the player"
  }
}

Make the advice specific to the player's items, gold amount, and game date. Consider seasonal factors and item synergies. Provide actionable, personalized recommendations.`;

        console.log('📝 Server Gemini AI: Sending prompt to model...');
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log('📥 Server Gemini AI: Received response');
        console.log(`📏 Server Gemini AI: Response length: ${text.length} characters`);

        try {
            const parsedResult = JSON.parse(text);

            // 验证响应结构
            if (!parsedResult.reportId || !parsedResult.mainTitle || !parsedResult.sections) {
                console.warn('⚠️ Server Gemini AI: Invalid response structure, using fallback');
                throw new Error('Invalid AI response structure');
            }

            console.log('✅ Server Gemini AI: Successfully generated report');
            console.log(`📊 Server Gemini AI: Report "${parsedResult.mainTitle}" with ${parsedResult.sections?.length || 0} sections`);

            return parsedResult as AnalysisResult;

        } catch (parseError) {
            console.error('❌ Server Gemini AI: JSON parse error:', parseError);
            console.log('📄 Server Gemini AI: Raw response:', text.substring(0, 500) + '...');
            throw new Error(`Failed to parse AI response: ${parseError.message}`);
        }

    } catch (error) {
        console.error('❌ Server Gemini AI: Generation failed:', error);

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

// 测试连接函数
export async function testGeminiConnection(): Promise<boolean> {
    console.log('🧪 Server Gemini AI: Testing connection...');

    if (!isGoogleAIAvailable()) {
        console.log('❌ Server Gemini AI: API key not available');
        return false;
    }

    try {
        const testResult = await generateAnalysisWithGoogleAI(
            [{ name: 'Test Crop', quantity: 1, properties: [] }],
            100,
            'Spring, Day 1',
            new Date().toISOString(),
            'test'
        );

        const isValid = testResult && testResult.reportId && testResult.mainTitle;
        console.log(`${isValid ? '✅' : '❌'} Server Gemini AI: Connection test ${isValid ? 'passed' : 'failed'}`);
        return isValid;

    } catch (error) {
        console.error('❌ Server Gemini AI: Connection test failed:', error.message);
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
        environment: process.env.NODE_ENV || 'unknown'
    };
}