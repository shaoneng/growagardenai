// /src/app/components/Modal.jsx (Upgraded to Bottom Sheet)
"use client";

import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Modal({ isOpen, onClose, title, children }) {
  // 新增: 使用一个内部状态来控制动画，让退出动画可以播放
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // 当 isOpen 变为 true 时，延迟一小段时间再显示，以触发进入动画
      const timer = setTimeout(() => setShow(true), 10);
      return () => clearTimeout(timer);
    } else {
      // 当 isOpen 变为 false 时，立刻开始隐藏动画
      setShow(false);
    }
  }, [isOpen]);

  // 如果 isOpen 为 false 且动画已结束，则不渲染任何东西
  if (!isOpen) {
    return null;
  }

  return (
    // 1. 修改: 背景层保持不变，但容器改为将内容推向底部
    <div 
      className="fixed inset-0 z-50 flex items-end justify-center transition-opacity duration-300"
      onClick={onClose}
    >
      {/* 2. 修改: 弹窗内容区域的样式和动画 */}
      <div
        className={`w-full transform rounded-t-lg bg-white shadow-xl transition-transform duration-300 ease-in-out
          ${show ? 'translate-y-0' : 'translate-y-full'}` // 根据 show 状态控制滑入滑出
        }
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative p-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="text-xl font-semibold">{title}</h3>
            <button 
              onClick={onClose}
              className="rounded-full p-1 text-gray-500 hover:bg-gray-200"
              aria-label="Close modal"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="mt-4 max-h-[50vh] overflow-y-auto"> {/* 限制最大高度 */}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}