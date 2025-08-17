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
  // 根据交互模式调整AI的角色和语调（中文）
  let roleDescription = "";
  let taskDescription = "";
  let analysisDepth = "";
  let contentStyle = "";
  
  switch (interactionMode) {
    case 'beginner':
      roleDescription = `你是一位友好且耐心的园艺导师，专注帮助新手上手。语调鼓励、简洁与支持，避免术语，以中文清晰解释。`;
      taskDescription = `任务：生成一份“个人花园起步计划”，给出明确可执行的动作。`;
      analysisDepth = `聚焦2-3条立竿见影的行动，并解释“为什么”有效。`;
      contentStyle = `中文表达简洁亲切，短句为主；必要时解释基础机制。`;
      break;
      
    case 'expert':
      roleDescription = `你是一位面向老练玩家的战略顾问。语调分析型、数据导向与成熟稳健，关注优化与效率。`;
      taskDescription = `任务：输出“战略投资分析”，提供进阶优化策略。`;
      analysisDepth = `提供4-6条结构化建议，包含ROI估算、风险评估与时序分析。`;
      contentStyle = `术语准确，必要时量化；可讨论组合与周期等概念，但避免堆砌。`;
      break;
      
    default:
      roleDescription = `你是一位兼顾可读性与深度的花园策士，既给方法也给路径。`;
      taskDescription = `任务：生成“花园策略报告”，兼顾执行与战略。`;
      analysisDepth = `提供3-4条均衡建议，结合短期动作与中长期思路。`;
      contentStyle = `准确且易读，既有实操要点也有策略洞察。`;
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

玩家上下文分析：
- 金币：${gold}（${gamePhase}）
- 玩家等级：~${playerLevel}
- 游戏日期：${inGameDate}
- 季节：${season} - ${seasonalContext}
- 当前日期：${currentDate}
- 物品组合：${itemAnalysis}

分析深度：
${analysisDepth}

内容风格：
${contentStyle}

季节考量：
${seasonalContext}

请按如下JSON结构返回（字段名保持英文，内容为中文）：
{
  "mainTitle": "高度个性化的中文主标题（≤18字）",
  "subTitle": "紧扣战略重心的中文副标题（≤24字）",
  "visualAnchor": "单个Emoji（🌱🚀📊⚡🎯）",
  "playerProfile": {
    "title": "中文画像标题",
    "archetype": "中文画像名",
    "summary": "2-3句中文画像总结"
  },
  "midBreakerQuote": "一句中文引言，贴合季节与处境",
  "sections": [
    {
      "id": "immediate_actions",
      "title": "优先行动 🎯",
      "points": [
        {
          "action": "围绕${detailedItemsList.map(i=>i.name).join('、')}与${gold}金币的具体动作",
          "reasoning": "为何此举当下最优（收益/风险/时机）",
          "tags": ["优先", "经济", "季节"],
          "synergy": ["可选：协同道具"]
        }
      ]
    },
    {
      "id": "strategic_optimization",
      "title": "策略优化 🧠",
      "points": [
        {
          "action": "结合组合的中长期优化建议",
          "reasoning": "战略影响与时序考量",
          "tags": ["长期", "架构", "成长"],
          "synergy": ["可选：组合协同"]
        }
      ]
    },
    {
      "id": "seasonal_opportunities",
      "title": "季节机会 ✨",
      "points": [
        {
          "action": "${season}季的特定建议",
          "reasoning": "为何该时点具备独特优势",
          "tags": ["季节", "时机", "窗口"]
        }
      ]
    }
  ],
  "footerAnalysis": {
    "title": "策略裁断",
    "conclusion": "针对你当前局面的中文总结与方向",
    "callToAction": "下一步的明确动作（中文，尽量量化）"
  }
}

重要：所有建议必须紧扣玩家的实际道具（${detailedItemsList.map(item => item.name).join(', ')}) 与金币（${gold}），避免泛泛之谈。`;
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
