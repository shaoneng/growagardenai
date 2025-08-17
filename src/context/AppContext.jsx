// src/context/AppContext.jsx
"use client";

import { createContext, useContext, useState } from 'react';
import { useToastContext } from '@/app/components/layout/ToastProvider';
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
  const toast = useToastContext();

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
        let serverMsg = `HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          serverMsg = errorData?.message || errorData?.error || serverMsg;
        } catch {}
        toast.error('生成失败', `服务器返回错误：${serverMsg}`);
        // 尝试本地回退生成
        const fallback = await generateViaLocalFallback(itemsToAnalyze, Number(effectiveGold), effectiveGameDate, currentDate, interactionMode, expertOptions);
        if (fallback) return;
        throw new Error(serverMsg);
      }

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('Failed to parse API response as JSON:', jsonError);
        toast.error('响应解析失败', '服务器返回了无效的 JSON');
        const fallback = await generateViaLocalFallback(itemsToAnalyze, Number(effectiveGold), effectiveGameDate, currentDate, interactionMode, expertOptions);
        if (fallback) return;
        throw new Error('Invalid JSON response from server.');
      }

      // 验证响应数据的完整性
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format from server');
      }

      // 检查API响应格式 - 数据可能在data字段中
      const reportData = data.data || data;
      
      if (!reportData.mainTitle || !reportData.sections) {
        console.warn('Incomplete response data:', data);
        toast.warning('数据不完整', '尝试使用回退报告');
        const fallback = await generateViaLocalFallback(itemsToAnalyze, Number(effectiveGold), effectiveGameDate, currentDate, interactionMode, expertOptions);
        if (fallback) return;
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
      toast.error('生成失败', error?.message || '请求失败');
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

      if (!response.ok) {
        let serverMsg = `HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          serverMsg = errorData?.message || errorData?.error || serverMsg;
        } catch {}
        toast.error('生成失败', `服务器返回错误：${serverMsg}`);
        const fallback = await generateViaLocalFallback(itemsToAnalyze, Number(gold), inGameDate, currentDate, interactionMode, expertOptions);
        if (fallback) return;
        throw new Error(serverMsg);
      }

      const data = await response.json();
      
      // 检查API响应格式 - 数据可能在data字段中
      const reportData = data.data || data;
      
      if (!reportData.mainTitle || !reportData.sections) {
        console.warn('Incomplete response data:', data);
        toast.warning('数据不完整', '尝试使用回退报告');
        const fallback = await generateViaLocalFallback(itemsToAnalyze, Number(gold), inGameDate, currentDate, interactionMode, expertOptions);
        if (fallback) return;
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
      toast.error('生成失败', error?.message || '请求失败');
    } finally {
      setIsLoading(false);
    }
  };

  // 本地回退生成：优先使用增强/基础 Gemini；若不可用，返回规则回退报告
  const generateViaLocalFallback = async (
    itemsToAnalyze,
    goldAmount,
    gameDate,
    currentDate,
    mode,
    expertOpts
  ) => {
    try {
      const detailedItemsList = Object.entries(itemsToAnalyze).map(([id, quantity]) => ({
        name: `Item ${id}`,
        quantity,
        properties: []
      }));

      const { AIServiceManager } = await import('@/lib/ai/service-manager');
      const reportObject = await AIServiceManager.generateReport({
        items: detailedItemsList,
        gold: Number(goldAmount),
        inGameDate: gameDate,
        currentDate,
        interactionMode: mode,
        expertOptions: expertOpts
      });

      toast.info('已切换回退模式', 'AI 服务不可用或接口失败');
      reportObject.reportId = `GGSB-${Date.now()}`;
      setReportData(reportObject);
      router.push('/report-summary');
      return true;
    } catch (e) {
      console.error('Local fallback generation failed:', e);
      return false;
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
