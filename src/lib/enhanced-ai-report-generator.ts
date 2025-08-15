// Enhanced AI Report Generator - 完全基于 Gemini AI 的智能报告生成系统
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { DetailedItem, AnalysisResult } from '@/types';

const MODEL_NAME = "gemini-2.0-flash-exp";

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

RESPONSE FORMAT (JSON):
{
  "mainTitle": "Compelling, personalized title that captures their unique situation",
  "subTitle": "Strategic subtitle that reflects their game phase and focus",
  "visualAnchor": "Perfect emoji that represents their strategic theme",
  "playerProfile": {
    "title": "Personalized archetype title based on their actual gameplay",
    "archetype": "Specific archetype name that fits their style",
    "summary": "Insightful 2-3 sentence analysis of their strategic approach and potential"
  },
  "midBreakerQuote": "Inspiring, contextual quote that resonates with their current journey",
  "sections": [
    {
      "id": "immediate_priorities",
      "title": "${roleConfig.sectionTitles.immediate}",
      "points": [
        {
          "action": "Specific action tailored to their exact items and gold amount",
          "reasoning": "Detailed explanation of why this action is perfect for their situation",
          "tags": ["Relevant", "Tags", "Here"],
          "synergy": ["Items that work together", "Strategic combinations"]
        }
      ]
    },
    {
      "id": "strategic_development",
      "title": "${roleConfig.sectionTitles.strategic}",
      "points": [
        {
          "action": "Strategic move that builds on their current foundation",
          "reasoning": "Long-term impact and timing considerations",
          "tags": ["Strategic", "Growth", "Optimization"],
          "synergy": ["Strategic synergies"]
        }
      ]
    },
    {
      "id": "seasonal_mastery",
      "title": "${roleConfig.sectionTitles.seasonal}",
      "points": [
        {
          "action": "Season-specific opportunity for ${season}",
          "reasoning": "Why this timing creates unique advantages",
          "tags": ["Seasonal", "Timing", "Opportunity"]
        }
      ]
    },
    {
      "id": "advanced_insights",
      "title": "${roleConfig.sectionTitles.advanced}",
      "points": [
        {
          "action": "Advanced technique or hidden opportunity",
          "reasoning": "Expert-level insight that most players miss",
          "tags": ["Advanced", "Hidden", "Expert"]
        }
      ]
    }
  ],
  "footerAnalysis": {
    "title": "Strategic Verdict",
    "conclusion": "Comprehensive assessment with clear strategic direction",
    "callToAction": "Specific next step that maximizes their current advantages"
  }
}

CRITICAL: Every recommendation must be specific to their actual items (${items.map(i => i.name).join(', ')}) and exact gold amount (${gold}). No generic advice!`;
}

/**
 * 获取角色配置
 */
function getRoleConfiguration(mode: string) {
  const configs = {
    beginner: {
      persona: "🌱 You are a warm, encouraging garden mentor who makes complex strategies feel simple and achievable. You celebrate small wins and build confidence through clear, step-by-step guidance.",
      mission: "Create a 'Personal Growth Plan' that transforms confusion into clarity and overwhelm into excitement.",
      analysisDepth: "Focus on 2-3 simple, high-impact actions. Explain the 'why' behind each step. Build confidence with encouraging language and celebrate their progress.",
      outputStyle: "Use simple, encouraging language. Include emojis. Explain game mechanics simply. Focus on immediate wins that build momentum.",
      sectionTitles: {
        immediate: "Your Next Wins 🎯",
        strategic: "Building Your Dream Garden 🌟",
        seasonal: "Perfect Timing Opportunities ⏰",
        advanced: "Pro Tips Just for You 💡"
      }
    },
    expert: {
      persona: "📊 You are a strategic mastermind who sees patterns others miss. You provide data-driven insights with surgical precision and reveal advanced optimization techniques.",
      mission: "Deliver a 'Strategic Intelligence Brief' with advanced analytics, market timing, and optimization strategies.",
      analysisDepth: "Provide 4-6 detailed strategic recommendations with ROI analysis, risk assessment, market timing, and portfolio optimization. Include advanced synergies and hidden mechanics.",
      outputStyle: "Use precise terminology, include numerical analysis, discuss advanced concepts like portfolio theory, market cycles, and strategic positioning.",
      sectionTitles: {
        immediate: "Priority Optimization Matrix 📊",
        strategic: "Advanced Strategic Positioning 🎯",
        seasonal: "Market Timing Analysis ⚡",
        advanced: "Elite Strategy Insights 🔬"
      }
    },
    advanced: {
      persona: "🎯 You are a balanced strategist who combines analytical depth with practical wisdom. You see both the forest and the trees, providing insights that are both strategic and actionable.",
      mission: "Generate a 'Strategic Intelligence Report' that balances immediate tactics with long-term vision.",
      analysisDepth: "Provide 3-4 well-balanced recommendations combining immediate actions with strategic thinking. Include both tactical moves and strategic positioning.",
      outputStyle: "Balance technical accuracy with accessibility. Include both practical tips and strategic insights. Use clear explanations with strategic depth.",
      sectionTitles: {
        immediate: "Strategic Priorities 🎯",
        strategic: "Long-term Positioning 🗺️",
        seasonal: "Seasonal Advantages ✨",
        advanced: "Strategic Insights 🧠"
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