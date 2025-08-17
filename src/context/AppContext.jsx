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
      console.log('🚀 AppContext: Calling Gemini AI via API route...');
      
      // 🤖 调用服务器端 API 路由，让 Gemini AI 生成报告
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedItems: itemsToAnalyze,
          gold: Number(effectiveGold),
          inGameDate: effectiveGameDate,
          currentDate: currentDate,
          interactionMode: interactionMode,
          expertOptions: expertOptions
        })
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (jsonError) {
          console.error('Failed to parse error response as JSON:', jsonError);
          throw new Error(`API request failed with status ${response.status}`);
        }
        throw new Error(errorData.error || `API request failed with status ${response.status}`);
      }

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('Failed to parse API response as JSON:', jsonError);
        throw new Error('Invalid JSON response from server. Please try again.');
      }

      // 验证响应数据的完整性
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format from server');
      }

      // 检查API响应格式 - 数据可能在data字段中
      const reportData = data.data || data;
      
      if (!reportData.mainTitle || !reportData.sections) {
        console.warn('Incomplete response data:', data);
        throw new Error('Incomplete report data received from server');
      }

      console.log('✅ AppContext: Gemini AI report received!');
      console.log(`- Report title: ${reportData.mainTitle}`);
      console.log(`- Sections: ${reportData.sections?.length || 0}`);

      // 生成报告ID
      reportData.reportId = `GGSB-${Date.now()}`;
      
      // 保存报告数据到localStorage
      try {
        const existingReports = JSON.parse(localStorage.getItem('growagarden_reports') || '{}');
        existingReports[reportData.reportId] = {
          ...reportData,
          savedAt: new Date().toISOString()
        };
        localStorage.setItem('growagarden_reports', JSON.stringify(existingReports));
      } catch (error) {
        console.warn('Failed to save report to localStorage:', error);
      }

      setReportData(reportData);
      router.push('/report-summary');

    } catch (error) {
      console.error("Failed to generate analysis:", error);
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
      console.log('🚀 AppContext: Calling Gemini AI via API route...');
      
      // 🤖 调用服务器端 API 路由，让 Gemini AI 生成报告
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedItems: itemsToAnalyze,
          gold: Number(gold),
          inGameDate: inGameDate,
          currentDate: currentDate,
          interactionMode: interactionMode,
          expertOptions: expertOptions
        })
      });

      const rawText = await response.text();
      let data;
      try {
        data = JSON.parse(rawText);
      } catch {
        throw new Error(rawText || `API request failed with status ${response.status}`);
      }

      if (!response.ok) {
        throw new Error(data.error || data.message || rawText || `API request failed with status ${response.status}`);
      }

      // 检查API响应格式 - 数据可能在data字段中
      const reportData = data.data || data;
      
      if (!reportData.mainTitle || !reportData.sections) {
        console.warn('Incomplete response data:', data);
        throw new Error('Incomplete report data received from server');
      }
      
      console.log('✅ AppContext: Gemini AI report received!');
      console.log(`- Report title: ${reportData.mainTitle}`);
      console.log(`- Sections: ${reportData.sections?.length || 0}`);

      // 生成报告ID
      reportData.reportId = `GGSB-${Date.now()}`;
      
      // 保存报告数据到localStorage
      try {
        const existingReports = JSON.parse(localStorage.getItem('growagarden_reports') || '{}');
        existingReports[reportData.reportId] = {
          ...reportData,
          savedAt: new Date().toISOString()
        };
        localStorage.setItem('growagarden_reports', JSON.stringify(existingReports));
      } catch (error) {
        console.warn('Failed to save report to localStorage:', error);
      }

      setReportData(reportData);
      router.push('/report-summary');

    } catch (error) {
      console.error("Failed to generate analysis:", error);
      alert(`Failed to generate analysis:\n${error.message}`);
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
