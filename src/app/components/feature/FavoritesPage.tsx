'use client';

// /src/app/components/feature/FavoritesPage.tsx
// 收藏页面主组件

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Heart, Search, Grid, List, ArrowLeft } from 'lucide-react';
import { useFavorites, useFavoritesStats } from '@/contexts/FavoritesContext';
import { FavoritesStatsCard } from '../ui/FavoritesBadge';
import FavoriteItemCard from '../ui/FavoriteItemCard';
import FavoriteItemList from '../ui/FavoriteItemList';
import EmptyFavoritesState from '../ui/EmptyFavoritesState';

// 导入数据
import itemsData from '../../../../public/data/items.json';

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const stats = useFavoritesStats();
  
  // 状态管理
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'crops', 'pets', 'reports'
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('name'); // 'name', 'tier', 'dateAdded', 'publicationDate'

  // 获取收藏的物品详细信息
  const favoriteItems = useMemo(() => {
    const allItems = itemsData as any[];
    const favoriteItemsData: any[] = [];

    // 获取收藏的作物
    favorites.crops.forEach(cropId => {
      const crop = allItems.find(item => item.name === cropId);
      if (crop) {
        favoriteItemsData.push({
          ...crop,
          type: 'crops' as const,
          addedAt: new Date().toISOString() // 暂时使用当前时间，实际应该从存储中获取
        });
      }
    });

    // 获取收藏的宠物
    favorites.pets.forEach(petId => {
      const pet = allItems.find(item => item.name === petId);
      if (pet) {
        favoriteItemsData.push({
          ...pet,
          type: 'pets' as const,
          addedAt: new Date().toISOString()
        });
      }
    });

    // 获取收藏的策略报告
    if (favorites.reports) {
      favorites.reports.forEach(reportId => {
        // 这里需要从某个地方获取报告数据，暂时创建模拟数据
        favoriteItemsData.push({
          id: reportId,
          name: reportId,
          display_name: `Strategy Report ${reportId}`,
          type: 'reports' as const,
          addedAt: new Date().toISOString(),
          reportId: reportId,
          publicationDate: new Date().toISOString(),
          mainTitle: `Strategy Report ${reportId}`,
          subTitle: 'Personalized Planting Advice'
        });
      });
    }

    return favoriteItemsData;
  }, [favorites]);

  // 过滤和排序收藏物品
  const filteredAndSortedItems = useMemo(() => {
    let filtered = [...favoriteItems];

    // 类型过滤
    if (activeFilter !== 'all') {
      filtered = filtered.filter(item => item.type === activeFilter);
    }

    // 搜索过滤
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 排序
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.display_name || a.name).localeCompare(b.display_name || b.name);
        case 'tier':
          const tierOrder = { 'Common': 1, 'Uncommon': 2, 'Rare': 3, 'Legendary': 4 };
          return (tierOrder[a.tier as keyof typeof tierOrder] || 0) - (tierOrder[b.tier as keyof typeof tierOrder] || 0);
        case 'dateAdded':
          return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
        case 'publicationDate':
          // 策略报告按生成日期排序
          const aDate = a.publicationDate ? new Date(a.publicationDate).getTime() : 0;
          const bDate = b.publicationDate ? new Date(b.publicationDate).getTime() : 0;
          return bDate - aDate;
        default:
          return 0;
      }
    });

    return filtered;
  }, [favoriteItems, activeFilter, searchTerm, sortBy]);

  // 按类型分组的物品
  const groupedItems = useMemo(() => {
    const crops = filteredAndSortedItems.filter(item => item.type === 'crops');
    const pets = filteredAndSortedItems.filter(item => item.type === 'pets');
    const reports = filteredAndSortedItems.filter(item => item.type === 'reports');
    return { crops, pets, reports };
  }, [filteredAndSortedItems]);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* 页面头部 */}
        <div className="mb-8">
          {/* 面包屑导航 */}
          <nav className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">My Favorites</span>
          </nav>

          {/* 页面标题和返回按钮 */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Link 
                href="/"
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="Back to Home"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <Heart className="w-8 h-8 text-red-500" fill="currentColor" />
                  My Favorites
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage your favorite crops and pets
                </p>
              </div>
            </div>

            {/* 视图切换 */}
            <div className="flex items-center gap-2 bg-white rounded-lg border p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 统计信息 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <FavoritesStatsCard
              totalCount={stats.totalCount}
              cropsCount={stats.cropsCount}
              petsCount={stats.petsCount}
              reportsCount={stats.reportsCount}
            />
            
            <div className="bg-white rounded-lg border p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <h3 className="font-semibold text-gray-900">Crop Favorites</h3>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {stats.cropsCount}
              </div>
              <div className="text-sm text-gray-500">
                {stats.totalCount > 0 ? Math.round((stats.cropsCount / stats.totalCount) * 100) : 0}% of favorites
              </div>
            </div>

            <div className="bg-white rounded-lg border p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <h3 className="font-semibold text-gray-900">Pet Favorites</h3>
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {stats.petsCount}
              </div>
              <div className="text-sm text-gray-500">
                {stats.totalCount > 0 ? Math.round((stats.petsCount / stats.totalCount) * 100) : 0}% of favorites
              </div>
            </div>

            <div className="bg-white rounded-lg border p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <h3 className="font-semibold text-gray-900">Strategy Reports</h3>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {stats.reportsCount}
              </div>
              <div className="text-sm text-gray-500">
                {stats.totalCount > 0 ? Math.round((stats.reportsCount / stats.totalCount) * 100) : 0}% of favorites
              </div>
            </div>
          </div>
        </div>

        {/* 控制面板 */}
        {stats.totalCount > 0 && (
          <div className="bg-white rounded-lg border p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* 搜索 */}
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search favorite items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* 类型过滤 */}
              <div>
                <select
                  value={activeFilter}
                  onChange={(e) => setActiveFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="all">All Types</option>
                  <option value="crops">Crops</option>
                  <option value="pets">Pets</option>
                  <option value="reports">Strategy Reports</option>
                </select>
              </div>

              {/* 排序 */}
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="name">Sort by Name</option>
                  <option value="tier">Sort by Rarity</option>
                  <option value="dateAdded">Sort by Date Added</option>
                  <option value="publicationDate">Sort by Publication Date</option>
                </select>
              </div>
            </div>

            {/* 过滤结果统计 */}
            <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
              <div>
                Showing {filteredAndSortedItems.length} items
                {searchTerm && (
                  <span className="ml-2">
                    for "{searchTerm}"
                  </span>
                )}
              </div>
              
              {(searchTerm || activeFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setActiveFilter('all');
                  }}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        )}

        {/* 主要内容区域 */}
        {stats.isEmpty ? (
          <EmptyFavoritesState />
        ) : filteredAndSortedItems.length === 0 ? (
          // 搜索无结果
          <div className="bg-white rounded-lg border p-12 text-center">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No matching favorites found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms or filter options
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setActiveFilter('all');
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Show All Favorites
            </button>
          </div>
        ) : (
          // 收藏物品展示
          <div className="space-y-8">
            {activeFilter === 'all' ? (
              // 分组显示
              <>
                {groupedItems.crops.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <h2 className="text-xl font-semibold text-gray-900">
                        🌱 Crop Favorites
                      </h2>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                        {groupedItems.crops.length}
                      </span>
                    </div>
                    {viewMode === 'grid' ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {groupedItems.crops.map((item) => (
                          <FavoriteItemCard key={item.name} item={item} />
                        ))}
                      </div>
                    ) : (
                      <FavoriteItemList items={groupedItems.crops} />
                    )}
                  </div>
                )}

                {groupedItems.pets.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <h2 className="text-xl font-semibold text-gray-900">
                        🐾 Pet Favorites
                      </h2>
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                        {groupedItems.pets.length}
                      </span>
                    </div>
                    {viewMode === 'grid' ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {groupedItems.pets.map((item) => (
                          <FavoriteItemCard key={item.name} item={item} />
                        ))}
                      </div>
                    ) : (
                      <FavoriteItemList items={groupedItems.pets} />
                    )}
                  </div>
                )}

                {groupedItems.reports.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <h2 className="text-xl font-semibold text-gray-900">
                        📊 Strategy Report Favorites
                      </h2>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {groupedItems.reports.length}
                      </span>
                    </div>
                    {viewMode === 'grid' ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {groupedItems.reports.map((item) => (
                          <FavoriteItemCard key={item.reportId || item.name} item={item} />
                        ))}
                      </div>
                    ) : (
                      <FavoriteItemList items={groupedItems.reports} />
                    )}
                  </div>
                )}
              </>
            ) : (
              // 统一显示
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {activeFilter === 'crops' ? '🌱 Crop Favorites' : 
                     activeFilter === 'pets' ? '🐾 Pet Favorites' : 
                     activeFilter === 'reports' ? '📊 Strategy Report Favorites' : 'All Favorites'}
                  </h2>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    {filteredAndSortedItems.length}
                  </span>
                </div>
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {filteredAndSortedItems.map((item) => (
                      <FavoriteItemCard key={item.name} item={item} />
                    ))}
                  </div>
                ) : (
                  <FavoriteItemList items={filteredAndSortedItems} />
                )}
              </div>
            )}
          </div>
        )}

        {/* 快速操作区域 */}
        {stats.totalCount > 0 && (
          <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/crops"
                className="flex items-center gap-3 p-4 bg-white rounded-lg border hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🌱</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Browse More Crops</div>
                  <div className="text-sm text-gray-600">Discover new crop varieties</div>
                </div>
              </Link>

              <Link
                href="/pets"
                className="flex items-center gap-3 p-4 bg-white rounded-lg border hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🐾</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Browse More Pets</div>
                  <div className="text-sm text-gray-600">Find adorable companions</div>
                </div>
              </Link>

              <Link
                href="/"
                className="flex items-center gap-3 p-4 bg-white rounded-lg border hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🤖</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">AI Strategy Advisor</div>
                  <div className="text-sm text-gray-600">Get personalized recommendations</div>
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}