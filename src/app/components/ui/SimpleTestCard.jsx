// src/app/components/ui/SimpleTestCard.jsx
// 极简测试卡片，用于调试图片显示问题

"use client";

export default function SimpleTestCard({ item, type = 'crops' }) {
  return (
    <div style={{
      width: '150px',
      height: '200px',
      border: '2px solid #ccc',
      borderRadius: '8px',
      padding: '10px',
      margin: '10px',
      backgroundColor: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* 极简图片测试 */}
      <div style={{
        width: '80px',
        height: '80px',
        border: '1px solid red', // 红色边框用于调试
        backgroundColor: '#f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '10px'
      }}>
        <img 
          src={`/images/items/${item.name}.png`}
          alt={item.display_name || item.name}
          style={{
            width: '70px',
            height: '70px',
            objectFit: 'contain',
            border: '1px solid blue' // 蓝色边框用于调试
          }}
          onLoad={(e) => {
            console.log(`🟢 LOADED: ${item.name}`);
            e.target.style.border = '2px solid green';
          }}
          onError={(e) => {
            console.log(`🔴 FAILED: ${item.name}`);
            e.target.style.display = 'none';
            e.target.parentNode.innerHTML = `
              <div style="width:70px;height:70px;background:#ffcccc;display:flex;align-items:center;justify-content:center;font-size:30px;border:2px solid red;">
                ${type === 'pets' ? '🐾' : '🌱'}
              </div>
            `;
          }}
        />
      </div>
      
      {/* 物品名称 */}
      <div style={{
        textAlign: 'center',
        fontSize: '12px',
        fontWeight: 'bold'
      }}>
        {item.display_name || item.name}
      </div>
      
      {/* 稀有度 */}
      <div style={{
        textAlign: 'center',
        fontSize: '10px',
        color: '#666',
        marginTop: '5px'
      }}>
        {item.tier}
      </div>
    </div>
  );
}