// /src/lib/generative-ai-provider.ts
// Google Generative AI Provider - 负责所有与Google AI相关的逻辑

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const MODEL_NAME = "gemini-2.5-pro";

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
 * 初始化Google Generative AI客户端
 */
function initializeGoogleAI(): GoogleGenerativeAI {
  const API_KEY = process.env.GEMINI_API_KEY;
  if (!API_KEY) {
    throw new Error('Server configuration error: Missing GEMINI_API_KEY.');
  }
  return new GoogleGenerativeAI(API_KEY);
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
      roleDescription = `You are a data-driven agricultural analyst and optimization expert. Your tone is precise, analytical, and focused on numbers, ROI, and market intelligence. You provide comprehensive analysis with detailed reasoning.`;
      taskDescription = `TASK: Generate an "Advanced Strategic Analysis" with detailed market intelligence and optimization recommendations.`;
      break;
      
    default: // advanced
      roleDescription = `You are a world-class strategist for the game "Grow a Garden." Your tone is that of an experienced mentor: authoritative, balanced, and strategic. You provide clear guidance without overwhelming complexity.`;
      taskDescription = `TASK: Analyze the user's data and generate a "Strategic Briefing" JSON object.`;
      break;
  }

  return `${roleDescription}

CRITICAL: Your entire response must be in authentic, natural-sounding English. Generate content that feels personal and tailored to this specific player's situation.

${taskDescription}

User's current status:
- In-game date: ${inGameDate}
- Gold: ${gold}
- Detailed Items List: ${JSON.stringify(detailedItemsList)}

The JSON output MUST follow this exact structure:
{
  "reportId": "A unique identifier, like 'GGSB-${new Date().getTime()}'.",
  "publicationDate": "${currentDate}",
  "mainTitle": "Strategic Briefing",
  "subTitle": "GROW A GARDEN INTELLIGENCE REPORT",
  "visualAnchor": "A single, impactful letter or number representing the core of the strategy. For example, 'A' for an 'Aggressive Growth' phase, or '3' for '3 Key Steps'.",
  "playerProfile": {
    "title": "Player Profile",
    "archetype": "A concise player archetype in English, e.g., 'Early-Stage Capital Accumulator' or 'Mid-Game Expander'.",
    "summary": "A powerful, single-sentence summary defining the player's current strategic position."
  },
  "midBreakerQuote": "A single, powerful, insightful quote distilled from the analysis, for the mid-page visual breaker.",
  "sections": [
    {
      "id": "priority_one",
      "title": "Priority One 🎯",
      "points": [
        {
          "action": "A short, verb-first command.",
          "reasoning": "A concise explanation of the strategic value of this action.",
          "tags": ["High ROI", "Short-Term"]
        }
      ]
    },
    {
      "id": "next_steps",
      "title": "Mid-Term Plays 🗺️",
      "points": [
        {
          "action": "A key task for mid-term development.",
          "reasoning": "Explain its profound impact on the late game.",
          "tags": ["Long-Term", "Infrastructure"]
        }
      ]
    },
    {
      "id": "hidden_gems",
      "title": "Hidden Gems ✨",
      "points": [
        {
          "action": "Reveal an overlooked item combo or strategy.",
          "reasoning": "Clarify how this synergy creates a 1+1>2 effect.",
          "synergy": ["item_name_1", "item_name_2"],
          "tags": ["Synergy"]
        }
      ]
    }
  ],
  "footerAnalysis": {
    "title": "The Final Verdict",
    "conclusion": "The final summary of this strategic briefing, giving a clear, directional recommendation.",
    "callToAction": "Immediate Action: [Fill in the single most important thing to do]"
  }
}

Ensure all 'icon' values are valid Font Awesome 5 class names (e.g., 'fas fa-bullseye'). The entire output must be a single, valid JSON object and nothing else.
`;
}

/**
 * 使用Google AI生成分析报告
 * @param detailedItemsList 详细物品列表
 * @param gold 金币数量
 * @param inGameDate 游戏内日期
 * @param currentDate 当前日期
 * @param interactionMode 交互模式
 * @returns 分析结果
 */
export async function generateAnalysisWithGoogleAI(
  detailedItemsList: DetailedItem[],
  gold: number,
  inGameDate: string,
  currentDate: string,
  interactionMode?: string
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
    return reportObject;
    
  } catch (error) {
    console.error('Google AI Provider Error:', error);
    throw new Error(`Failed to generate analysis with Google AI: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * 检查Google AI服务是否可用
 */
export function isGoogleAIAvailable(): boolean {
  return !!process.env.GEMINI_API_KEY;
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