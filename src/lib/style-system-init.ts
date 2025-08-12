// /src/lib/style-system-init.ts
// 样式系统初始化和注册

import { StyleRegistry } from './report-style-system';
import { magazineAdapter } from './style-adapters/magazine-adapter';
import { minimalAdapter } from './style-adapters/minimal-adapter';
import { dashboardAdapter } from './style-adapters/dashboard-adapter';

/**
 * 初始化样式系统
 */
export function initializeStyleSystem(): void {
  const registry = StyleRegistry.getInstance();
  
  try {
    // 注册所有样式适配器
    registry.registerStyle(magazineAdapter);
    registry.registerStyle(minimalAdapter);
    registry.registerStyle(dashboardAdapter);
    
    console.log('✅ Style system initialized with 3 styles: magazine, minimal, dashboard');
  } catch (error) {
    console.error('❌ Failed to initialize style system:', error);
    throw error;
  }
}

/**
 * 获取样式系统实例
 */
export function getStyleSystem() {
  return {
    registry: StyleRegistry.getInstance()
  };
}