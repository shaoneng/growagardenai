// src/app/components/SelectionToolbar.jsx (With Modal)
"use client";

import { useState } from 'react';
import { useAppContext } from "@/context/AppContext";
import Modal from '../ui/Modal'; // <-- 1. 导入新创建的 Modal 组件

// 2. 接收 allItems 属性，用于在弹窗中显示物品名称
export default function SelectionToolbar({ onNextStep, allItems }) {
  const { selectedItems } = useAppContext();
  // 3. 新增一个状态来控制弹窗的打开/关闭
  const [isModalOpen, setIsModalOpen] = useState(false);

  const selectionCount = selectedItems.size;
  const itemsById = new Map(allItems.map(item => [item.id, item]));

  if (selectionCount === 0) {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 z-10 w-full border-t border-gray-200 bg-white/80 p-4 shadow-lg backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          {/* 4. 让工具栏左侧区域变得可以点击 */}
          <div 
            className="cursor-pointer"
            onClick={() => setIsModalOpen(true)} // 点击时打开弹窗
          >
            <span className="font-bold text-blue-600">{selectionCount}</span>
            <span className="ml-2 text-gray-700">item(s) selected</span>
          </div>
          <button
            onClick={onNextStep}
            className="rounded-full bg-blue-600 px-6 py-2 font-semibold text-white shadow-md transition-transform hover:scale-105"
          >
            Next Step
          </button>
        </div>
      </div>

      {/* 5. 在这里渲染 Modal 组件 */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Your Current Selection"
      >
        {/* 这是传递给 Modal 的内容，即已选物品列表 */}
        <ul className="space-y-3">
          {[...selectedItems.entries()].map(([id, quantity]) => {
            const item = itemsById.get(id);
            return (
              <li key={id} className="flex justify-between items-center text-gray-800">
                <span>{item?.display_name || 'Unknown Item'}</span>
                <span className="font-semibold">{`x ${quantity}`}</span>
              </li>
            );
          })}
        </ul>
      </Modal>
    </>
  );
}