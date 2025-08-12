// /src/app/components/feature/BeginnerGuide.jsx
"use client";

import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';

const BeginnerGuide = () => {
  const { setGold, setInGameDate, requestAnalysisWithParams, isLoading } = useAppContext();
  const [currentStep, setCurrentStep] = useState(0);
  const [playerGold, setPlayerGold] = useState('100');
  const [season, setSeason] = useState('Spring');

  const beginnerTips = [
    {
      title: "Welcome to Garden Growing! 🌱",
      content: "Don't worry about complex strategies - we'll give you simple, proven advice to get started!",
      icon: "👋"
    },
    {
      title: "Start with Simple Crops 🥕",
      content: "Carrots and Strawberries are perfect for beginners. They grow fast and always make profit!",
      icon: "🌱"
    },
    {
      title: "Focus on Quick Returns 💰",
      content: "In your first week, plant crops that grow in 2-4 hours. This builds your gold quickly!",
      icon: "⏰"
    },
    {
      title: "Season Matters! 🌸",
      content: "Spring gives 20% faster growth, Summer gives 30% more gold. Plan accordingly!",
      icon: "🌞"
    }
  ];

  const quickStartGuides = [
    {
      title: "Day 1-3: Foundation Building",
      items: [
        "🥕 Plant 5-10 Carrots (2 hours, guaranteed profit)",
        "🍓 Plant 3-5 Strawberries (4 hours, good returns)",
        "💰 Keep 50+ gold for emergencies",
        "📈 Reinvest all profits into more crops"
      ],
      expectedProfit: "50-100 gold per day"
    },
    {
      title: "Day 4-7: Scaling Up",
      items: [
        "🫐 Add Blueberries (6 hours, multi-harvest)",
        "🌹 Try Roses for decoration bonus",
        "🏠 Save for your first building upgrade",
        "📊 Track which crops work best for you"
      ],
      expectedProfit: "100-200 gold per day"
    },
    {
      title: "Week 2+: Advanced Beginner",
      items: [
        "🍅 Experiment with Tomatoes (multi-harvest)",
        "🌷 Try seasonal specials for bonuses",
        "🏗️ Invest in tools and buildings",
        "🎯 Set bigger goals (1000+ gold)"
      ],
      expectedProfit: "200+ gold per day"
    }
  ];

  const handleGetPersonalizedAdvice = async () => {
    // 设置基础状态
    setGold(playerGold);
    const gameDate = `${season}, Day 1`;
    setInGameDate(gameDate);
    
    // 等待状态更新，然后使用新手默认推荐物品进行分析
    // 为了避免异步状态更新问题，我们直接传递参数
    await requestAnalysisWithParams(true, playerGold, gameDate);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* 欢迎标题 */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          New Player Guide 🌱
        </h1>
        <p className="text-lg text-gray-600">
          Simple, proven strategies to get you started successfully!
        </p>
      </div>

      {/* 快速提示轮播 */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Quick Tips</h3>
          <div className="flex space-x-2">
            {beginnerTips.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-3 h-3 rounded-full ${
                  currentStep === index ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-4xl mb-4">{beginnerTips[currentStep].icon}</div>
          <h4 className="text-xl font-semibold mb-2">{beginnerTips[currentStep].title}</h4>
          <p className="text-gray-600">{beginnerTips[currentStep].content}</p>
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="px-4 py-2 text-blue-600 disabled:text-gray-400"
          >
            ← Previous
          </button>
          <button
            onClick={() => setCurrentStep(Math.min(beginnerTips.length - 1, currentStep + 1))}
            disabled={currentStep === beginnerTips.length - 1}
            className="px-4 py-2 text-blue-600 disabled:text-gray-400"
          >
            Next →
          </button>
        </div>
      </div>

      {/* 阶段性指南 */}
      <div className="grid md:grid-cols-3 gap-6">
        {quickStartGuides.map((guide, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {guide.title}
            </h3>
            <ul className="space-y-2 mb-4">
              {guide.items.map((item, itemIndex) => (
                <li key={itemIndex} className="text-sm text-gray-600 flex items-start">
                  <span className="mr-2">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="text-sm font-medium text-green-600 bg-green-50 p-2 rounded">
              Expected: {guide.expectedProfit}
            </div>
          </div>
        ))}
      </div>

      {/* 个性化建议生成器 */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6 border">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Get Your Personal Starting Plan 🎯
        </h3>
        <p className="text-gray-600 mb-6">
          Tell us your current situation and we'll create a custom plan just for you!
        </p>
        
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How much gold do you have?
            </label>
            <select
              value={playerGold}
              onChange={(e) => setPlayerGold(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="50">50 gold (Just started)</option>
              <option value="100">100 gold (Default start)</option>
              <option value="200">200 gold (Played a bit)</option>
              <option value="500">500+ gold (Have some experience)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What season is it in your game?
            </label>
            <select
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Spring">🌸 Spring (Fast growth!)</option>
              <option value="Summer">☀️ Summer (More gold!)</option>
              <option value="Autumn">🍂 Autumn (More XP!)</option>
              <option value="Winter">❄️ Winter (Steady progress)</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleGetPersonalizedAdvice}
          disabled={isLoading}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating your plan...
            </span>
          ) : (
            "Create My Personal Plan 🚀"
          )}
        </button>
      </div>

      {/* 常见问题 */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Common Beginner Questions 🤔
        </h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900">Q: What should I plant first?</h4>
            <p className="text-gray-600 text-sm">A: Always start with Carrots! They grow in just 2 hours and always make profit. Plant 5-10 of them.</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Q: Should I save gold or spend it all?</h4>
            <p className="text-gray-600 text-sm">A: Keep 50-100 gold as emergency fund, invest the rest. Money makes money in this game!</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Q: When should I try rare crops?</h4>
            <p className="text-gray-600 text-sm">A: Wait until you have 500+ gold and understand the basics. Rare crops need bigger investments.</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Q: How do I know if I'm doing well?</h4>
            <p className="text-gray-600 text-sm">A: If you're doubling your gold every 2-3 days, you're on the right track!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeginnerGuide;