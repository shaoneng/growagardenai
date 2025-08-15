'use client';

import React, { useState } from 'react';

export default function GameIntroduction({ onComplete, onSkip }) {
  const [currentSection, setCurrentSection] = useState(0);

  const sections = [
    {
      id: 'basics',
      title: 'Getting Started: Your Garden Journey',
      icon: '🌱',
      content: {
        subtitle: 'Master the Core Loop',
        description: 'Welcome to Grow a Garden! This viral Roblox sensation has captivated millions with its addictive yet relaxing gameplay.',
        keyPoints: [
          {
            title: 'Starting Capital',
            description: 'You begin with 20 Sheckles to purchase your first seeds (carrots are perfect for beginners)',
            icon: '💰'
          },
          {
            title: 'The Core Loop',
            description: 'Buy seeds → Plant in your plot → Wait for crops to mature (even offline!) → Harvest and sell for profit → Reinvest to expand',
            icon: '🔄'
          },
          {
            title: 'Intuitive Design',
            description: 'Simple, beginner-friendly interface that anyone can master in minutes',
            icon: '🎮'
          }
        ]
      }
    },
    {
      id: 'strategy',
      title: 'Advanced Mechanics: Mutations & Systems',
      icon: '⚡',
      content: {
        subtitle: 'Unlock Hidden Potential',
        description: 'Beyond basic farming lies a deep strategic layer that separates casual players from garden masters.',
        keyPoints: [
          {
            title: 'Crop Mutations',
            description: 'Crops can mutate into rare variants (Golden, Rainbow, Frozen) with significantly higher values',
            icon: '✨'
          },
          {
            title: 'Weather System',
            description: 'Different weather patterns trigger specific mutation types (Lightning, Frost, Rainbow effects)',
            icon: '🌦️'
          },
          {
            title: 'Sprinkler Strategy',
            description: 'Accelerate growth and boost high-value mutation chances with strategic sprinkler placement',
            icon: '💧'
          },
          {
            title: 'Pet Companions',
            description: 'Unlock pets through loot boxes for passive bonuses like faster growth or increased profits',
            icon: '🐾'
          }
        ]
      }
    },
    {
      id: 'progression',
      title: 'Growth Path: Expansion & Events',
      icon: '🚀',
      content: {
        subtitle: 'Scale Your Empire',
        description: 'Transform from a humble gardener into a agricultural mogul through smart expansion and event participation.',
        keyPoints: [
          {
            title: 'Land Expansion',
            description: 'Unlock larger plots and premium tools as your Sheckles accumulate',
            icon: '🏞️'
          },
          {
            title: 'Weekly Events',
            description: 'Limited-time seeds, decorations, and exclusive items require active participation',
            icon: '📅'
          },
          {
            title: 'Kitchen Storm Update',
            description: 'The pasta cooking system introduced recipes and culinary gameplay mechanics',
            icon: '🍝'
          },
          {
            title: 'Community Trading',
            description: 'Gift rare crops to friends and engage in the thriving player economy',
            icon: '🤝'
          }
        ]
      }
    },
    {
      id: 'phenomenon',
      title: 'Why It Became a Global Phenomenon',
      icon: '🌟',
      content: {
        subtitle: 'The Secret to Success',
        description: 'Understanding what made Grow a Garden the "Gen-Alpha FarmVille" helps you appreciate its genius design.',
        keyPoints: [
          {
            title: 'Explosive Growth',
            description: 'Reached millions of players within weeks, consistently outperforming Fortnite with 21+ million peak concurrent users',
            icon: '📈'
          },
          {
            title: 'Stress-Free Gaming',
            description: 'Idle mechanics and therapeutic gameplay provide emotional comfort in our complex world',
            icon: '😌'
          },
          {
            title: 'Social Connection',
            description: 'Strong community features, trading systems, and viral sharing fuel organic growth',
            icon: '🌐'
          },
          {
            title: 'Perfect Balance',
            description: 'Simple enough for anyone, deep enough for strategy enthusiasts',
            icon: '⚖️'
          }
        ]
      }
    }
  ];

  const strategicTips = [
    { phase: 'Early Game', strategy: 'Focus on carrots and basic crops to build your Sheckles foundation', icon: '🥕' },
    { phase: 'Mid Game', strategy: 'Invest in sprinklers and hunt for mutations while collecting pets', icon: '💧' },
    { phase: 'Late Game', strategy: 'Participate in weekly events and rare seed collections like Kitchen Storm', icon: '🎯' },
    { phase: 'Ongoing', strategy: 'Leverage idle mechanics for sustainable profits while building community connections', icon: '♾️' }
  ];

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const currentSectionData = sections[currentSection];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🌻</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Grow a Garden
          </h1>
          <p className="text-lg text-gray-600">
            Master the viral Roblox phenomenon that's captivating millions
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2">
            {sections.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSection
                    ? 'bg-green-500'
                    : index < currentSection
                    ? 'bg-green-300'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          {/* Section Header */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">{currentSectionData.icon}</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {currentSectionData.title}
            </h2>
            <p className="text-lg text-green-600 font-semibold">
              {currentSectionData.content.subtitle}
            </p>
            <p className="text-gray-600 mt-4 leading-relaxed">
              {currentSectionData.content.description}
            </p>
          </div>

          {/* Key Points */}
          <div className="grid gap-6 md:grid-cols-2">
            {currentSectionData.content.keyPoints.map((point, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl flex-shrink-0">{point.icon}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {point.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {point.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Strategic Tips (show on last section) */}
          {currentSection === sections.length - 1 && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                🎯 Quick Strategy Reference
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {strategicTips.map((tip, index) => (
                  <div key={index} className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{tip.icon}</div>
                      <div>
                        <div className="font-semibold text-green-700 text-sm">
                          {tip.phase}
                        </div>
                        <div className="text-gray-700 text-sm">
                          {tip.strategy}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={onSkip}
            className="px-6 py-3 text-gray-500 hover:text-gray-700 transition-colors"
          >
            Skip Introduction
          </button>

          <div className="flex space-x-4">
            {currentSection > 0 && (
              <button
                onClick={handlePrevious}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Previous
              </button>
            )}
            
            <button
              onClick={handleNext}
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              {currentSection === sections.length - 1 ? 'Start Your Garden!' : 'Next'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>
            Ready to join the millions who've discovered the magic of strategic gardening?
          </p>
        </div>
      </div>
    </div>
  );
}