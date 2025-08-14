'use client';

// /src/app/components/layout/GlobalNavigation.tsx
// 全局导航栏组件

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  BookOpen, 
  Heart, 
  Menu, 
  X, 
  Sparkles,
  Search
} from 'lucide-react';
import { useFavorites } from '@/contexts/FavoritesContext';
import { NavigationBadge } from '../ui/FavoritesBadge';

export default function GlobalNavigation() {
  const pathname = usePathname();
  const { getFavoriteCount } = useFavorites();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const favoriteCount = getFavoriteCount();

  // 导航项配置
  const navigationItems = [
    {
      name: 'Home',
      href: '/',
      icon: Home,
      description: 'AI Strategy Advisor'
    },
    {
      name: 'Encyclopedia',
      href: '/crops',
      icon: BookOpen,
      description: 'Browse crops and pets',
      submenu: [
        { name: 'Crops', href: '/crops', icon: '🌱' },
        { name: 'Pets', href: '/pets', icon: '🐾' }
      ]
    },
    {
      name: 'My Favorites',
      href: '/favorites',
      icon: Heart,
      description: 'Manage your favorite items',
      badge: favoriteCount > 0 ? favoriteCount : undefined
    }
  ];

  // 检查当前路径是否匹配
  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  // 切换移动端菜单
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* 主导航栏 */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo 和品牌 */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="hidden sm:block">
                  <div className="font-bold text-gray-900">Garden AI</div>
                  <div className="text-xs text-gray-500">Strategy Advisor</div>
                </div>
              </Link>
            </div>

            {/* 桌面端导航菜单 */}
            <div className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                
                return (
                  <div key={item.name} className="relative group">
                    <Link
                      href={item.href}
                      className={`
                        relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                        ${active
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }
                      `}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                      
                      {/* 收藏数量徽章 */}
                      {item.badge && (
                        <NavigationBadge count={item.badge} />
                      )}
                    </Link>

                    {/* 子菜单（如果有） */}
                    {item.submenu && (
                      <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <div className="py-2">
                          {item.submenu.map((subItem) => (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                              <span className="text-lg">{subItem.icon}</span>
                              <span>{subItem.name}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 移动端菜单按钮 */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 移动端菜单 */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-2 space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                
                return (
                  <div key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`
                        flex items-center justify-between px-3 py-3 rounded-lg text-sm font-medium transition-colors
                        ${active
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        <div>
                          <div>{item.name}</div>
                          <div className="text-xs text-gray-500">{item.description}</div>
                        </div>
                      </div>
                      
                      {/* 收藏数量徽章 */}
                      {item.badge && (
                        <div className="flex-shrink-0">
                          <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 bg-red-500 text-white text-xs font-bold rounded-full">
                            {item.badge > 9 ? '9+' : item.badge}
                          </span>
                        </div>
                      )}
                    </Link>

                    {/* 移动端子菜单 */}
                    {item.submenu && (
                      <div className="ml-8 mt-1 space-y-1">
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                          >
                            <span className="text-base">{subItem.icon}</span>
                            <span>{subItem.name}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 移动端快速操作 */}
            <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
              <div className="text-xs font-medium text-gray-500 mb-2">Quick Actions</div>
              <div className="flex items-center gap-2">
                <Link
                  href="/crops"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
                >
                  <span>🌱</span>
                  <span>Browse Crops</span>
                </Link>
                <Link
                  href="/pets"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors"
                >
                  <span>🐾</span>
                  <span>Browse Pets</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* 移动端菜单遮罩 */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}