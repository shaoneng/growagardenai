'use client';

// /src/app/components/ui/EmptyFavoritesState.tsx
// 收藏为空时的状态组件

import React from 'react';
import Link from 'next/link';
import { Heart, Search, Sparkles } from 'lucide-react';

export default function EmptyFavoritesState() {
  return (
    <div className="bg-white rounded-lg border p-12 text-center">
      {/* 图标和标题 */}
      <div className="mb-6">
        <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
          <Heart className="w-10 h-10 text-gray-400" />
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-blue-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          还没有收藏任何物品
        </h2>
        <p className="text-gray-600 max-w-md mx-auto">
          开始探索作物、宠物和策略报告，将你喜欢的内容添加到收藏夹中，方便以后快速查找！
        </p>
      </div>

      {/* 操作建议 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
        <Link
          href="/crops"
          className="group flex flex-col items-center gap-3 p-6 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
        >
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
            <span className="text-2xl">🌱</span>
          </div>
          <div>
            <div className="font-semibold text-green-900 mb-1">浏览作物</div>
            <div className="text-sm text-green-700">发现各种作物品种</div>
          </div>
        </Link>

        <Link
          href="/pets"
          className="group flex flex-col items-center gap-3 p-6 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
        >
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
            <span className="text-2xl">🐾</span>
          </div>
          <div>
            <div className="font-semibold text-purple-900 mb-1">浏览宠物</div>
            <div className="text-sm text-purple-700">寻找可爱的伙伴</div>
          </div>
        </Link>

        <Link
          href="/"
          className="group flex flex-col items-center gap-3 p-6 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
            <span className="text-2xl">📊</span>
          </div>
          <div>
            <div className="font-semibold text-blue-900 mb-1">生成策略报告</div>
            <div className="text-sm text-blue-700">获取个性化建议</div>
          </div>
        </Link>
      </div>

      {/* 使用提示 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto">
        <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
          <Search className="w-5 h-5" />
          如何添加收藏？
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold">1</span>
            </div>
            <div>
              <div className="font-medium mb-1">在百科全书页面</div>
              <div>点击物品卡片右上角的心形图标</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold">2</span>
            </div>
            <div>
              <div className="font-medium mb-1">在详情页面</div>
              <div>点击大尺寸的收藏按钮</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold">3</span>
            </div>
            <div>
              <div className="font-medium mb-1">在策略报告页面</div>
              <div>收藏有用的个性化建议</div>
            </div>
          </div>
        </div>
      </div>

      {/* 返回首页按钮 */}
      <div className="mt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <span>返回首页</span>
        </Link>
      </div>
    </div>
  );
}