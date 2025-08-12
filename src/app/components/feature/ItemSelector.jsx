// /src/app/components/ItemSelector.jsx (Fixed undefined.length error)
"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useAppContext } from "@/context/AppContext";
import ItemCard from '../ui/ItemCard';
import CategoryFilter from './CategoryFilter';
import SearchFilter from './SearchFilter';

const INITIAL_LOAD_COUNT = 24;
const LOAD_MORE_COUNT = 24;

export default function ItemSelector({ items }) {
  const { selectedItems, handleItemSelection } = useAppContext();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCount, setVisibleCount] = useState(INITIAL_LOAD_COUNT);
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef(null);
  const loadingRef = useRef(null);

  const categories = useMemo(() => {
    if (!items) return [];
    const allCategories = items.map(item => item.source);
    const uniqueCategories = [...new Set(allCategories)];
    // --- 这是关键改动 ---
    // 过滤掉任何从数据中提取出的名为 "All" 的分类 (不区分大小写)
    return uniqueCategories.filter(category => category && category.toLowerCase() !== 'all');
  }, [items]);

  const categoryFilteredItems = useMemo(() => {
    if (!items) return []; // Defensive check
    if (activeCategory === 'All') return items;
    return items.filter(item => item.source === activeCategory);
  }, [items, activeCategory]);

  const handleCategoryChange = (category) => {
    setSearchTerm('');
    setActiveCategory(category);
    setVisibleCount(INITIAL_LOAD_COUNT);
  };

  const finalSortedItems = useMemo(() => {
    if (!categoryFilteredItems) return []; // Defensive check
    if (!searchTerm) {
      return categoryFilteredItems;
    }
    const matchingItems = [];
    const nonMatchingItems = [];
    for (const item of categoryFilteredItems) {
      if (item.display_name.toLowerCase().includes(searchTerm.toLowerCase())) {
        matchingItems.push(item);
      } else {
        nonMatchingItems.push(item);
      }
    }
    return [...matchingItems, ...nonMatchingItems];
  }, [searchTerm, categoryFilteredItems]);

  useEffect(() => {
    setVisibleCount(INITIAL_LOAD_COUNT);
  }, [finalSortedItems]);

  const hasMore = visibleCount < (finalSortedItems?.length || 0);

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

  // 重置可见数量和加载状态
  useEffect(() => {
    setVisibleCount(INITIAL_LOAD_COUNT);
    setIsLoading(false);
  }, [finalSortedItems]);


  if (!items || items.length === 0) return <div>Loading items...</div>;

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col gap-4">
        <div><CategoryFilter categories={categories} activeCategory={activeCategory} onCategoryChange={handleCategoryChange}/></div>
        <div className="w-full md:max-w-sm"><SearchFilter searchTerm={searchTerm} onSearchChange={setSearchTerm} /></div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 mb-6">
        {finalSortedItems.slice(0, visibleCount).map((item) => {
          const isMatch = item.display_name.toLowerCase().includes(searchTerm.toLowerCase());
          const isDimmed = searchTerm.length > 0 && !isMatch;
          const quantity = selectedItems.get(item.id) || 0;

          return (
            <ItemCard key={item.id} item={item} quantity={quantity} onSelect={handleItemSelection} isDimmed={isDimmed} />
          );
        })}
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
      {!hasMore && finalSortedItems.length > INITIAL_LOAD_COUNT && (
        <div className="text-center py-4">
          <div className="text-gray-500 text-sm">
            ✅ All {finalSortedItems.length} items loaded
          </div>
        </div>
      )}
    </div>
  );
}