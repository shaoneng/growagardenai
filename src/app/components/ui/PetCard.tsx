'use client';

import React from 'react';
import ItemImage from './ItemImage';

interface PetCardProps {
  pet: {
    id: string;
    name: string;
    display_name: string;
    tier: string;
    bonus_type: string;
    bonus_value: number;
    attraction_method: string;
    description?: string;
  };
  size?: 'small' | 'medium' | 'large';
  showDetails?: boolean;
}

const PetCard: React.FC<PetCardProps> = ({ 
  pet, 
  size = 'medium', 
  showDetails = true 
}) => {
  const sizeClasses = {
    small: 'p-3',
    medium: 'p-4',
    large: 'p-6'
  };

  const imageSizes = {
    small: 48,
    medium: 64,
    large: 80
  };

  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'common': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'uncommon': return 'bg-green-100 text-green-700 border-green-200';
      case 'rare': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'epic': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'legendary': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getBonusIcon = (bonusType: string) => {
    switch (bonusType) {
      case 'gold': return '💰';
      case 'growth': return '🌱';
      case 'experience': return '📚';
      case 'luck': return '🍀';
      case 'harvest': return '🌾';
      default: return '⭐';
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 ${sizeClasses[size]}`}>
      {/* Pet Image */}
      <div className="flex justify-center mb-3">
        <ItemImage 
          item={pet} 
          size={imageSizes[size]} 
          type="pets"
          className="rounded-lg bg-gray-50 p-2"
        />
      </div>

      {/* Pet Name */}
      <div className="text-center mb-2">
        <h3 className="font-semibold text-gray-800 text-sm">
          {pet.display_name}
        </h3>
      </div>

      {/* Pet Tier */}
      <div className="flex justify-center mb-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTierColor(pet.tier)}`}>
          {pet.tier}
        </span>
      </div>

      {showDetails && (
        <>
          {/* Bonus Information */}
          <div className="bg-gray-50 rounded-lg p-3 mb-3">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-lg">{getBonusIcon(pet.bonus_type)}</span>
              <span className="text-sm font-medium text-gray-700 capitalize">
                {pet.bonus_type} Bonus
              </span>
            </div>
            <div className="text-center">
              <span className="text-lg font-bold text-green-600">
                +{pet.bonus_value}%
              </span>
            </div>
          </div>

          {/* Description */}
          {pet.description && (
            <div className="text-xs text-gray-600 text-center mb-3 leading-relaxed">
              {pet.description}
            </div>
          )}

          {/* Attraction Method */}
          <div className="border-t border-gray-100 pt-3">
            <div className="text-xs text-gray-500 text-center">
              <div className="font-medium mb-1">🎯 How to Attract:</div>
              <div className="leading-relaxed">
                {pet.attraction_method}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PetCard;