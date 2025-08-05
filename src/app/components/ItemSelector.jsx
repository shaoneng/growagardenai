// /src/app/components/ItemSelector.jsx (Fixed undefined.length error)
"use client";

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useAppContext } from "@/context/AppContext";
import ItemCard from './ItemCard';
import CategoryFilter from './CategoryFilter';
import SearchFilter from './SearchFilter';

const INITIAL_LOAD_COUNT = 24;
const LOAD_MORE_COUNT = 24;

export default function ItemSelector({ items }) {
  const { selectedItems, handleItemSelection } = useAppContext();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCount, setVisibleCount] = useState(INITIAL_LOAD_COUNT);

  const categories = useMemo(() => {
    if (!items) return []; // Defensive check
    const allCategories = items.map(item => item.source);
    return [...new Set(allCategories)];
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

  // --- 这是关键改动 ---
  const handleScroll = useCallback(() => {
    // 1. 增加一个安全检查，如果 finalSortedItems 不存在，则直接返回
    if (!finalSortedItems) return;

    // 2. 在这里使用可选链 (?.) 来安全地访问 .length
    if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 200 && visibleCount < (finalSortedItems?.length || 0)) {
      setVisibleCount(prevCount => prevCount + LOAD_MORE_COUNT);
    }
  }, [visibleCount, finalSortedItems]); // 3. 将依赖项从 finalSortedItems.length 改为 finalSortedItems 本身

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);


  if (!items || items.length === 0) return <div>Loading items...</div>;

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col gap-4">
        <div><CategoryFilter categories={categories} activeCategory={activeCategory} onCategoryChange={handleCategoryChange}/></div>
        <div className="w-full md:max-w-sm"><SearchFilter searchTerm={searchTerm} onSearchChange={setSearchTerm} /></div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {finalSortedItems.slice(0, visibleCount).map((item) => {
          const isMatch = item.display_name.toLowerCase().includes(searchTerm.toLowerCase());
          const isDimmed = searchTerm.length > 0 && !isMatch;
          const quantity = selectedItems.get(item.id) || 0;

          return (
            <ItemCard key={item.id} item={item} quantity={quantity} onSelect={handleItemSelection} isDimmed={isDimmed} />
          );
        })}
      </div>
    </div>
  );
}