// /src/app/components/feature/ModeAwareItemSelector.jsx
"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useAppContext } from "@/context/AppContext";
import ItemCard from '../ui/ItemCard';
import CategoryFilter from './CategoryFilter';
import SearchFilter from './SearchFilter';

const INITIAL_LOAD_COUNT = 24;
const LOAD_MORE_COUNT = 24;

export default function ModeAwareItemSelector({ items }) {
  const { selectedItems, handleItemSelection, interactionMode } = useAppContext();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCount, setVisibleCount] = useState(INITIAL_LOAD_COUNT);
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef(null);
  const loadingRef = useRef(null);

  // 根据交互模式过滤和排序物品
  const modeFilteredItems = useMemo(() => {
    if (!items) return [];
    
    let filteredItems = [...items];
    
    switch (interactionMode) {
      case 'beginner':
        // 新手模式：只显示Common和Uncommon物品，按简单程度排序
        filteredItems = items.filter(item => 
          item.tier === 'Common' || item.tier === 'Uncommon'
        );
        // 优先显示简单的作物
        filteredItems.sort((a, b) => {
          const simpleItems = ['carrot', 'strawberry', 'blueberry', 'rose'];
          const aIsSimple = simpleItems.some(simple => 
            a.name.toLowerCase().includes(simple)
          );
          const bIsSimple = simpleItems.some(simple => 
            b.name.toLowerCase().includes(simple)
          );
          if (aIsSimple && !bIsSimple) return -1;
          if (!aIsSimple && bIsSimple) return 1;
          return 0;
        });
        break;
        
      case 'advanced':
        // 进阶模式：显示所有物品，按稀有度和价值排序
        filteredItems.sort((a, b) => {
          const tierOrder = { 'Common': 1, 'Uncommon': 2, 'Rare': 3, 'Legendary': 4 };
          return tierOrder[a.tier] - tierOrder[b.tier];
        });
        break;
        
      case 'expert':
        // 专家模式：显示所有物品，按复杂度和潜在收益排序
        filteredItems.sort((a, b) => {
          // 优先显示高价值和复杂的物品
          const tierOrder = { 'Legendary': 1, 'Rare': 2, 'Uncommon': 3, 'Common': 4 };
          return tierOrder[a.tier] - tierOrder[b.tier];
        });
        break;
        
      default:
        // 默认排序
        break;
    }
    
    return filteredItems;
  }, [items, interactionMode]);

  const categories = useMemo(() => {
    if (!modeFilteredItems) return [];
    const allCategories = modeFilteredItems.map(item => item.source);
    const uniqueCategories = [...new Set(allCategories)];
    return uniqueCategories.filter(category => category && category.toLowerCase() !== 'all');
  }, [modeFilteredItems]);

  const categoryFilteredItems = useMemo(() => {
    if (!modeFilteredItems) return [];
    if (activeCategory === 'All') return modeFilteredItems;
    return modeFilteredItems.filter(item => item.source === activeCategory);
  }, [modeFilteredItems, activeCategory]);

  const searchFilteredItems = useMemo(() => {
    if (!searchTerm) return categoryFilteredItems;
    return categoryFilteredItems.filter(item =>
      item.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categoryFilteredItems, searchTerm]);

  const visibleItems = useMemo(() => {
    return searchFilteredItems.slice(0, visibleCount);
  }, [searchFilteredItems, visibleCount]);

  const hasMore = visibleCount < searchFilteredItems.length;

  // 无限滚动加载更多
  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    // 模拟加载延迟，提供更好的用户体验
    setTimeout(() => {
      setVisibleCount(prev => prev + LOAD_MORE_COUNT);
      setIsLoading(false);
    }, 300);
  }, [isLoading, hasMore]);

  // 设置Intersection Observer来检测滚动到底部
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
        rootMargin: '100px' // 提前100px开始加载
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

  // 重置可见数量当搜索或分类改变时
  useEffect(() => {
    setVisibleCount(INITIAL_LOAD_COUNT);
    setIsLoading(false);
  }, [searchTerm, activeCategory, interactionMode]);

  // 根据模式显示不同的指导文本
  const getModeGuidance = () => {
    switch (interactionMode) {
      case 'beginner':
        return {
          title: "Choose Your First Items 🌱",
          description: "We've selected the best items for beginners. Start with simple crops like carrots and strawberries!",
          tip: "💡 Tip: Look for items marked as 'Common' - they're easier to manage and give quick results."
        };
      case 'advanced':
        return {
          title: "Build Your Strategy 🗺️",
          description: "Select items that align with your strategic goals. Consider seasonal bonuses and synergies.",
          tip: "💡 Tip: Mix different tiers for a balanced portfolio. Rare items offer higher returns but need more investment."
        };
      case 'expert':
        return {
          title: "Optimize Your Portfolio ⚡",
          description: "Choose items based on your risk tolerance and optimization goals. Focus on ROI and market opportunities.",
          tip: "💡 Tip: Legendary items are shown first - they offer the highest potential but require significant resources."
        };
      default:
        return {
          title: "Select Your Items",
          description: "Choose the items you currently have or want to analyze.",
          tip: ""
        };
    }
  };

  const guidance = getModeGuidance();

  return (
    <div className="w-full">
      {/* 模式特定的指导 */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {guidance.title}
        </h2>
        <p className="text-gray-600 mb-2">
          {guidance.description}
        </p>
        {guidance.tip && (
          <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
            {guidance.tip}
          </div>
        )}
      </div>

      {/* 搜索和筛选 */}
      <div className="mb-6 space-y-4">
        <SearchFilter 
          searchTerm={searchTerm} 
          onSearchChange={setSearchTerm}
          placeholder={
            interactionMode === 'beginner' 
              ? "Search for simple items..." 
              : "Search items..."
          }
        />
        <CategoryFilter 
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      </div>

      {/* 结果统计 */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {visibleItems.length} of {searchFilteredItems.length} items
        {interactionMode === 'beginner' && (
          <span className="ml-2 text-green-600">
            (Filtered for beginners)
          </span>
        )}
      </div>

      {/* 物品网格 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
        {visibleItems.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            quantity={selectedItems.get(item.id) || 0}
            onAdd={() => handleItemSelection(item, 'add')}
            onRemove={() => handleItemSelection(item, 'remove')}
            showTierBadge={interactionMode !== 'beginner'} // 新手模式隐藏稀有度标签
            showPrices={interactionMode === 'expert'} // 只在专家模式显示价格
          />
        ))}
      </div>

      {/* 无限滚动加载指示器 */}
      {hasMore && (
        <div 
          ref={loadingRef}
          className="text-center py-8"
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-600">Loading more items...</span>
            </div>
          ) : (
            <div className="text-gray-400 text-sm">
              Scroll down to load more items
            </div>
          )}
        </div>
      )}

      {/* 加载完成提示 */}
      {!hasMore && searchFilteredItems.length > INITIAL_LOAD_COUNT && (
        <div className="text-center py-4">
          <div className="text-gray-500 text-sm">
            ✅ All {searchFilteredItems.length} items loaded
          </div>
        </div>
      )}

      {/* 无结果提示 */}
      {searchFilteredItems.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">No items found</div>
          <div className="text-gray-500 text-sm">
            Try adjusting your search or category filter
          </div>
        </div>
      )}
    </div>
  );
}