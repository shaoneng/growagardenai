// src/app/components/ItemCard.jsx (Final Version with +/- Buttons)
"use client";

import ItemImage from './ItemImage';

const tierColorMap = {
  'Common': 'border-gray-400', 'Uncommon': 'border-green-500', 'Rare': 'border-blue-500',
  'Epic': 'border-purple-600', 'Legendary': 'border-orange-500', 'Mythical': 'border-red-600', 'Divine': 'border-yellow-400'
};

export default function ItemCard({ 
  item, 
  quantity, 
  onAdd, 
  onRemove, 
  onSelect, // 保持向后兼容
  isDimmed,
  showTierBadge = true,
  showPrices = false 
}) {
  const isSelected = quantity > 0;
  const selectedClass = isSelected ? 'ring-4 ring-offset-2 ring-sky-500' : '';
  const dimmedClass = isDimmed ? 'opacity-30' : 'opacity-100';

  // 处理点击事件 - 支持新旧两种API
  const handleCardClick = () => {
    if (!isSelected) {
      if (onAdd) {
        onAdd();
      } else if (onSelect) {
        onSelect(item, 'add');
      }
    }
  };

  const handleButtonClick = (e, action) => {
    e.stopPropagation(); 
    if (action === 'add' && onAdd) {
      onAdd();
    } else if (action === 'remove' && onRemove) {
      onRemove();
    } else if (onSelect) {
      onSelect(item, action);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      // --- 修改 3: 移除 onContextMenu (右键点击) ---
      className={`relative cursor-pointer rounded-lg border bg-white shadow-md transition-all duration-300 hover:scale-105 ${tierColorMap[item.tier] || 'border-gray-300'} ${selectedClass} ${dimmedClass}`}
    >
      <div className="p-2">
        <div className="flex h-20 w-full items-center justify-center bg-gray-50 rounded">
          <img 
            src={`/images/items/${item.name}.png`}
            alt={item.display_name || item.name}
            className="w-24 h-24 max-h-28 object-contain"
            onError={(e) => {
              console.log(`ItemCard image failed: /images/items/${item.name}.png`);
              e.target.style.display = 'none';
              e.target.parentNode.innerHTML = `<div class="w-24 h-24 flex items-center justify-center text-3xl bg-gray-100 rounded">🌱</div>`;
            }}
          />
        </div>
        <div className="mt-1 text-center">
          <p className="font-bold text-gray-800 text-xs">{item.display_name}</p>
          {showTierBadge && (
            <p className={`text-xs font-medium text-gray-500`}>{item.tier}</p>
          )}
          {showPrices && item.prices && (
            <p className="text-xs text-green-600">
              ${Object.values(item.prices)[0] || 'N/A'}
            </p>
          )}
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