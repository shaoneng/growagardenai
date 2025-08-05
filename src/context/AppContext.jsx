// src/context/AppContext.jsx (Improved Error Handling)
"use client";

import { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [selectedItems, setSelectedItems] = useState(new Map());
  const [gold, setGold] = useState('');
  const [inGameDate, setInGameDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const router = useRouter();

  const handleItemSelection = (item, action = 'add') => {
    const newSelectedItems = new Map(selectedItems);
    const currentQty = newSelectedItems.get(item.id) || 0;
    if (action === 'add') newSelectedItems.set(item.id, currentQty + 1);
    else if (action === 'remove') currentQty > 1 ? newSelectedItems.set(item.id, currentQty - 1) : newSelectedItems.delete(item.id);
    setSelectedItems(newSelectedItems);
  };

  const requestAnalysis = async () => {
    if (selectedItems.size === 0) return;
    setIsLoading(true);
    const itemsObject = Object.fromEntries(selectedItems);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selectedItems: itemsObject,
          gold: Number(gold),
          inGameDate: inGameDate
        })
      });

      // --- 这是关键改动 ---
      // 即使状态码是400或500，我们也要读取其中的错误信息
      const data = await response.json();

      if (!response.ok) {
        // 将后端返回的更具体的错误信息抛出
        throw new Error(data.error || `API Error: ${response.statusText}`);
      }

      setReportData(data);
      router.push('/report');

    } catch (error) {
      console.error("Failed to fetch analysis:", error);
      // 将具体的错误信息展示给用户
      alert(`Failed to get analysis:\n${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    selectedItems,
    gold,
    inGameDate,
    isLoading,
    reportData,
    handleItemSelection,
    setGold,
    setInGameDate,
    requestAnalysis,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}