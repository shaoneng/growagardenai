// /src/app/components/feature/PetsEncyclopedia.jsx
// 宠物百科全书组件

"use client";

import { useState, useEffect } from 'react';
import EncyclopediaBase from './EncyclopediaBase';
import { identifyPets, enrichItemData, loadPetsData } from '../../../lib/encyclopedia-utils';
import itemsData from '../../../../public/data/items.json';

export default function PetsEncyclopedia() {
  const [pets, setPets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPets = async () => {
      try {
        // 首先尝试加载专门的宠物数据
        let petsData = await loadPetsData();
        
        // 如果没有专门的宠物数据，从items.json中识别
        if (petsData.length === 0) {
          petsData = identifyPets(itemsData);
        }
        
        const enrichedPets = enrichItemData(petsData, 'pets');
        setPets(enrichedPets);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading pets data:', error);
        setIsLoading(false);
      }
    };

    loadPets();
  }, []);

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <div className="text-gray-600">Loading pets encyclopedia...</div>
      </div>
    );
  }

  return (
    <div>
      {/* 宠物特色信息 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-blue-900 mb-2">
          🐾 About Pets in Grow a Garden
        </h2>
        <p className="text-blue-800 text-sm mb-3">
          Pets provide valuable bonuses to your garden! Each pet has unique abilities that can boost 
          your crop growth, increase gold earnings, or provide special effects.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center">
            <span className="text-green-600 mr-2">🌱</span>
            <span className="text-blue-800">Growth Speed Bonuses</span>
          </div>
          <div className="flex items-center">
            <span className="text-yellow-600 mr-2">💰</span>
            <span className="text-blue-800">Gold Multipliers</span>
          </div>
          <div className="flex items-center">
            <span className="text-purple-600 mr-2">✨</span>
            <span className="text-blue-800">Special Effects</span>
          </div>
        </div>
      </div>

      {/* 百科全书组件 */}
      <EncyclopediaBase 
        items={pets}
        title="Pets Encyclopedia"
        type="pets"
        showBeginnerRecommendations={true}
      />

      {/* 宠物获取提示 */}
      {pets.length > 0 && (
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-900 mb-2">
            💡 Pet Attraction Tips
          </h3>
          <div className="text-yellow-800 text-sm space-y-2">
            <p>• Different pets are attracted to specific crops or garden setups</p>
            <p>• Keep your garden clean and well-maintained to attract more pets</p>
            <p>• Some pets only appear during certain seasons or weather conditions</p>
            <p>• Pet bonuses stack, so collecting multiple pets can significantly boost your garden!</p>
          </div>
        </div>
      )}
    </div>
  );
}