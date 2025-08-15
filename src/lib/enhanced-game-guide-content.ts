// Enhanced Game Guide Content Data
import { 
  GuideContent, 
  GameMechanic, 
  StrategyPhase, 
  ViralStatistics, 
  LocalizationMapping 
} from './enhanced-game-guide-types';

// Professional English Localization Mapping
export const localizationMapping: LocalizationMapping[] = [
  {
    chinese: '金币 (Jīnbì)',
    english: 'Sheckles',
    context: 'Primary in-game currency',
    usage: 'Used to purchase seeds, tools, and land expansions'
  },
  {
    chinese: '突变 (Tūbiàn)',
    english: 'Mutations',
    context: 'Rare crop variants with enhanced value',
    usage: 'Golden, Rainbow, Frozen, and other special crop types'
  },
  {
    chinese: '喷灌器 (Pēnguàn qì)',
    english: 'Sprinklers',
    context: 'Automated watering systems',
    usage: 'Accelerate crop growth and increase mutation chances'
  },
  {
    chinese: '宠物 (Chǒngwù)',
    english: 'Pets',
    context: 'Companion animals providing passive bonuses',
    usage: 'Boost growth speed, increase profits, or enhance mutations'
  },
  {
    chinese: '天气系统 (Tiānqì xìtǒng)',
    english: 'Weather System',
    context: 'Dynamic environmental conditions',
    usage: 'Different weather types trigger specific mutation variants'
  },
  {
    chinese: '幸运宝箱 (Xìngyùn bǎoxiāng)',
    english: 'Loot Boxes',
    context: 'Randomized reward containers',
    usage: 'Primary method for acquiring pets and rare items'
  },
  {
    chinese: '厨房风暴 (Chúfáng fēngbào)',
    english: 'Kitchen Storm',
    context: 'Major content update introducing cooking mechanics',
    usage: 'Pasta recipes, cooking systems, and culinary strategies'
  }
];

// Viral Statistics and Cultural Context
export const viralStatistics: ViralStatistics = {
  peakConcurrentPlayers: 21000000,
  culturalPositioning: "Gen-Alpha's FarmVille",
  comparisonGames: ['Fortnite', 'Minecraft', 'Adopt Me'],
  releaseImpact: 'Became a cultural phenomenon within weeks of release',
  communitySize: 'Millions of active daily players worldwide'
};

// Comprehensive Game Mechanics Database
export const gameMechanics: GameMechanic[] = [
  {
    name: 'Starting Resources',
    chineseTerm: '初始资源',
    englishTerm: 'Starting Capital',
    description: 'Every new player begins with 20 Sheckles to purchase their first seeds and start their farming journey.',
    tips: [
      'Focus on carrots initially - they provide the best return on investment for beginners',
      'Reinvest all profits back into more seeds to compound your growth',
      'Don\'t spend Sheckles on decorations until you have a stable income flow'
    ],
    relatedMechanics: ['Core Gameplay Loop', 'Resource Management', 'Early Game Strategy']
  },
  {
    name: 'Crop Mutations',
    chineseTerm: '作物突变',
    englishTerm: 'Rare Crop Variants',
    description: 'When harvesting crops, there\'s a chance they\'ll mutate into valuable variants like Golden, Rainbow, or Frozen versions worth significantly more Sheckles.',
    tips: [
      'Weather conditions directly influence which mutation types can occur',
      'Sprinklers increase both growth speed and mutation probability',
      'Some pets provide specific mutation bonuses for certain crop types',
      'Rare mutations can be worth 10x or more than regular crops'
    ],
    relatedMechanics: ['Weather System', 'Sprinklers', 'Pets', 'Advanced Strategy']
  },
  {
    name: 'Weather System',
    chineseTerm: '天气系统',
    englishTerm: 'Dynamic Weather Effects',
    description: 'Different weather patterns trigger specific mutation types - thunderstorms might create Lightning variants while snow enables Frozen mutations.',
    tips: [
      'Check weather forecasts to plan your planting schedule',
      'Some mutations only occur during specific weather conditions',
      'Weather changes are predictable, allowing for strategic planning',
      'Combine weather timing with sprinklers for maximum mutation rates'
    ],
    relatedMechanics: ['Crop Mutations', 'Strategic Planning', 'Timing Optimization']
  },
  {
    name: 'Sprinkler Systems',
    chineseTerm: '喷灌系统',
    englishTerm: 'Automated Irrigation',
    description: 'Sprinklers reduce crop growth time and significantly increase the chances of valuable mutations occurring.',
    tips: [
      'Place sprinklers strategically to cover maximum crop area',
      'Upgrade sprinklers for better coverage and stronger mutation bonuses',
      'Combine with favorable weather for optimal results',
      'Calculate ROI - sprinkler cost vs. increased mutation profits'
    ],
    relatedMechanics: ['Crop Mutations', 'Efficiency Optimization', 'Land Management']
  },
  {
    name: 'Pet Companions',
    chineseTerm: '宠物伙伴',
    englishTerm: 'Companion Animals',
    description: 'Pets provide passive bonuses like faster growth, increased profits, or enhanced mutation chances. They\'re acquired through loot boxes.',
    tips: [
      'Different pets specialize in different bonuses - choose based on your strategy',
      'Some pets work better with specific crop types',
      'Pet bonuses stack with sprinkler effects for compound benefits',
      'Invest in loot boxes strategically when you have surplus Sheckles'
    ],
    relatedMechanics: ['Loot Boxes', 'Passive Income', 'Strategic Specialization']
  },
  {
    name: 'Kitchen Storm Update',
    chineseTerm: '厨房风暴更新',
    englishTerm: 'Culinary Expansion',
    description: 'The Kitchen Storm update introduced pasta cooking mechanics, recipes, and new strategic gameplay elements beyond traditional farming.',
    tips: [
      'Learn recipes to create high-value pasta dishes from your crops',
      'Some recipes require specific crop mutations as ingredients',
      'Cooking can provide better profits than selling raw crops',
      'Master the timing - some recipes have optimal cooking windows'
    ],
    relatedMechanics: ['Recipe Management', 'Value-Added Processing', 'Advanced Gameplay']
  }
];

// Strategic Phase Guidance
export const strategyPhases: StrategyPhase[] = [
  {
    phase: 'early',
    title: 'Foundation Building',
    description: 'Focus on establishing a stable Sheckles income through efficient carrot farming.',
    keyActions: [
      'Plant carrots exclusively with your starting 20 Sheckles',
      'Reinvest all profits into more carrot seeds',
      'Learn the basic harvest timing to maximize efficiency',
      'Avoid spending on decorations or premium items initially'
    ],
    expectedOutcomes: [
      'Steady Sheckles income growth',
      'Understanding of core gameplay mechanics',
      'Sufficient capital for mid-game investments'
    ],
    recommendedResources: ['Carrot seeds', 'Basic farming plots'],
    timeframe: 'First 1-2 hours of gameplay'
  },
  {
    phase: 'mid',
    title: 'System Optimization',
    description: 'Invest in sprinklers and pets to boost efficiency and unlock mutation potential.',
    keyActions: [
      'Purchase your first sprinkler system for key farming areas',
      'Open loot boxes to acquire helpful pets',
      'Experiment with different crop types beyond carrots',
      'Start timing plantings with favorable weather conditions'
    ],
    expectedOutcomes: [
      'Increased crop growth speed',
      'First rare mutations and higher profits',
      'Passive bonuses from pet companions',
      'More diverse and resilient farming operation'
    ],
    recommendedResources: ['Sprinklers', 'Loot boxes', 'Premium seeds', 'Weather tracking'],
    timeframe: '2-10 hours of gameplay'
  },
  {
    phase: 'late',
    title: 'Advanced Mastery',
    description: 'Participate in weekly events, master Kitchen Storm recipes, and optimize for rare mutations.',
    keyActions: [
      'Engage with weekly events for exclusive seeds and items',
      'Master pasta cooking recipes for value-added processing',
      'Optimize pet and sprinkler combinations for specific mutations',
      'Expand land holdings for larger-scale operations'
    ],
    expectedOutcomes: [
      'Access to exclusive and limited-time content',
      'Mastery of advanced cooking mechanics',
      'Consistent rare mutation production',
      'Large-scale, highly profitable farming empire'
    ],
    recommendedResources: ['Event participation', 'Recipe ingredients', 'Land expansions', 'Premium pets'],
    timeframe: '10+ hours of gameplay'
  },
  {
    phase: 'ongoing',
    title: 'Community Engagement',
    description: 'Maintain idle profit systems while engaging in community trading and social features.',
    keyActions: [
      'Set up automated systems for passive income',
      'Trade rare mutations with other players',
      'Gift valuable crops to friends and community members',
      'Stay updated with new content releases and events'
    ],
    expectedOutcomes: [
      'Sustainable passive income generation',
      'Strong community relationships and trading networks',
      'Access to rare items through social interactions',
      'Long-term engagement with evolving game content'
    ],
    recommendedResources: ['Trading marketplace', 'Social features', 'Community events', 'Content updates'],
    timeframe: 'Continuous engagement'
  }
];

// Comprehensive Glossary
export const gameGlossary: Record<string, string> = {
  'Sheckles': 'The primary in-game currency used to purchase seeds, tools, and expansions',
  'Mutations': 'Rare crop variants (Golden, Rainbow, Frozen) worth significantly more than regular crops',
  'Sprinklers': 'Automated watering systems that accelerate growth and increase mutation chances',
  'Pets': 'Companion animals providing passive bonuses like faster growth or increased profits',
  'Loot Boxes': 'Randomized reward containers that primarily contain pets and rare items',
  'Weather System': 'Dynamic environmental conditions that trigger specific mutation types',
  'Kitchen Storm': 'Major update introducing pasta cooking mechanics and recipe systems',
  'Gen-Alpha\'s FarmVille': 'Cultural positioning describing the game\'s appeal to younger generations',
  'Viral Phenomenon': 'The game\'s explosive growth to 21+ million concurrent players',
  'Idle Mechanics': 'Systems that continue generating progress even when offline',
  'Trading Marketplace': 'Community feature for exchanging valuable items between players',
  'Weekly Events': 'Limited-time content offering exclusive seeds, decorations, and items',
  'Land Expansion': 'Purchasing additional farming plots to increase production capacity',
  'Passive Income': 'Automated systems that generate Sheckles without active player input',
  'Mutation Rates': 'The probability of crops developing into rare variants during harvest',
  'Recipe Mastery': 'Learning and optimizing pasta cooking combinations for maximum profit',
  'Community Trading': 'Social system for sharing and exchanging rare crops with other players',
  'Strategic Timing': 'Coordinating planting schedules with weather patterns for optimal results'
};

// Complete Guide Content Structure
export const enhancedGuideContent: Omit<GuideContent, 'sections'> = {
  mechanics: gameMechanics,
  strategies: strategyPhases,
  glossary: gameGlossary,
  viralStats: viralStatistics
};