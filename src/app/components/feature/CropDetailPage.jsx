// /src/app/components/feature/CropDetailPage.jsx
// 作物详情页组件

"use client";

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { EnhancedFavoriteButton } from '../ui/EnhancedFavoriteButton';

const tierColorMap = {
  'Common': 'bg-gray-100 text-gray-800 border-gray-300',
  'Uncommon': 'bg-green-100 text-green-800 border-green-300',
  'Rare': 'bg-blue-100 text-blue-800 border-blue-300',
  'Legendary': 'bg-purple-100 text-purple-800 border-purple-300'
};

const seasonBonuses = {
  'Spring': { growth: 1.2, gold: 1.0, description: '20% faster growth' },
  'Summer': { growth: 1.0, gold: 1.3, description: '30% more gold' },
  'Autumn': { growth: 0.9, gold: 1.1, description: '20% more XP' },
  'Winter': { growth: 0.8, gold: 1.0, description: 'Steady growth' }
};

export default function CropDetailPage({ crop }) {
  const [imageError, setImageError] = useState(false);
  const imagePath = `/images/items/${crop.name}.png`;

  // 计算基础统计数据
  const stats = useMemo(() => {
    const basePrice = crop.prices ? Object.values(crop.prices)[0] : 50;
    const sellPrice = Math.round(basePrice * 1.5);
    const growthTime = crop.multi_harvest ? 6 : 4; // 假设的成长时间
    const profit = sellPrice - basePrice;
    const profitPerHour = profit / growthTime;
    
    return {
      basePrice,
      sellPrice,
      growthTime,
      profit,
      profitPerHour
    };
  }, [crop]);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* 面包屑导航 */}
        <nav className="flex mb-6 text-sm">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link href="/" className="text-blue-600 hover:text-blue-800">
                Home
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
                <Link href="/crops" className="ml-1 text-blue-600 hover:text-blue-800 md:ml-2">
                  Crops
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
                <span className="ml-1 text-gray-500 md:ml-2">{crop.display_name || crop.name}</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* 主要内容 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：作物信息 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* 作物图片 */}
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                    {!imageError ? (
                      <Image 
                        src={imagePath}
                        alt={crop.display_name || crop.name}
                        width={128}
                        height={128}
                        className="max-w-full max-h-full object-contain"
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      <div className="text-4xl">🌱</div>
                    )}
                  </div>
                </div>

                {/* 基本信息 */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <h1 className="text-3xl font-bold text-gray-900">
                      {crop.display_name || crop.name}
                    </h1>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                      tierColorMap[crop.tier] || tierColorMap['Common']
                    }`}>
                      {crop.tier}
                    </span>
                    {crop.multi_harvest && (
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-300">
                        Multi-Harvest
                      </span>
                    )}
                  </div>

                  {/* 收藏按钮 */}
                  <div className="mb-6">
                    <EnhancedFavoriteButton
                      itemId={crop.name}
                      itemType="crops"
                      itemName={crop.display_name || crop.name}
                      size="lg"
                      showLabel={true}
                      className="shadow-sm"
                    />
                  </div>

                  {/* 作物属性 */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Seed Price</span>
                      <div className="text-lg font-semibold text-gray-900">
                        {stats.basePrice} gold
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-gray-600">Sell Price</span>
                      <div className="text-lg font-semibold text-green-600">
                        {stats.sellPrice} gold
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-gray-600">Growth Time</span>
                      <div className="text-lg font-semibold text-gray-900">
                        {stats.growthTime}h
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-gray-600">Profit/Hour</span>
                      <div className="text-lg font-semibold text-blue-600">
                        {stats.profitPerHour.toFixed(1)} gold
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 季节性分析 */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                🌞 Seasonal Analysis
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(seasonBonuses).map(([season, bonus]) => (
                  <div key={season} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{season}</h3>
                      <span className="text-sm text-gray-600">{bonus.description}</span>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Growth Time:</span>
                        <span className="font-medium">
                          {(stats.growthTime / bonus.growth).toFixed(1)}h
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Gold Earned:</span>
                        <span className="font-medium text-green-600">
                          {Math.round(stats.sellPrice * bonus.gold)} gold
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Profit/Hour:</span>
                        <span className="font-medium text-blue-600">
                          {((stats.sellPrice * bonus.gold - stats.basePrice) / (stats.growthTime / bonus.growth)).toFixed(1)} gold
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 种植指南 */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                📖 Growing Guide
              </h2>
              <div className="prose prose-sm max-w-none text-gray-700">
                <p>
                  {crop.display_name || crop.name} is a {crop.tier.toLowerCase()} crop that 
                  {crop.multi_harvest ? ' can be harvested multiple times' : ' provides a single harvest'}.
                  {crop.tier === 'Common' && ' This crop is perfect for beginners due to its reliability and quick returns.'}
                  {crop.tier === 'Legendary' && ' This rare crop requires significant investment but offers exceptional returns.'}
                </p>
                
                {crop.multi_harvest && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-4">
                    <h4 className="font-medium text-green-900 mb-2">🔄 Multi-Harvest Benefits</h4>
                    <p className="text-green-800 text-sm">
                      This crop can be harvested multiple times from a single planting, providing 
                      sustained income over time. After the initial growth period, you'll get 
                      regular harvests without replanting!
                    </p>
                  </div>
                )}
                
                <h4 className="font-medium text-gray-900 mt-4 mb-2">💡 Optimization Tips</h4>
                <ul className="text-sm space-y-1">
                  <li>• Plant during {crop.tier === 'Common' ? 'Spring for faster growth' : 'Summer for maximum profits'}</li>
                  <li>• {crop.multi_harvest ? 'Focus on long-term placement for sustained income' : 'Great for quick gold accumulation'}</li>
                  <li>• Consider pairing with pets that boost {crop.tier === 'Legendary' ? 'gold earnings' : 'growth speed'}</li>
                  <li>• {crop.tier === 'Rare' || crop.tier === 'Legendary' ? 'Ensure you have sufficient capital before investing' : 'Perfect for building your initial gold reserves'}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 右侧：快速信息和相关内容 */}
          <div className="space-y-6">
            {/* 快速统计 */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Rarity</span>
                  <span className="text-sm font-medium text-gray-900">{crop.tier}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Type</span>
                  <span className="text-sm font-medium text-gray-900">
                    {crop.multi_harvest ? 'Multi-Harvest' : 'Single Harvest'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Base Profit</span>
                  <span className="text-sm font-medium text-green-600">
                    {stats.profit} gold
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">ROI</span>
                  <span className="text-sm font-medium text-blue-600">
                    {((stats.profit / stats.basePrice) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>

            {/* 投资建议 */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-yellow-900 mb-3">
                💰 Investment Advice
              </h3>
              <div className="text-yellow-800 text-sm space-y-2">
                {crop.tier === 'Common' && (
                  <>
                    <p>• Perfect for beginners and quick profits</p>
                    <p>• Low risk, reliable returns</p>
                    <p>• Great for building initial capital</p>
                  </>
                )}
                {crop.tier === 'Uncommon' && (
                  <>
                    <p>• Good balance of risk and reward</p>
                    <p>• Suitable for intermediate players</p>
                    <p>• Consider seasonal bonuses</p>
                  </>
                )}
                {(crop.tier === 'Rare' || crop.tier === 'Legendary') && (
                  <>
                    <p>• High investment, high returns</p>
                    <p>• Requires significant capital</p>
                    <p>• Best for experienced players</p>
                  </>
                )}
              </div>
            </div>

            {/* 相关链接 */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Related</h3>
              <div className="space-y-2">
                <Link 
                  href="/crops" 
                  className="block text-blue-600 hover:text-blue-800 text-sm"
                >
                  ← Back to All Crops
                </Link>
                <Link 
                  href="/pets" 
                  className="block text-blue-600 hover:text-blue-800 text-sm"
                >
                  Browse Pets →
                </Link>
                <Link 
                  href="/" 
                  className="block text-blue-600 hover:text-blue-800 text-sm"
                >
                  AI Strategy Advisor →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 数据时效性标注 */}
        <div className="mt-8 text-center text-xs text-gray-500">
          Data last updated: {new Date().toLocaleDateString()} | 
          Applicable to current game version
        </div>
      </div>
    </main>
  );
}