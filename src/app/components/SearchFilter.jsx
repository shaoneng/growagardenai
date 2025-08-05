// /src/app/components/SearchFilter.jsx
"use client";

import { useTranslation } from "react-i18next";

export default function SearchFilter({ searchTerm, onSearchChange }) {
  const { t } = useTranslation('common');

  return (
    <div className="mb-6 w-full">
      <input
        type="text"
        placeholder={t('search.placeholder', 'Search for items...')} // 假设 i18n 文件中有这个键
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      />
    </div>
  );
}