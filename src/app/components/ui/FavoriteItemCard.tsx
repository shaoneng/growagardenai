'use client';

// /src/app/components/ui/FavoriteItemCard.tsx
// 收藏物品卡片组件

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, ExternalLink } from 'lucide-react';
import { QuickFavoriteButton } from './EnhancedFavoriteButton';

const tierColorMap = {
  'Common': 'border-gray-400 bg-gray-50',
  'Uncommon': 'border-green-500 bg-green-50', 
  'Rare': 'border-blue-500 bg-blue-50',
  'Epic': 'border-purple-600 bg-purple-50',
  'Legendary': 'border-orange-500 bg-orange-50',
  'Mythical': 'border-red-600 bg-red-50',
  'Divine': 'border-yellow-400 bg-yellow-50'
};

interface FavoriteItemCardProps {
  item: {
    name: string;
    display_name?: string;
    tier?: string;
    type: 'crops' | 'pets' | 'reports';
    bonus_type?: string;
    bonus_value?: number;
    prices?: Record<string, number>;
    multi_harvest?: boolean;
    addedAt: string;
    // 策略报告特有字段
    reportId?: string;
    publicationDate?: string;
    mainTitle?: string;
    subTitle?: string;
  };
}

export default function FavoriteItemCard({ item }: FavoriteItemCardProps) {
  const [imageError, setImageError] = useState(false);
  const tierStyle = tierColorMap[item.tier as keyof typeof tierColorMap] || 'border-gray-300 bg-white';
  
  // 生成详情页链接
  const detailLink = item.type === 'reports' 
    ? `/reports/${item.reportId || item.name}` 
    : `/${item.type}/${item.name.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={`relative group rounded-lg border-2 shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-105 ${tierStyle}`}>
      {/* 收藏按钮 - 右上角 */}
      <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <QuickFavoriteButton
          itemId={item.name}
          itemType={item.type}
          itemName={item.display_name || item.name}
          className="bg-white/90 backdrop-blur-sm shadow-sm"
        />
      </div>

      {/* 主要内容 */}
      <Link href={detailLink} className="block p-4">
        {/* 物品图片 */}
        <div className="h-20 w-full mb-3 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
          {item.type === 'reports' ? (
            <div className="text-3xl">📊</div>
          ) : !imageError ? (
            <img 
              src={`/images/items/${item.name}.png`}
              alt={item.display_name || item.name}
              className="w-16 h-16 object-contain"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="text-3xl">
              {item.type === 'pets' ? '🐾' : '🌱'}
            </div>
          )}
        </div>
        
        {/* 物品名称 */}
        <div className="text-center mb-2">
          <h3 className="font-bold text-gray-800 text-sm leading-tight line-clamp-2">
            {item.display_name || item.name}
          </h3>
        </div>
        
        {/* 稀有度标签或报告日期 */}
        <div className="text-center mb-2">
          {item.type === 'reports' ? (
            <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-blue-200 text-blue-700">
              {item.publicationDate ? new Date(item.publicationDate).toLocaleDateString('en-US') : 'Strategy Report'}
            </span>
          ) : item.tier ? (
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
          ) : null}
        </div>
        
        {/* 类型特定信息 */}
        <div className="text-center text-xs">
          {item.type === 'reports' && (
            <div className="text-blue-600 font-medium">
              {item.subTitle || 'Personalized Strategy Advice'}
            </div>
          )}
          
          {item.type === 'pets' && item.bonus_type && (
            <div className="text-purple-600 font-medium">
              {item.bonus_type.replace(/_/g, ' ')}
              {item.bonus_value && ` +${item.bonus_value}%`}
            </div>
          )}
          
          {item.type === 'crops' && (
            <div className="space-y-1">
              {item.prices && (
                <div className="text-green-600 font-medium">
                  ${Object.values(item.prices)[0]}
                </div>
              )}
              {item.multi_harvest && (
                <div className="text-blue-600">
                  Multi-harvest
                </div>
              )}
            </div>
          )}
        </div>
      </Link>

      {/* 悬停时显示的外部链接图标 */}
      <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <ExternalLink className="w-4 h-4 text-gray-400" />
      </div>

      {/* 收藏时间标记 */}
      <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-black/70 text-white text-xs px-2 py-1 rounded-full">
          <Heart className="w-3 h-3 inline mr-1" fill="currentColor" />
          Favorited
        </div>
      </div>
    </div>
  );
}