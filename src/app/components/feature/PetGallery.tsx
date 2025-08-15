'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List } from 'lucide-react';
import PetCard from '../ui/PetCard';
import { loadPetsData } from '@/lib/encyclopedia-utils';

interface Pet {
  id: string;
  name: string;
  display_name: string;
  tier: string;
  bonus_type: string;
  bonus_value: number;
  attraction_method: string;
  description?: string;
}

const PetGallery: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [filteredPets, setFilteredPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState('all');
  const [selectedBonus, setSelectedBonus] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const loadPets = async () => {
      try {
        const petsData = await loadPetsData();
        setPets(petsData);
        setFilteredPets(petsData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading pets:', error);
        setIsLoading(false);
      }
    };

    loadPets();
  }, []);

  useEffect(() => {
    let filtered = pets;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(pet =>
        pet.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Tier filter
    if (selectedTier !== 'all') {
      filtered = filtered.filter(pet => pet.tier.toLowerCase() === selectedTier);
    }

    // Bonus type filter
    if (selectedBonus !== 'all') {
      filtered = filtered.filter(pet => pet.bonus_type === selectedBonus);
    }

    setFilteredPets(filtered);
  }, [pets, searchTerm, selectedTier, selectedBonus]);

  const tiers = ['all', 'common', 'uncommon', 'rare', 'epic', 'legendary'];
  const bonusTypes = ['all', 'gold', 'growth', 'experience', 'luck', 'harvest'];

  const getTierStats = () => {
    const stats = pets.reduce((acc, pet) => {
      acc[pet.tier.toLowerCase()] = (acc[pet.tier.toLowerCase()] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return stats;
  };

  const getBonusStats = () => {
    const stats = pets.reduce((acc, pet) => {
      acc[pet.bonus_type] = (acc[pet.bonus_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return stats;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600">Loading pet gallery...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          🐾 Pet Gallery
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Discover all {pets.length} adorable pets and their unique bonuses
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {Object.entries(getTierStats()).map(([tier, count]) => (
          <div key={tier} className="bg-white rounded-lg p-4 text-center shadow-sm border">
            <div className="text-2xl font-bold text-gray-800">{count}</div>
            <div className="text-sm text-gray-600 capitalize">{tier}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Search */}
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search pets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Tier Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {tiers.map(tier => (
                <option key={tier} value={tier}>
                  {tier === 'all' ? 'All Tiers' : tier.charAt(0).toUpperCase() + tier.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Bonus Filter */}
          <div>
            <select
              value={selectedBonus}
              onChange={(e) => setSelectedBonus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {bonusTypes.map(bonus => (
                <option key={bonus} value={bonus}>
                  {bonus === 'all' ? 'All Bonuses' : bonus.charAt(0).toUpperCase() + bonus.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* View Mode */}
          <div className="flex items-center gap-1 border border-gray-300 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Active Filters */}
        {(searchTerm || selectedTier !== 'all' || selectedBonus !== 'all') && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Active filters:</span>
              {searchTerm && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  Search: "{searchTerm}"
                </span>
              )}
              {selectedTier !== 'all' && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded capitalize">
                  Tier: {selectedTier}
                </span>
              )}
              {selectedBonus !== 'all' && (
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded capitalize">
                  Bonus: {selectedBonus}
                </span>
              )}
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedTier('all');
                  setSelectedBonus('all');
                }}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Clear all
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {filteredPets.length} of {pets.length} pets
        </p>
      </div>

      {/* Pet Grid/List */}
      {filteredPets.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No pets found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'
            : 'space-y-4'
        }>
          {filteredPets.map(pet => (
            <PetCard
              key={pet.id}
              pet={pet}
              size={viewMode === 'list' ? 'small' : 'medium'}
              showDetails={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PetGallery;