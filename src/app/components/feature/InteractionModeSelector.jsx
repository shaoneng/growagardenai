// /src/app/components/feature/InteractionModeSelector.jsx
"use client";

import { useAppContext } from '@/context/AppContext';
import { useTranslation } from 'react-i18next';

const InteractionModeSelector = () => {
  const { interactionMode, setInteractionMode, expertOptions, setExpertOptions } = useAppContext();
  const { t } = useTranslation();

  const modes = [
    {
      id: 'beginner',
      name: 'Beginner Guide',
      description: 'Simple, step-by-step guidance for new players',
      icon: '🌱',
      color: 'bg-green-100 border-green-300 text-green-800'
    },
    {
      id: 'advanced',
      name: 'Advanced Planning',
      description: 'Strategic analysis with detailed recommendations',
      icon: '🗺️',
      color: 'bg-blue-100 border-blue-300 text-blue-800'
    },
    {
      id: 'expert',
      name: 'Expert Simulation',
      description: 'Comprehensive analysis with customizable parameters',
      icon: '⚡',
      color: 'bg-purple-100 border-purple-300 text-purple-800'
    }
  ];

  const handleModeChange = (modeId) => {
    setInteractionMode(modeId);
  };

  const handleExpertOptionChange = (option, value) => {
    setExpertOptions(prev => ({
      ...prev,
      [option]: value
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Choose Your Analysis Mode
      </h3>
      
      {/* Mode Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {modes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => handleModeChange(mode.id)}
            className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
              interactionMode === mode.id
                ? mode.color
                : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-3">{mode.icon}</span>
              <h4 className="font-medium">{mode.name}</h4>
            </div>
            <p className="text-sm opacity-80">{mode.description}</p>
          </button>
        ))}
      </div>

      {/* Expert Mode Options */}
      {interactionMode === 'expert' && (
        <div className="border-t pt-6">
          <h4 className="font-medium text-gray-900 mb-4">Expert Configuration</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Optimization Goal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Optimization Goal
              </label>
              <select
                value={expertOptions.optimizationGoal}
                onChange={(e) => handleExpertOptionChange('optimizationGoal', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="balanced">Balanced Growth</option>
                <option value="profit">Maximum Profit</option>
                <option value="xp">Experience Focus</option>
                <option value="speed">Quick Returns</option>
              </select>
            </div>

            {/* Risk Tolerance */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Risk Tolerance
              </label>
              <select
                value={expertOptions.riskTolerance}
                onChange={(e) => handleExpertOptionChange('riskTolerance', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="conservative">Conservative</option>
                <option value="moderate">Moderate</option>
                <option value="aggressive">Aggressive</option>
              </select>
            </div>

            {/* Time Horizon */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Horizon
              </label>
              <select
                value={expertOptions.timeHorizon}
                onChange={(e) => handleExpertOptionChange('timeHorizon', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="short">Short Term (1-2 days)</option>
                <option value="medium">Medium Term (3-7 days)</option>
                <option value="long">Long Term (1+ weeks)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Mode Description */}
      <div className="mt-4 p-3 bg-gray-50 rounded-md">
        <p className="text-sm text-gray-600">
          {interactionMode === 'beginner' && 
            "Perfect for new players! Get simple, easy-to-follow advice with clear next steps."
          }
          {interactionMode === 'advanced' && 
            "Ideal for experienced players who want strategic insights and detailed planning recommendations."
          }
          {interactionMode === 'expert' && 
            "For advanced players who want comprehensive analysis with customizable parameters and detailed market intelligence."
          }
        </p>
      </div>
    </div>
  );
};

export default InteractionModeSelector;