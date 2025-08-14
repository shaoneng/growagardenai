"use client";

import { useState } from 'react';
import ImmersiveOnboardingDemo from '../components/feature/ImmersiveOnboardingDemo';

export default function TestOnboarding() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-8">沉浸式引导测试页面</h1>
        
        <div className="space-y-4">
          <button
            onClick={() => {
              console.log('🚀 显示沉浸式引导');
              setShowOnboarding(true);
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            显示沉浸式引导
          </button>
          
          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                localStorage.clear();
                console.log('🧹 清除所有localStorage数据');
                alert('localStorage已清除，刷新页面测试新用户体验');
              }
            }}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors ml-4"
          >
            清除缓存
          </button>
        </div>

        <div className="mt-8 p-4 bg-white rounded-lg shadow">
          <h3 className="font-bold mb-2">当前状态:</h3>
          <pre className="text-left text-sm">
            {typeof window !== 'undefined' ? JSON.stringify({
              localStorage: Object.keys(localStorage).reduce((acc, key) => {
                acc[key] = localStorage.getItem(key);
                return acc;
              }, {} as Record<string, string | null>)
            }, null, 2) : '服务端渲染中...'}
          </pre>
        </div>
      </div>

      {/* 沉浸式引导 */}
      {showOnboarding && (
        <ImmersiveOnboardingDemo
          onComplete={(preference) => {
            console.log('✅ 引导完成:', preference);
            setShowOnboarding(false);
            alert(`引导完成！用户偏好: ${preference}`);
          }}
          onSkip={() => {
            console.log('⏭️ 引导跳过');
            setShowOnboarding(false);
            alert('引导已跳过');
          }}
        />
      )}
    </div>
  );
}