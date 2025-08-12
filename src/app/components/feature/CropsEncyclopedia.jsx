// /src/app/components/feature/CropsEncyclopedia.jsx
// 作物百科全书组件

"use client";

import { useState, useEffect } from 'react';
import EncyclopediaBase from './EncyclopediaBase';
import { identifyCrops, enrichItemData } from '../../../lib/encyclopedia-utils';
import itemsData from '../../../../public/data/items.json';

export default function CropsEncyclopedia() {
  const [crops, setCrops] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      // 使用工具函数识别和丰富作物数据
      const cropsData = identifyCrops(itemsData);
      const enrichedCrops = enrichItemData(cropsData, 'crops');
      
      setCrops(enrichedCrops);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading crops data:', error);
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <div className="text-gray-600">Loading crops encyclopedia...</div>
      </div>
    );
  }

  return (
    <div>
      {/* 作物特色信息 */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-green-900 mb-2">
          🌱 About Crops in Grow a Garden
        </h2>
        <p className="text-green-800 text-sm mb-3">
          Master the art of farming with our comprehensive crop database! Each crop has unique 
          growth patterns, profit potential, and seasonal bonuses.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center">
            <span className="text-blue-600 mr-2">⏰</span>
            <span className="text-green-800">Growth Times</span>
          </div>
          <div className="flex items-center">
            <span className="text-yellow-600 mr-2">💰</span>
            <span className="text-green-800">Profit Margins</span>
          </div>
          <div className="flex items-center">
            <span className="text-purple-600 mr-2">🔄</span>
            <span className="text-green-800">Multi-Harvest</span>
          </div>
          <div className="flex items-center">
            <span className="text-orange-600 mr-2">🌞</span>
            <span className="text-green-800">Seasonal Bonuses</span>
          </div>
        </div>
      </div>

      {/* 百科全书组件 */}
      <EncyclopediaBase 
        items={crops}
        title="Crops Encyclopedia"
        type="crops"
        showBeginnerRecommendations={true}
      />

      {/* 种植策略提示 */}
      {crops.length > 0 && (
        <div className="mt-8 space-y-6">
          {/* 季节性建议 */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-orange-900 mb-2">
              🌞 Seasonal Growing Tips
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-orange-800 mb-1">🌸 Spring</h4>
                <p className="text-orange-700">20% faster growth - perfect for quick crops like carrots!</p>
              </div>
              <div>
                <h4 className="font-medium text-orange-800 mb-1">☀️ Summer</h4>
                <p className="text-orange-700">30% more gold - maximize profits with high-value crops!</p>
              </div>
              <div>
                <h4 className="font-medium text-orange-800 mb-1">🍂 Autumn</h4>
                <p className="text-orange-700">20% more XP - great for leveling up your farming skills!</p>
              </div>
              <div>
                <h4 className="font-medium text-orange-800 mb-1">❄️ Winter</h4>
                <p className="text-orange-700">Steady growth - focus on planning and preparation!</p>
              </div>
            </div>
          </div>

          {/* 盈利策略 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              💡 Profit Optimization Strategies
            </h3>
            <div className="text-blue-800 text-sm space-y-2">
              <p>• <strong>Multi-harvest crops</strong> like blueberries provide sustained income over time</p>
              <p>• <strong>Quick crops</strong> like carrots are perfect for rapid gold accumulation</p>
              <p>• <strong>Rare crops</strong> offer higher profits but require larger initial investments</p>
              <p>• <strong>Seasonal specials</strong> can provide up to 200% bonus profits during their peak season!</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}