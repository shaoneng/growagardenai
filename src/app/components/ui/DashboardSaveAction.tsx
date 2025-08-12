'use client';
// /src/app/components/ui/DashboardSaveAction.tsx
// 仪表板风格的保存分析组件

import React, { useState, useEffect } from 'react';
import { Save, CheckCircle, Database } from 'lucide-react';
import { useFavoriteStatus } from '@/contexts/FavoritesContext';

interface DashboardSaveActionProps {
  reportId: string;
  reportTitle?: string;
  className?: string;
  variant?: 'terminal' | 'compact' | 'floating';
}

export default function DashboardSaveAction({
  reportId,
  reportTitle,
  className = '',
  variant = 'terminal'
}: DashboardSaveActionProps) {
  const { isFavorite, toggleFavorite } = useFavoriteStatus(reportId, 'reports');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDataFlow, setShowDataFlow] = useState(false);

  const handleSaveAnalysis = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    setShowDataFlow(true);
    
    // 模拟数据处理延迟
    setTimeout(() => {
      toggleFavorite();
      setIsProcessing(false);
      
      // 显示数据流效果
      setTimeout(() => setShowDataFlow(false), 1000);
    }, 300);
  };

  if (variant === 'terminal') {
    return (
      <div className={`dashboard-save-terminal ${className}`}>
        <button
          type="button"
          className={`
            relative px-4 py-2 font-mono text-sm
            border transition-all duration-200
            ${isFavorite
              ? 'bg-green-500/30 border-green-400 text-green-400'
              : 'bg-green-500/10 border-green-500 text-green-500 hover:bg-green-500/20'
            }
            ${isProcessing ? 'animate-pulse' : ''}
          `}
          onClick={handleSaveAnalysis}
          disabled={isProcessing}
          aria-label={isFavorite ? '分析已保存' : '保存分析'}
        >
          <div className="flex items-center gap-2">
            {isProcessing ? (
              <>
                <div className="w-3 h-3 border border-green-400 border-t-transparent rounded-full animate-spin" />
                <span>PROCESSING...</span>
              </>
            ) : isFavorite ? (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>ANALYSIS SAVED</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>SAVE ANALYSIS</span>
              </>
            )}
          </div>
          
          {/* 数据流动效果 */}
          {showDataFlow && (
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/20 to-transparent animate-pulse" />
              <div className="absolute top-0 left-0 w-full h-0.5 bg-green-400 animate-pulse" />
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-green-400 animate-pulse" />
            </div>
          )}
        </button>
        
        {/* 终端风格的状态指示器 */}
        <div className="mt-1 text-xs font-mono text-green-400/70">
          {isFavorite ? '● SAVED TO DATABASE' : '○ READY TO SAVE'}
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <button
        type="button"
        className={`
          inline-flex items-center gap-1 px-2 py-1
          text-xs font-mono border transition-all duration-200
          ${isFavorite
            ? 'bg-green-500/30 border-green-400 text-green-400'
            : 'bg-green-500/10 border-green-500 text-green-500 hover:bg-green-500/20'
          }
          ${className}
        `}
        onClick={handleSaveAnalysis}
        disabled={isProcessing}
        aria-label={isFavorite ? '已保存' : '保存'}
      >
        {isProcessing ? (
          <div className="w-3 h-3 border border-green-400 border-t-transparent rounded-full animate-spin" />
        ) : isFavorite ? (
          <CheckCircle className="w-3 h-3" />
        ) : (
          <Database className="w-3 h-3" />
        )}
        <span>{isFavorite ? 'SAVED' : 'SAVE'}</span>
      </button>
    );
  }

  if (variant === 'floating') {
    return (
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <button
          type="button"
          className={`
            w-14 h-14 rounded-full flex items-center justify-center
            border-2 transition-all duration-300 shadow-lg
            ${isFavorite
              ? 'bg-green-500 border-green-400 text-black shadow-green-500/25'
              : 'bg-black border-green-500 text-green-500 hover:bg-green-500/10 shadow-green-500/10'
            }
            ${isProcessing ? 'animate-pulse' : 'hover:scale-110'}
          `}
          onClick={handleSaveAnalysis}
          disabled={isProcessing}
          aria-label={isFavorite ? '分析已保存' : '保存分析'}
          title={reportTitle}
        >
          {isProcessing ? (
            <div className="w-6 h-6 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
          ) : isFavorite ? (
            <CheckCircle className="w-6 h-6" />
          ) : (
            <Save className="w-6 h-6" />
          )}
        </button>
        
        {/* 浮动状态文本 */}
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
          <div className={`
            px-2 py-1 rounded text-xs font-mono
            ${isFavorite
              ? 'bg-green-500 text-black'
              : 'bg-black border border-green-500 text-green-500'
            }
          `}>
            {isFavorite ? 'SAVED' : 'SAVE ANALYSIS'}
          </div>
        </div>
      </div>
    );
  }

  return null;
}

/**
 * 仪表板风格的批量保存组件
 */
export function DashboardBatchSave({
  reportIds,
  className = ''
}: {
  reportIds: string[];
  className?: string;
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);

  const handleBatchSave = async () => {
    setIsProcessing(true);
    setProcessedCount(0);
    
    // 模拟批量处理
    for (let i = 0; i < reportIds.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setProcessedCount(i + 1);
    }
    
    setIsProcessing(false);
  };

  return (
    <div className={`dashboard-batch-save ${className}`}>
      <button
        type="button"
        className={`
          px-6 py-3 font-mono text-sm border-2
          transition-all duration-200
          ${isProcessing
            ? 'bg-yellow-500/20 border-yellow-400 text-yellow-400'
            : 'bg-green-500/10 border-green-500 text-green-500 hover:bg-green-500/20'
          }
        `}
        onClick={handleBatchSave}
        disabled={isProcessing}
      >
        <div className="flex items-center gap-3">
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border border-yellow-400 border-t-transparent rounded-full animate-spin" />
              <span>BATCH PROCESSING... ({processedCount}/{reportIds.length})</span>
            </>
          ) : (
            <>
              <Database className="w-4 h-4" />
              <span>BATCH SAVE ALL ANALYSES</span>
            </>
          )}
        </div>
      </button>
      
      {/* 进度条 */}
      {isProcessing && (
        <div className="mt-2 w-full bg-black border border-green-500">
          <div 
            className="h-1 bg-green-500 transition-all duration-200"
            style={{ width: `${(processedCount / reportIds.length) * 100}%` }}
          />
        </div>
      )}
    </div>
  );
}