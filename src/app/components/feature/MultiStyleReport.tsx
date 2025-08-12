'use client';
// /src/app/components/feature/MultiStyleReport.tsx
// 多样式报告组件 - 集成三种样式的统一入口

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import LoadingSpinner from '../ui/LoadingSpinner';
import StyleSwitcher from '../ui/StyleSwitcher';

// 导入样式系统
import { initializeStyleSystem } from '@/lib/style-system-init';
import { StyleRegistry, StyleSwitchEngine } from '@/lib/report-style-system';
import { UserPreferenceManager, UserContextDetector } from '@/lib/user-preference-manager';
import { ReportDataAdapter } from '@/lib/report-style-system';

// 导入样式特定组件
import MagazineStyleReport from './styles/MagazineStyleReport';
import MinimalStyleReport from './styles/MinimalStyleReport';
import DashboardStyleReport from './styles/DashboardStyleReport';

// 导入类型
import { ReportStyleType, ReportCoreData } from '@/types';

export default function MultiStyleReport() {
  const { isLoading, reportData } = useAppContext();
  const router = useRouter();
  
  // 状态管理
  const [currentStyle, setCurrentStyle] = useState<ReportStyleType>('magazine');
  const [isStyleSystemReady, setIsStyleSystemReady] = useState(false);
  const [isStyleSwitching, setIsStyleSwitching] = useState(false);
  const [adaptedData, setAdaptedData] = useState<any>(null);

  // 初始化样式系统
  useEffect(() => {
    const initSystem = async () => {
      try {
        // 初始化样式系统
        initializeStyleSystem();
        
        // 检测用户上下文
        const userContext = UserContextDetector.detectContext();
        
        // 获取用户偏好
        const preferenceManager = UserPreferenceManager.getInstance();
        const preferences = preferenceManager.getPreferences();
        
        // 设置初始样式（用户偏好或推荐）
        setCurrentStyle(preferences.preferredStyle);
        setIsStyleSystemReady(true);
        
        console.log('✅ Multi-style report system initialized');
      } catch (error) {
        console.error('❌ Failed to initialize style system:', error);
        // 降级到默认杂志风格
        setCurrentStyle('magazine');
        setIsStyleSystemReady(true);
      }
    };

    initSystem();
  }, []);

  // 处理报告数据
  const coreData = useMemo(() => {
    if (!reportData && !isLoading) {
      // 生成默认数据
      const currentDate = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      const uniqueId = `GGSB-${new Date().getTime()}`;

      const defaultReportData = {
        reportId: uniqueId,
        publicationDate: currentDate,
        mainTitle: "Strategic Briefing",
        subTitle: "GROW A GARDEN INTELLIGENCE REPORT",
        visualAnchor: "A",
        playerProfile: {
          title: "Player Profile",
          archetype: "Early-Stage Capital Accumulator",
          summary: "You're in a prime starting position with ample gold and immense potential. The core mission is to convert this initial capital into sustainable, high-yield assets—fast."
        },
        midBreakerQuote: "Trading short-term, one-off gains for 'asset crops' that produce continuously is the first step from novice to tycoon.",
        sections: [
          {
            id: "priority_one",
            title: "Priority One 🎯",
            points: [
              {
                action: "Liquidate Strawberries, Acquire Blueberries",
                reasoning: "Strawberries are a one-time sale. Blueberries are 'multi-harvest' assets that will become your stable 'gold printer' for the future.",
                tags: ["High ROI", "Asset Conversion"]
              },
              {
                action: "Plant All Carrot Seeds Immediately",
                reasoning: "Of all starter crops, Carrots have the highest gold-per-minute ratio, enabling the fastest possible initial capital accumulation.",
                tags: ["High-Efficiency", "Short-Term"]
              }
            ]
          },
          {
            id: "next_steps",
            title: "Mid-Term Plays 🗺️",
            points: [
              {
                action: "Secure 5,000 Gold for 'Advanced Tools'",
                reasoning: "This is a critical power spike in your progression. It dramatically boosts farming efficiency, paving the way for large-scale operations.",
                tags: ["Long-Term Investment", "Efficiency Boost"]
              }
            ]
          },
          {
            id: "hidden_gems",
            title: "Hidden Gems ✨",
            points: [
              {
                action: "Hold onto the Orange Tulip",
                reasoning: "While its sale price is low, planting it near a future Beehive yields high-value 'Tulip Honey'—a potential gold mine.",
                synergy: ["orange_tulip", "beehive"],
                tags: ["Synergy"]
              }
            ]
          }
        ],
        footerAnalysis: {
          title: "The Final Verdict",
          conclusion: "Your current strategy is crystal clear: SPEED. Liquidate low-yield items, convert capital into long-term, interest-bearing assets, and do not get distracted by minor gains.",
          callToAction: "Immediate Action: Sell all Strawberries and invest every coin into Blueberry seeds."
        }
      };

      return ReportDataAdapter.adaptToCore(
        defaultReportData,
        UserContextDetector.detectContext()
      );
    }

    if (reportData) {
      return ReportDataAdapter.adaptToCore(
        reportData,
        UserContextDetector.detectContext()
      );
    }

    return null;
  }, [reportData, isLoading]);

  // 处理样式切换
  const handleStyleChange = async (newStyle: ReportStyleType) => {
    if (newStyle === currentStyle || isStyleSwitching || !coreData) return;

    setIsStyleSwitching(true);
    console.log(`🔄 Switching from ${currentStyle} to ${newStyle}...`);

    try {
      // 记录样式使用开始时间
      const startTime = Date.now();

      // 清除旧的适配数据，强制重新适配
      setAdaptedData(null);

      // 更新当前样式
      setCurrentStyle(newStyle);

      // 记录用户偏好
      const preferenceManager = UserPreferenceManager.getInstance();
      const duration = Date.now() - startTime;
      preferenceManager.recordStyleUsage(
        newStyle,
        duration,
        UserContextDetector.detectContext().deviceType
      );

      console.log(`✅ Switched to ${newStyle} style`);
    } catch (error) {
      console.error(`❌ Failed to switch to ${newStyle} style:`, error);
    } finally {
      setIsStyleSwitching(false);
    }
  };

  // 适配当前样式的数据
  useEffect(() => {
    if (coreData && isStyleSystemReady) {
      console.log(`🔄 Adapting data for ${currentStyle} style...`);
      const registry = StyleRegistry.getInstance();
      const adapter = registry.getAdapter(currentStyle);
      
      if (adapter) {
        try {
          const adapted = adapter.adaptData(coreData);
          setAdaptedData(adapted);
          console.log(`✅ Data adapted for ${currentStyle} style:`, adapted);
        } catch (error) {
          console.error(`❌ Failed to adapt data for ${currentStyle}:`, error);
          // 使用原始数据作为降级
          setAdaptedData(coreData.content);
          console.log(`🔄 Using raw data for ${currentStyle}:`, coreData.content);
        }
      } else {
        console.warn(`⚠️ No adapter found for ${currentStyle}, using raw data`);
        // 降级到原始数据
        setAdaptedData(coreData.content);
        console.log(`🔄 Using raw data for ${currentStyle}:`, coreData.content);
      }
    }
  }, [coreData, currentStyle, isStyleSystemReady]);

  // 重定向逻辑
  useEffect(() => {
    if (!isLoading && !reportData) {
      router.replace('/');
    }
  }, [isLoading, reportData, router]);

  // 加载状态
  if (isLoading || !isStyleSystemReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // 数据不可用
  if (!coreData || !adaptedData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            报告数据不可用
          </h2>
          <p className="text-gray-500">
            请返回首页重新生成报告
          </p>
        </div>
      </div>
    );
  }

  // 渲染样式特定组件
  const renderStyleComponent = () => {
    const commonProps = {
      data: adaptedData,
      coreData,
      isStyleSwitching
    };

    switch (currentStyle) {
      case 'magazine':
        return <MagazineStyleReport {...commonProps} />;
      case 'minimal':
        return <MinimalStyleReport {...commonProps} />;
      case 'dashboard':
        return <DashboardStyleReport {...commonProps} />;
      default:
        return <MagazineStyleReport {...commonProps} />;
    }
  };

  // 获取当前样式的背景色
  const getBackgroundColor = () => {
    switch (currentStyle) {
      case 'magazine':
        return 'bg-[#f8f7f2]'; // 米白色
      case 'minimal':
        return 'bg-white'; // 纯白
      case 'dashboard':
        return 'bg-[#0a0a0a]'; // 深黑
      default:
        return 'bg-[#f8f7f2]';
    }
  };

  return (
    <main className={`min-h-screen transition-colors duration-500 ${getBackgroundColor()}`}>
      {/* 样式切换器 - 固定在顶部 */}
      <div className="sticky top-0 z-50 backdrop-blur-sm bg-white/80 border-b border-gray-200 p-4">
        <div className="container mx-auto max-w-6xl">
          <StyleSwitcher
            currentStyle={currentStyle}
            onStyleChange={handleStyleChange}
            className="flex justify-center"
          />
        </div>
      </div>

      {/* 样式切换加载指示器 */}
      {isStyleSwitching && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-gray-700">正在切换样式...</span>
            </div>
          </div>
        </div>
      )}

      {/* 样式特定内容 */}
      <div className="transition-opacity duration-300">
        {renderStyleComponent()}
      </div>
    </main>
  );
}