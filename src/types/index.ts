// /src/types/index.ts
// 核心数据模型定义

/**
 * 游戏物品基础接口
 */
export interface GameItem {
  id: number;
  name: string;
  display_name: string;
  tier: 'Common' | 'Uncommon' | 'Rare' | 'Legendary';
  source: string;
  obtainable?: boolean;
  prices?: Record<string, number>;
}

/**
 * 作物特定属性
 */
export interface Crop extends GameItem {
  multi_harvest: boolean;
  growth_time?: number; // 小时
  harvest_count?: number;
  season_bonus?: string[];
  base_price?: number;
  sell_price?: number;
  xp_reward?: number;
}

/**
 * 宠物特定属性
 */
export interface Pet extends GameItem {
  bonus_type?: 'growth_speed' | 'gold_multiplier' | 'xp_multiplier' | 'special';
  bonus_value?: number;
  range?: number;
  special_effect?: string;
  attraction_items?: string[];
}

/**
 * 详细物品信息（用于分析）
 */
export interface DetailedItem {
  name: string;
  quantity: number;
  properties: string[];
}

/**
 * 玩家状态
 */
export interface PlayerStatus {
  level: number;
  gold: number;
  xp: number;
  inGameDate: string;
  season: 'Spring' | 'Summer' | 'Autumn' | 'Winter';
  day: number;
}

/**
 * 交互模式
 */
export enum InteractionMode {
  BEGINNER = 'beginner',
  ADVANCED = 'advanced',
  EXPERT = 'expert'
}

/**
 * 专家模式选项
 */
export interface ExpertOptions {
  optimizationGoal?: 'profit' | 'xp' | 'speed' | 'balanced';
  riskTolerance?: 'conservative' | 'moderate' | 'aggressive';
  timeHorizon?: 'short' | 'medium' | 'long';
}

/**
 * 分析请求
 */
export interface AnalysisRequest {
  selectedItems: Record<string, number>;
  gold: number;
  inGameDate: string;
  currentDate: string;
}

/**
 * 增强的分析请求（包含交互模式）
 */
export interface EnhancedAnalysisRequest extends AnalysisRequest {
  interactionMode?: InteractionMode;
  expertOptions?: ExpertOptions;
}

/**
 * 建议点
 */
export interface AdvicePoint {
  action: string;
  reasoning: string;
  tags: string[];
  synergy?: string[];
}

/**
 * 报告部分
 */
export interface ReportSection {
  id: string;
  title: string;
  points: AdvicePoint[];
}

/**
 * 玩家档案
 */
export interface PlayerProfile {
  title: string;
  archetype: string;
  summary: string;
}

/**
 * 页脚分析
 */
export interface FooterAnalysis {
  title: string;
  conclusion: string;
  callToAction: string;
}

/**
 * 分析结果
 */
export interface AnalysisResult {
  reportId: string;
  publicationDate: string;
  mainTitle: string;
  subTitle: string;
  visualAnchor: string;
  playerProfile: PlayerProfile;
  midBreakerQuote: string;
  sections: ReportSection[];
  footerAnalysis: FooterAnalysis;
}

/**
 * 投资组合推荐
 */
export interface PortfolioRecommendation {
  item: string;
  quantity: number;
  priority: 'High' | 'Medium' | 'Low';
  reasoning: string;
}

/**
 * 投资组合分析
 */
export interface PortfolioAnalysis {
  recommendations: PortfolioRecommendation[];
  totalInvestment: number;
  expectedROI: number;
}

/**
 * 作物ROI分析
 */
export interface CropROIAnalysis {
  totalInvestment: number;
  expectedReturn: number;
  roi: number;
  timeToProfit: number;
  riskLevel: 'Low' | 'Medium' | 'High';
}

/**
 * 规则引擎建议
 */
export interface RuleBasedAdvice {
  immediateActions: string[];
  midTermGoals: string[];
  hiddenOpportunities: string[];
  warnings: string[];
  playerArchetype: string;
}

/**
 * 季节加成
 */
export interface SeasonBonus {
  growthSpeed: number;
  goldBonus: number;
  xpBonus: number;
  description: string;
}

/**
 * 投资策略
 */
export interface InvestmentStrategy {
  minROI: number;
  preferredRisk: 'Low' | 'Medium' | 'High';
  allocationRatio: number;
}

/**
 * 应用状态（用于React Context）
 */
export interface AppState {
  selectedItems: Map<number, number>;
  gold: string;
  inGameDate: string;
  isLoading: boolean;
  reportData: AnalysisResult | null;
  interactionMode: string;
  expertOptions: ExpertOptions;
}

/**
 * API错误响应
 */
export interface APIError {
  error: string;
  details?: string;
  code?: string;
}

/**
 * API成功响应
 */
export interface APIResponse<T = any> {
  data?: T;
  success: boolean;
  message?: string;
}

/**
 * 收藏系统相关类型定义
 */

/**
 * 收藏数据结构
 */
export interface FavoritesData {
  crops: string[];
  pets: string[];
  reports: string[];
  lastUpdated: string;
}

/**
 * 收藏物品类型
 */
export type FavoriteItemType = 'crops' | 'pets' | 'reports';

/**
 * 收藏物品信息
 */
export interface FavoriteItem {
  id: string;
  name: string;
  displayName: string;
  tier?: string;
  type: FavoriteItemType;
  addedAt: string;
  // 策略报告特有字段
  reportId?: string;
  publicationDate?: string;
  mainTitle?: string;
  subTitle?: string;
}

/**
 * 收藏上下文类型
 */
export interface FavoritesContextType {
  favorites: FavoritesData;
  addToFavorites: (itemId: string, type: FavoriteItemType) => void;
  removeFromFavorites: (itemId: string, type: FavoriteItemType) => void;
  isFavorite: (itemId: string, type: FavoriteItemType) => boolean;
  getFavoriteCount: () => number;
  getFavoritesByType: (type: FavoriteItemType) => string[];
  clearAllFavorites: () => void;
  isLoading: boolean;
}

/**
 * 收藏按钮属性
 */
export interface FavoriteButtonProps {
  itemId: string;
  itemType: FavoriteItemType;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

/**
 * 收藏徽章属性
 */
export interface FavoritesBadgeProps {
  count: number;
  showZero?: boolean;
  className?: string;
}

/**
 * localStorage 操作结果
 */
export interface StorageResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * 多样式报告系统类型定义
 */

/**
 * 报告样式类型
 */
export type ReportStyleType = 'magazine' | 'minimal' | 'dashboard';

/**
 * 情感调性
 */
export type EmotionalTone = 'professional' | 'casual' | 'playful' | 'intense';

/**
 * 复杂度级别
 */
export type ComplexityLevel = 'minimal' | 'moderate' | 'rich';

/**
 * 响应式断点配置
 */
export interface ResponsiveConfig {
  mobile: {
    maxWidth: number;
    layout: 'single-column' | 'card-stack' | 'minimal';
    fontSize: 'small' | 'medium' | 'large';
  };
  tablet: {
    maxWidth: number;
    layout: 'dual-column' | 'mixed' | 'grid';
    fontSize: 'medium' | 'large';
  };
  desktop: {
    minWidth: number;
    layout: 'multi-column' | 'complex' | 'dashboard';
    fontSize: 'medium' | 'large' | 'extra-large';
  };
}

/**
 * 动画配置
 */
export interface AnimationConfig {
  transitions: {
    duration: number;
    easing: string;
  };
  hover: {
    scale?: number;
    shadow?: 'none' | 'soft' | 'strong';
    transform?: string;
  };
  focus: {
    outline: string;
    background?: string;
  };
}

/**
 * 收藏集成配置
 */
export interface FavoriteIntegrationConfig {
  position: 'top-right' | 'top-left' | 'integrated' | 'floating';
  style: 'bookmark' | 'button' | 'icon' | 'ghost';
  animation: 'fade' | 'slide' | 'scale' | 'fold';
  states: {
    default: {
      color?: string;
      opacity?: number;
      size?: string;
      background?: string;
    };
    favorited: {
      color?: string;
      opacity?: number;
      background?: string;
      icon?: string;
    };
    hover: {
      transform?: string;
      shadow?: string;
      scale?: number;
      opacity?: number;
    };
  };
}

/**
 * 样式配置
 */
export interface StyleConfiguration {
  name: ReportStyleType;
  displayName: string;
  description: string;
  emotionalTone: EmotionalTone;
  complexity: ComplexityLevel;
  favoriteIntegration: FavoriteIntegrationConfig;
  responsiveBreakpoints: ResponsiveConfig;
  animations: AnimationConfig;
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    muted: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    codeFont?: string;
    sizes: {
      h1: string;
      h2: string;
      h3: string;
      body: string;
      small: string;
    };
  };
}

/**
 * 用户上下文
 */
export interface UserContext {
  deviceType: 'mobile' | 'tablet' | 'desktop';
  screenSize: {
    width: number;
    height: number;
  };
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  preferredComplexity: ComplexityLevel;
  accessibilityNeeds?: {
    highContrast?: boolean;
    largeText?: boolean;
    reducedMotion?: boolean;
    screenReader?: boolean;
  };
}

/**
 * 样式使用历史
 */
export interface StyleUsageHistory {
  styleName: ReportStyleType;
  usedAt: string;
  duration: number; // 使用时长（秒）
  deviceType: string;
  satisfaction?: number; // 1-5 评分
}

/**
 * 样式个性化配置
 */
export interface StylePersonalization {
  styleName: ReportStyleType;
  customizations: {
    fontSize?: number;
    colorAdjustments?: Record<string, string>;
    layoutPreferences?: Record<string, any>;
  };
  createdAt: string;
  lastUsed: string;
}

/**
 * 报告核心数据（样式无关）
 */
export interface ReportCoreData {
  reportId: string;
  content: AnalysisResult;
  metadata: {
    generatedAt: string;
    version: string;
    dataSource: string;
    processingTime: number;
  };
  userContext: UserContext;
}

/**
 * 样式适配器接口
 */
export interface StyleAdapter {
  name: ReportStyleType;
  version: string;
  
  /**
   * 将核心数据适配为特定样式的展示数据
   */
  adaptData(coreData: ReportCoreData): any;
  
  /**
   * 获取样式特定的收藏组件
   */
  getFavoriteComponent(): React.ComponentType<any>;
  
  /**
   * 获取样式配置
   */
  getConfiguration(): StyleConfiguration;
  
  /**
   * 验证数据兼容性
   */
  validateData(data: any): boolean;
}

/**
 * 报告样式系统
 */
export interface ReportStyleSystem {
  // 样式无关的核心数据
  coreData: ReportCoreData;
  
  // 样式特定的展示配置
  styleConfigs: Record<ReportStyleType, StyleConfiguration>;
  
  // 用户偏好和历史
  userPreferences: {
    preferredStyle: ReportStyleType;
    styleHistory: StyleUsageHistory[];
    personalizations: StylePersonalization[];
    lastUpdated: string;
  };
}

/**
 * 样式推荐上下文因素
 */
export interface ContextFactors {
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  deviceType: 'mobile' | 'tablet' | 'desktop';
  reportComplexity: 'low' | 'medium' | 'high';
  userHistory: StyleUsageHistory[];
  currentMood?: 'focused' | 'casual' | 'analytical' | 'exploratory';
}

/**
 * 样式推荐结果
 */
export interface StyleRecommendation {
  recommendedStyle: ReportStyleType;
  confidence: number; // 0-1
  reasoning: string;
  alternatives: {
    style: ReportStyleType;
    score: number;
    reason: string;
  }[];
}

/**
 * 样式插件接口
 */
export interface StylePlugin {
  name: string;
  version: string;
  dependencies: string[];
  
  register(): void;
  render(data: ReportCoreData): React.ReactElement;
  getFavoriteComponent(): React.ComponentType<any>;
  getResponsiveConfig(): ResponsiveConfig;
  validate(): boolean;
}

/**
 * 样式切换事件
 */
export interface StyleSwitchEvent {
  fromStyle: ReportStyleType;
  toStyle: ReportStyleType;
  timestamp: string;
  trigger: 'user' | 'auto' | 'recommendation';
  duration?: number;
}

/**
 * 性能指标
 */
export interface PerformanceMetrics {
  styleLoadTime: number;
  renderTime: number;
  interactionDelay: number;
  memoryUsage: number;
  timestamp: string;
}

/**
 * 可访问性配置
 */
export interface AccessibilityConfig {
  colorContrast: {
    normal: number;
    large: number;
  };
  keyboardNavigation: {
    focusIndicators: 'visible' | 'high-contrast';
    tabOrder: 'logical';
    shortcuts: Array<{
      key: string;
      action: string;
      description: string;
    }>;
  };
  screenReader: {
    landmarks: boolean;
    headingStructure: 'hierarchical';
    alternativeText: 'descriptive';
  };
  reducedMotion: {
    respectPreference: boolean;
    fallbackAnimations: 'fade' | 'none';
  };
}