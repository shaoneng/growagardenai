// /src/lib/advisor-engine.ts
// 智能规则引擎 - 基于游戏规则的纯逻辑决策引擎

import {
  DetailedItem,
  AnalysisResult,
  AnalysisRequest,
  EnhancedAnalysisRequest,
  InteractionMode,
  ExpertOptions,
  PlayerStatus,
  RuleBasedAdvice,
  PortfolioAnalysis
} from '@/types';

import { 
  generateRuleBasedAdvice, 
  calculateOptimalPortfolio,
  SEASON_BONUSES 
} from './game-rules';

// 重新导出类型，以便API路由可以使用
export type { 
  DetailedItem, 
  AnalysisResult, 
  AnalysisRequest, 
  EnhancedAnalysisRequest,
  ExpertOptions
};

// 重新导出枚举（作为值）
export { InteractionMode };

/**
 * 生成战略建议的主函数
 * 这是规则引擎的核心函数，基于游戏规则生成结构化的建议
 * 
 * @param detailedItemsList 详细物品列表
 * @param gold 金币数量
 * @param inGameDate 游戏内日期
 * @param currentDate 当前日期
 * @param interactionMode 交互模式
 * @param expertOptions 专家模式选项
 * @returns 分析结果
 */
export async function generateStrategicAdvice(
  detailedItemsList: DetailedItem[],
  gold: number,
  inGameDate: string,
  currentDate: string,
  interactionMode: InteractionMode = InteractionMode.ADVANCED,
  expertOptions?: EnhancedAnalysisRequest['expertOptions']
): Promise<AnalysisResult> {
  
  // 解析游戏内日期
  const [season, dayPart] = inGameDate.split(', ');
  const day = parseInt(dayPart.replace('Day ', ''));
  
  // 构建玩家状态
  const playerStatus: PlayerStatus = {
    level: Math.floor(gold / 100) + 1, // 简单的等级估算
    gold,
    xp: 0,
    inGameDate,
    season: season as 'Spring' | 'Summer' | 'Autumn' | 'Winter',
    day
  };
  
  // 转换物品格式以适配规则引擎
  const gameItems = detailedItemsList.map(item => ({
    name: item.name.toLowerCase().replace(/ /g, '_'),
    tier: inferTierFromName(item.name),
    quantity: item.quantity
  }));
  
  // 使用规则引擎生成基础数据和建议
  const ruleBasedAdvice = generateRuleBasedAdvice(gameItems, playerStatus, expertOptions);
  const portfolio = calculateOptimalPortfolio(gold, playerStatus.level, season, gameItems, expertOptions);
  
  // 检查是否有Gemini API可用来增强报告
  const useGeminiEnhancement = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 0;
  
  let strategicReport: AnalysisResult;
  
  if (useGeminiEnhancement) {
    // 使用Gemini API生成个性化报告
    strategicReport = await generateGeminiEnhancedReport(
      interactionMode,
      currentDate,
      season,
      playerStatus,
      ruleBasedAdvice,
      portfolio,
      detailedItemsList
    );
  } else {
    // 回退到规则引擎生成的报告
    strategicReport = generateModeSpecificReport(
      interactionMode,
      currentDate,
      season,
      playerStatus,
      ruleBasedAdvice,
      portfolio
    );
  }

  return strategicReport;
}

/**
 * 检查规则引擎是否可用
 * @returns 始终返回true，因为规则引擎不依赖外部服务
 */
export function isRuleEngineAvailable(): boolean {
  return true;
}

/**
 * 获取规则引擎状态信息
 */
export function getRuleEngineStatus() {
  return {
    available: true,
    engine: 'advisor-engine',
    version: '1.0.0',
    provider: 'Rule-Based Decision Engine'
  };
}

/**
 * 辅助函数：根据物品名称推断稀有度
 */
function inferTierFromName(itemName: string): string {
  const commonItems = ['carrot', 'strawberry'];
  const uncommonItems = ['blueberry', 'rose', 'orange tulip', 'dezen', 'artichoke', 'onion'];
  const rareItems = ['tomato', 'daffodil', 'cauliflower', 'raspberry', 'foxglove', 'corn'];
  const legendaryItems = ['watermelon', 'pumpkin'];
  
  const lowerName = itemName.toLowerCase();
  
  if (commonItems.some(item => lowerName.includes(item))) return 'Common';
  if (uncommonItems.some(item => lowerName.includes(item))) return 'Uncommon';
  if (rareItems.some(item => lowerName.includes(item))) return 'Rare';
  if (legendaryItems.some(item => lowerName.includes(item))) return 'Legendary';
  
  return 'Common'; // 默认
}

/**
 * 辅助函数：生成视觉锚点
 */
function getVisualAnchor(season: string, archetype: string): string {
  if (season === 'Spring') return 'S';
  if (season === 'Summer') return '☀';
  if (season === 'Autumn') return '🍂';
  if (season === 'Winter') return '❄';
  
  if (archetype.includes('Starter')) return '🌱';
  if (archetype.includes('Expander')) return '🚀';
  
  return 'A';
}

/**
 * 辅助函数：生成玩家总结
 */
function generatePlayerSummary(playerStatus: PlayerStatus, _expectedROI: number): string {
  const seasonBonus = SEASON_BONUSES[playerStatus.season];
  
  if (playerStatus.gold < 200) {
    return `You're in the early building phase with ${playerStatus.gold} gold. Focus on establishing a solid foundation with reliable, quick-return investments.`;
  } else if (playerStatus.gold > 1000) {
    return `With ${playerStatus.gold} gold at your disposal, you're positioned for aggressive expansion and high-value strategic investments.`;
  } else {
    return `Your ${playerStatus.gold} gold provides good flexibility for balanced growth. ${seasonBonus.description} this season.`;
  }
}

/**
 * 辅助函数：生成季节性引言
 */
function getSeasonalQuote(season: string, _gold: number): string {
  const quotes = {
    Spring: "Spring awakens new possibilities - every seed planted today shapes tomorrow's harvest.",
    Summer: "Summer's abundance rewards the prepared - maximize your growth while conditions are optimal.",
    Autumn: "Autumn teaches patience and planning - harvest wisdom along with your crops.",
    Winter: "Winter demands strategic thinking - conserve resources and plan for the coming seasons."
  };
  
  return quotes[season as keyof typeof quotes] || "Success in gardening comes from understanding timing and patience.";
}

/**
 * 辅助函数：生成战略结论
 */
function generateStrategicConclusion(
  portfolio: { expectedROI: number }, 
  playerStatus: PlayerStatus, 
  advice: { playerArchetype: string }
): string {
  const roiText = portfolio.expectedROI > 30 ? "excellent" : portfolio.expectedROI > 15 ? "solid" : "modest";
  const seasonBonus = SEASON_BONUSES[playerStatus.season];
  
  return `Your current strategy shows ${roiText} potential with ${portfolio.expectedROI.toFixed(1)}% expected ROI. ${seasonBonus.description}, making this an optimal time for ${advice.playerArchetype.includes('Starter') ? 'foundation building' : 'strategic expansion'}.`;
}

/**
 * 辅助函数：生成行动号召
 */
function generateCallToAction(immediateActions: string[], _playerStatus: PlayerStatus): string {
  if (immediateActions.length === 0) {
    return "Continue monitoring market conditions and seasonal opportunities.";
  }
  
  const primaryAction = immediateActions[0].split(' - ')[0];
  return `Immediate Action: ${primaryAction}`;
}

/**
 * 根据交互模式生成特定的报告结构
 */
function generateModeSpecificReport(
  mode: InteractionMode,
  currentDate: string,
  season: string,
  playerStatus: PlayerStatus,
  ruleBasedAdvice: any,
  portfolio: any
): AnalysisResult {
  const baseReport = {
    reportId: `GGSB-${Date.now()}`,
    publicationDate: currentDate,
    visualAnchor: getVisualAnchor(season, ruleBasedAdvice.playerArchetype),
    playerProfile: {
      title: "Player Profile",
      archetype: ruleBasedAdvice.playerArchetype,
      summary: generatePlayerSummary(playerStatus, portfolio.expectedROI)
    },
    midBreakerQuote: getSeasonalQuote(season, playerStatus.gold),
    footerAnalysis: {
      title: "Strategic Assessment",
      conclusion: generateStrategicConclusion(portfolio, playerStatus, ruleBasedAdvice),
      callToAction: generateCallToAction(ruleBasedAdvice.immediateActions, playerStatus)
    }
  };

  switch (mode) {
    case InteractionMode.BEGINNER:
      return {
        ...baseReport,
        mainTitle: "Your Garden Guide",
        subTitle: "SIMPLE STEPS TO SUCCESS",
        sections: [
          {
            id: "what_to_do_now",
            title: "What Should I Do Now? 🌱",
            points: ruleBasedAdvice.immediateActions.slice(0, 2).map((action: string) => ({
              action: simplifyActionForBeginner(action.split(' - ')[0]),
              reasoning: simplifyReasoningForBeginner(action.split(' - ')[1] || "This will help you grow your garden"),
              tags: ["Beginner Friendly", "Easy"]
            }))
          },
          {
            id: "next_goal",
            title: "Your Next Goal 🎯",
            points: ruleBasedAdvice.midTermGoals.slice(0, 1).map((goal: string) => ({
              action: simplifyActionForBeginner(goal),
              reasoning: "This will unlock new opportunities and help you progress faster",
              tags: ["Goal", "Progress"]
            }))
          },
          ...(ruleBasedAdvice.warnings.length > 0 ? [{
            id: "helpful_tips",
            title: "Helpful Tips 💡",
            points: ruleBasedAdvice.warnings.slice(0, 1).map((warning: string) => ({
              action: "Keep in mind",
              reasoning: simplifyReasoningForBeginner(warning),
              tags: ["Tip", "Important"]
            }))
          }] : [])
        ]
      };

    case InteractionMode.EXPERT:
      return {
        ...baseReport,
        mainTitle: "Advanced Strategic Analysis",
        subTitle: "COMPREHENSIVE MARKET INTELLIGENCE",
        sections: [
          {
            id: "optimization_analysis",
            title: "Portfolio Optimization 📊",
            points: portfolio.recommendations.map((rec: any) => ({
              action: `Allocate ${rec.quantity}x ${rec.item}`,
              reasoning: `${rec.reasoning} | Priority: ${rec.priority}`,
              tags: ["Optimization", rec.priority, "ROI"]
            }))
          },
          {
            id: "risk_reward_matrix",
            title: "Risk-Reward Analysis ⚖️",
            points: ruleBasedAdvice.immediateActions.map((action: string) => ({
              action: action.split(' - ')[0],
              reasoning: `${action.split(' - ')[1] || "Strategic analysis"} | Expected ROI: ${portfolio.expectedROI.toFixed(1)}%`,
              tags: ["Risk Analysis", "Advanced", "Data-Driven"]
            }))
          },
          {
            id: "market_opportunities",
            title: "Market Opportunities 🔍",
            points: ruleBasedAdvice.hiddenOpportunities.map((opportunity: string) => ({
              action: opportunity.split(':')[0],
              reasoning: opportunity.split(':')[1] || "Advanced market insight",
              tags: ["Market Intelligence", "Opportunity"]
            }))
          },
          {
            id: "strategic_warnings",
            title: "Strategic Risk Assessment ⚠️",
            points: ruleBasedAdvice.warnings.map((warning: string) => ({
              action: "Mitigate risk factor",
              reasoning: warning,
              tags: ["Risk Management", "Strategic"]
            }))
          }
        ]
      };

    default: // ADVANCED mode
      return {
        ...baseReport,
        mainTitle: "Strategic Briefing",
        subTitle: "GROW A GARDEN INTELLIGENCE REPORT",
        sections: [
          {
            id: "priority_one",
            title: "Priority One 🎯",
            points: ruleBasedAdvice.immediateActions.map((action: string) => ({
              action: action.split(' - ')[0],
              reasoning: action.split(' - ')[1] || "Based on current game state analysis",
              tags: ["High Priority", "Immediate"]
            }))
          },
          {
            id: "next_steps", 
            title: "Mid-Term Strategy 🗺️",
            points: ruleBasedAdvice.midTermGoals.map((goal: string) => ({
              action: goal,
              reasoning: "Strategic milestone for sustainable growth and progression",
              tags: ["Mid-Term", "Growth"]
            }))
          },
          {
            id: "hidden_gems",
            title: "Hidden Opportunities ✨", 
            points: ruleBasedAdvice.hiddenOpportunities.map((opportunity: string) => ({
              action: opportunity.split(':')[0],
              reasoning: opportunity.split(':')[1] || "Special seasonal or synergy bonus available",
              tags: ["Seasonal", "Bonus"]
            }))
          },
          ...(ruleBasedAdvice.warnings.length > 0 ? [{
            id: "warnings",
            title: "Risk Assessment ⚠️",
            points: ruleBasedAdvice.warnings.map((warning: string) => ({
              action: "Address potential risk",
              reasoning: warning,
              tags: ["Risk Management", "Caution"]
            }))
          }] : [])
        ]
      };
  }
}

/**
 * 为新手模式简化行动描述
 */
function simplifyActionForBeginner(action: string): string {
  // 简化复杂的术语和建议
  return action
    .replace(/Focus on|Prioritize/, 'Plant')
    .replace(/ROI|return on investment/i, 'profit')
    .replace(/portfolio|allocation/i, 'items')
    .replace(/infrastructure/, 'tools')
    .replace(/optimization/, 'better choices');
}

/**
 * 为新手模式简化推理描述
 */
function simplifyReasoningForBeginner(reasoning: string): string {
  // 简化复杂的解释
  return reasoning
    .replace(/Expected ROI|ROI/g, 'profit')
    .replace(/strategic|optimization/gi, 'good')
    .replace(/portfolio diversification/i, 'variety')
    .replace(/risk mitigation/i, 'staying safe')
    .replace(/market conditions/i, 'game situation');
}

/**
 * 使用Gemini API生成个性化增强报告
 */
async function generateGeminiEnhancedReport(
  mode: InteractionMode,
  currentDate: string,
  season: string,
  playerStatus: PlayerStatus,
  ruleBasedAdvice: any,
  portfolio: any,
  detailedItemsList: DetailedItem[]
): Promise<AnalysisResult> {
  try {
    // 导入Gemini API功能
    const { generateAnalysisWithGoogleAI } = await import('./generative-ai-provider');
    
    // 使用Gemini API生成个性化报告
    const geminiReport = await generateAnalysisWithGoogleAI(
      detailedItemsList,
      playerStatus.gold,
      playerStatus.inGameDate,
      currentDate,
      mode
    );
    
    // 根据交互模式调整Gemini生成的报告
    return adaptGeminiReportForMode(geminiReport, mode, ruleBasedAdvice, portfolio);
    
  } catch (error) {
    console.warn('Gemini API failed, falling back to rule engine:', error);
    
    // 如果Gemini API失败，回退到规则引擎
    return generateModeSpecificReport(
      mode,
      currentDate,
      season,
      playerStatus,
      ruleBasedAdvice,
      portfolio
    );
  }
}

/**
 * 根据交互模式调整Gemini生成的报告
 */
function adaptGeminiReportForMode(
  geminiReport: AnalysisResult,
  mode: InteractionMode,
  ruleBasedAdvice: any,
  portfolio: any
): AnalysisResult {
  switch (mode) {
    case InteractionMode.BEGINNER:
      return {
        ...geminiReport,
        mainTitle: "Your Personal Garden Plan 🌱",
        subTitle: "SIMPLE STEPS TO SUCCESS",
        sections: geminiReport.sections.slice(0, 2).map(section => ({
          ...section,
          title: section.title.replace(/Priority One|Strategic/, 'What to do now'),
          points: section.points.slice(0, 3).map(point => ({
            ...point,
            action: simplifyActionForBeginner(point.action),
            reasoning: simplifyReasoningForBeginner(point.reasoning),
            tags: ["Beginner Friendly", "Easy"]
          }))
        }))
      };
      
    case InteractionMode.EXPERT:
      return {
        ...geminiReport,
        mainTitle: "Advanced Strategic Analysis",
        subTitle: "COMPREHENSIVE MARKET INTELLIGENCE",
        sections: [
          ...geminiReport.sections,
          {
            id: "portfolio_analysis",
            title: "Portfolio Optimization 📊",
            points: portfolio.recommendations.slice(0, 3).map((rec: any) => ({
              action: `Optimize allocation: ${rec.item}`,
              reasoning: `${rec.reasoning} | Expected ROI: ${portfolio.expectedROI.toFixed(1)}%`,
              tags: ["Data-Driven", "Optimization", rec.priority]
            }))
          }
        ]
      };
      
    default: // ADVANCED
      return {
        ...geminiReport,
        sections: geminiReport.sections.map(section => ({
          ...section,
          points: section.points.map(point => ({
            ...point,
            tags: [...(point.tags || []), "Strategic", "Balanced"]
          }))
        }))
      };
  }
}