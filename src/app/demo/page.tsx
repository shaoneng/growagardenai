"use client";

import { useState } from 'react';
import ImmersiveOnboardingDemo from '../components/feature/ImmersiveOnboardingDemo';

export default function OnboardingDemo() {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      {!showDemo ? (
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-8">沉浸式引导演示</h1>
          <p className="text-xl text-gray-600 mb-8">点击下面的按钮体验革命性的用户引导</p>
          <button
            onClick={() => setShowDemo(true)}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 text-xl"
          >
            🚀 体验沉浸式引导
          </button>
        </div>
      ) : (
        <ImmersiveOnboardingDemo
          onComplete={(preference) => {
            alert(`太棒了！你选择了: ${preference}`);
            setShowDemo(false);
          }}
          onSkip={() => {
            alert('下次再试试吧！');
            setShowDemo(false);
          }}
        />
      )}
    </div>
  );
}