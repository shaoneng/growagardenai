// /src/app/components/CategoryFilter.jsx (Final Button Style)
"use client";

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronUp } from 'lucide-react';

const MAX_VISIBLE_CATEGORIES = 4;

export default function CategoryFilter({ categories, activeCategory, onCategoryChange }) {
  const { t } = useTranslation();
  const [showAll, setShowAll] = useState(false);

  const visibleCategories = showAll ? categories : categories.slice(0, MAX_VISIBLE_CATEGORIES);

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      <button
        onClick={() => onCategoryChange('All')}
        className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${activeCategory === 'All' ? 'bg-blue-600 text-white shadow' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
      >
        All
      </button>
      
      {visibleCategories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${activeCategory === category ? 'bg-blue-600 text-white shadow' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          {category}
        </button>
      ))}

      {categories.length > MAX_VISIBLE_CATEGORIES && (
        <button
          onClick={() => setShowAll(!showAll)}
          // --- THIS IS THE CHANGE ---
          // The classes have been updated to create a gray, bordered button style
          className="flex items-center gap-1 rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-300"
        >
          <span>
            {showAll ? t('ShowLess') : t('ShowMore')}
          </span>
          {showAll ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      )}
    </div>
  );
}