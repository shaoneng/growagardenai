// src/app/components/feature/EncyclopediaEntrance.jsx
"use client";

import { useRouter } from 'next/navigation';
import { BookOpen, Sprout, Heart } from 'lucide-react';

export default function EncyclopediaEntrance() {
  const router = useRouter();

  const encyclopediaOptions = [
    {
      id: 'crops',
      title: 'Crops Encyclopedia',
      description: 'Discover all crops, their growth times, profits, and seasonal bonuses',
      icon: Sprout,
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      path: '/crops',
      stats: '50+ Crops'
    },
    {
      id: 'pets',
      title: 'Pets Encyclopedia', 
      description: 'Learn about pets, their bonuses, attraction methods, and effects',
      icon: Heart,
      color: 'bg-pink-500',
      hoverColor: 'hover:bg-pink-600',
      path: '/pets',
      stats: '30+ Pets'
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <BookOpen className="w-8 h-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            Game Encyclopedia
          </h2>
        </div>
        <p className="text-gray-600">
          Explore detailed information about all crops and pets in the game
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {encyclopediaOptions.map((option) => {
          const IconComponent = option.icon;
          
          return (
            <div
              key={option.id}
              onClick={() => router.push(option.path)}
              className="group cursor-pointer bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 hover:border-gray-300"
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`${option.color} ${option.hoverColor} p-3 rounded-lg transition-colors group-hover:scale-105 transform duration-200`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {option.title}
                      </h3>
                      <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {option.stats}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {option.description}
                    </p>
                    
                    <div className="flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700 transition-colors">
                      <span>Explore {option.title.split(' ')[0]}</span>
                      <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 底部装饰条 */}
              <div className={`h-1 ${option.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></div>
            </div>
          );
        })}
      </div>

      {/* 快速功能提示 */}
      <div className="mt-8 bg-blue-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-start gap-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <BookOpen className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-medium text-blue-900 mb-1">Encyclopedia Features</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Real-time search and filtering</li>
              <li>• Detailed stats and growth information</li>
              <li>• Investment advice and ROI calculations</li>
              <li>• Seasonal bonuses and optimal strategies</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}