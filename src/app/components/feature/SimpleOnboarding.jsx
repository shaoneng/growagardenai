"use client";

import { useState } from 'react';

const SimpleOnboarding = ({ onComplete, onSkip }) => {
  const [step, setStep] = useState('choice');
  const [choice, setChoice] = useState(null);

  const scenarios = {
    profit: {
      title: "Maximize Profit",
      icon: "💰",
      result: "Ancient Fruit - 2,340g/day",
      tip: "Based on current market analysis"
    },
    speed: {
      title: "Fast Growth", 
      icon: "⚡",
      result: "Coffee Beans - Harvest every 2 hours",
      tip: "Highest experience efficiency"
    },
    balance: {
      title: "Balanced Strategy",
      icon: "⚖️", 
      result: "Blueberries - Steady income",
      tip: "Low risk, perfect for beginners"
    }
  };

  if (step === 'choice') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full p-8">
          <h1 className="text-3xl font-bold text-center mb-2">
            Let me help you find the perfect strategy
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Choose your goal and get personalized recommendations instantly
          </p>
          
          <div className="grid gap-4 mb-8">
            {Object.entries(scenarios).map(([key, scenario]) => (
              <button
                key={key}
                onClick={() => {
                  setChoice(key);
                  setStep('result');
                }}
                className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
              >
                <span className="text-3xl mr-4">{scenario.icon}</span>
                <span className="text-xl font-medium">{scenario.title}</span>
              </button>
            ))}
          </div>
          
          <div className="text-center">
            <button
              onClick={onSkip}
              className="text-gray-500 hover:text-gray-700"
            >
              Skip guide
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'result' && choice) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full p-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{scenarios[choice].icon}</div>
            <h2 className="text-2xl font-bold mb-2">Perfect!</h2>
            <p className="text-gray-600">We found the ideal strategy for you</p>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <h3 className="font-bold text-lg mb-2">Recommended Strategy</h3>
            <p className="text-xl text-green-800 mb-2">{scenarios[choice].result}</p>
            <p className="text-sm text-green-600">{scenarios[choice].tip}</p>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={() => onComplete(choice)}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 font-medium"
            >
              Get Started
            </button>
            <button
              onClick={() => setStep('choice')}
              className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 font-medium"
            >
              Choose Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default SimpleOnboarding;