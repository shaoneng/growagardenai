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
  const [adaptedData, setAdaptedData] = useState<unknown>(null);

  // 初始化样式系统
  useEffect(() => {
    const initSystem = async () => {
      try {
        // 初始化样式系统
        initializeStyleSystem();
        
        // 检测用户上下文
        // const userContext = UserContextDetector.detectContext();
        
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

  // 处理报告数据 - 现在完全依赖 Gemini AI 生成的数据
  const coreData = useMemo(() => {
    console.log('🔄 MultiStyleReport: Processing report data...', { reportData, isLoading });
    
    if (reportData) {
      console.log('✅ MultiStyleReport: Using AI-generated report data');
      return ReportDataAdapter.adaptToCore(
        reportData,
        UserContextDetector.detectContext()
      );
    }

    // 如果没有报告数据且不在加载中，返回 null
    // 这将触发重定向到首页
    if (!isLoading) {
      console.log('⚠️ MultiStyleReport: No report data available, will redirect');
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