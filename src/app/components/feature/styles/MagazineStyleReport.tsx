'use client';
// /src/app/components/feature/styles/MagazineStyleReport.tsx
// 杂志风格报告组件

import React from 'react';
import { ReportCoreData } from '@/types';
import MagazineBookmark from '../../ui/MagazineBookmark';

interface MagazineStyleReportProps {
  data: any;
  coreData: ReportCoreData;
  isStyleSwitching?: boolean;
}

export default function MagazineStyleReport({ 
  data, 
  coreData, 
  isStyleSwitching = false 
}: MagazineStyleReportProps) {
  const {
    mainTitle,
    subTitle,
    reportId,
    publicationDate,
    visualAnchor,
    playerProfile,
    midBreakerQuote,
    sections,
    footerAnalysis,
    readingExperience
  } = data;

  return (
    <div className={`magazine-report transition-opacity duration-300 ${isStyleSwitching ? 'opacity-50' : 'opacity-100'}`}>
      <div className="container mx-auto max-w-6xl p-4 md:p-8">
        {/* 杂志风格标题区域 */}
        <header className="border-b-2 border-[#8B7355] pb-6 mb-8 relative">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold font-serif text-[#2C1810] leading-tight mb-2">
                {mainTitle}
              </h1>
              <p className="text-sm tracking-[0.3em] uppercase text-[#8B7355] font-semibold">
                {subTitle}
              </p>
              {readingExperience?.estimatedReadTime && (
                <div className="mt-3 text-sm text-[#A0956B]">
                  📖 {readingExperience.estimatedReadTime}
                </div>
              )}
            </div>
            
            {/* 报告信息和收藏按钮 */}
            <div className="flex items-start gap-4">
              <div className="text-right text-sm text-[#8B7355] flex-shrink-0">
                <p className="font-semibold">Report ID: {reportId}</p>
                <p className="text-[#A0956B]">Date: {publicationDate}</p>
              </div>
              
              {/* 杂志风格收藏按钮 */}
              <MagazineBookmark
                reportId={reportId}
                reportTitle={mainTitle}
                size="lg"
              />
            </div>
          </div>
        </header>

        {/* 杂志风格主要内容 */}
        <main className="grid grid-cols-12 gap-8 lg:gap-12">
          {/* 大型视觉锚点 */}
          <aside className="col-span-12 lg:col-span-4 flex items-center justify-center order-last lg:order-first mt-8 lg:mt-0">
            <div className="text-[20rem] lg:text-[25rem] font-black leading-[0.7] text-transparent [-webkit-text-stroke:3px_#E5E7EB] select-none text-center opacity-30">
              {visualAnchor}
            </div>
          </aside>

          {/* 内容区域 */}
          <section className="col-span-12 lg:col-span-8 space-y-8">
            {/* 玩家档案 - 杂志风格卡片 */}
            <article className="bg-white/70 backdrop-blur-sm border border-[#E5E7EB] rounded-lg p-8 shadow-sm">
              <header className="border-b border-[#E5E7EB] pb-4 mb-6">
                <h2 className="text-2xl font-bold font-serif text-[#2C1810]">
                  {playerProfile.title}
                </h2>
                <p className="text-lg font-semibold text-[#D4AF37] mt-1">
                  {playerProfile.archetype}
                </p>
              </header>
              <p className="text-lg leading-relaxed text-[#2C1810] font-serif">
                {playerProfile.summary}
              </p>
            </article>

            {/* 报告部分 */}
            {sections.map((section: any, index: number) => (
              <article key={section.id} className="bg-white/70 backdrop-blur-sm border border-[#E5E7EB] rounded-lg p-8 shadow-sm">
                <header className="mb-6">
                  <h3 className="text-2xl font-bold font-serif text-[#2C1810] flex items-center gap-3">
                    <span className="w-8 h-8 bg-[#D4AF37] text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    {section.title.replace(/[🎯🗺️✨📊]/g, '').trim()}
                  </h3>
                </header>
                
                <div className="space-y-6">
                  {section.points.map((point: any, pointIndex: number) => (
                    <div key={pointIndex} className="border-l-4 border-[#D4AF37] pl-6 py-2">
                      <h4 className="text-xl font-bold text-[#2C1810] mb-3 font-serif">
                        {point.action}
                      </h4>
                      <p className="text-base leading-relaxed text-[#2C1810] mb-4">
                        {point.reasoning}
                      </p>
                      
                      {/* 标签和协同效应 */}
                      <div className="flex flex-wrap gap-2 items-center">
                        {point.tags?.map((tag: string) => (
                          <span 
                            key={tag} 
                            className="px-3 py-1 bg-[#8B7355]/10 text-[#8B7355] text-sm rounded-full font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                        {point.synergy && (
                          <div className="flex items-center gap-2 text-sm text-[#D4AF37] font-semibold">
                            <span>🔗</span>
                            <span>{point.synergy.join(' + ')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </section>
        </main>

        {/* 杂志风格拉引 */}
        {midBreakerQuote && (
          <section className="my-16 py-12 text-center relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/5 via-[#D4AF37]/10 to-[#D4AF37]/5 rounded-lg" />
            <blockquote className="relative text-2xl md:text-3xl font-serif font-bold text-[#2C1810] leading-relaxed max-w-4xl mx-auto">
              <span className="text-6xl text-[#D4AF37] opacity-50 absolute -top-4 -left-4">"</span>
              {midBreakerQuote.replace(/"/g, '')}
              <span className="text-6xl text-[#D4AF37] opacity-50 absolute -bottom-8 -right-4">"</span>
            </blockquote>
          </section>
        )}

        {/* 杂志风格结论 */}
        <footer className="bg-[#2C1810] text-white rounded-lg p-8 mt-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#2C1810] via-[#2C1810] to-[#1a0f08]" />
          <div className="relative">
            <h2 className="text-3xl font-bold font-serif mb-6 text-[#D4AF37]">
              {footerAnalysis.title}
            </h2>
            <div className="prose prose-lg prose-invert max-w-none">
              <p className="text-lg leading-relaxed text-gray-200 mb-8">
                {footerAnalysis.conclusion}
              </p>
            </div>
            <div className="bg-[#D4AF37] text-[#2C1810] font-bold text-center p-6 rounded-lg">
              <p className="text-lg font-serif">
                {footerAnalysis.callToAction}
              </p>
            </div>
          </div>
        </footer>

        {/* 杂志风格页脚信息 */}
        <div className="mt-8 pt-6 border-t border-[#E5E7EB] text-center text-sm text-[#A0956B]">
          <p>© Grow A Garden Strategic Briefing • {publicationDate}</p>
          {readingExperience?.complexity && (
            <p className="mt-1">
              Complexity: {readingExperience.complexity} • Tone: {readingExperience.tone}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}