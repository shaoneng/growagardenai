// src/app/components/ReportCard.jsx (With Collapse/Expand functionality)
"use client";
import { useState } from 'react';
import { icons, ChevronDown } from 'lucide-react';

export default function ReportCard({ icon, title, summary, points, initialExpanded = false }) {
  // 1. 新增: 每个卡片都有自己的“展开”状态
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  const LucideIcon = icons[icon] || icons['HelpCircle'];

  return (
    <div className="rounded-lg bg-white shadow-md">
      {/* 2. 新增: 让整个头部区域都可以点击，并增加鼠标指针样式 */}
      <div 
        className="flex cursor-pointer items-center justify-between gap-3 p-6"
        onClick={() => setIsExpanded(!isExpanded)} // 点击时切换展开/折叠状态
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-3">
          <LucideIcon className="h-8 w-8 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        </div>
        
        {/* 3. 新增: 添加一个V形图标作为视觉提示，并根据状态旋转 */}
        <ChevronDown 
          className={`h-6 w-6 text-gray-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`} 
        />
      </div>

      {/* 4. 修改: 只有在 isExpanded 为 true 时才渲染详细内容 */}
      {isExpanded && (
        <div className="px-6 pb-6 animate-fade-in-down"> {/* 可选: 添加一个简单的向下展开动画 */}
          <p className="mb-4 text-gray-600">{summary}</p>
          <ul className="list-inside list-disc space-y-2 text-gray-700">
            {points.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}