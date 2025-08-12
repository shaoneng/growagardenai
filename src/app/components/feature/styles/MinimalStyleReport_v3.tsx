'use client';
// /src/app/components/feature/styles/MinimalStyleReport_v3.tsx
// 极简风格报告组件 - 终极纯粹版本
// 设计哲学: 删除到只剩本质，然后让本质闪闪发光

import React, { useState, useEffect, useMemo } from 'react';
import { ReportCoreData } from '@/types';
import MinimalFavorite from '../../ui/MinimalFavorite';

interface MinimalStyleReportProps {
  data: any;
  coreData: ReportCoreData;
  isStyleSwitching?: boolean;
}

// 极简主义的核心：只保留最必要的状态
const useMinimalState = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [focusedItem, setFocusedItem] = useState<number | null>(null);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);
  
  return { isVisible, focusedItem, setFocusedItem };
};

export default function MinimalStyleReport({
  data,
  coreData,
  isStyleSwitching = false
}: MinimalStyleReportProps) {
  // 极简状态管理
  const { isVisible, focusedItem, setFocusedItem } = useMinimalState();

  // 纯粹的数据提取
  const reportData = data || coreData?.content || {};
  const mainTitle = reportData.mainTitle || data?.mainTitle || 'Strategic Analysis';
  const reportId = reportData.reportId || data?.reportId || coreData?.reportId || 'REPORT-001';
  const sections = reportData.sections || data?.sections || [];

  // 提炼核心洞察 - 只保留最重要的
  const coreInsights = useMemo(() => {
    const insights = [];
    
    // 第一个洞察：来自玩家档案
    if (reportData.playerProfile?.archetype) {
      insights.push(reportData.playerProfile.archetype);
    }
    
    // 第二个洞察：来自中间引言
    if (reportData.midBreakerQuote) {
      insights.push(reportData.midBreakerQuote.replace(/"/g, ''));
    }
    
    // 第三个洞察：来自第一个行动项
    if (sections[0]?.points?.[0]?.action) {
      insights.push(sections[0].points[0].action);
    }
    
    return insights.slice(0, 3);
  }, [reportData, sections]);

  // 提炼核心行动 - 只保留最关键的
  const coreActions = useMemo(() => {
    return sections
      .flatMap((section: any) => section?.points || [])
      .filter((point: any) => point?.tags?.includes('High ROI') || point?.priority === 'high')
      .slice(0, 3)
      .map((point: any) => point?.action)
      .filter(Boolean);
  }, [sections]);

  // 调试信息
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🎨 MinimalStyleReport [Ultimate Pure]:', {
        coreInsights: coreInsights.length,
        coreActions: coreActions.length,
        totalSections: sections.length
      });
    }
  }, [coreInsights, coreActions, sections]);

  return (
    <div className={`
      minimal-pure relative min-h-screen bg-white
      transition-all duration-700 ease-out
      ${isStyleSwitching ? 'opacity-20 blur-sm' : 'opacity-100 blur-0'}
      ${isVisible ? 'translate-y-0' : 'translate-y-8'}
    `}>
      {/* 隐形收藏按钮 - 只在需要时出现 */}
      <div className="fixed top-8 right-8 z-50 opacity-0 hover:opacity-100 transition-opacity duration-300">
        <MinimalFavorite
          reportId={reportId}
          reportTitle={mainTitle}
          integrated={false}
        />
      </div>

      {/* 终极极简容器 */}
      <div className="max-w-2xl mx-auto px-8 py-24 md:py-32">
        
        {/* 纯粹标题 */}
        <header className={`
          mb-24 md:mb-32 text-center
          transition-all duration-1000 delay-300
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        `}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extralight text-gray-900 leading-tight tracking-tight">
            {mainTitle.split(' ').map((word: string, index: number) => (
              <span 
                key={index}
                className={`
                  inline-block transition-all duration-500
                  ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
                `}
                style={{ 
                  transitionDelay: `${500 + index * 200}ms` 
                }}
              >
                {word}
                {index < mainTitle.split(' ').length - 1 && (
                  <span className="inline-block w-4" />
                )}
              </span>
            ))}
          </h1>
        </header>

        {/* 核心洞察 - 极简呈现 */}
        {coreInsights.length > 0 && (
          <section className={`
            mb-24 md:mb-32
            transition-all duration-1000 delay-700
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
          `}>
            <div className="space-y-16 md:space-y-20">
              {coreInsights.map((insight: string, index: number) => (
                <div 
                  key={index}
                  className={`
                    relative group cursor-pointer
                    transition-all duration-500
                    ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                  `}
                  style={{ 
                    transitionDelay: `${1000 + index * 300}ms` 
                  }}
                  onMouseEnter={() => setFocusedItem(index)}
                  onMouseLeave={() => setFocusedItem(null)}
                >
                  {/* 极简强调线 */}
                  <div className={`
                    absolute left-0 top-0 w-px bg-gray-900 transition-all duration-700
                    ${focusedItem === index ? 'h-full opacity-100' : 'h-12 opacity-30'}
                  `} />
                  
                  {/* 洞察内容 */}
                  <div className={`
                    pl-8 transition-all duration-300
                    ${focusedItem === index ? 'transform translate-x-4' : ''}
                  `}>
                    <p className={`
                      text-xl md:text-2xl lg:text-3xl font-light text-gray-900 leading-relaxed
                      transition-all duration-300
                      ${focusedItem === index ? 'text-gray-700' : 'text-gray-900'}
                    `}>
                      {insight}
                    </p>
                  </div>

                  {/* 悬停指示器 */}
                  <div className={`
                    absolute -right-4 top-1/2 transform -translate-y-1/2
                    w-3 h-3 rounded-full bg-gray-900 transition-all duration-300
                    ${focusedItem === index ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}
                  `} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 核心行动 - 极简执行 */}
        {coreActions.length > 0 && (
          <section className={`
            mb-24 md:mb-32
            transition-all duration-1000 delay-1200
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
          `}>
            <div className="space-y-12 md:space-y-16">
              {coreActions.map((action: string, index: number) => (
                <div 
                  key={index}
                  className={`
                    group relative cursor-pointer
                    transition-all duration-500
                    ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                  `}
                  style={{ 
                    transitionDelay: `${1500 + index * 200}ms` 
                  }}
                  onMouseEnter={() => setFocusedItem(100 + index)}
                  onMouseLeave={() => setFocusedItem(null)}
                >
                  {/* 行动编号 */}
                  <div className="flex items-start gap-6 md:gap-8">
                    <div className={`
                      flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-full bg-gray-900 text-white
                      flex items-center justify-center font-light text-lg md:text-xl
                      transition-all duration-300
                      ${focusedItem === 100 + index ? 'scale-110 shadow-2xl' : 'group-hover:scale-105'}
                    `}>
                      {index + 1}
                    </div>
                    
                    {/* 行动内容 */}
                    <div className="flex-1 pt-2 md:pt-4">
                      <p className={`
                        text-lg md:text-xl lg:text-2xl font-light text-gray-900 leading-relaxed
                        transition-all duration-300
                        ${focusedItem === 100 + index ? 'text-gray-700 transform translate-x-2' : ''}
                      `}>
                        {action}
                      </p>
                    </div>
                  </div>

                  {/* 进度线 */}
                  <div className={`
                    mt-6 ml-6 md:ml-8 h-px bg-gray-200 transition-all duration-500
                    ${focusedItem === 100 + index ? 'bg-gray-900 scale-x-100' : 'scale-x-0'}
                    origin-left
                  `} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 空状态 - 极简优雅 */}
        {coreInsights.length === 0 && coreActions.length === 0 && (
          <section className="text-center py-24 md:py-32">
            <div className={`
              space-y-8 transition-all duration-1000 delay-500
              ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
            `}>
              <div className="w-1 h-24 bg-gray-200 mx-auto animate-pulse" />
              <div className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-light text-gray-600">
                  Analyzing
                </h2>
                <p className="text-base text-gray-500 max-w-md mx-auto leading-relaxed">
                  We're distilling your data into essential insights and actionable strategies.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* 极简页脚 */}
        <footer className={`
          mt-32 md:mt-40 pt-16 text-center
          transition-all duration-1000 delay-1500
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        `}>
          <div className="space-y-6">
            <div className="w-24 h-px bg-gray-200 mx-auto" />
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-900">
                {reportId}
              </p>
              <p className="text-xs text-gray-500">
                {new Date().toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}