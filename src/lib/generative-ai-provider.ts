// /src/lib/generative-ai-provider.ts
// Google Generative AI Provider - 客户端版本

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
 * 构建分析提示词 - 增强版本
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
  let analysisDepth = "";
  let contentStyle = "";
  
  switch (interactionMode) {
    case 'beginner':
      roleDescription = `You are a friendly, patient garden mentor who specializes in helping complete beginners. Your tone is encouraging, simple, and supportive. You avoid jargon and explain everything in plain English.`;
      taskDescription = `TASK: Create a "Personal Garden Plan" that gives specific, actionable advice for a new player.`;
      analysisDepth = `Focus on 2-3 simple, immediate actions. Explain WHY each action helps. Use encouraging language.`;
      contentStyle = `Use simple words, short sentences, and lots of encouragement. Include basic explanations of game mechanics.`;
      break;
      
    case 'expert':
      roleDescription = `You are a strategic advisor for experienced players. Your tone is analytical, data-driven, and sophisticated. You use advanced terminology and focus on optimization and efficiency.`;
      taskDescription = `TASK: Create a "Strategic Investment Analysis" that provides advanced optimization strategies.`;
      analysisDepth = `Provide 4-6 detailed strategic recommendations with ROI calculations, risk assessments, and market timing analysis.`;
      contentStyle = `Use precise terminology, include numerical analysis, discuss advanced concepts like portfolio diversification and market cycles.`;
      break;
      
    default:
      roleDescription = `You are a knowledgeable garden strategist who balances accessibility with depth. Your tone is informative yet approachable, providing both practical advice and strategic insights.`;
      taskDescription = `TASK: Create a "Garden Strategy Report" that balances practical advice with strategic depth.`;
      analysisDepth = `Provide 3-4 well-balanced recommendations that combine immediate actions with strategic thinking.`;
      contentStyle = `Balance technical accuracy with readability. Include both practical tips and strategic insights.`;
  }

  // 分析玩家的当前状态
  const playerLevel = Math.floor(gold / 100) + 1;
  const isEarlyGame = gold < 200;
  const isMidGame = gold >= 200 && gold < 1000;
  const isLateGame = gold >= 1000;
  
  const gamePhase = isEarlyGame ? "Early Game" : isMidGame ? "Mid Game" : "Late Game";
  
  // 分析季节和时间
  const [season] = inGameDate.split(', ');
  const seasonalContext = getSeasonalContext(season);
  
  // 分析玩家的物品组合
  const itemAnalysis = analyzePlayerItems(detailedItemsList);

  return `${roleDescription}

${taskDescription}

PLAYER CONTEXT ANALYSIS:
- Gold: ${gold} (${gamePhase} phase)
- Player Level: ~${playerLevel}
- Game Date: ${inGameDate}
- Season: ${season} - ${seasonalContext}
- Real Date: ${currentDate}
- Items Portfolio: ${itemAnalysis}

ANALYSIS REQUIREMENTS:
${analysisDepth}

CONTENT STYLE:
${contentStyle}

SEASONAL CONSIDERATIONS:
${seasonalContext}

RESPONSE FORMAT: Return a JSON object with this exact structure:
{
  "mainTitle": "Engaging, personalized title that reflects the player's situation",
  "subTitle": "Descriptive subtitle that captures the strategic focus",
  "visualAnchor": "A single emoji that represents the core theme (🌱🚀📊⚡🎯)",
  "playerProfile": {
    "title": "Player archetype title based on their items and gold",
    "archetype": "Brief archetype name (e.g., 'Strategic Builder', 'Efficiency Expert', 'Growth Optimizer')",
    "summary": "2-3 sentence personality summary based on their current portfolio and game phase"
  },
  "midBreakerQuote": "An inspiring, contextual quote related to their current situation and season",
  "sections": [
    {
      "id": "immediate_actions",
      "title": "Priority Actions 🎯",
      "points": [
        {
          "action": "Specific, actionable advice tailored to their items and gold",
          "reasoning": "Clear explanation of why this matters for their specific situation",
          "tags": ["Priority", "Economic", "Seasonal"],
          "synergy": ["Optional: items that work well together"]
        }
      ]
    },
    {
      "id": "strategic_optimization",
      "title": "Strategic Optimization 🧠",
      "points": [
        {
          "action": "Long-term strategic advice based on their portfolio",
          "reasoning": "Explain the strategic impact and timing considerations",
          "tags": ["Long-Term", "Infrastructure", "Growth"],
          "synergy": ["Optional: strategic combinations"]
        }
      ]
    },
    {
      "id": "seasonal_opportunities",
      "title": "Seasonal Opportunities ✨",
      "points": [
        {
          "action": "Season-specific recommendations for ${season}",
          "reasoning": "Why this seasonal timing creates special opportunities",
          "tags": ["Seasonal", "Timing", "Opportunity"]
        }
      ]
    }
  ],
  "footerAnalysis": {
    "title": "Strategic Assessment",
    "conclusion": "Personalized summary with clear next steps based on their specific situation",
    "callToAction": "Specific, actionable next step that fits their game phase and resources"
  }
}

IMPORTANT: Make every recommendation specific to their actual items (${detailedItemsList.map(item => item.name).join(', ')}) and gold amount (${gold}). Avoid generic advice.`;
}

/**
 * 获取季节性背景信息
 */
function getSeasonalContext(season: string): string {
  const seasonalInfo = {
    'Spring': 'Growth season with planting bonuses. Focus on establishing new crops and expanding your garden.',
    'Summer': 'Peak growing season with maximum yields. Optimize for high-value crops and efficient harvesting.',
    'Autumn': 'Harvest season with preservation bonuses. Focus on collecting resources and preparing for winter.',
    'Winter': 'Planning season with reduced growth. Focus on strategy, upgrades, and resource management.'
  };
  
  return seasonalInfo[season as keyof typeof seasonalInfo] || 'Balanced season for steady growth and development.';
}

/**
 * 分析玩家物品组合
 */
function analyzePlayerItems(items: DetailedItem[]): string {
  if (items.length === 0) return "No items selected - starting fresh";
  
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const itemTypes = items.map(item => item.name).join(', ');
  const diversity = items.length;
  
  let analysis = `${totalItems} items across ${diversity} types: ${itemTypes}`;
  
  if (diversity === 1) {
    analysis += " (Focused strategy)";
  } else if (diversity >= 5) {
    analysis += " (Diversified portfolio)";
  } else {
    analysis += " (Balanced approach)";
  }
  
  return analysis;
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