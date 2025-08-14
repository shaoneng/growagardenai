// src/context/AppContext.jsx
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
  const [interactionMode, setInteractionMode] = useState('advanced'); // 默认进阶模式
  const [expertOptions, setExpertOptions] = useState({
    optimizationGoal: 'balanced',
    riskTolerance: 'moderate',
    timeHorizon: 'medium'
  });
  const router = useRouter();

  const handleItemSelection = (item, action = 'add') => {
    const newSelectedItems = new Map(selectedItems);
    const currentQty = newSelectedItems.get(item.id) || 0;
    if (action === 'add') newSelectedItems.set(item.id, currentQty + 1);
    else if (action === 'remove') currentQty > 1 ? newSelectedItems.set(item.id, currentQty - 1) : newSelectedItems.delete(item.id);
    setSelectedItems(newSelectedItems);
  };

  const requestAnalysisWithParams = async (useBeginnerDefaults = false, goldAmount = null, gameDateParam = null) => {
    const effectiveGold = goldAmount !== null ? goldAmount : gold;
    const effectiveGameDate = gameDateParam !== null ? gameDateParam : inGameDate;
    
    let itemsToAnalyze = Object.fromEntries(selectedItems);
    
    // 如果是新手模式且使用默认推荐，自动选择推荐物品
    if (useBeginnerDefaults && interactionMode === 'beginner') {
      // 根据金币数量推荐不同的物品组合
      const goldNum = Number(effectiveGold);
      if (goldNum <= 100) {
        itemsToAnalyze = {
          1: 5,  // 假设1是胡萝卜的ID
          2: 3   // 假设2是草莓的ID
        };
      } else if (goldNum <= 300) {
        itemsToAnalyze = {
          1: 8,  // 胡萝卜
          2: 5,  // 草莓
          3: 2   // 假设3是蓝莓的ID
        };
      } else {
        itemsToAnalyze = {
          1: 10, // 胡萝卜
          2: 8,  // 草莓
          3: 5,  // 蓝莓
          4: 2   // 假设4是玫瑰的ID
        };
      }
    }
    
    if (Object.keys(itemsToAnalyze).length === 0) return;
    setIsLoading(true);

    const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selectedItems: itemsToAnalyze,
          gold: Number(effectiveGold),
          inGameDate: effectiveGameDate,
          currentDate: currentDate,
          interactionMode: interactionMode,
          expertOptions: expertOptions
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `API Error: ${response.statusText}`);
      }

      // 生成报告ID（如果没有的话）
      if (!data.reportId) {
        data.reportId = `GGSB-${Date.now()}`;
      }
      
      // 保存报告数据到localStorage
      try {
        const existingReports = JSON.parse(localStorage.getItem('growagarden_reports') || '{}');
        existingReports[data.reportId] = {
          ...data,
          savedAt: new Date().toISOString()
        };
        localStorage.setItem('growagarden_reports', JSON.stringify(existingReports));
      } catch (error) {
        console.warn('Failed to save report to localStorage:', error);
      }

      setReportData(data);
      router.push('/report-summary');

    } catch (error) {
      console.error("Failed to fetch analysis:", error);
      alert(`Failed to get analysis:\n${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const requestAnalysis = async (useBeginnerDefaults = false) => {
    let itemsToAnalyze = Object.fromEntries(selectedItems);
    
    // 如果是新手模式且使用默认推荐，自动选择推荐物品
    if (useBeginnerDefaults && interactionMode === 'beginner') {
      // 根据金币数量推荐不同的物品组合
      const goldAmount = Number(gold);
      if (goldAmount <= 100) {
        itemsToAnalyze = {
          1: 5,  // 假设1是胡萝卜的ID
          2: 3   // 假设2是草莓的ID
        };
      } else if (goldAmount <= 300) {
        itemsToAnalyze = {
          1: 8,  // 胡萝卜
          2: 5,  // 草莓
          3: 2   // 假设3是蓝莓的ID
        };
      } else {
        itemsToAnalyze = {
          1: 10, // 胡萝卜
          2: 8,  // 草莓
          3: 5,  // 蓝莓
          4: 2   // 假设4是玫瑰的ID
        };
      }
    }
    
    if (Object.keys(itemsToAnalyze).length === 0) return;
    setIsLoading(true);

    const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selectedItems: itemsToAnalyze,
          gold: Number(gold),
          inGameDate: inGameDate,
          currentDate: currentDate,
          interactionMode: interactionMode,
          expertOptions: expertOptions
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `API Error: ${response.statusText}`);
      }

      // 生成报告ID（如果没有的话）
      if (!data.reportId) {
        data.reportId = `GGSB-${Date.now()}`;
      }
      
      // 保存报告数据到localStorage
      try {
        const existingReports = JSON.parse(localStorage.getItem('growagarden_reports') || '{}');
        existingReports[data.reportId] = {
          ...data,
          savedAt: new Date().toISOString()
        };
        localStorage.setItem('growagarden_reports', JSON.stringify(existingReports));
      } catch (error) {
        console.warn('Failed to save report to localStorage:', error);
      }

      setReportData(data);
      router.push('/report-summary');

    } catch (error) {
      console.error("Failed to fetch analysis:", error);
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
    interactionMode,
    expertOptions,
    handleItemSelection,
    setGold,
    setInGameDate,
    setInteractionMode,
    setExpertOptions,
    setReportData,
    requestAnalysis,
    requestAnalysisWithParams,
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
