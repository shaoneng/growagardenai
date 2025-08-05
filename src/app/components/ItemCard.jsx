// src/app/components/ItemCard.jsx (Final Version with +/- Buttons)
"use client";

import Image from 'next/image';

const tierColorMap = {
  'Common': 'border-gray-400', 'Uncommon': 'border-green-500', 'Rare': 'border-blue-500',
  'Epic': 'border-purple-600', 'Legendary': 'border-orange-500', 'Mythical': 'border-red-600', 'Divine': 'border-yellow-400'
};

export default function ItemCard({ item, quantity, onSelect, isDimmed }) {
  const isSelected = quantity > 0;
  const selectedClass = isSelected ? 'ring-4 ring-offset-2 ring-sky-500' : '';
  const dimmedClass = isDimmed ? 'opacity-30' : 'opacity-100';
  const imagePath = `/images/items/${item.name}.png`;

  // --- 修改 1: 创建一个新的总点击处理器 ---
  // 只有在物品未被选中时，点击整个卡片才会添加第一个
  const handleCardClick = () => {
    if (!isSelected) {
      onSelect(item, 'add');
    }
    // 如果已经选中，点击卡片本身不执行任何操作，必须使用 +/- 按钮
  };

  // --- 修改 2: 为按钮创建独立的点击处理器 ---
  const handleButtonClick = (e, action) => {
    // 关键：阻止事件冒泡！
    // 否则点击按钮也会触发 handleCardClick，导致意外行为。
    e.stopPropagation(); 
    onSelect(item, action);
  };

  return (
    <div
      onClick={handleCardClick}
      // --- 修改 3: 移除 onContextMenu (右键点击) ---
      className={`relative cursor-pointer rounded-lg border bg-white shadow-md transition-all duration-300 hover:scale-105 ${tierColorMap[item.tier] || 'border-gray-300'} ${selectedClass} ${dimmedClass}`}
    >
      <div className="p-4">
        <div className="flex h-20 w-full items-center justify-center">
          <Image src={imagePath} alt={`Grow a Garden AI Advisor - ${item.display_name} item`} width={80} height={80} className="max-h-20 w-auto object-contain" onError={(e) => { e.target.src = '/images/items/placeholder.png'; }} />
        </div>
        <div className="mt-3 text-center">
          <p className="font-bold text-gray-800">{item.display_name}</p>
          <p className={`text-sm font-medium text-gray-500`}>{item.tier}</p>
        </div>
      </div>

      {/* --- 修改 4: 新增的 +/- 按钮和数量显示 --- */}
      {/* 只有在物品被选中 (quantity > 0) 时才显示这个控制区域 */}
      {isSelected && (
        <div className="absolute bottom-2 left-1/2 flex w-3/4 -translate-x-1/2 items-center justify-between rounded-full bg-slate-700 bg-opacity-80 text-white shadow-lg backdrop-blur-sm">
          <button 
            onClick={(e) => handleButtonClick(e, 'remove')}
            className="flex h-7 w-7 items-center justify-center rounded-full text-lg font-bold transition hover:bg-slate-600"
            aria-label="Decrease quantity"
          >
            -
          </button>
          <span className="text-sm font-semibold">{quantity}</span>
          <button 
            onClick={(e) => handleButtonClick(e, 'add')}
            className="flex h-7 w-7 items-center justify-center rounded-full text-lg font-bold transition hover:bg-slate-600"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      )}
    </div>
  );
}