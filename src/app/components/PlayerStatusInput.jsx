// src/app/components/PlayerStatusInput.jsx (Game-style Date Picker)
"use client";
import { useState, useEffect } from 'react'; // <-- 新增: 导入 useState 和 useEffect
import { useAppContext } from "@/context/AppContext";

export default function PlayerStatusInput() {
  // 1. 从全局 Context 获取我们需要的方法和值
  const { gold, setGold, inGameDate, setInGameDate } = useAppContext();

  // 2. 新增: 创建用于季节和天数的本地状态
  const [season, setSeason] = useState('Spring');
  const [day, setDay] = useState(1);

  const seasons = ['Spring', 'Summer', 'Autumn', 'Winter'];
  const days = Array.from({ length: 28 }, (_, i) => i + 1); // 假设每个季节28天

  // 3. 新增: 使用 useEffect，当季节或天数变化时，自动更新全局的 inGameDate
  useEffect(() => {
    // 将季节和天数合并成一个对AI更友好的字符串，例如 "Spring, Day 1"
    const newGameDate = `${season}, Day ${day}`;
    setInGameDate(newGameDate);
  }, [season, day, setInGameDate]);

  return (
    <div className="rounded-lg bg-white p-4 shadow-md">
      <h3 className="mb-4 text-lg font-bold text-gray-800">Player Status</h3>
      <div className="flex flex-col gap-4">
        <div>
          <label htmlFor="gold" className="mb-1 block text-sm font-medium text-gray-700">
            Current Gold
          </label>
          <input
            type="number"
            id="gold"
            value={gold}
            onChange={(e) => setGold(e.target.value)}
            placeholder="e.g., 5000"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        {/* 4. 修改: 将原来的 date input 替换为两个下拉选择框 */}
        <div>
          <label htmlFor="season" className="mb-1 block text-sm font-medium text-gray-700">
            In-game Date
          </label>
          <div className="flex gap-2">
            <select
              id="season"
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              className="w-1/2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {seasons.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select
              id="day"
              value={day}
              onChange={(e) => setDay(parseInt(e.target.value))}
              className="w-1/2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {days.map(d => <option key={d} value={d}>Day {d}</option>)}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}