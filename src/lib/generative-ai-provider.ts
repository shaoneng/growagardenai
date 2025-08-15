// /src/lib/generative-ai-provider.ts
// Google Generative AI Provider - 客户端版本

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const MODEL_NAME = "gemini-2.0-flash-exp";

// 接口定义
export interface DetailedItem {
  name: string;
  quantity: number;
  properties: string[];
}

export interface AnalysisRequest {
  selectedItems: Record<string, number>;
  gold: number;
  inGameDate: string;
  currentDate: string;
}

export interface AnalysisResult {
  reportId: string;
  publicationDate: string;
  mainTitle: string;
  subTitle: string;
  visualAnchor: string;
  playerProfile: {
    title: string;
    archetype: string;
    summary: string;
  };
  midBreakerQuote: string;
  sections: Array<{
    id: string;
    title: string;
    points: Array<{
      action: string;
      reasoning: string;
      tags: string[];
      synergy?: string[];
    }>;
  }>;
  footerAnalysis: {
    title: string;
    conclusion: string;
    callToAction: string;
  };
}

/**
 * 初始化Google Generative AI客户端（客户端版本）
 */
function initializeGoogleAI(): GoogleGenerativeAI {
  const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!API_KEY) {
    throw new Error('Client configuration error: Missing NEXT_PUBLIC_GEMINI_API_KEY.');
  }
  return new GoogleGenerativeAI(API_KEY);
}

/**
 * 检查 Google AI 是否可用
 */
export function isGoogleAIAvailable(): boolean {
  return !!process.env.NEXT_PUBLIC_GEMINI_API_KEY;
}

/**
 * 获取配置好的AI模型
 */
function getConfiguredModel(genAI: GoogleGenerativeAI) {
  return genAI.getGenerativeModel({
    model: MODEL_NAME,
    generationConfig: { 
      responseMimeType: "application/json" 
    },
    safetySettings: [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    ]
  });
}

/**
 * 构建分析提示词
 */
function buildAnalysisPrompt(
  detailedItemsList: DetailedItem[],
  gold: number,
  inGameDate: string,
  currentDate: string,
  interactionMode?: string
): string {
  // 根据交互模式调整AI的角色和语调
  let roleDescription = "";
  let taskDescription = "";
  
  switch (interactionMode) {
    case 'beginner':
      roleDescription = `You are a friendly, patient garden mentor who specializes in helping complete beginners. Your tone is encouraging, simple, and supportive. You avoid jargon and explain everything in plain English.`;
      taskDescription = `TASK: Create a "Personal Garden Plan" that gives specific, actionable advice for a new player.`;
      break;
      
    case 'expert':
      roleDescription = `You are a strategic advisor for experienced players. Your tone is analytical, data-driven, and sophisticated. You use advanced terminology and focus on optimization and efficiency.`;
      taskDescription = `TASK: Create a "Strategic Investment Analysis" that provides advanced optimization strategies.`;
      break;
      
    default:
      roleDescription = `You are a knowledgeable garden strategist who balances accessibility with depth. Your tone is informative yet approachable, providing both practical advice and strategic insights.`;
      taskDescription = `TASK: Create a "Garden Strategy Report" that balances practical advice with strategic depth.`;
  }

  return `${roleDescription}

${taskDescription}

CONTEXT:
- Player has ${gold} gold
- Current game date: ${inGameDate}
- Real date: ${currentDate}
- Selected items: ${JSON.stringify(detailedItemsList)}

RESPONSE FORMAT: Return a JSON object with this exact structure:
{
  "mainTitle": "Engaging title for the report",
  "subTitle": "Descriptive subtitle",
  "visualAnchor": "A single emoji that represents the core theme",
  "playerProfile": {
    "title": "Player archetype title",
    "archetype": "Brief archetype name",
    "summary": "2-3 sentence personality summary"
  },
  "midBreakerQuote": "An inspiring quote related to gardening/strategy",
  "sections": [
    {
      "id": "immediate_actions",
      "title": "Immediate Actions 🎯",
      "points": [
        {
          "action": "Specific actionable advice",
          "reasoning": "Clear explanation of why this matters",
          "tags": ["Priority", "Economic"]
        }
      ]
    },
    {
      "id": "strategic_moves",
      "title": "Strategic Moves 🧠",
      "points": [
        {
          "action": "Long-term strategic advice",
          "reasoning": "Explain its profound impact",
          "tags": ["Long-Term", "Infrastructure"]
        }
      ]
    }
  ],
  "footerAnalysis": {
    "title": "The Final Verdict",
    "conclusion": "Final summary with clear recommendation",
    "callToAction": "Specific next step for the player"
  }
}`;
}

/**
 * 使用 Google AI 生成分析报告（客户端版本）
 */
export async function generateAnalysisWithGoogleAI(
  detailedItemsList: DetailedItem[],
  gold: number,
  inGameDate: string,
  currentDate: string,
  interactionMode?: string,
  expertOptions?: any
): Promise<AnalysisResult> {
  try {
    // 初始化Google AI
    const genAI = initializeGoogleAI();
    const model = getConfiguredModel(genAI);
    
    // 构建提示词
    const prompt = buildAnalysisPrompt(detailedItemsList, gold, inGameDate, currentDate, interactionMode);
    
    // 调用AI生成内容
    const result = await model.generateContent(prompt);
    const response = result.response;
    const jsonText = response.text();
    
    // 解析并返回结果
    const reportObject = JSON.parse(jsonText) as AnalysisResult;
    
    // 添加报告ID和时间戳
    reportObject.reportId = `GGSB-${Date.now()}`;
    reportObject.publicationDate = currentDate;
    
    return reportObject;
    
  } catch (error) {
    console.error('Google AI Provider Error:', error);
    throw new Error(`Failed to generate analysis with Google AI: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * 获取Google AI服务状态信息
 */
export function getGoogleAIStatus() {
  return {
    available: isGoogleAIAvailable(),
    model: MODEL_NAME,
    provider: 'Google Generative AI'
  };
}