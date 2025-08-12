// src/app/components/ui/NavigationHeader.jsx
"use client";

import { useRouter } from 'next/navigation';
import { Home, ArrowLeft, Zap } from 'lucide-react';

export default function NavigationHeader({ 
  title, 
  subtitle, 
  showBackToHome = true, 
  showBackToAnalyzer = true,
  breadcrumbs = [] 
}) {
  const router = useRouter();

  return (
    <div className="mb-8">
      {/* 快速导航按钮 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {showBackToHome && (
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </button>
          )}
          
          {showBackToAnalyzer && (
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">Strategy Analyzer</span>
            </button>
          )}
        </div>

        {/* 面包屑导航 */}
        {breadcrumbs.length > 0 && (
          <nav className="hidden md:flex text-sm">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              {breadcrumbs.map((crumb, index) => (
                <li key={index} className="inline-flex items-center">
                  {index > 0 && (
                    <svg className="w-6 h-6 text-gray-400 mx-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                    </svg>
                  )}
                  {crumb.href ? (
                    <a href={crumb.href} className="text-blue-600 hover:text-blue-800">
                      {crumb.label}
                    </a>
                  ) : (
                    <span className="text-gray-500">{crumb.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
      </div>

      {/* 页面标题 */}
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {title}
        </h1>
        {subtitle && (
          <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}