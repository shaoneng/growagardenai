// /src/app/components/feature/EncyclopediaBase.jsx
// 百科全书基础组件

"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import EncyclopediaItemCard from '../ui/EncyclopediaItemCard';
import SimpleTestCard from '../ui/SimpleTestCard';
import SearchFilter from './SearchFilter';
import CategoryFilter from './CategoryFilter';

const INITIAL_LOAD_COUNT = 24;
const LOAD_MORE_COUNT = 24;

export default function EncyclopediaBase({ 
  items = [], 
  title = "Encyclopedia",
  type = "items", // "pets" or "crops"
  showBeginnerRecommendations = true 
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // URL状态同步
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'All');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'name');
  const [showBeginnerOnly, setShowBeginnerOnly] = useState(searchParams.get('beginner') === 'true');
  
  // 无限滚动状态
  const [visibleCount, setVisibleCount] = useState(INITIAL_LOAD_COUNT);
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef(null);
  const loadingRef = useRef(null);

  // 更新URL参数
  const updateURL = useCallback((params) => {
    const newSearchParams = new URLSearchParams(searchParams);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== 'All' && value !== 'name' && value !== false) {
        newSearchParams.set(key, value.toString());
      } else {
        newSearchParams.delete(key);
      }
    });

    const newURL = `${window.location.pathname}?${newSearchParams.toString()}`;
    router.replace(newURL, { scroll: false });
  }, [router, searchParams]);

  // 分类提取
  const categories = useMemo(() => {
    if (!items || items.length === 0) return [];
    
    // 根据类型提取不同的分类
    if (type === 'pets') {
      // 宠物按奖励类型分类
      const bonusTypes = items.map(item => item.bonus_type).filter(Boolean);
      const tiers = items.map(item => item.tier).filter(Boolean);
      return [...new Set([...bonusTypes, ...tiers])];
    } else {
      // 作物按稀有度分类
      const tiers = items.map(item => item.tier).filter(Boolean);
      return [...new Set(tiers)];
    }
  }, [items, type]);

  // 过滤和排序逻辑
  const processedItems = useMemo(() => {
    if (!items || items.length === 0) return [];
    
    let filtered = [...items];
    
    // 新手推荐过滤
    if (showBeginnerOnly) {
      filtered = filtered.filter(item => 
        item.tier === 'Common' || item.tier === 'Uncommon'
      );
    }
    
    // 分类过滤
    if (activeCategory !== 'All') {
      filtered = filtered.filter(item => 
        item.tier === activeCategory || 
        item.bonus_type === activeCategory ||
        item.source === activeCategory
      );
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
          return (tierOrder[a.tier] || 0) - (tierOrder[b.tier] || 0);
        case 'price':
          const aPrice = a.prices ? Object.values(a.prices)[0] : 0;
          const bPrice = b.prices ? Object.values(b.prices)[0] : 0;
          return (bPrice || 0) - (aPrice || 0);
        default:
          return 0;
      }
    });
    
    return filtered;
  }, [items, activeCategory, searchTerm, sortBy, showBeginnerOnly]);

  const visibleItems = useMemo(() => {
    return processedItems.slice(0, visibleCount);
  }, [processedItems, visibleCount]);

  const hasMore = visibleCount < processedItems.length;

  // 无限滚动加载
  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + LOAD_MORE_COUNT);
      setIsLoading(false);
    }, 300);
  }, [isLoading, hasMore]);

  // Intersection Observer设置
  useEffect(() => {
    if (!loadingRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px'
      }
    );

    observer.observe(loadingRef.current);
    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMore, hasMore, isLoading]);

  // 重置可见数量
  useEffect(() => {
    setVisibleCount(INITIAL_LOAD_COUNT);
    setIsLoading(false);
  }, [processedItems]);

  // 处理搜索变化
  const handleSearchChange = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
    updateURL({ search: newSearchTerm, category: activeCategory, sort: sortBy, beginner: showBeginnerOnly });
  };

  // 处理分类变化
  const handleCategoryChange = (newCategory) => {
    setActiveCategory(newCategory);
    updateURL({ search: searchTerm, category: newCategory, sort: sortBy, beginner: showBeginnerOnly });
  };

  // 处理排序变化
  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    updateURL({ search: searchTerm, category: activeCategory, sort: newSort, beginner: showBeginnerOnly });
  };

  // 处理新手模式切换
  const handleBeginnerToggle = (enabled) => {
    setShowBeginnerOnly(enabled);
    updateURL({ search: searchTerm, category: activeCategory, sort: sortBy, beginner: enabled });
  };

  // 处理物品点击 - 导航到详情页
  const handleItemClick = (item) => {
    const itemName = item.name.toLowerCase().replace(/\s+/g, '-');
    router.push(`/${type}/${itemName}`);
  };

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg mb-2">Loading {title}...</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* 控制面板 */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* 搜索 */}
          <div className="lg:col-span-2">
            <SearchFilter 
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              placeholder={`Search ${type}...`}
            />
          </div>
          
          {/* 排序 */}
          <div className="flex items-center h-10">
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <optgroup label="Sort by">
                <option value="name">Name</option>
                <option value="tier">Rarity</option>
                {type === 'crops' && <option value="price">Price</option>}
              </optgroup>
            </select>
          </div>
          
          {/* 新手推荐切换 - 与搜索框居中对齐 */}
          {showBeginnerRecommendations && (
            <div className="flex items-center h-10">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showBeginnerOnly}
                  onChange={(e) => handleBeginnerToggle(e.target.checked)}
                  className="sr-only"
                />
                <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  showBeginnerOnly ? 'bg-blue-600' : 'bg-gray-200'
                }`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    showBeginnerOnly ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </div>
                <span className="ml-2 text-sm text-gray-700">Beginner Friendly</span>
              </label>
            </div>
          )}
        </div>
        
        {/* 分类过滤 */}
        <CategoryFilter 
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />
      </div>

      {/* 结果统计 */}
      <div className="mb-6 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Showing {visibleItems.length} of {processedItems.length} {type}
          {showBeginnerOnly && (
            <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              Beginner Friendly
            </span>
          )}
        </div>
        
        {processedItems.length > 0 && (
          <div className="text-sm text-gray-500">
            Total: {items.length} {type}
          </div>
        )}
      </div>

      {/* 物品网格 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
        {visibleItems.map((item) => (
          <EncyclopediaItemCard
            key={item.id}
            item={item}
            type={type}
            onClick={handleItemClick}
          />
        ))}
      </div>

      {/* 无限滚动指示器 */}
      {hasMore && (
        <div 
          ref={loadingRef}
          className="text-center py-8"
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-600">Loading more {type}...</span>
            </div>
          ) : (
            <div className="text-gray-400 text-sm">
              Scroll down to load more {type}
            </div>
          )}
        </div>
      )}

      {/* 加载完成提示 */}
      {!hasMore && processedItems.length > INITIAL_LOAD_COUNT && (
        <div className="text-center py-4">
          <div className="text-gray-500 text-sm">
            ✅ All {processedItems.length} {type} loaded
          </div>
        </div>
      )}

      {/* 无结果提示 */}
      {processedItems.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">No {type} found</div>
          <div className="text-gray-500 text-sm">
            Try adjusting your search or filter criteria
          </div>
        </div>
      )}
    </div>
  );
}