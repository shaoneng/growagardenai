'use client';

// /src/app/reports/[id]/page.tsx
// 收藏报告详情页面

import React, { useEffect, useState } from 'react';
export const runtime = 'edge';

import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import MultiStyleReport from '../../components/feature/MultiStyleReport';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface ReportPageProps {
  params: {
    id: string;
  };
}

export default function ReportPage({ params }: ReportPageProps) {
  const { reportData, setReportData, isLoading } = useAppContext();
  const router = useRouter();
  const [isLoadingReport, setIsLoadingReport] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 如果已经有报告数据且ID匹配，直接显示
    if (reportData && reportData.reportId === params.id) {
      return;
    }

    // 尝试从localStorage加载报告数据
    const loadReportFromStorage = () => {
      try {
        setIsLoadingReport(true);
        setError(null);

        // 检查localStorage中是否有这个报告的数据
        const storedReports = localStorage.getItem('growagarden_reports');
        if (storedReports) {
          const reports = JSON.parse(storedReports);
          const targetReport = reports[params.id];
          
          if (targetReport) {
            setReportData(targetReport);
            setIsLoadingReport(false);
            return;
          }
        }

        // 如果localStorage中没有找到，显示错误信息
        setError('报告数据未找到。可能是因为报告已过期或被清除。');
        setIsLoadingReport(false);
      } catch (error) {
        console.error('Failed to load report from storage:', error);
        setError('加载报告时出现错误。');
        setIsLoadingReport(false);
      }
    };

    loadReportFromStorage();
  }, [params.id, reportData, setReportData]);

  // 如果正在加载
  if (isLoading || isLoadingReport) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">正在加载报告...</p>
        </div>
      </div>
    );
  }

  // 如果有错误
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="text-6xl mb-4">📊</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            报告不可用
          </h1>
          <p className="text-gray-600 mb-6">
            {error}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/')}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              生成新报告
            </button>
            <button
              onClick={() => router.push('/favorites')}
              className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              返回收藏页面
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 如果没有报告数据
  if (!reportData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="text-6xl mb-4">📊</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            报告未找到
          </h1>
          <p className="text-gray-600 mb-6">
            无法找到ID为 &quot;{params.id}&quot; 的报告。
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/')}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              生成新报告
            </button>
            <button
              onClick={() => router.push('/favorites')}
              className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              返回收藏页面
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 显示报告
  return <MultiStyleReport />;
}
