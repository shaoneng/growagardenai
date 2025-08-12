'use client';

// /src/app/components/ui/FavoriteItemList.tsx
// 收藏物品列表视图组件

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, ExternalLink, Calendar, Star } from 'lucide-react';
import { QuickFavoriteButton } from './EnhancedFavoriteButton';

const tierColorMap = {
  'Common': 'text-gray-600',
  'Uncommon': 'text-green-600', 
  'Rare': 'text-blue-600',
  'Epic': 'text-purple-600',
  'Legendary': 'text-orange-600',
  'Mythical': 'text-red-600',
  'Divine': 'text-yellow-600'
};

interface FavoriteItemListProps {
  items: Array<{
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
  }>;
}

export default function FavoriteItemList({ items }: FavoriteItemListProps) {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (itemName: string) => {
    setImageErrors(prev => ({ ...prev, [itemName]: true }));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <div className="divide-y divide-gray-200">
        {items.map((item) => {
          const detailLink = item.type === 'reports' 
            ? `/reports/${item.reportId || item.name}` 
            : `/${item.type}/${item.name.toLowerCase().replace(/\s+/g, '-')}`;
          const hasImageError = imageErrors[item.name];

          return (
            <div key={item.name} className="group hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4 p-4">
                {/* 物品图片 */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                    {item.type === 'reports' ? (
                      <div className="text-2xl">📊</div>
                    ) : !hasImageError ? (
                      <img 
                        src={`/images/items/${item.name}.png`}
                        alt={item.display_name || item.name}
                        className="w-12 h-12 object-contain"
                        onError={() => handleImageError(item.name)}
                      />
                    ) : (
                      <div className="text-2xl">
                        {item.type === 'pets' ? '🐾' : '🌱'}
                      </div>
                    )}
                  </div>
                </div>

                {/* 物品信息 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* 名称和稀有度 */}
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {item.display_name || item.name}
                        </h3>
                        {item.type === 'reports' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border bg-blue-100 text-blue-700 border-blue-300">
                            <Calendar className="w-3 h-3" />
                            {item.publicationDate ? new Date(item.publicationDate).toLocaleDateString('zh-CN') : '策略报告'}
                          </span>
                        ) : item.tier ? (
                          <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${
                            item.tier === 'Common' ? 'bg-gray-100 text-gray-700 border-gray-300' :
                            item.tier === 'Uncommon' ? 'bg-green-100 text-green-700 border-green-300' :
                            item.tier === 'Rare' ? 'bg-blue-100 text-blue-700 border-blue-300' :
                            item.tier === 'Epic' ? 'bg-purple-100 text-purple-700 border-purple-300' :
                            item.tier === 'Legendary' ? 'bg-orange-100 text-orange-700 border-orange-300' :
                            'bg-gray-100 text-gray-700 border-gray-300'
                          }`}>
                            <Star className="w-3 h-3" />
                            {item.tier}
                          </span>
                        ) : null}
                      </div>

                      {/* 类型和特殊属性 */}
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <span className="flex items-center gap-1">
                          {item.type === 'reports' ? '📊' : item.type === 'pets' ? '🐾' : '🌱'}
                          {item.type === 'reports' ? '策略报告' : item.type === 'pets' ? '宠物' : '作物'}
                        </span>

                        {item.type === 'reports' && item.subTitle && (
                          <span className="text-blue-600 font-medium">
                            {item.subTitle}
                          </span>
                        )}

                        {item.type === 'pets' && item.bonus_type && (
                          <span className="text-purple-600 font-medium">
                            {item.bonus_type.replace(/_/g, ' ')}
                            {item.bonus_value && ` +${item.bonus_value}%`}
                          </span>
                        )}

                        {item.type === 'crops' && item.prices && (
                          <span className="text-green-600 font-medium">
                            ${Object.values(item.prices)[0]}
                          </span>
                        )}

                        {item.multi_harvest && (
                          <span className="text-blue-600 font-medium">
                            Multi-harvest
                          </span>
                        )}
                      </div>

                      {/* 收藏时间 */}
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>收藏于 {formatDate(item.addedAt)}</span>
                      </div>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex items-center gap-2 ml-4">
                      {/* 收藏按钮 */}
                      <QuickFavoriteButton
                        itemId={item.name}
                        itemType={item.type}
                        itemName={item.display_name || item.name}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      />

                      {/* 查看详情按钮 */}
                      <Link
                        href={detailLink}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <span>查看详情</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}