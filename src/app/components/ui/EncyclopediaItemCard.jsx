// src/app/components/ui/EncyclopediaItemCard.jsx
// 专门为百科全书优化的物品卡片

"use client";

import { CompactFavoriteButton } from './FavoriteButton';

const tierColorMap = {
  'Common': 'border-gray-400 bg-gray-50',
  'Uncommon': 'border-green-500 bg-green-50', 
  'Rare': 'border-blue-500 bg-blue-50',
  'Epic': 'border-purple-600 bg-purple-50',
  'Legendary': 'border-orange-500 bg-orange-50',
  'Mythical': 'border-red-600 bg-red-50',
  'Divine': 'border-yellow-400 bg-yellow-50'
};

const bonusTypeColors = {
  'gold': 'text-yellow-600',
  'growth': 'text-green-600',
  'experience': 'text-blue-600',
  'luck': 'text-purple-600',
  'harvest': 'text-orange-600'
};

export default function EncyclopediaItemCard({ 
  item, 
  type = 'crops', // 'crops' or 'pets'
  onClick 
}) {
  const tierStyle = tierColorMap[item.tier] || 'border-gray-300 bg-white';

  // 处理卡片点击，避免收藏按钮触发
  const handleCardClick = (e) => {
    // 如果点击的是收藏按钮或其子元素，不触发卡片点击
    if (e.target.closest('[data-favorite-button]')) {
      return;
    }
    onClick && onClick(item);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`relative cursor-pointer rounded-lg border-2 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg ${tierStyle}`}
    >
      {/* 收藏按钮 - 右上角 */}
      <div className="absolute top-2 right-2 z-10">
        <div data-favorite-button>
          <CompactFavoriteButton
            itemId={item.name}
            itemType={type}
            className="bg-white/80 backdrop-blur-sm hover:bg-white shadow-sm"
          />
        </div>
      </div>

      <div className="p-3">
        {/* 物品图片 - 超级简化版本 */}
        <div className="h-20 w-full mb-2" style={{ backgroundColor: '#f9fafb', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img 
            src={`/images/items/${item.name}.png`}
            alt={item.display_name || item.name}
            style={{ 
              width: '64px', 
              height: '64px', 
              objectFit: 'contain',
              display: 'block',
              maxWidth: '100%',
              maxHeight: '100%'
            }}
            onError={(e) => {
              console.log(`❌ Image FAILED: /images/items/${item.name}.png`);
              e.target.style.display = 'none';
              const fallback = document.createElement('div');
              fallback.style.cssText = 'width:64px;height:64px;display:flex;align-items:center;justify-content:center;background:#fee2e2;border-radius:4px;font-size:32px;';
              fallback.textContent = type === 'pets' ? '🐾' : '🌱';
              e.target.parentNode.appendChild(fallback);
            }}
            onLoad={() => console.log(`✅ Image SUCCESS: /images/items/${item.name}.png`)}
          />
        </div>
        
        {/* 物品名称 */}
        <div className="text-center mb-2">
          <h3 className="font-bold text-gray-800 text-sm leading-tight">
            {item.display_name}
          </h3>
        </div>
        
        {/* 稀有度标签 */}
        <div className="text-center mb-2">
          <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
            item.tier === 'Common' ? 'bg-gray-200 text-gray-700' :
            item.tier === 'Uncommon' ? 'bg-green-200 text-green-700' :
            item.tier === 'Rare' ? 'bg-blue-200 text-blue-700' :
            item.tier === 'Epic' ? 'bg-purple-200 text-purple-700' :
            item.tier === 'Legendary' ? 'bg-orange-200 text-orange-700' :
            'bg-gray-200 text-gray-700'
          }`}>
            {item.tier}
          </span>
        </div>
        
        {/* 类型特定信息 */}
        {type === 'pets' && item.bonus_type && (
          <div className="text-center">
            <div className={`text-xs font-medium ${bonusTypeColors[item.bonus_type] || 'text-gray-600'}`}>
              {item.bonus_type.charAt(0).toUpperCase() + item.bonus_type.slice(1)} Bonus
            </div>
            {item.bonus_value && (
              <div className="text-xs text-gray-500">
                +{item.bonus_value}%
              </div>
            )}
          </div>
        )}
        
        {type === 'crops' && item.prices && (
          <div className="text-center">
            <div className="text-xs font-medium text-green-600">
              ${Object.values(item.prices)[0] || 'N/A'}
            </div>
            {item.multi_harvest && (
              <div className="text-xs text-blue-600">
                Multi-harvest
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* 移除可能遮挡图片的悬停效果 */}
    </div>
  );
}