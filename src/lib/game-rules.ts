// /src/lib/game-rules.ts
// 游戏规则数据结构和计算逻辑

import {
  Crop,
  Pet,
  PlayerStatus,
  ExpertOptions,
  PortfolioAnalysis,
  CropROIAnalysis,
  RuleBasedAdvice,
  SeasonBonus,
  InvestmentStrategy
} from '@/types';

// 重新导出核心类型
export type { 
  PlayerStatus, 
  ExpertOptions, 
  PortfolioAnalysis, 
  CropROIAnalysis, 
  RuleBasedAdvice 
};

/**
 * 基于稀有度的基础属性映射
 */
export const TIER_BASE_PROPERTIES = {
  Common: {
    basePrice: 50,
    sellPrice: 75,
    growthTime: 2,
    xpReward: 10,
    goldMultiplier: 1.0
  },
  Uncommon: {
    basePrice: 150,
    sellPrice: 225,
    growthTime: 4,
    xpReward: 25,
    goldMultiplier: 1.2
  },
  Rare: {
    basePrice: 400,
    sellPrice: 600,
    growthTime: 8,
    xpReward: 50,
    goldMultiplier: 1.5
  },
  Legendary: {
    basePrice: 1000,
    sellPrice: 1500,
    growthTime: 16,
    xpReward: 100,
    goldMultiplier: 2.0
  }
} as const;

/**
 * 季节加成系数
 */
export const SEASON_BONUSES = {
  Spring: {
    growthSpeed: 1.2,
    goldBonus: 1.0,
    xpBonus: 1.1,
    description: "Spring accelerates growth by 20%"
  },
  Summer: {
    growthSpeed: 1.0,
    goldBonus: 1.3,
    xpBonus: 1.0,
    description: "Summer increases gold rewards by 30%"
  },
  Autumn: {
    growthSpeed: 0.9,
    goldBonus: 1.1,
    xpBonus: 1.2,
    description: "Autumn provides 20% XP bonus"
  },
  Winter: {
    growthSpeed: 0.8,
    goldBonus: 1.0,
    xpBonus: 1.0,
    description: "Winter slows growth but maintains stability"
  }
} as const;

/**
 * 特殊作物规则
 */
export const SPECIAL_CROP_RULES = {
  // 多次收获作物
  multi_harvest: {
    blueberry: { harvestCount: 3, intervalHours: 6 },
    strawberry: { harvestCount: 2, intervalHours: 4 },
    tomato: { harvestCount: 4, intervalHours: 8 }
  },
  
  // 特殊协同效应
  synergies: {
    orange_tulip: {
      with: ['beehive'],
      effect: 'produces_tulip_honey',
      bonus: 2.5
    },
    corn: {
      with: ['scarecrow'],
      effect: 'pest_protection',
      bonus: 1.3
    }
  },
  
  // 季节特殊加成
  seasonal_specials: {
    pumpkin: { season: 'Autumn', bonus: 2.0 },
    watermelon: { season: 'Summer', bonus: 1.8 },
    daffodil: { season: 'Spring', bonus: 1.5 }
  }
} as const;

/**
 * 计算作物的实际收益
 */
export function calculateCropROI(
  cropName: string,
  tier: string,
  quantity: number,
  playerStatus: PlayerStatus
): {
  totalInvestment: number;
  expectedReturn: number;
  roi: number;
  timeToProfit: number;
  riskLevel: 'Low' | 'Medium' | 'High';
} {
  const baseProps = TIER_BASE_PROPERTIES[tier as keyof typeof TIER_BASE_PROPERTIES];
  const seasonBonus = SEASON_BONUSES[playerStatus.season];
  
  const totalInvestment = baseProps.basePrice * quantity;
  const baseReturn = baseProps.sellPrice * quantity;
  const seasonAdjustedReturn = baseReturn * seasonBonus.goldBonus;
  
  // 检查特殊规则
  const specialRule = SPECIAL_CROP_RULES.seasonal_specials[cropName as keyof typeof SPECIAL_CROP_RULES.seasonal_specials];
  const finalReturn = specialRule && specialRule.season === playerStatus.season 
    ? seasonAdjustedReturn * specialRule.bonus 
    : seasonAdjustedReturn;
  
  const roi = ((finalReturn - totalInvestment) / totalInvestment) * 100;
  const adjustedGrowthTime = baseProps.growthTime / seasonBonus.growthSpeed;
  
  // 风险评估
  let riskLevel: 'Low' | 'Medium' | 'High' = 'Medium';
  if (tier === 'Common' || tier === 'Uncommon') riskLevel = 'Low';
  if (tier === 'Legendary') riskLevel = 'High';
  
  return {
    totalInvestment,
    expectedReturn: finalReturn,
    roi,
    timeToProfit: adjustedGrowthTime,
    riskLevel
  };
}



/**
 * 计算最优投资组合
 */
export function calculateOptimalPortfolio(
  availableGold: number,
  playerLevel: number,
  season: string,
  availableItems: Array<{name: string, tier: string, quantity: number}>,
  expertOptions?: ExpertOptions
): {
  recommendations: Array<{
    item: string;
    quantity: number;
    priority: 'High' | 'Medium' | 'Low';
    reasoning: string;
  }>;
  totalInvestment: number;
  expectedROI: number;
} {
  const recommendations = [];
  let totalInvestment = 0;
  let totalExpectedReturn = 0;
  
  // 根据玩家等级和金币数量制定策略
  const strategy = determineStrategy(availableGold, playerLevel, expertOptions);
  
  for (const item of availableItems) {
    const playerStatus: PlayerStatus = {
      level: playerLevel,
      gold: availableGold,
      xp: 0,
      inGameDate: `${season}, Day 1`,
      season: season as 'Spring' | 'Summer' | 'Autumn' | 'Winter',
      day: 1
    };
    
    const analysis = calculateCropROI(item.name, item.tier, item.quantity, playerStatus);
    
    if (analysis.roi > strategy.minROI && analysis.riskLevel === strategy.preferredRisk) {
      const priority: 'High' | 'Medium' | 'Low' = analysis.roi > 50 ? 'High' : analysis.roi > 25 ? 'Medium' : 'Low';
      
      recommendations.push({
        item: item.name,
        quantity: Math.min(item.quantity, Math.floor(availableGold * strategy.allocationRatio / TIER_BASE_PROPERTIES[item.tier as keyof typeof TIER_BASE_PROPERTIES].basePrice)),
        priority,
        reasoning: `ROI: ${analysis.roi.toFixed(1)}%, Risk: ${analysis.riskLevel}, Time: ${analysis.timeToProfit}h`
      });
      
      totalInvestment += analysis.totalInvestment;
      totalExpectedReturn += analysis.expectedReturn;
    }
  }
  
  return {
    recommendations,
    totalInvestment,
    expectedROI: totalInvestment > 0 ? ((totalExpectedReturn - totalInvestment) / totalInvestment) * 100 : 0
  };
}

/**
 * 根据玩家状态确定投资策略
 */
function determineStrategy(gold: number, _level: number, expertOptions?: ExpertOptions): {
  minROI: number;
  preferredRisk: 'Low' | 'Medium' | 'High';
  allocationRatio: number;
} {
  // 基础策略
  let baseStrategy;
  if (gold < 200) {
    baseStrategy = { minROI: 20, preferredRisk: 'Low' as const, allocationRatio: 0.8 };
  } else if (gold < 1000) {
    baseStrategy = { minROI: 30, preferredRisk: 'Medium' as const, allocationRatio: 0.6 };
  } else {
    baseStrategy = { minROI: 40, preferredRisk: 'High' as const, allocationRatio: 0.4 };
  }

  // 根据专家选项调整策略
  if (expertOptions) {
    // 调整风险偏好
    if (expertOptions.riskTolerance === 'conservative') {
      baseStrategy.preferredRisk = 'Low';
      baseStrategy.minROI = Math.max(baseStrategy.minROI - 10, 15);
    } else if (expertOptions.riskTolerance === 'aggressive') {
      baseStrategy.preferredRisk = 'High';
      baseStrategy.minROI += 15;
    }

    // 调整优化目标
    if (expertOptions.optimizationGoal === 'speed') {
      baseStrategy.minROI = Math.max(baseStrategy.minROI - 15, 10);
      baseStrategy.allocationRatio += 0.2;
    } else if (expertOptions.optimizationGoal === 'profit') {
      baseStrategy.minROI += 10;
      baseStrategy.allocationRatio -= 0.1;
    }

    // 调整时间视野
    if (expertOptions.timeHorizon === 'short') {
      baseStrategy.preferredRisk = baseStrategy.preferredRisk === 'High' ? 'Medium' : 'Low';
    } else if (expertOptions.timeHorizon === 'long') {
      baseStrategy.minROI += 5;
    }
  }

  return baseStrategy;
}

/**
 * 生成基于规则的战略建议
 */
export function generateRuleBasedAdvice(
  selectedItems: Array<{name: string, tier: string, quantity: number}>,
  playerStatus: PlayerStatus,
  expertOptions?: ExpertOptions
): {
  immediateActions: string[];
  midTermGoals: string[];
  hiddenOpportunities: string[];
  warnings: string[];
  playerArchetype: string;
} {
  const portfolio = calculateOptimalPortfolio(
    playerStatus.gold,
    playerStatus.level,
    playerStatus.season,
    selectedItems,
    expertOptions
  );
  
  const immediateActions = [];
  const midTermGoals = [];
  const hiddenOpportunities = [];
  const warnings = [];
  
  // 立即行动建议
  const highPriorityItems = portfolio.recommendations.filter(r => r.priority === 'High');
  if (highPriorityItems.length > 0) {
    immediateActions.push(`Focus on ${highPriorityItems[0].item} - ${highPriorityItems[0].reasoning}`);
  }
  
  if (playerStatus.gold < 100) {
    immediateActions.push("Prioritize quick-return crops to build your gold reserves");
  }
  
  // 中期目标
  if (playerStatus.level < 10) {
    midTermGoals.push("Reach level 10 to unlock advanced farming tools");
  }
  
  if (playerStatus.gold < 1000) {
    midTermGoals.push("Save 1,000 gold for mid-game infrastructure investments");
  }
  
  // 隐藏机会
  const seasonalSpecials = Object.entries(SPECIAL_CROP_RULES.seasonal_specials)
    .filter(([, rule]) => rule.season === playerStatus.season);
  
  if (seasonalSpecials.length > 0) {
    hiddenOpportunities.push(`${playerStatus.season} bonus: ${seasonalSpecials[0][0]} provides ${(seasonalSpecials[0][1].bonus * 100 - 100).toFixed(0)}% extra profit`);
  }
  
  // 警告
  if (portfolio.expectedROI < 20) {
    warnings.push("Current selection has low ROI - consider diversifying your portfolio");
  }
  
  if (selectedItems.length > 5) {
    warnings.push("Managing too many different crops may reduce efficiency");
  }
  
  // 玩家类型判断
  let playerArchetype = "Balanced Farmer";
  if (playerStatus.gold < 200) {
    playerArchetype = "Resource-Constrained Starter";
  } else if (playerStatus.gold > 1000) {
    playerArchetype = "Capital-Rich Expander";
  }
  
  return {
    immediateActions,
    midTermGoals,
    hiddenOpportunities,
    warnings,
    playerArchetype
  };
}