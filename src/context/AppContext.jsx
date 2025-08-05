// src/context/AppContext.jsx (Upgraded for API calls)
"use client";

import { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/navigation'; // <-- 新增: 导入 Next.js 路由器

const AppContext = createContext();

export function AppProvider({ children }) {
  const [selectedItems, setSelectedItems] = useState(new Map());
  const [gold, setGold] = useState('');
  const [inGameDate, setInGameDate] = useState('');

  // --- 新增: 用于处理API请求和结果的状态 ---
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const router = useRouter(); // <-- 新增: 初始化路由器

  const handleItemSelection = (item, action = 'add') => {
    // ... (此函数无变化)
    const newSelectedItems = new Map(selectedItems);
    const currentQty = newSelectedItems.get(item.id) || 0;
    if (action === 'add') newSelectedItems.set(item.id, currentQty + 1);
    else if (action === 'remove') currentQty > 1 ? newSelectedItems.set(item.id, currentQty - 1) : newSelectedItems.delete(item.id);
    setSelectedItems(newSelectedItems);
  };

  // --- 新增: 调用API的核心函数 ---
  const requestAnalysis = async () => {
    if (selectedItems.size === 0) return;

    setIsLoading(true); // 开始加载

    // 将 Map 转换为 API 需要的 object 格式
    const itemsObject = Object.fromEntries(selectedItems);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selectedItems: itemsObject,
          gold: Number(gold), // 确保 gold 是数字
          inGameDate: inGameDate
        })
      });

      if (!response.ok) {
        // 如果API返回错误状态，抛出错误
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();
      setReportData(data); // 将AI返回的数据存入 state
      router.push('/report'); // 跳转到报告页面

    } catch (error) {
      console.error("Failed to fetch analysis:", error);
      alert("Failed to get analysis. Please try again."); // 给用户一个简单的错误提示
    } finally {
      setIsLoading(false); // 结束加载
    }
  };

  const value = {
    selectedItems,
    gold,
    inGameDate,
    isLoading, // <-- 导出
    reportData, // <-- 导出
    handleItemSelection,
    setGold,
    setInGameDate,
    requestAnalysis, // <-- 导出
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