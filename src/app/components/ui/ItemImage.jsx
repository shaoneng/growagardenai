// src/app/components/ui/ItemImage.jsx
// 超级简单的图片组件

"use client";

export default function ItemImage({ 
  item, 
  size = 64, 
  className = "",
  type = 'crops'
}) {
  const imagePath = `/images/items/${item.name}.png`;
  
  return (
    <div 
      className={`flex items-center justify-center ${className}`}
      style={{ width: size, height: size, minWidth: size, minHeight: size }}
    >
      <img 
        src={imagePath} 
        alt={item.display_name || item.name} 
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'contain',
          display: 'block'
        }}
        onError={(e) => {
          console.log(`Failed to load: ${imagePath}`);
          e.target.style.display = 'none';
          e.target.parentNode.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#f3f4f6;border-radius:4px;font-size:24px;">${type === 'pets' ? '🐾' : '🌱'}</div>`;
        }}
      />
    </div>
  );
}