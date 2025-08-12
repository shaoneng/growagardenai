// /src/app/components/feature/PetDetailPage.jsx
// 宠物详情页组件

"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { EnhancedFavoriteButton } from '../ui/EnhancedFavoriteButton';

const tierColorMap = {
  'Common': 'bg-gray-100 text-gray-800 border-gray-300',
  'Uncommon': 'bg-green-100 text-green-800 border-green-300',
  'Rare': 'bg-blue-100 text-blue-800 border-blue-300',
  'Legendary': 'bg-purple-100 text-purple-800 border-purple-300'
};

export default function PetDetailPage({ pet }) {
  const [imageError, setImageError] = useState(false);
  const imagePath = `/images/items/${pet.name}.png`;

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
                <Link href="/pets" className="ml-1 text-blue-600 hover:text-blue-800 md:ml-2">
                  Pets
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
                <span className="ml-1 text-gray-500 md:ml-2">{pet.display_name || pet.name}</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* 主要内容 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：宠物信息 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* 宠物图片 */}
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                    {!imageError ? (
                      <Image 
                        src={imagePath}
                        alt={pet.display_name || pet.name}
                        width={128}
                        height={128}
                        className="max-w-full max-h-full object-contain"
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      <div className="text-4xl">🐾</div>
                    )}
                  </div>
                </div>

                {/* 基本信息 */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <h1 className="text-3xl font-bold text-gray-900">
                      {pet.display_name || pet.name}
                    </h1>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                      tierColorMap[pet.tier] || tierColorMap['Common']
                    }`}>
                      {pet.tier}
                    </span>
                  </div>

                  {/* 收藏按钮 */}
                  <div className="mb-6">
                    <EnhancedFavoriteButton
                      itemId={pet.name}
                      itemType="pets"
                      itemName={pet.display_name || pet.name}
                      size="lg"
                      showLabel={true}
                      className="shadow-sm"
                    />
                  </div>

                  {/* 宠物属性 */}
                  <div className="space-y-3">
                    {pet.bonus_type && (
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-600 w-24">Bonus Type:</span>
                        <span className="text-sm text-gray-900 capitalize">
                          {pet.bonus_type.replace(/_/g, ' ')}
                        </span>
                      </div>
                    )}
                    
                    {pet.bonus_value && (
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-600 w-24">Bonus Value:</span>
                        <span className="text-sm text-gray-900">
                          {pet.bonus_value}%
                        </span>
                      </div>
                    )}
                    
                    {pet.range && (
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-600 w-24">Range:</span>
                        <span className="text-sm text-gray-900">
                          {pet.range} tiles
                        </span>
                      </div>
                    )}
                    
                    {pet.special_effect && (
                      <div className="flex items-start">
                        <span className="text-sm font-medium text-gray-600 w-24">Special:</span>
                        <span className="text-sm text-gray-900">
                          {pet.special_effect}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 详细描述 */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                About {pet.display_name || pet.name}
              </h2>
              <div className="prose prose-sm max-w-none text-gray-700">
                <p>
                  {pet.display_name || pet.name} is a {pet.tier.toLowerCase()} pet that can provide 
                  valuable bonuses to your garden. {pet.bonus_type && `This pet specializes in ${pet.bonus_type.replace(/_/g, ' ')} bonuses.`}
                </p>
                
                {pet.special_effect && (
                  <p>
                    <strong>Special Ability:</strong> {pet.special_effect}
                  </p>
                )}
                
                <p>
                  Like all pets, {pet.display_name || pet.name} will need to be attracted to your garden 
                  through proper care and the right environment. Make sure to keep your garden clean 
                  and well-maintained to increase your chances of attracting this adorable companion!
                </p>
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
                  <span className="text-sm font-medium text-gray-900">{pet.tier}</span>
                </div>
                
                {pet.bonus_type && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Bonus Type</span>
                    <span className="text-sm font-medium text-gray-900 capitalize">
                      {pet.bonus_type.replace(/_/g, ' ')}
                    </span>
                  </div>
                )}
                
                {pet.bonus_value && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Bonus Amount</span>
                    <span className="text-sm font-medium text-green-600">+{pet.bonus_value}%</span>
                  </div>
                )}
                
                {pet.range && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Effect Range</span>
                    <span className="text-sm font-medium text-gray-900">{pet.range} tiles</span>
                  </div>
                )}
              </div>
            </div>

            {/* 吸引提示 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                🎯 Attraction Tips
              </h3>
              <div className="text-blue-800 text-sm space-y-2">
                <p>• Keep your garden clean and well-maintained</p>
                <p>• Plant a variety of crops to attract different pets</p>
                <p>• Some pets prefer specific seasons or weather</p>
                <p>• Be patient - rare pets may take time to appear!</p>
              </div>
            </div>

            {/* 相关链接 */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Related</h3>
              <div className="space-y-2">
                <Link 
                  href="/pets" 
                  className="block text-blue-600 hover:text-blue-800 text-sm"
                >
                  ← Back to All Pets
                </Link>
                <Link 
                  href="/crops" 
                  className="block text-blue-600 hover:text-blue-800 text-sm"
                >
                  Browse Crops →
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