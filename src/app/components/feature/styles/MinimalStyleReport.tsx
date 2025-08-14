'use client';
// /src/app/components/feature/styles/MinimalStyleReport.tsx
// 极简风格报告组件 - 终极纯粹版本
// 设计哲学: 删除到只剩本质，然后让本质闪闪发光

import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  // 响应式和交互状态
  const [breakpoint, setBreakpoint] = useState('desktop');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [focusedSection, setFocusedSection] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 简单的响应式检测
  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 768) setBreakpoint('mobile');
      else if (width < 1024) setBreakpoint('tablet');
      else setBreakpoint('desktop');
    };

    const updateScrollProgress = () => {
      const scrolled = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(maxScroll > 0 ? scrolled / maxScroll : 0);
    };

    updateBreakpoint();
    updateScrollProgress();

    window.addEventListener('resize', updateBreakpoint);
    window.addEventListener('scroll', updateScrollProgress);

    return () => {
      window.removeEventListener('resize', updateBreakpoint);
      window.removeEventListener('scroll', updateScrollProgress);
    };
  }, []);

  // 智能数据提取和适配
  const reportData = useMemo(() => {
    return data || coreData?.content || {};
  }, [data, coreData]);

  const {
    mainTitle = reportData.mainTitle || data?.mainTitle || 'Strategic Analysis',
    reportId = reportData.reportId || data?.reportId || coreData?.reportId || 'REPORT-001',
    sections = reportData.sections || data?.sections || [],
    playerProfile = reportData.playerProfile || data?.playerProfile,
    midBreakerQuote = reportData.midBreakerQuote || data?.midBreakerQuote
  } = reportData;

  // 智能内容提取
  const keyInsights = useMemo(() => {
    const insights = [
      playerProfile?.archetype && `Your strategic archetype: ${playerProfile.archetype}`,
      midBreakerQuote?.replace(/"/g, ''),
      sections[0]?.points?.[0]?.action && `Priority action: ${sections[0].points[0].action}`
    ].filter(Boolean);
    
    return insights.slice(0, breakpoint === 'mobile' ? 2 : 3);
  }, [playerProfile, midBreakerQuote, sections, breakpoint]);

  const actionItems = useMemo(() => {
    const items = sections
      .flatMap((section: any) => section?.points || [])
      .map((point: any) => point?.action)
      .filter(Boolean);
    
    const maxItems = breakpoint === 'mobile' ? 3 : breakpoint === 'tablet' ? 4 : 5;
    return items.slice(0, maxItems);
  }, [sections, breakpoint]);

  // 简单的内容优先级系统
  const contentPriority = useMemo(() => ({
    essential: keyInsights.slice(0, 2),
    important: actionItems.slice(0, 3),
    supplementary: sections.slice(2)
  }), [keyInsights, actionItems, sections]);

  // 阅读时间智能计算
  const estimatedReadTime = useMemo(() => {
    const wordCount = [
      mainTitle,
      ...keyInsights,
      ...sections.flatMap((s: any) => s?.points?.map((p: any) => p?.action + ' ' + p?.reasoning) || []),
      ...actionItems
    ].join(' ').split(' ').length;
    
    const minutes = Math.max(1, Math.ceil(wordCount / 200)); // 200 words per minute
    return breakpoint === 'mobile' ? `${minutes}min` : `${minutes} minute read`;
  }, [mainTitle, keyInsights, sections, actionItems, breakpoint]);

  // 入场动画
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // 调试信息（仅开发环境）
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🎨 MinimalStyleReport [Radical Redesign]:', {
        breakpoint,
        scrollProgress: Math.round(scrollProgress * 100) + '%',
        contentPriority: {
          essential: contentPriority.essential.length,
          important: contentPriority.important.length,
          supplementary: contentPriority.supplementary.length
        },
        keyInsights: keyInsights.length,
        actionItems: actionItems.length,
        estimatedReadTime
      });
    }
  }, [breakpoint, scrollProgress, contentPriority, keyInsights, actionItems, estimatedReadTime]);

  return (
    <div 
      ref={containerRef}
      className={`
        minimal-report-radical relative min-h-screen
        transition-all duration-500 ease-out
        ${isStyleSwitching ? 'opacity-30 scale-[0.98]' : 'opacity-100 scale-100'}
        ${isVisible ? 'translate-y-0' : 'translate-y-4'}
      `}
    >
      {/* 滚动进度指示器 */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-100 z-50">
        <div 
          className="h-full bg-gray-900 transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* 智能收藏按钮 - 响应式定位 */}
      <div className={`
        fixed z-40 transition-all duration-300
        ${breakpoint === 'mobile' 
          ? 'bottom-6 right-6' 
          : 'top-8 right-8'
        }
      `}>
        <div className={`
          transform transition-all duration-300
          ${scrollProgress > 0.1 ? 'scale-90 opacity-80' : 'scale-100 opacity-100'}
          hover:scale-110 hover:opacity-100
        `}>
          <MinimalFavorite
            reportId={reportId}
            reportTitle={mainTitle}
            integrated={false}
          />
        </div>
      </div>

      {/* 响应式容器系统 */}
      <div className={`
        container mx-auto transition-all duration-300
        ${breakpoint === 'mobile' 
          ? 'max-w-sm px-6 py-12' 
          : breakpoint === 'tablet'
          ? 'max-w-2xl px-8 py-16'
          : 'max-w-4xl px-12 py-24'
        }
      `}>
        {/* 革命性标题区域 - 响应式网格布局 */}
        <header className={`
          relative mb-16 md:mb-24 lg:mb-32
          transition-all duration-700 delay-100
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        `}>
          {/* 背景装饰网格 */}
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <div className="grid grid-cols-12 gap-4 h-full">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="border-r border-gray-900 last:border-r-0" />
              ))}
            </div>
          </div>

          <div className="relative z-10">
            {/* 响应式标题布局 */}
            <div className={`
              grid gap-8 items-center
              ${breakpoint === 'mobile' 
                ? 'grid-cols-1 text-center' 
                : 'grid-cols-12'
              }
            `}>
              {/* 主标题 */}
              <div className={`
                ${breakpoint === 'mobile' 
                  ? 'col-span-1' 
                  : 'col-span-8 col-start-3'
                }
              `}>
                <h1 className={`
                  font-light text-gray-900 leading-tight tracking-tight
                  transition-all duration-500 delay-200
                  ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                  ${breakpoint === 'mobile' 
                    ? 'text-3xl' 
                    : breakpoint === 'tablet'
                    ? 'text-4xl'
                    : 'text-5xl lg:text-6xl'
                  }
                `}>
                  {mainTitle.split(' ').map((word: string, index: number) => (
                    <span 
                      key={index}
                      className={`
                        inline-block transition-all duration-300
                        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
                      `}
                      style={{ 
                        transitionDelay: `${300 + index * 100}ms` 
                      }}
                    >
                      {word}{' '}
                    </span>
                  ))}
                </h1>
              </div>
            </div>

            {/* 装饰性分割线和元信息 */}
            <div className={`
              mt-12 flex items-center justify-center gap-8
              transition-all duration-500 delay-500
              ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
            `}>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent max-w-24" />
              <div className="text-center">
                <p className={`
                  font-mono uppercase tracking-widest text-gray-500
                  ${breakpoint === 'mobile' ? 'text-xs' : 'text-sm'}
                `}>
                  {estimatedReadTime}
                </p>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent max-w-24" />
            </div>
          </div>
        </header>

        {/* 革命性关键洞察 - 智能响应式网格 */}
        {keyInsights.length > 0 && (
          <section className={`
            mb-16 md:mb-24 lg:mb-32
            transition-all duration-700 delay-300
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
          `}>
            {/* 章节标题 */}
            <div className="text-center mb-12 md:mb-16">
              <h2 className={`
                font-mono uppercase tracking-widest text-gray-400
                ${breakpoint === 'mobile' ? 'text-xs' : 'text-sm'}
              `}>
                Core Insights
              </h2>
              <div className="w-16 h-px bg-gray-900 mx-auto mt-4" />
            </div>

            {/* 响应式洞察网格 */}
            <div className={`
              grid gap-8 md:gap-12
              ${breakpoint === 'mobile' 
                ? 'grid-cols-1' 
                : keyInsights.length === 1
                ? 'grid-cols-1 max-w-3xl mx-auto'
                : keyInsights.length === 2
                ? 'grid-cols-1 md:grid-cols-2'
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              }
            `}>
              {keyInsights.map((insight: string, index: number) => (
                <div 
                  key={index}
                  className={`
                    group relative
                    transition-all duration-500
                    ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                  `}
                  style={{ 
                    transitionDelay: `${600 + index * 200}ms` 
                  }}
                  onMouseEnter={() => setFocusedSection(index)}
                  onMouseLeave={() => setFocusedSection(null)}
                >
                  {/* 动态强调线 */}
                  <div className={`
                    absolute left-0 top-0 w-1 bg-gray-900 transition-all duration-300
                    ${focusedSection === index ? 'h-full opacity-100' : 'h-8 opacity-60'}
                  `} />
                  
                  {/* 内容区域 */}
                  <div className="pl-6 md:pl-8">
                    <div className={`
                      transition-all duration-300
                      ${focusedSection === index ? 'transform translate-x-2' : ''}
                    `}>
                      <p className={`
                        font-light text-gray-900 leading-relaxed
                        transition-all duration-300
                        ${focusedSection === index ? 'text-gray-800' : 'text-gray-900'}
                        ${breakpoint === 'mobile' 
                          ? 'text-lg' 
                          : breakpoint === 'tablet'
                          ? 'text-xl'
                          : 'text-xl lg:text-2xl'
                        }
                      `}>
                        {insight}
                      </p>
                    </div>
                  </div>

                  {/* 悬停装饰 */}
                  <div className={`
                    absolute -right-2 top-1/2 transform -translate-y-1/2
                    w-2 h-2 rounded-full bg-gray-900 transition-all duration-300
                    ${focusedSection === index ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}
                  `} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 革命性核心内容 - 智能信息架构 */}
        {sections.length > 0 && (
          <section className={`
            mb-16 md:mb-24 lg:mb-32
            transition-all duration-700 delay-500
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
          `}>
            <div className="space-y-16 md:space-y-24">
              {sections.slice(0, breakpoint === 'mobile' ? 1 : 2).map((section: any, sectionIndex: number) => (
                <div 
                  key={sectionIndex} 
                  className={`
                    relative
                    transition-all duration-500
                    ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                  `}
                  style={{ 
                    transitionDelay: `${800 + sectionIndex * 300}ms` 
                  }}
                >
                  {/* 智能章节标题 */}
                  <div className="mb-8 md:mb-12">
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`
                        flex items-center justify-center rounded-full bg-gray-900 text-white font-mono
                        transition-all duration-300 hover:scale-110
                        ${breakpoint === 'mobile' ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm'}
                      `}>
                        {String(sectionIndex + 1).padStart(2, '0')}
                      </div>
                      <div className="flex-1 h-px bg-gradient-to-r from-gray-900 via-gray-300 to-transparent" />
                    </div>
                    <h2 className={`
                      font-light text-gray-900 leading-tight
                      ${breakpoint === 'mobile' 
                        ? 'text-xl' 
                        : breakpoint === 'tablet'
                        ? 'text-2xl'
                        : 'text-3xl'
                      }
                    `}>
                      {section?.title?.replace(/[🎯🗺️✨📊]/g, '').trim() || `Strategic Focus ${sectionIndex + 1}`}
                    </h2>
                  </div>

                  {/* 响应式要点网格 */}
                  <div className={`
                    grid gap-8 md:gap-12
                    ${breakpoint === 'mobile' 
                      ? 'grid-cols-1' 
                      : 'grid-cols-1 lg:grid-cols-2'
                    }
                  `}>
                    {(section?.points || []).slice(0, breakpoint === 'mobile' ? 2 : 3).map((point: any, pointIndex: number) => (
                      <div 
                        key={pointIndex} 
                        className="group relative cursor-pointer"
                        onMouseEnter={() => setFocusedSection(sectionIndex * 10 + pointIndex)}
                        onMouseLeave={() => setFocusedSection(null)}
                      >
                        {/* 交互式卡片容器 */}
                        <div className={`
                          relative p-6 md:p-8 rounded-2xl border transition-all duration-300
                          ${focusedSection === sectionIndex * 10 + pointIndex
                            ? 'border-gray-300 shadow-lg shadow-gray-100 transform -translate-y-1'
                            : 'border-gray-100 hover:border-gray-200'
                          }
                        `}>
                          {/* 优先级指示器 */}
                          <div className="flex items-start gap-4 mb-4">
                            <div className={`
                              flex-shrink-0 rounded-full border-2 transition-all duration-300 mt-1
                              ${point?.tags?.includes('High ROI')
                                ? 'w-6 h-6 border-gray-900 bg-gray-900'
                                : 'w-6 h-6 border-gray-300 group-hover:border-gray-500'
                              }
                            `}>
                              {point?.tags?.includes('High ROI') && (
                                <div className={`
                                  w-full h-full rounded-full bg-white transition-all duration-300
                                  ${focusedSection === sectionIndex * 10 + pointIndex ? 'scale-50' : 'scale-75'}
                                `} />
                              )}
                            </div>
                            
                            {/* 标签系统 */}
                            {point?.tags?.length > 0 && (
                              <div className="flex gap-2">
                                {point.tags.slice(0, 2).map((tag: string, tagIndex: number) => (
                                  <span 
                                    key={tagIndex}
                                    className={`
                                      px-2 py-1 rounded-full text-xs font-medium transition-all duration-300
                                      ${tag === 'High ROI' 
                                        ? 'bg-gray-900 text-white' 
                                        : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                                      }
                                    `}
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* 内容区域 */}
                          <div className="space-y-3">
                            <h3 className={`
                              font-medium text-gray-900 leading-tight transition-all duration-300
                              ${focusedSection === sectionIndex * 10 + pointIndex ? 'text-gray-800' : ''}
                              ${breakpoint === 'mobile' ? 'text-base' : 'text-lg'}
                            `}>
                              {point?.action || 'Strategic Action'}
                            </h3>
                            <p className={`
                              text-gray-600 leading-relaxed transition-all duration-300
                              ${focusedSection === sectionIndex * 10 + pointIndex ? 'text-gray-700' : ''}
                              ${breakpoint === 'mobile' ? 'text-sm' : 'text-base'}
                            `}>
                              {point?.reasoning 
                                ? point.reasoning.split('.').slice(0, 2).join('.') + '.'
                                : 'Strategic recommendation designed for optimal results and sustainable growth.'
                              }
                            </p>
                          </div>

                          {/* 悬停装饰 */}
                          <div className={`
                            absolute top-4 right-4 w-2 h-2 rounded-full bg-gray-900 transition-all duration-300
                            ${focusedSection === sectionIndex * 10 + pointIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}
                          `} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 革命性行动项目 - 智能执行系统 */}
        {actionItems.length > 0 && (
          <section className={`
            mb-16 md:mb-24 lg:mb-32
            transition-all duration-700 delay-700
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
          `}>
            {/* 强化章节标题 */}
            <div className="text-center mb-12 md:mb-16">
              <h2 className={`
                font-mono uppercase tracking-widest text-gray-400 mb-6
                ${breakpoint === 'mobile' ? 'text-xs' : 'text-sm'}
              `}>
                Next Actions
              </h2>
              <div className="flex items-center justify-center gap-4">
                <div className="w-8 h-px bg-gray-900" />
                <div className="w-2 h-2 rounded-full bg-gray-900" />
                <div className="w-8 h-px bg-gray-900" />
              </div>
            </div>

            {/* 智能行动网格 */}
            <div className={`
              grid gap-4 md:gap-6
              ${breakpoint === 'mobile' 
                ? 'grid-cols-1' 
                : actionItems.length <= 2
                ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto'
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              }
            `}>
              {actionItems.map((action: string, index: number) => (
                <div 
                  key={index}
                  className={`
                    group relative cursor-pointer
                    transition-all duration-500
                    ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                  `}
                  style={{ 
                    transitionDelay: `${1000 + index * 150}ms` 
                  }}
                  onMouseEnter={() => setFocusedSection(100 + index)}
                  onMouseLeave={() => setFocusedSection(null)}
                >
                  {/* 高级交互卡片 */}
                  <div className={`
                    relative p-6 md:p-8 rounded-2xl border transition-all duration-300
                    ${focusedSection === 100 + index
                      ? 'border-gray-900 shadow-xl shadow-gray-200 transform -translate-y-2 scale-[1.02]'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-lg hover:shadow-gray-100 hover:-translate-y-1'
                    }
                  `}>
                    {/* 优先级编号 */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`
                        flex-shrink-0 rounded-full bg-gray-900 text-white font-mono flex items-center justify-center
                        transition-all duration-300
                        ${focusedSection === 100 + index ? 'scale-110 shadow-lg' : 'group-hover:scale-105'}
                        ${breakpoint === 'mobile' ? 'w-8 h-8 text-sm' : 'w-10 h-10 text-base'}
                      `}>
                        {index + 1}
                      </div>
                      
                      {/* 进度指示器 */}
                      <div className="flex-1 flex items-center">
                        <div className={`
                          h-1 bg-gray-100 rounded-full transition-all duration-500
                          ${focusedSection === 100 + index ? 'w-full' : 'w-0'}
                        `}>
                          <div className={`
                            h-full bg-gray-900 rounded-full transition-all duration-700
                            ${focusedSection === 100 + index ? 'w-1/3' : 'w-0'}
                          `} />
                        </div>
                      </div>
                    </div>

                    {/* 行动内容 */}
                    <div className="space-y-3">
                      <p className={`
                        font-medium text-gray-900 leading-relaxed transition-all duration-300
                        ${focusedSection === 100 + index ? 'text-gray-800' : ''}
                        ${breakpoint === 'mobile' ? 'text-sm' : 'text-base'}
                      `}>
                        {action}
                      </p>
                      
                      {/* 智能估算 */}
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <div className="w-1 h-1 rounded-full bg-gray-400" />
                        <span>Est. {Math.ceil(action.length / 20)} min</span>
                      </div>
                    </div>

                    {/* 交互装饰 */}
                    <div className={`
                      absolute top-4 right-4 transition-all duration-300
                      ${focusedSection === 100 + index ? 'opacity-100 rotate-45' : 'opacity-0 rotate-0'}
                    `}>
                      <div className="w-3 h-3 border-t-2 border-r-2 border-gray-900" />
                    </div>

                    {/* 悬停光效 */}
                    <div className={`
                      absolute inset-0 rounded-2xl bg-gradient-to-br from-gray-50 to-transparent opacity-0 transition-opacity duration-300
                      ${focusedSection === 100 + index ? 'opacity-100' : 'group-hover:opacity-50'}
                    `} />
                  </div>
                </div>
              ))}
            </div>

            {/* 行动总结 */}
            {actionItems.length > 3 && (
              <div className={`
                text-center mt-12 transition-all duration-500 delay-1000
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
              `}>
                <p className="text-sm text-gray-500">
                  +{actionItems.length - 3} more strategic actions available
                </p>
              </div>
            )}
          </section>
        )}

        {/* 革命性加载状态 - 智能内容生成动画 */}
        {sections.length === 0 && keyInsights.length === 0 && actionItems.length === 0 && (
          <section className="mb-32 text-center">
            <div className="space-y-16">
              {/* 高级加载动画 */}
              <div className="relative w-24 h-24 mx-auto">
                {/* 外圈 */}
                <div className="absolute inset-0 border-2 border-gray-100 rounded-full animate-spin" 
                     style={{ animationDuration: '3s' }} />
                {/* 中圈 */}
                <div className="absolute inset-2 border-2 border-gray-300 rounded-full animate-spin" 
                     style={{ animationDuration: '2s', animationDirection: 'reverse' }} />
                {/* 内圈 */}
                <div className="absolute inset-4 border-2 border-gray-900 rounded-full animate-spin" 
                     style={{ animationDuration: '1s' }} />
                {/* 中心点 */}
                <div className="absolute inset-8 bg-gray-900 rounded-full animate-pulse" />
              </div>

              {/* 智能加载文案 */}
              <div className="space-y-6">
                <h3 className={`
                  font-light text-gray-900 leading-tight
                  ${breakpoint === 'mobile' ? 'text-xl' : 'text-2xl'}
                `}>
                  Crafting your strategic analysis
                </h3>
                <div className="space-y-3 max-w-lg mx-auto">
                  <p className="text-base text-gray-600 leading-relaxed">
                    Our AI is analyzing your data patterns, identifying key opportunities, 
                    and generating personalized recommendations.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <div className="w-1 h-1 rounded-full bg-gray-400 animate-pulse" />
                    <span>Processing insights</span>
                    <div className="w-1 h-1 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
                  </div>
                </div>
              </div>

              {/* 进度指示器 */}
              <div className="max-w-xs mx-auto">
                <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gray-900 rounded-full animate-pulse" style={{ width: '60%' }} />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 重新设计的极简页脚 - 清晰的信息层级 */}
        <footer className={`
          mt-24 md:mt-32 pt-16 md:pt-20 pb-16 md:pb-20
          border-t border-gray-100
          transition-all duration-700 delay-1200
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        `}>
          <div className="max-w-4xl mx-auto">
            {/* 主要元信息区域 */}
            <div className={`
              grid gap-12 md:gap-16 mb-16
              ${breakpoint === 'mobile' 
                ? 'grid-cols-1 text-center' 
                : 'grid-cols-3 text-left'
              }
            `}>
              {/* Report ID */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono text-gray-400 uppercase tracking-widest">
                  Report ID
                </h4>
                <p className="text-base font-medium text-gray-900 font-mono">
                  {reportId}
                </p>
              </div>

              {/* Generated Date */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono text-gray-400 uppercase tracking-widest">
                  Generated
                </h4>
                <p className="text-base font-medium text-gray-900">
                  {new Date().toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>

              {/* Version */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono text-gray-400 uppercase tracking-widest">
                  Version
                </h4>
                <p className="text-base font-medium text-gray-900">
                  Minimal 2.0
                </p>
              </div>
            </div>

            {/* 分割线 */}
            <div className="w-full h-px bg-gray-200 mb-12" />

            {/* 底部品牌区域 */}
            <div className={`
              flex items-center justify-between
              ${breakpoint === 'mobile' 
                ? 'flex-col gap-6 text-center' 
                : 'flex-row'
              }
            `}>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Strategic Analysis Report
                </p>
                <p className="text-xs text-gray-400">
                  Designed with obsessive attention to detail
                </p>
              </div>

              {/* 阅读统计 */}
              <div className="flex items-center gap-6 text-xs text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-gray-400" />
                  <span>{estimatedReadTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-gray-400" />
                  <span>{keyInsights.length + actionItems.length} insights</span>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}