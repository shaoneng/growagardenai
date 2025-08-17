// Enhanced AI Report Generator - 完全基于 Gemini AI 的智能报告生成系统
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { DetailedItem, AnalysisResult } from '@/types';

const MODEL_NAME = "gemini-2.5-pro";

interface EnhancedReportRequest {
  items: DetailedItem[];
  gold: number;
  inGameDate: string;
  currentDate: string;
  interactionMode: 'beginner' | 'advanced' | 'expert';
  playerPreferences?: {
    focusAreas?: string[];
    riskTolerance?: 'low' | 'medium' | 'high';
    timeHorizon?: 'short' | 'medium' | 'long';
  };
  gameContext?: {
    recentActions?: string[];
    achievements?: string[];
    challenges?: string[];
  };
}

/**
 * 初始化增强的 Gemini AI 客户端
 */
function initializeEnhancedGeminiAI(): GoogleGenerativeAI {
  const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!API_KEY) {
    throw new Error('Gemini API key not configured. Please set NEXT_PUBLIC_GEMINI_API_KEY.');
  }
  return new GoogleGenerativeAI(API_KEY);
}

/**
 * 获取配置好的增强AI模型
 */
function getEnhancedModel(genAI: GoogleGenerativeAI) {
  return genAI.getGenerativeModel({
    model: MODEL_NAME,
    generationConfig: { 
      responseMimeType: "application/json",
      temperature: 0.8, // 增加创造性
      topP: 0.9,
      topK: 40,
      maxOutputTokens: 4096
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
 * 构建增强的分析提示词
 */
function buildEnhancedPrompt(request: EnhancedReportRequest): string {
  const { items, gold, inGameDate, currentDate, interactionMode, playerPreferences, gameContext } = request;
  
  // 分析玩家状态
  const playerLevel = Math.floor(gold / 100) + 1;
  const gamePhase = gold < 200 ? "Early Game" : gold < 1000 ? "Mid Game" : "Late Game";
  const [season, dayPart] = inGameDate.split(', ');
  const day = parseInt(dayPart?.replace('Day ', '') || '1');
  
  // 分析物品组合
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const itemDiversity = items.length;
  const itemCategories = categorizeItems(items);
  
  // 根据交互模式设置AI角色
  const roleConfig = getRoleConfiguration(interactionMode);
  
  // 构建上下文信息
  const contextInfo = buildContextualInformation(season, day, gamePhase, itemCategories);
  
  return `${roleConfig.persona}

LANGUAGE: 请使用流畅、优雅的中文输出（简体）。
TONE: 华丽而不浮夸，富有画面感与鼓舞性，保持清晰可执行。
STYLE: 恰当运用比喻、意象与对仗，避免空泛口号；每条建议必须落到实际道具与金币数。

MISSION: ${roleConfig.mission}

PLAYER ANALYSIS:
🎮 Game Phase: ${gamePhase} (Level ~${playerLevel})
💰 Resources: ${gold} gold
📅 Game Date: ${inGameDate} (${season}, Day ${day})
📦 Portfolio: ${totalItems} items across ${itemDiversity} categories
🎯 Focus Areas: ${playerPreferences?.focusAreas?.join(', ') || 'General optimization'}
⚡ Risk Profile: ${playerPreferences?.riskTolerance || 'medium'} risk tolerance
⏰ Time Horizon: ${playerPreferences?.timeHorizon || 'medium'} term planning

ITEM BREAKDOWN:
${items.map(item => `- ${item.name}: ${item.quantity}x (${item.properties?.join(', ') || 'Standard properties'})`).join('\n')}

SEASONAL CONTEXT:
${contextInfo.seasonal}

STRATEGIC CONTEXT:
${contextInfo.strategic}

${gameContext?.recentActions ? `RECENT ACTIONS: ${gameContext.recentActions.join(', ')}` : ''}
${gameContext?.achievements ? `ACHIEVEMENTS: ${gameContext.achievements.join(', ')}` : ''}
${gameContext?.challenges ? `CURRENT CHALLENGES: ${gameContext.challenges.join(', ')}` : ''}

ANALYSIS REQUIREMENTS:
${roleConfig.analysisDepth}

OUTPUT STYLE:
${roleConfig.outputStyle}
补充要求：
- 所有标题、正文与引语均以中文呈现。
- 以第二人称直呼其人（“你”），增强代入感与个性化。
- 每个要点先给“行动”，再给“理由”，若有“协同”，点名具体道具名称。

RESPONSE FORMAT (JSON):
{
  "mainTitle": "高度个性化、意象鲜明的中文主标题（不超过18字）",
  "subTitle": "紧扣阶段与重心的中文副标题（不超过24字）",
  "visualAnchor": "单个最契合主题的Emoji",
  "playerProfile": {
    "title": "基于当前玩法的中文画像标题",
    "archetype": "贴合其风格的中文画像名",
    "summary": "2-3句凝练分析，概括你的策略取向与潜力（中文）"
  },
  "midBreakerQuote": "一句富有诗意且切题的中文引言（避免套话）",
  "sections": [
    {
      "id": "immediate_priorities",
      "title": "${roleConfig.sectionTitles.immediate}",
      "points": [
        {
          "action": "围绕所持道具与金币的具体行动（中文，直给步骤与数量）",
          "reasoning": "为何这一步与当下最契合（点明收益、风险与时机）",
          "tags": ["优先", "阶段性", "收益"],
          "synergy": ["可与哪些道具形成协同（点名道具）"]
        }
      ]
    },
    {
      "id": "strategic_development",
      "title": "${roleConfig.sectionTitles.strategic}",
      "points": [
        {
          "action": "基于当前底座的中长期布局（中文，包含阶段目标）",
          "reasoning": "长期影响、资源节律与关键窗口期说明",
          "tags": ["战略", "成长", "优化"],
          "synergy": ["中长期的协同组合（点名道具）"]
        }
      ]
    },
    {
      "id": "seasonal_mastery",
      "title": "${roleConfig.sectionTitles.seasonal}",
      "points": [
        {
          "action": "${season} 季的专属机会（中文，点明道具与资源调度）",
          "reasoning": "此时点为何独特且收益占优",
          "tags": ["季节", "时机", "窗口"]
        }
      ]
    },
    {
      "id": "advanced_insights",
      "title": "${roleConfig.sectionTitles.advanced}",
      "points": [
        {
          "action": "进阶技巧或隐蔽红利（中文，少即是多，务必落地）",
          "reasoning": "专业洞察：多数玩家忽视的因果链",
          "tags": ["进阶", "隐性", "专家"]
        }
      ]
    }
  ],
  "footerAnalysis": {
    "title": "策略裁断",
    "conclusion": "一段收束全篇的中文总结，给出清晰方向与取舍",
    "callToAction": "下一步的最优动作（中文，明确到道具/数量/时点）"
  }
}

CRITICAL: 所有建议必须严格对应玩家实际道具（${items.map(i => i.name).join(', ')}) 与金币（${gold}）。禁止泛泛而谈！`;
}

/**
 * 获取角色配置
 */
function getRoleConfiguration(mode: string) {
  const configs = {
    beginner: {
      persona: "🌱 你是一位温暖而耐心的园艺导师，擅长将复杂策略化繁为简，用清晰可行的步骤帮助新人建立信心。",
      mission: "打造一份‘个人成长计划’，把迷茫化作清晰，把压力化作期待。",
      analysisDepth: "聚焦2-3条最有性价比的行动，说明每一步背后的‘为什么’，帮助你稳步起势。",
      outputStyle: "用亲切易懂的中文表达，适度配合Emoji，解释机制直白、步骤明确，优先带来可见的小胜利。",
      sectionTitles: {
        immediate: "你眼前的胜利 🎯",
        strategic: "筑梦花园的蓝图 🌟",
        seasonal: "恰逢其时的窗口 ⏰",
        advanced: "只为你准备的窍门 💡"
      }
    },
    expert: {
      persona: "📊 你是一位洞见敏锐的战略家，擅长以数据与结构拆解复杂局面，给出刀锋般精确的优化方案。",
      mission: "呈上一份‘战略情报简报’，涵盖收益测算、风险分层、时机择优与组合优化。",
      analysisDepth: "提供4-6条结构化建议，含ROI测算、风险阈值、时序安排与协同组合；必要时点名隐性机制。",
      outputStyle: "术语准确、逻辑严密，必要时量化；可引用‘组合管理-周期-位势’等概念，但避免堆砌。",
      sectionTitles: {
        immediate: "优先级优化矩阵 📊",
        strategic: "高级战略位势 🎯",
        seasonal: "时序与节律分析 ⚡",
        advanced: "进阶策略洞察 🔬"
      }
    },
    advanced: {
      persona: "🎯 你是一位兼顾远近的策士，既见林亦见树，将可执行的动作与长线布局融为一体。",
      mission: "产出一份‘战略智能报告’，兼顾眼前推进与中长期价值。",
      analysisDepth: "提供3-4条均衡建议，既有当下动作，也有位势构建与节奏管理。",
      outputStyle: "准确而亲近，既讲策略也讲方法，解释清晰有层次。",
      sectionTitles: {
        immediate: "当下的关键 🎯",
        strategic: "长线的位势 🗺️",
        seasonal: "季节的顺风 ✨",
        advanced: "策略的洞见 🧠"
      }
    }
  };
  
  return configs[mode as keyof typeof configs] || configs.advanced;
}

/**
 * 构建上下文信息
 */
function buildContextualInformation(season: string, day: number, gamePhase: string, itemCategories: any) {
  const seasonalInfo = {
    'Spring': {
      description: 'Growth and expansion season with planting bonuses',
      opportunities: 'New crop varieties, expansion opportunities, foundation building',
      strategy: 'Focus on establishing diverse crops and building infrastructure'
    },
    'Summer': {
      description: 'Peak productivity season with maximum yields',
      opportunities: 'High-value crops, efficiency optimization, resource accumulation',
      strategy: 'Maximize output and optimize for high-value activities'
    },
    'Autumn': {
      description: 'Harvest and preparation season with collection bonuses',
      opportunities: 'Resource gathering, strategic stockpiling, preparation for winter',
      strategy: 'Focus on harvesting gains and preparing for the next cycle'
    },
    'Winter': {
      description: 'Planning and optimization season with strategic bonuses',
      opportunities: 'Strategic planning, infrastructure upgrades, skill development',
      strategy: 'Optimize systems and plan for the upcoming growth season'
    }
  };
  
  const currentSeason = seasonalInfo[season as keyof typeof seasonalInfo] || seasonalInfo.Spring;
  
  return {
    seasonal: `${currentSeason.description}. Key opportunities: ${currentSeason.opportunities}. Strategic focus: ${currentSeason.strategy}`,
    strategic: `${gamePhase} phase on Day ${day}. Portfolio composition: ${itemCategories.summary}`
  };
}

/**
 * 分类物品
 */
function categorizeItems(items: DetailedItem[]) {
  const categories = {
    crops: items.filter(item => item.properties?.includes('crop') || 
                      ['carrot', 'strawberry', 'blueberry', 'tomato', 'corn'].some(crop => 
                        item.name.toLowerCase().includes(crop))),
    tools: items.filter(item => item.properties?.includes('tool') || 
                       ['sprinkler', 'fertilizer', 'tool'].some(tool => 
                         item.name.toLowerCase().includes(tool))),
    decorations: items.filter(item => item.properties?.includes('decoration')),
    special: items.filter(item => item.properties?.includes('special') || 
                         item.properties?.includes('rare'))
  };
  
  const summary = `${categories.crops.length} crops, ${categories.tools.length} tools, ${categories.decorations.length} decorations, ${categories.special.length} special items`;
  
  return { ...categories, summary };
}

/**
 * 生成增强的AI报告
 */
export async function generateEnhancedAIReport(request: EnhancedReportRequest): Promise<AnalysisResult> {
  try {
    const genAI = initializeEnhancedGeminiAI();
    const model = getEnhancedModel(genAI);
    
    const prompt = buildEnhancedPrompt(request);
    
    console.log('🤖 Generating enhanced AI report with Gemini...');
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    const jsonText = response.text();
    
    // 解析并验证结果
    const reportObject = JSON.parse(jsonText) as AnalysisResult;
    
    // 添加报告元数据
    reportObject.reportId = `AI-${Date.now()}`;
    reportObject.publicationDate = request.currentDate;
    
    // 验证报告结构
    validateReportStructure(reportObject);
    
    console.log('✅ Enhanced AI report generated successfully');
    
    return reportObject;
    
  } catch (error) {
    console.error('❌ Enhanced AI report generation failed:', error);
    throw new Error(`Failed to generate enhanced AI report: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * 验证报告结构
 */
function validateReportStructure(report: AnalysisResult): void {
  const requiredFields = ['mainTitle', 'subTitle', 'visualAnchor', 'playerProfile', 'sections', 'footerAnalysis'];
  
  for (const field of requiredFields) {
    if (!(field in report)) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
  
  if (!Array.isArray(report.sections) || report.sections.length === 0) {
    throw new Error('Report must have at least one section');
  }
  
  for (const section of report.sections) {
    if (!section.id || !section.title || !Array.isArray(section.points)) {
      throw new Error('Invalid section structure');
    }
  }
}

/**
 * 检查增强AI是否可用
 */
export function isEnhancedAIAvailable(): boolean {
  return !!process.env.NEXT_PUBLIC_GEMINI_API_KEY;
}

/**
 * 获取增强AI状态
 */
export function getEnhancedAIStatus() {
  return {
    available: isEnhancedAIAvailable(),
    model: MODEL_NAME,
    provider: 'Enhanced Gemini AI',
    features: ['Contextual Analysis', 'Personalized Recommendations', 'Strategic Insights', 'Seasonal Optimization']
  };
}
