'use client';

import React, { useState, useEffect } from 'react';
import {
  PlayerLevelType,
  OnboardingFlowType,
  OnboardingStep,
  PlayerLevel,
  Goal,
  UserProfile,
  OnboardingState,
  UserPreferences,
  PlayerLevelOnboardingProps,
  ONBOARDING_STORAGE_KEYS
} from '@/types';
import { onboardingStorage } from '@/lib/onboarding-storage';
import { onboardingValidation } from '@/lib/onboarding-validation';
import OnboardingErrorBoundary from '@/app/components/ui/OnboardingErrorBoundary';
import {
  ResponsiveContainer,
  ResponsiveGrid,
  ResponsiveCard,
  ResponsiveModalBackdrop,
  ResponsiveText,
  ResponsiveButton,
  ResponsiveProgress,
  ResponsiveSpacing,
  useIsMobile
} from '@/app/components/ui/ResponsiveOnboardingLayout';

/**
 * 玩家水平定义数据
 */
const playerLevels: Record<PlayerLevelType, PlayerLevel> = {
  beginner: {
    title: "Beginner",
    icon: "🌱",
    description: "New to the game, need step-by-step guidance",
    features: ["Simple recommendations", "Basic tutorials", "Safe strategies"]
  },
  advanced: {
    title: "Advanced", 
    icon: "🗺️",
    description: "Experienced player, want strategic analysis",
    features: ["Detailed analysis", "Multiple options", "Risk assessment"]
  },
  expert: {
    title: "Expert",
    icon: "⚡",
    description: "Pro player, need comprehensive customizable analysis",
    features: ["Full customization", "Advanced metrics", "Complex strategies"]
  }
};

/**
 * 根据玩家水平生成目标选项
 * 实现动态目标选择系统，根据不同经验水平提供适合的目标选项
 */
const getGoalsForLevel = (level: PlayerLevelType): Record<string, Goal> => {
  const baseGoals = {
    profit: { 
      title: "Maximize Profit", 
      icon: "💰", 
      description: "Focus on gold income",
      recommendation: ""
    },
    speed: { 
      title: "Fast Growth", 
      icon: "⚡", 
      description: "Quick leveling and unlocks",
      recommendation: ""
    },
    balance: { 
      title: "Balanced Strategy", 
      icon: "⚖️", 
      description: "Steady progress",
      recommendation: ""
    },
    xp: {
      title: "XP Efficiency",
      icon: "📈",
      description: "Maximize experience gain",
      recommendation: ""
    }
  };

  switch(level) {
    case 'beginner':
      // 需求 2.1: Beginner显示2个简化的目标选项：Maximize Profit和Balanced Strategy
      return {
        profit: { 
          ...baseGoals.profit, 
          recommendation: "Ancient Fruit - Safe and profitable" // 需求 2.2
        },
        balance: { 
          ...baseGoals.balance, 
          recommendation: "Blueberries - Perfect for learning" // 需求 2.3
        }
      };
    case 'advanced':
      // 需求 2.4: Advanced显示3个策略目标：Maximize Profit、Fast Growth、Balanced Strategy
      return {
        profit: { 
          ...baseGoals.profit, 
          recommendation: "Optimized crop rotation strategy" // 需求 2.5
        },
        speed: { 
          ...baseGoals.speed, 
          recommendation: "Coffee + Speed pets combo" // 需求 2.5
        },
        balance: { 
          ...baseGoals.balance, 
          recommendation: "Diversified portfolio approach" // 需求 2.5
        }
      };
    case 'expert':
      // 需求 2.6: Expert显示4个目标包括Custom Strategy选项
      return {
        profit: { 
          ...baseGoals.profit, 
          recommendation: "Custom profit optimization" // 需求 2.7
        },
        speed: { 
          ...baseGoals.speed, 
          recommendation: "Advanced speed optimization" // 需求 2.7
        },
        xp: {
          ...baseGoals.xp,
          recommendation: "Advanced XP efficiency" // 需求 2.7
        },
        custom: { 
          title: "Custom Strategy", 
          icon: "🎯", 
          description: "Define your own parameters",
          recommendation: "Fully customizable analysis" // 需求 2.7
        }
      };
    default:
      return {};
  }
};

/**
 * 获取目标选择的详细说明文本
 * 根据玩家水平提供个性化的说明
 */
const getGoalSelectionDescription = (level: PlayerLevelType): string => {
  switch(level) {
    case 'beginner':
      return "We've simplified the options to help you get started without feeling overwhelmed";
    case 'advanced':
      return "Choose from strategic options that match your experience level";
    case 'expert':
      return "Full range of optimization goals including custom parameters";
    default:
      return "Choose your preferred strategy approach";
  }
};

/**
 * 获取目标数量的描述文本
 */
const getGoalCountDescription = (level: PlayerLevelType): string => {
  const goalCount = Object.keys(getGoalsForLevel(level)).length;
  switch(level) {
    case 'beginner':
      return `${goalCount} focused options`;
    case 'advanced':
      return `${goalCount} strategic choices`;
    case 'expert':
      return `${goalCount} optimization paths`;
    default:
      return `${goalCount} options`;
  }
};

/**
 * 获取个性化的成功消息
 */
const getSuccessMessage = (level: PlayerLevelType, goalKey: string): string => {
  const goalTitle = getGoalsForLevel(level)[goalKey]?.title || 'your goal';
  const levelTitle = playerLevels[level]?.title || 'player';
  
  switch(level) {
    case 'beginner':
      return `Great choice! ${goalTitle} is perfect for new players like you.`;
    case 'advanced':
      return `Excellent selection! ${goalTitle} matches your strategic mindset.`;
    case 'expert':
      return `Outstanding! ${goalTitle} will unlock your full potential.`;
    default:
      return `Perfect match! You've selected ${goalTitle} as a ${levelTitle} player.`;
  }
};

/**
 * 获取个性化的路径描述
 */
const getPersonalizedPathDescription = (level: PlayerLevelType, goalKey: string): {
  title: string;
  description: string;
  features: string[];
  nextSteps: string[];
} => {
  const baseDescriptions = {
    beginner: {
      title: "Simple Step-by-Step Tutorial",
      description: "You'll be guided through a carefully designed learning path",
      features: [
        "Basic game mechanics explained clearly",
        "Safe and profitable crop recommendations", 
        "Simple strategies to get you started",
        "Built-in safety nets to prevent mistakes"
      ],
      nextSteps: [
        "Start with the tutorial introduction",
        "Learn basic farming concepts",
        "Practice with recommended crops",
        "Build confidence with guided decisions"
      ]
    },
    advanced: {
      title: "Strategic Item Selection Interface", 
      description: "You'll access powerful analysis tools for strategic planning",
      features: [
        "Detailed analysis of your choices",
        "Multiple strategic options to consider",
        "Risk assessment for different approaches",
        "Advanced filtering and comparison tools"
      ],
      nextSteps: [
        "Access the strategic dashboard",
        "Review available optimization options",
        "Compare different strategic approaches",
        "Make informed decisions with data"
      ]
    },
    expert: {
      title: "Full Customization Dashboard",
      description: "You'll enter the complete control center for advanced optimization",
      features: [
        "Complete control over all parameters",
        "Advanced metrics and optimization tools", 
        "Complex multi-objective strategies",
        "Custom algorithm configuration"
      ],
      nextSteps: [
        "Configure your optimization parameters",
        "Set up custom analysis criteria",
        "Define multi-objective goals",
        "Launch advanced optimization engine"
      ]
    }
  };

  const base = baseDescriptions[level];
  
  // Customize based on selected goal
  if (goalKey === 'custom' && level === 'expert') {
    return {
      ...base,
      title: "Custom Strategy Configuration",
      description: "You'll design your own optimization strategy from scratch",
      features: [
        ...base.features,
        "Custom parameter definition",
        "Algorithm selection and tuning",
        "Personalized success metrics"
      ]
    };
  }

  return base;
};

/**
 * 获取流程特定的图标
 */
const getFlowIcon = (level: PlayerLevelType): string => {
  switch(level) {
    case 'beginner':
      return '🎓'; // Graduation cap for learning
    case 'advanced': 
      return '🎯'; // Target for strategic focus
    case 'expert':
      return '⚙️'; // Gear for customization
    default:
      return '🚀'; // Rocket for journey
  }
};

/**
 * 获取预计完成时间
 */
const getEstimatedTime = (level: PlayerLevelType): string => {
  switch(level) {
    case 'beginner':
      return '5-10 minutes';
    case 'advanced':
      return '2-5 minutes';
    case 'expert':
      return '1-3 minutes';
    default:
      return '3-7 minutes';
  }
};

/**
 * 根据玩家水平获取对应的流程
 * 实现需求4.1-4.3的流程路由映射
 */
const getFlowForLevel = (level: PlayerLevelType): OnboardingFlowType => {
  const flowMapping: Record<PlayerLevelType, OnboardingFlowType> = {
    'beginner': 'beginner-guide',    // 需求 4.1
    'advanced': 'item-selection',    // 需求 4.2
    'expert': 'full-configuration'   // 需求 4.3
  };
  return flowMapping[level] || 'item-selection';
};

/**
 * 验证用户配置的完整性
 * 确保路由前所有必需信息都已收集
 */
const validateUserProfile = (profile: Partial<UserProfile>): profile is UserProfile => {
  return !!(
    profile.level && 
    profile.goal && 
    profile.flow &&
    ['beginner', 'advanced', 'expert'].includes(profile.level) &&
    ['beginner-guide', 'item-selection', 'full-configuration'].includes(profile.flow)
  );
};

/**
 * 创建完整的用户配置对象
 * 需求 4.4: 传递完整的用户配置信息
 */
const createUserProfile = (level: PlayerLevelType, goal: string): UserProfile => {
  return {
    level,
    goal,
    flow: getFlowForLevel(level)
  };
};

/**
 * 获取路由失败时的降级选项
 * 需求 4.5: 路由失败时的降级处理
 */
const getFallbackFlow = (): OnboardingFlowType => {
  return 'item-selection'; // 默认到中级界面
};

/**
 * 路由执行前的预检查
 */
const validateRouting = (level: PlayerLevelType, goal: string): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 检查必需参数
  if (!level) {
    errors.push('Player level is required');
  }
  if (!goal) {
    errors.push('Goal selection is required');
  }

  // 检查有效性
  if (level && !['beginner', 'advanced', 'expert'].includes(level)) {
    errors.push(`Invalid player level: ${level}`);
  }

  // 检查目标与水平的匹配性
  if (level && goal) {
    const availableGoals = Object.keys(getGoalsForLevel(level));
    if (!availableGoals.includes(goal)) {
      warnings.push(`Goal "${goal}" may not be optimal for ${level} level`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * PlayerLevelOnboarding 主组件
 * 
 * 实现基于玩家经验水平的个性化引导系统
 * 包含三个步骤：经验水平选择 → 目标选择 → 结果展示
 */
const PlayerLevelOnboarding: React.FC<PlayerLevelOnboardingProps> = ({
  onComplete,
  onSkip
}) => {
  // 组件状态管理
  const [state, setState] = useState<OnboardingState>({
    step: 'level-selection',
    selectedLevel: null,
    selectedGoal: null,
    isCompleted: false
  });

  // 检查是否已完成引导并恢复状态
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        // 需求 8.2: 执行数据健康检查
        const healthCheck = onboardingValidation.performDataHealthCheck();
        
        if (!healthCheck.healthy) {
          console.warn('Data health issues detected:', healthCheck.issues);
          
          // 尝试自动恢复
          const recovery = onboardingValidation.recoverCorruptedData();
          if (recovery.recovered) {
            console.log('Data recovery successful:', recovery.warnings);
          } else if (recovery.errors.length > 0) {
            console.error('Data recovery failed:', recovery.errors);
            // 清理无效数据
            onboardingValidation.cleanupInvalidData();
          }
        }

        // 需求 7.2: 检查是否已完成引导
        if (onboardingStorage.isCompleted()) {
          const userPrefs = onboardingStorage.load();
          if (userPrefs) {
            // 验证用户偏好数据
            const validation = onboardingValidation.validateUserPreferences(userPrefs);
            
            if (validation.success || validation.recovered) {
              const validPrefs = validation.data;
              console.log('Found completed onboarding, routing to previous flow:', validPrefs);
              
              // 如果数据被恢复，保存修复后的数据
              if (validation.recovered) {
                onboardingStorage.save(validPrefs);
              }
              
              // 需求 7.3: 直接进入用户上次选择的流程
              onComplete({
                level: validPrefs.level,
                goal: validPrefs.goal,
                flow: validPrefs.flow
              });
              return;
            } else {
              console.warn('Invalid user preferences, clearing and restarting onboarding');
              onboardingStorage.clear();
            }
          }
        }

        // 尝试恢复未完成的引导状态
        const partialState = onboardingStorage.loadPartial();
        if (partialState) {
          // 验证部分状态数据
          const validation = onboardingValidation.validateOnboardingState(partialState);
          
          if (validation.success || validation.recovered) {
            const validState = validation.data;
            console.log('Restoring partial onboarding state:', validState);
            
            // 如果数据被恢复，保存修复后的数据
            if (validation.recovered) {
              onboardingStorage.savePartial(validState);
            }
            
            setState(prev => ({
              ...prev,
              selectedLevel: validState.selectedLevel || null,
              selectedGoal: validState.selectedGoal || null,
              step: validState.step || 'level-selection'
            }));
          } else {
            console.warn('Invalid partial state, clearing and starting fresh');
            onboardingStorage.clearPartial();
          }
        }
      } catch (error) {
        console.error('Error during onboarding status check:', error);
        
        // 需求 8.4: 路由失败时的安全降级
        // 如果检查过程出错，清理所有数据并重新开始
        try {
          onboardingStorage.clear();
          console.log('Cleared corrupted data, starting fresh onboarding');
        } catch (clearError) {
          console.error('Failed to clear corrupted data:', clearError);
          // 如果连清理都失败，至少确保组件能正常显示
        }
      }
    };

    checkOnboardingStatus();
  }, [onComplete]);

  // 保存部分状态到localStorage (需求 5.5: 保持选择状态)
  useEffect(() => {
    // 只在有选择时保存状态
    if (state.selectedLevel || state.selectedGoal) {
      onboardingStorage.savePartial(state);
    }
  }, [state.step, state.selectedLevel, state.selectedGoal]);

  /**
   * 处理水平选择
   */
  const handleLevelSelect = (level: PlayerLevelType) => {
    setState(prev => ({
      ...prev,
      selectedLevel: level,
      step: 'goal-selection',
      selectedGoal: null // 重置目标选择
    }));
  };

  /**
   * 处理目标选择
   */
  const handleGoalSelect = (goalKey: string) => {
    setState(prev => ({
      ...prev,
      selectedGoal: goalKey,
      step: 'result'
    }));
  };

  /**
   * 处理返回到水平选择
   * 需求 5.1: 提供"Back to level selection"选项
   * 需求 5.5: 导航时保持选择状态
   */
  const handleBackToLevelSelection = () => {
    console.log('Navigating back to level selection');
    setState(prev => ({
      ...prev,
      step: 'level-selection',
      selectedGoal: null // 清除目标选择，但保持水平选择
    }));
  };

  /**
   * 处理返回到目标选择
   * 需求 5.3: 提供"Change Goal"选项返回目标选择
   * 需求 5.5: 导航时保持选择状态
   */
  const handleBackToGoalSelection = () => {
    console.log('Navigating back to goal selection');
    setState(prev => ({
      ...prev,
      step: 'goal-selection'
      // 保持 selectedLevel 和 selectedGoal，允许用户重新选择
    }));
  };

  /**
   * 处理重置整个引导流程
   */
  const handleResetOnboarding = () => {
    console.log('Resetting onboarding flow');
    setState({
      step: 'level-selection',
      selectedLevel: null,
      selectedGoal: null,
      isCompleted: false
    });
  };

  /**
   * 处理键盘导航
   */
  const handleKeyNavigation = (event: KeyboardEvent) => {
    switch(event.key) {
      case 'Escape':
        if (state.step !== 'level-selection') {
          event.preventDefault();
          if (state.step === 'goal-selection') {
            handleBackToLevelSelection();
          } else if (state.step === 'result') {
            handleBackToGoalSelection();
          }
        }
        break;
      case 'Enter':
        // 可以在这里添加快捷键确认逻辑
        break;
    }
  };

  // 添加键盘事件监听
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      handleKeyNavigation(event);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [state.step]);

  /**
   * 获取当前步骤的导航选项
   */
  const getNavigationOptions = () => {
    const options = [];
    
    switch(state.step) {
      case 'level-selection':
        options.push({
          label: 'Skip Guide',
          action: handleSkip,
          type: 'secondary' as const,
          icon: '⏭️'
        });
        break;
        
      case 'goal-selection':
        options.push({
          label: 'Back to Level Selection',
          action: handleBackToLevelSelection,
          type: 'secondary' as const,
          icon: '←'
        });
        options.push({
          label: 'Skip Guide',
          action: handleSkip,
          type: 'secondary' as const,
          icon: '⏭️'
        });
        break;
        
      case 'result':
        options.push({
          label: 'Change Goal',
          action: handleBackToGoalSelection,
          type: 'secondary' as const,
          icon: '←'
        });
        options.push({
          label: 'Change Level',
          action: handleBackToLevelSelection,
          type: 'secondary' as const,
          icon: '↶'
        });
        options.push({
          label: 'Start Over',
          action: handleResetOnboarding,
          type: 'tertiary' as const,
          icon: '🔄'
        });
        break;
    }
    
    return options;
  };

  /**
   * 处理引导完成
   * 实现完整的流程路由系统
   */
  const handleComplete = () => {
    if (!state.selectedLevel || !state.selectedGoal) {
      console.error('Missing required selections for routing');
      return;
    }

    // 执行路由前验证 (需求 4.4)
    const validation = validateRouting(state.selectedLevel, state.selectedGoal);
    
    if (!validation.isValid) {
      console.error('Routing validation failed:', validation.errors);
      // 可以在这里显示错误消息给用户
      return;
    }

    // 记录警告但不阻塞流程
    if (validation.warnings.length > 0) {
      console.warn('Routing warnings:', validation.warnings);
    }

    // 创建用户配置 (需求 4.4: 传递完整信息)
    let userProfile: UserProfile;
    
    try {
      userProfile = createUserProfile(state.selectedLevel, state.selectedGoal);
      
      // 验证配置完整性
      if (!validateUserProfile(userProfile)) {
        throw new Error('Invalid user profile configuration');
      }
    } catch (error) {
      console.error('Failed to create user profile:', error);
      
      // 降级处理 (需求 4.5)
      userProfile = {
        level: state.selectedLevel,
        goal: state.selectedGoal,
        flow: getFallbackFlow()
      };
      
      console.warn('Using fallback flow:', userProfile.flow);
    }

    // 保存用户偏好到localStorage
    const saveSuccess = onboardingStorage.save(userProfile);
    if (saveSuccess) {
      // 清除部分状态，因为引导已完成
      onboardingStorage.clearPartial();
    } else {
      console.warn('Failed to save user preferences, continuing with session-only state');
      // 继续执行，不阻塞用户体验
    }

    // 记录路由信息用于调试
    console.log('Routing user to flow:', {
      level: userProfile.level,
      goal: userProfile.goal,
      flow: userProfile.flow,
      timestamp: new Date().toISOString()
    });

    // 更新状态并执行路由 (需求 4.5: 确保目标界面接收完整信息)
    setState(prev => ({ ...prev, isCompleted: true }));
    
    try {
      onComplete(userProfile);
    } catch (error) {
      console.error('Routing callback failed:', error);
      
      // 如果主要路由失败，尝试降级路由
      const fallbackProfile: UserProfile = {
        ...userProfile,
        flow: getFallbackFlow()
      };
      
      console.warn('Attempting fallback routing:', fallbackProfile);
      onComplete(fallbackProfile);
    }
  };

  /**
   * 处理跳过引导
   * 需求 5.4: 跳过时直接进入默认主界面
   */
  const handleSkip = () => {
    console.log('User skipped onboarding');
    
    // 记录跳过事件
    const skipSuccess = onboardingStorage.recordSkip(state);
    if (!skipSuccess) {
      console.warn('Failed to record skip event, continuing anyway');
    }
    
    onSkip();
  };

  const isMobile = useIsMobile();

  // 渲染占位符内容（实际UI将在后续任务中实现）
  return (
    <ResponsiveModalBackdrop>
      <ResponsiveCard variant="default" size="lg" className="w-full">
        <div className="text-center mb-6">
          <ResponsiveText variant="h1" className="mb-4">
            Welcome to Garden Growth Advisor
          </ResponsiveText>
          <ResponsiveText variant="body" color="secondary" className="max-w-2xl mx-auto">
            Let's personalize your experience based on your gaming level
          </ResponsiveText>
        </div>

        {/* 步骤指示器和进度保存状态 */}
        <ResponsiveProgress 
          steps={['Level', 'Goal', 'Result']}
          currentStep={(['level-selection', 'goal-selection', 'result'] as OnboardingStep[]).indexOf(state.step)}
        />
        
        {/* 进度保存指示器 */}
        {(state.selectedLevel || state.selectedGoal) && (
          <div className="flex items-center justify-center text-xs text-gray-500 mb-4">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            <span>Progress automatically saved</span>
          </div>
        )}

        {/* 当前步骤内容 */}
        <div className="min-h-[400px]">
          {state.step === 'level-selection' && (
            <div>
              <div className="text-center mb-8">
                <ResponsiveText variant="h2" className="mb-3">
                  What's your experience level?
                </ResponsiveText>
                <ResponsiveText variant="body" color="secondary" className="max-w-2xl mx-auto">
                  Choose your gaming experience to get personalized recommendations and guidance
                </ResponsiveText>
              </div>
              
              {/* 响应式网格布局 */}
              <ResponsiveGrid itemCount={3} maxWidth="6xl">
                {Object.entries(playerLevels).map(([key, level]) => (
                  <ResponsiveCard
                    key={key}
                    variant="default"
                    size="lg"
                    interactive={true}
                    className="group relative"
                  >
                    <button
                      onClick={() => handleLevelSelect(key as PlayerLevelType)}
                      className="w-full text-left focus:outline-none"
                    >
                      {/* 图标和标题区域 */}
                      <div className="flex items-center mb-4">
                        <div className="text-3xl sm:text-4xl lg:text-5xl mr-3 sm:mr-4 transform group-hover:scale-110 transition-transform duration-300">
                          {level.icon}
                        </div>
                        <div className="flex-1">
                          <ResponsiveText variant="h3" className="mb-1 group-hover:text-blue-700 transition-colors">
                            {level.title}
                          </ResponsiveText>
                          <div className="w-8 sm:w-12 h-1 bg-blue-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                        </div>
                      </div>
                      
                      {/* 描述文本 */}
                      <ResponsiveText variant="body" color="secondary" className="mb-6 group-hover:text-gray-700">
                        {level.description}
                      </ResponsiveText>
                      
                      {/* 特性列表 */}
                      <div className="space-y-3">
                        <ResponsiveText variant="small" className="font-semibold text-gray-800 uppercase tracking-wide">
                          What you'll get:
                        </ResponsiveText>
                        <ul className="space-y-2">
                          {level.features.map((feature, index) => (
                            <li key={index} className="flex items-center">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0 
                                            transform group-hover:scale-125 transition-transform duration-200"
                                   style={{ animationDelay: `${index * 100}ms` }}>
                              </div>
                              <ResponsiveText variant="caption" className="font-medium group-hover:text-gray-700">
                                {feature}
                              </ResponsiveText>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* Selection indicator */}
                      <div className="absolute top-2 sm:top-4 right-2 sm:right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </button>
                  </ResponsiveCard>
                ))}
              </ResponsiveGrid>
              
              {/* 底部提示 */}
              <div className="text-center mt-6 sm:mt-8">
                <ResponsiveText variant="caption" color="muted">
                  Don't worry, you can always change this later in your settings
                </ResponsiveText>
              </div>
            </div>
          )}

          {state.step === 'goal-selection' && state.selectedLevel && (
            <div>
              <div className="text-center mb-8">
                <ResponsiveText variant="h2" className="mb-3">
                  What's your main goal?
                </ResponsiveText>
                <div className="flex items-center justify-center mb-4">
                  <div className="flex items-center bg-blue-50 px-4 py-2 rounded-full">
                    <span className="text-2xl mr-2">{playerLevels[state.selectedLevel].icon}</span>
                    <span className="text-blue-700 font-semibold">
                      {playerLevels[state.selectedLevel].title} Player
                    </span>
                  </div>
                </div>
                <ResponsiveText variant="body" color="secondary" className="max-w-2xl mx-auto mb-2">
                  {getGoalSelectionDescription(state.selectedLevel)}
                </ResponsiveText>
                <div className="flex items-center justify-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    {getGoalCountDescription(state.selectedLevel)}
                  </span>
                </div>
              </div>
              
              {/* 动态网格布局 - 根据选项数量调整 */}
              <ResponsiveGrid 
                itemCount={Object.keys(getGoalsForLevel(state.selectedLevel)).length}
                maxWidth="4xl"
              >
                {Object.entries(getGoalsForLevel(state.selectedLevel)).map(([key, goal]) => (
                  <ResponsiveCard
                    key={key}
                    variant={key === 'custom' ? 'gradient' : 'default'}
                    size="md"
                    interactive={true}
                    className="group relative"
                  >
                    <button
                      onClick={() => handleGoalSelect(key)}
                      className="w-full text-left focus:outline-none"
                    >
                      {/* 图标和标题 */}
                      <div className="flex items-center mb-4">
                        <div className="text-2xl sm:text-3xl mr-3 transform group-hover:scale-110 transition-transform duration-300">
                          {goal.icon}
                        </div>
                        <div className="flex-1">
                          <ResponsiveText 
                            variant="h4" 
                            className={`transition-colors ${
                              key === 'custom' ? 'group-hover:text-purple-700' : 'group-hover:text-blue-700'
                            }`}
                          >
                            {goal.title}
                            {key === 'custom' && (
                              <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                Advanced
                              </span>
                            )}
                          </ResponsiveText>
                        </div>
                      </div>
                      
                      {/* 描述 */}
                      <ResponsiveText variant="caption" color="secondary" className="mb-4 group-hover:text-gray-700">
                        {goal.description}
                      </ResponsiveText>
                      
                      {/* 推荐信息 */}
                      <div className={`rounded-lg p-3 border-l-4 transition-colors ${
                        key === 'custom' 
                          ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-500 group-hover:border-purple-600'
                          : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-500 group-hover:border-blue-600'
                      }`}>
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mr-2">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                              key === 'custom' 
                                ? 'bg-purple-500 group-hover:bg-purple-600'
                                : 'bg-blue-500 group-hover:bg-blue-600'
                            }`}>
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {key === 'custom' ? (
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                ) : (
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                )}
                              </svg>
                            </div>
                          </div>
                          <div className="flex-1">
                            <p className={`text-sm font-medium transition-colors ${
                              key === 'custom' 
                                ? 'text-purple-700 group-hover:text-purple-800'
                                : 'text-blue-700 group-hover:text-blue-800'
                            }`}>
                              {goal.recommendation}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* 适合度指示器 */}
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-xs text-gray-500 mr-2">Perfect for {playerLevels[state.selectedLevel].title.toLowerCase()}s</span>
                          <div className="flex space-x-1">
                            {[1, 2, 3].map((star) => (
                              <svg key={star} className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                              </svg>
                            ))}
                          </div>
                        </div>
                        <div className="text-xs text-green-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                          Recommended ✓
                        </div>
                      </div>
                      
                      {/* Selection indicator */}
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                    </button>
                  </ResponsiveCard>
                ))}
              </ResponsiveGrid>
              
              {/* 导航按钮 */}
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleBackToLevelSelection}
                  className="flex items-center px-6 py-3 text-blue-600 hover:text-blue-800 
                           hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to level selection
                </button>
              </div>
            </div>
          )}

          {state.step === 'result' && state.selectedLevel && state.selectedGoal && (
            <div className="text-center max-w-4xl mx-auto">
              {/* 成功动画和图标 */}
              <div className="mb-8">
                <div className="relative inline-block">
                  <div className="text-8xl mb-4 animate-bounce">
                    {getGoalsForLevel(state.selectedLevel)[state.selectedGoal]?.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                
                <h2 className="text-4xl font-bold text-gray-900 mb-3">Perfect Match!</h2>
                <p className="text-xl text-gray-600 mb-4 leading-relaxed">
                  {getSuccessMessage(state.selectedLevel, state.selectedGoal)}
                </p>
                
                {/* 选择摘要 */}
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="flex items-center bg-blue-50 px-4 py-2 rounded-full">
                    <span className="text-2xl mr-2">{playerLevels[state.selectedLevel].icon}</span>
                    <span className="text-blue-700 font-semibold">
                      {playerLevels[state.selectedLevel].title}
                    </span>
                  </div>
                  <div className="text-gray-400">+</div>
                  <div className="flex items-center bg-green-50 px-4 py-2 rounded-full">
                    <span className="text-2xl mr-2">{getGoalsForLevel(state.selectedLevel)[state.selectedGoal]?.icon}</span>
                    <span className="text-green-700 font-semibold">
                      {getGoalsForLevel(state.selectedLevel)[state.selectedGoal]?.title}
                    </span>
                  </div>
                </div>
              </div>

              {/* 个性化路径说明 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* 左侧：路径详情 */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                      <span className="text-2xl">{getFlowIcon(state.selectedLevel)}</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">What happens next?</h3>
                      <p className="text-blue-600 text-sm font-medium">
                        Estimated time: {getEstimatedTime(state.selectedLevel)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-left">
                    {(() => {
                      const pathInfo = getPersonalizedPathDescription(state.selectedLevel, state.selectedGoal);
                      return (
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-xl font-semibold text-gray-900 mb-2">
                              {pathInfo.title}
                            </h4>
                            <p className="text-gray-700 leading-relaxed">
                              {pathInfo.description}
                            </p>
                          </div>
                          
                          <div>
                            <h5 className="font-semibold text-gray-800 mb-3">What you'll get:</h5>
                            <ul className="space-y-2">
                              {pathInfo.features.map((feature, index) => (
                                <li key={index} className="flex items-start text-gray-600">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                  <span className="text-sm">{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* 右侧：下一步预览 */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Your Journey</h3>
                      <p className="text-green-600 text-sm font-medium">
                        Personalized for {playerLevels[state.selectedLevel].title} players
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-left">
                    {(() => {
                      const pathInfo = getPersonalizedPathDescription(state.selectedLevel, state.selectedGoal);
                      return (
                        <div className="space-y-4">
                          <div>
                            <h5 className="font-semibold text-gray-800 mb-3">Your next steps:</h5>
                            <ol className="space-y-3">
                              {pathInfo.nextSteps.map((step, index) => (
                                <li key={index} className="flex items-start text-gray-600">
                                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0 mt-0.5">
                                    {index + 1}
                                  </div>
                                  <span className="text-sm">{step}</span>
                                </li>
                              ))}
                            </ol>
                          </div>
                          
                          {/* 流程路由信息 */}
                          <div className="mt-6 space-y-3">
                            {/* 流程类型 */}
                            <div className="p-4 bg-white rounded-lg border border-green-200">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">Target Flow:</span>
                                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                                  {getFlowForLevel(state.selectedLevel).replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </span>
                              </div>
                            </div>
                            
                            {/* 路由状态 */}
                            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                              <div className="flex items-center">
                                <div className="w-3 h-3 bg-blue-500 rounded-full mr-3 animate-pulse"></div>
                                <span className="text-sm text-blue-700 font-medium">
                                  Ready to route to {getFlowForLevel(state.selectedLevel)} interface
                                </span>
                              </div>
                            </div>
                            
                            {/* 配置验证状态 */}
                            {(() => {
                              const validation = validateRouting(state.selectedLevel, state.selectedGoal);
                              return (
                                <div className={`p-3 rounded-lg border ${
                                  validation.isValid 
                                    ? 'bg-green-50 border-green-200' 
                                    : 'bg-yellow-50 border-yellow-200'
                                }`}>
                                  <div className="flex items-center">
                                    <div className={`w-3 h-3 rounded-full mr-3 ${
                                      validation.isValid ? 'bg-green-500' : 'bg-yellow-500'
                                    }`}></div>
                                    <span className={`text-sm font-medium ${
                                      validation.isValid ? 'text-green-700' : 'text-yellow-700'
                                    }`}>
                                      {validation.isValid 
                                        ? 'Configuration validated ✓' 
                                        : `${validation.warnings.length} warnings`
                                      }
                                    </span>
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* 行动按钮 */}
              <div className="space-y-6">
                {/* 主要行动按钮 */}
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <button
                    onClick={handleComplete}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl 
                             hover:from-blue-700 hover:to-blue-800 hover:shadow-lg hover:scale-105
                             focus:outline-none focus:ring-4 focus:ring-blue-200
                             transition-all duration-300 font-bold text-lg
                             flex items-center justify-center group"
                  >
                    <span className="text-2xl mr-3 group-hover:animate-pulse">
                      {getFlowIcon(state.selectedLevel)}
                    </span>
                    Start My Journey
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={handleBackToGoalSelection}
                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-8 py-4 rounded-xl
                             transition-all duration-200 font-semibold text-lg border-2 border-blue-200 hover:border-blue-300
                             flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Change Goal
                  </button>
                </div>

                {/* 额外信息和选项 */}
                <div className="flex flex-col items-center space-y-4">
                  {/* 配置摘要 */}
                  <div className="bg-gray-50 rounded-lg p-4 max-w-md">
                    <h4 className="font-semibold text-gray-800 mb-2 text-center">Your Configuration</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Level:</span>
                        <div className="font-medium text-gray-900">{playerLevels[state.selectedLevel].title}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Goal:</span>
                        <div className="font-medium text-gray-900">{getGoalsForLevel(state.selectedLevel)[state.selectedGoal]?.title}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Flow:</span>
                        <div className="font-medium text-gray-900 capitalize">
                          {getFlowForLevel(state.selectedLevel).replace('-', ' ')}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Time:</span>
                        <div className="font-medium text-gray-900">{getEstimatedTime(state.selectedLevel)}</div>
                      </div>
                    </div>
                  </div>

                  {/* 快速重新开始选项 */}
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <button
                      onClick={handleBackToLevelSelection}
                      className="hover:text-blue-600 transition-colors"
                    >
                      Change Level
                    </button>
                    <span>•</span>
                    <button
                      onClick={handleSkip}
                      className="hover:text-blue-600 transition-colors"
                    >
                      Skip Setup
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 动态导航选项 */}
        <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
          <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4">
            {getNavigationOptions().map((option, index) => (
              <ResponsiveButton
                key={index}
                onClick={option.action}
                variant={option.type === 'secondary' ? 'secondary' : 'tertiary'}
                size="sm"
                icon={option.icon}
                className={isMobile ? 'text-xs' : ''}
              >
                {option.label}
              </ResponsiveButton>
            ))}
          </div>
          
          {/* 键盘快捷键提示 */}
          {!isMobile && (
            <div className="text-center mt-4">
              <ResponsiveText variant="small" color="muted">
                Press <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Esc</kbd> to go back
                {state.step !== 'level-selection' && ' or use the navigation buttons above'}
              </ResponsiveText>
            </div>
          )}
        </div>
      </ResponsiveCard>
    </ResponsiveModalBackdrop>
  );
};

/**
 * 带错误边界的PlayerLevelOnboarding组件
 * 需求 8.1: 创建错误边界组件包装引导系统
 */
const PlayerLevelOnboardingWithErrorBoundary: React.FC<PlayerLevelOnboardingProps> = (props) => {
  return (
    <OnboardingErrorBoundary
      onError={(error, errorInfo) => {
        // 记录错误到控制台和存储
        console.error('PlayerLevelOnboarding Error:', {
          error: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          props: props,
          timestamp: new Date().toISOString()
        });
      }}
      resetOnPropsChange={true}
    >
      <PlayerLevelOnboarding {...props} />
    </OnboardingErrorBoundary>
  );
};

export default PlayerLevelOnboardingWithErrorBoundary;