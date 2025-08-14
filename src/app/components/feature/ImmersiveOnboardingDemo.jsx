// /src/app/components/feature/ImmersiveOnboardingDemo.jsx
"use client";

import { useState, useEffect } from 'react';

const ImmersiveOnboardingDemo = ({ onComplete, onSkip }) => {
  const [currentPhase, setCurrentPhase] = useState('value-proposition');
  const [userChoice, setUserChoice] = useState(null);
  const [showResults, setShowResults] = useState(false);

  // 智能默认数据 - 让用户立即看到价值
  const demoScenarios = {
    profit: {
      title: "最大化金币收益",
      description: "我想要最赚钱的种植方案",
      result: {
        crop: "古代水果",
        profit: "2,340金币/天",
        reason: "考虑到你的当前等级，这是最优选择",
        nextStep: "选择配套宠物可以再增加15%收益"
      },
      color: "from-yellow-400 to-orange-500",
      icon: "💰"
    },
    speed: {
      title: "快速成长",
      description: "我想要快速升级和解锁内容",
      result: {
        crop: "咖啡豆",
        profit: "最快经验获取",
        reason: "每2小时收获一次，经验效率最高",
        nextStep: "配合速度宠物可以减少20%成长时间"
      },
      color: "from-green-400 to-blue-500",
      icon: "⚡"
    },
    balance: {
      title: "平衡发展",
      description: "我想要稳定的收益和成长",
      result: {
        crop: "蓝莓",
        profit: "1,680金币/天 + 稳定经验",
        reason: "风险低，收益稳定，适合长期发展",
        nextStep: "这个选择让你可以同时关注多个目标"
      },
      color: "from-purple-400 to-pink-500",
      icon: "⚖️"
    }
  };

  const handleChoiceSelect = (choice) => {
    setUserChoice(choice);
    // 延迟显示结果，创造期待感
    setTimeout(() => {
      setShowResults(true);
    }, 800);
  };

  const handleContinue = () => {
    onComplete?.(userChoice);
  };

  const handleSkipToExplore = () => {
    onSkip?.();
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 z-50 flex items-center justify-center p-4">
      
      {/* 价值主张阶段 */}
      {currentPhase === 'value-proposition' && !userChoice && (
        <div className="max-w-4xl w-full animate-fade-in">
          {/* 主标题 */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
              让我帮你找到
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                最赚钱
              </span>
              的种植方案
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              30秒内获得个性化推荐，无需复杂设置
            </p>
          </div>

          {/* 选择卡片 */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {Object.entries(demoScenarios).map(([key, scenario]) => (
              <button
                key={key}
                onClick={() => handleChoiceSelect(key)}
                className="group relative overflow-hidden rounded-2xl p-8 text-left transition-all duration-500 hover:scale-105 hover:shadow-2xl bg-white/10 backdrop-blur-sm border border-white/20"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${scenario.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  <div className="text-4xl mb-4">{scenario.icon}</div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {scenario.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {scenario.description}
                  </p>
                </div>

                {/* 悬停效果 */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* 底部操作 */}
          <div className="text-center">
            <button
              onClick={handleSkipToExplore}
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              我想自己探索 →
            </button>
          </div>
        </div>
      )}

      {/* 结果展示阶段 */}
      {userChoice && (
        <div className="max-w-2xl w-full">
          {/* 加载状态 */}
          {!showResults && (
            <div className="text-center animate-pulse">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                正在分析你的需求...
              </h2>
              <p className="text-gray-300">
                基于你的选择计算最优方案
              </p>
            </div>
          )}

          {/* 结果展示 */}
          {showResults && (
            <div className="animate-fade-in">
              <div className="text-center mb-8">
                <div className={`w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r ${demoScenarios[userChoice].color} flex items-center justify-center text-3xl`}>
                  {demoScenarios[userChoice].icon}
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  完美！为你找到了最佳方案
                </h2>
              </div>

              {/* 推荐结果卡片 */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">
                    推荐作物：{demoScenarios[userChoice].result.crop}
                  </h3>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-400">
                      {demoScenarios[userChoice].result.profit}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                    <p className="text-gray-300">
                      <span className="font-medium text-white">为什么选择这个：</span>
                      {demoScenarios[userChoice].result.reason}
                    </p>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                    <p className="text-gray-300">
                      <span className="font-medium text-white">下一步优化：</span>
                      {demoScenarios[userChoice].result.nextStep}
                    </p>
                  </div>
                </div>
              </div>

              {/* 行动按钮 */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleContinue}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-4 px-8 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                >
                  开始使用这个方案
                </button>
                
                <button
                  onClick={() => {
                    setUserChoice(null);
                    setShowResults(false);
                  }}
                  className="flex-1 bg-white/10 backdrop-blur-sm text-white font-medium py-4 px-8 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  重新选择
                </button>
              </div>

              {/* 信任指标 */}
              <div className="text-center mt-6">
                <p className="text-sm text-gray-400">
                  基于 <span className="text-white font-medium">10,000+</span> 玩家数据分析
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 跳过按钮 - 始终可见但不突兀 */}
      <button
        onClick={handleSkipToExplore}
        className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors text-sm"
      >
        跳过引导
      </button>
    </div>
  );
};

export default ImmersiveOnboardingDemo;