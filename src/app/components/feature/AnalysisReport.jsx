// src/app/components/AnalysisReport.jsx (Fixed Title Repetition)
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next'; // <-- 1. 导入 useTranslation
import { useAppContext } from "@/context/AppContext";
import LoadingSpinner from '../ui/LoadingSpinner';
import ReportCard from './ReportCard';

export default function AnalysisReport() {
  const { isLoading, reportData } = useAppContext();
  const { t } = useTranslation(); // <-- 2. 初始化翻译函数
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !reportData) {
      router.replace('/');
    }
  }, [isLoading, reportData, router]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!reportData) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl space-y-4">
      <header className="text-center">
        {/* 3. 修改: 大标题使用i18n中的静态文本 */}
        <h1 className="text-4xl font-bold text-gray-900">{t('Your Strategic Report')}</h1>

        {/* 下方的摘要段落继续使用AI生成的动态文本 */}
        {reportData.summary && (
          <p className="mt-2 text-lg text-gray-600">{reportData.summary}</p>
        )}
      </header>
      
      <div className="space-y-4 pt-4">
        {(reportData?.sections ?? []).map((section, index) => (
          <ReportCard
            key={section.id}
            icon={section.icon}
            title={section.title}
            summary={section.summary}
            points={section.points}
            initialExpanded={index === 0}
          />
        ))}
      </div>
    </div>
  );
}