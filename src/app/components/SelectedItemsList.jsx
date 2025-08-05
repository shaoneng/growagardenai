// src/app/components/SelectedItemsList.jsx (With Input Validation)
"use client";

import { useAppContext } from "@/context/AppContext";

export default function SelectedItemsList({ allItems }) {
  // 1. 新增: 从 Context 中额外获取 gold 和 inGameDate 用于验证
  const { selectedItems, isLoading, requestAnalysis, gold, inGameDate } = useAppContext();
  
  const hasSelection = selectedItems.size > 0;
  
  // 2. 新增: 组合所有验证条件
  const isSubmittable = hasSelection && gold && Number(gold) > 0 && inGameDate && !isLoading;
  
  const itemsById = new Map(allItems.map(item => [item.id, item]));

  return (
    <div className="rounded-lg bg-white p-4 shadow-md">
      <h3 className="mb-4 text-lg font-bold text-gray-800">Your Selection</h3>
      <div className="mb-4 min-h-[100px] max-h-[300px] overflow-y-auto">
        {hasSelection ? (
            <ul className="space-y-2">{[...selectedItems.entries()].map(([id, quantity]) => <li key={id} className="flex items-center justify-between text-gray-700"><span>{itemsById.get(id)?.display_name}</span><span className="font-semibold">{`x ${quantity}`}</span></li>)}</ul>
        ) : (
            <p className="py-8 text-center text-gray-500">Click on items to add them here.</p>
        )}
      </div>
      <button
        onClick={requestAnalysis}
        // 3. 修改: 使用新的验证变量来控制 disabled 状态
        disabled={!isSubmittable}
        className="w-full rounded-md bg-blue-600 px-4 py-2 font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        {isLoading ? 'Analyzing...' : 'Request AI Guidance!'}
      </button>
    </div>
  );
}