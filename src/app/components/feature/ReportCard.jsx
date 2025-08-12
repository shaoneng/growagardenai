// /src/app/components/ReportCard.jsx
"use client";
import { useState } from 'react';
import { icons, ChevronDown, HelpCircle, Link as LinkIcon } from 'lucide-react';

// 新增一个函数来处理严重性标签的颜色
const getSeverityColor = (severity) => {
  switch (severity?.toLowerCase()) {
    case 'high':
      return 'bg-red-100 text-red-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'low':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};


export default function ReportCard({ icon, title, summary, points, initialExpanded = false }) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  let LucideIcon = icon ? icons[icon] : null;

  if (!LucideIcon) {
    console.warn(`Icon "${icon}" not found. Falling back to HelpCircle.`);
    LucideIcon = HelpCircle;
  }

  return (
    <div className="rounded-lg bg-white shadow-md">
      <div 
        className="flex cursor-pointer items-center justify-between gap-3 p-6"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-3">
          <LucideIcon className="h-8 w-8 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        </div>
        <ChevronDown 
          className={`h-6 w-6 text-gray-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`} 
        />
      </div>
      {isExpanded && (
        <div className="animate-fade-in-down px-6 pb-6">
          <p className="mb-4 text-gray-600">{summary}</p>
          {/* --- 这是关键的修复 --- */}
          {/* 我们不再使用 <ul>，而是使用 div 来更好地控制布局 */}
          <div className="space-y-4">
            {points.map((point, index) => (
              // 检查 point 是否是有效对象
              typeof point === 'object' && point !== null ? (
                <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                  {/* 渲染 point.action 作为主要建议 */}
                  <p className="font-semibold text-gray-800">{point.action}</p>
                  
                  {/* 渲染 point.reasoning 作为解释 */}
                  {point.reasoning && (
                    <p className="mt-1 text-sm text-gray-600">{point.reasoning}</p>
                  )}

                  {/* 渲染标签和协同效应 */}
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {point.tags?.map((tag) => (
                      <span key={tag} className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                        {tag}
                      </span>
                    ))}
                    {point.synergy && (
                       <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                         <LinkIcon size={12} />
                         协同: {point.synergy.join(' + ')}
                       </span>
                    )}
                     {point.severity && (
                       <span className={`rounded-full px-2 py-1 text-xs font-medium ${getSeverityColor(point.severity)}`}>
                         风险: {point.severity}
                       </span>
                    )}
                  </div>
                </div>
              ) : (
                // 为旧的字符串格式提供后备支持
                <div key={index} className="list-inside list-disc text-gray-700">{point}</div>
              )
            ))}
          </div>
        </div>
      )}
    </div>
  );
}