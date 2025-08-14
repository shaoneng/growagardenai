'use client';

// /src/contexts/FavoritesContext.tsx
// 收藏系统的 React Context 实现

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { 
  FavoritesData, 
  FavoritesContextType, 
  FavoriteItemType 
} from '@/types';
import { FavoritesStorage, FavoritesUtils } from '@/lib/favorites-storage';
import { 
  FavoritesValidator, 
  FavoritesErrorHandler, 
  debounce 
} from '@/lib/favorites-validation';
import { EnhancedFavoritesLoader } from '@/lib/favorites-migration';

/**
 * 默认收藏数据
 */
const DEFAULT_FAVORITES: FavoritesData = {
  crops: [],
  pets: [],
  reports: [],
  lastUpdated: new Date().toISOString()
};

/**
 * 创建收藏上下文
 */
const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

/**
 * Provider 属性接口
 */
interface FavoritesProviderProps {
  children: ReactNode;
}

/**
 * 收藏系统 Provider 组件
 */
export function FavoritesProvider({ children }: FavoritesProviderProps) {
  // 状态管理
  const [favorites, setFavorites] = useState<FavoritesData>(DEFAULT_FAVORITES);
  const [isLoading, setIsLoading] = useState(true);

  // 防抖保存函数 - 避免频繁写入 localStorage
  const debouncedSave = useCallback(
    debounce((data: FavoritesData) => {
      const result = FavoritesStorage.save(data);
      if (!result.success) {
        FavoritesErrorHandler.logError(
          new Error(result.error || 'Failed to save favorites'),
          'debouncedSave'
        );
      }
    }, 500),
    []
  );

  // 初始化：从 localStorage 加载数据（包含迁移功能）
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        setIsLoading(true);
        
        // 使用增强的加载器，支持数据迁移
        const result = EnhancedFavoritesLoader.safeLoad();
        
        if (result.success && result.data) {
          setFavorites(result.data);
        } else {
          // 加载失败，使用默认数据
          console.warn('Failed to load favorites, using default data:', result.error);
          setFavorites(DEFAULT_FAVORITES);
        }
      } catch (error) {
        FavoritesErrorHandler.logError(error, 'loadFavorites');
        setFavorites(DEFAULT_FAVORITES);
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, []);

  // 当收藏数据变化时，保存到 localStorage
  useEffect(() => {
    if (!isLoading) {
      debouncedSave(favorites);
    }
  }, [favorites, isLoading, debouncedSave]);

  /**
   * 添加物品到收藏
   */
  const addToFavorites = useCallback((itemId: string, type: FavoriteItemType) => {
    try {
      // 验证参数
      FavoritesValidator.validateFavoriteOperation(itemId, type);

      setFavorites(prevFavorites => {
        // 确保prevFavorites已初始化
        if (!prevFavorites) {
          return DEFAULT_FAVORITES;
        }
        
        // 检查是否已经收藏
        if (FavoritesUtils.isItemFavorited(prevFavorites, itemId, type)) {
          return prevFavorites; // 已收藏，不做任何操作
        }

        // 添加到收藏
        return FavoritesUtils.addItem(prevFavorites, itemId, type);
      });

    } catch (error) {
      FavoritesErrorHandler.logError(error, 'addToFavorites');
      
      // 在生产环境中，可以显示用户友好的错误消息
      if (process.env.NODE_ENV === 'production') {
        console.warn('Failed to add item to favorites:', FavoritesErrorHandler.getUserFriendlyMessage(error));
      }
    }
  }, []);

  /**
   * 从收藏中移除物品
   */
  const removeFromFavorites = useCallback((itemId: string, type: FavoriteItemType) => {
    try {
      // 验证参数
      FavoritesValidator.validateFavoriteOperation(itemId, type);

      setFavorites(prevFavorites => {
        // 确保prevFavorites已初始化
        if (!prevFavorites) {
          return DEFAULT_FAVORITES;
        }
        
        // 检查是否已收藏
        if (!FavoritesUtils.isItemFavorited(prevFavorites, itemId, type)) {
          return prevFavorites; // 未收藏，不做任何操作
        }

        // 从收藏中移除
        return FavoritesUtils.removeItem(prevFavorites, itemId, type);
      });

    } catch (error) {
      FavoritesErrorHandler.logError(error, 'removeFromFavorites');
      
      // 在生产环境中，可以显示用户友好的错误消息
      if (process.env.NODE_ENV === 'production') {
        console.warn('Failed to remove item from favorites:', FavoritesErrorHandler.getUserFriendlyMessage(error));
      }
    }
  }, []);

  /**
   * 检查物品是否已收藏
   */
  const isFavorite = useCallback((itemId: string, type: FavoriteItemType): boolean => {
    try {
      // 验证参数
      FavoritesValidator.validateFavoriteOperation(itemId, type);
      
      // 确保favorites已初始化
      if (!favorites || isLoading) {
        return false;
      }
      
      return FavoritesUtils.isItemFavorited(favorites, itemId, type);
    } catch (error) {
      FavoritesErrorHandler.logError(error, 'isFavorite');
      return false; // 出错时返回 false
    }
  }, [favorites, isLoading]);

  /**
   * 获取收藏总数
   */
  const getFavoriteCount = useCallback((): number => {
    if (!favorites || isLoading) {
      return 0;
    }
    return FavoritesUtils.getTotalCount(favorites);
  }, [favorites, isLoading]);

  /**
   * 获取指定类型的收藏列表
   */
  const getFavoritesByType = useCallback((type: FavoriteItemType): string[] => {
    try {
      FavoritesValidator.validateItemType(type);
      return [...favorites[type]]; // 返回副本，避免外部修改
    } catch (error) {
      FavoritesErrorHandler.logError(error, 'getFavoritesByType');
      return [];
    }
  }, [favorites]);

  /**
   * 清空所有收藏
   */
  const clearAllFavorites = useCallback(() => {
    try {
      setFavorites(FavoritesUtils.clearAll());
    } catch (error) {
      FavoritesErrorHandler.logError(error, 'clearAllFavorites');
    }
  }, []);

  // Context 值
  const contextValue: FavoritesContextType = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    getFavoriteCount,
    getFavoritesByType,
    clearAllFavorites,
    isLoading
  };

  return (
    <FavoritesContext.Provider value={contextValue}>
      {children}
    </FavoritesContext.Provider>
  );
}

/**
 * 使用收藏上下文的 Hook
 */
export function useFavorites(): FavoritesContextType {
  const context = useContext(FavoritesContext);
  
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  
  return context;
}

/**
 * 高阶组件：为组件提供收藏功能
 */
export function withFavorites<P extends object>(
  Component: React.ComponentType<P & { favorites: FavoritesContextType }>
) {
  return function WithFavoritesComponent(props: P) {
    const favorites = useFavorites();
    
    return <Component {...props} favorites={favorites} />;
  };
}

/**
 * 收藏统计 Hook
 */
export function useFavoritesStats() {
  const { favorites } = useFavorites();
  
  return React.useMemo(() => {
    return FavoritesUtils.getStats(favorites);
  }, [favorites]);
}

/**
 * 特定类型收藏 Hook
 */
export function useFavoritesByType(type: FavoriteItemType) {
  const { getFavoritesByType } = useFavorites();
  
  return React.useMemo(() => {
    return getFavoritesByType(type);
  }, [getFavoritesByType, type]);
}

/**
 * 收藏操作 Hook（返回操作函数）
 */
export function useFavoriteActions() {
  const { addToFavorites, removeFromFavorites, clearAllFavorites } = useFavorites();
  
  return React.useMemo(() => ({
    addToFavorites,
    removeFromFavorites,
    clearAllFavorites
  }), [addToFavorites, removeFromFavorites, clearAllFavorites]);
}

/**
 * 单个物品收藏状态 Hook
 */
export function useFavoriteStatus(itemId: string, type: FavoriteItemType) {
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  
  const isItemFavorite = React.useMemo(() => {
    return isFavorite(itemId, type);
  }, [isFavorite, itemId, type]);

  const toggleFavorite = React.useCallback(() => {
    if (isItemFavorite) {
      removeFromFavorites(itemId, type);
    } else {
      addToFavorites(itemId, type);
    }
  }, [isItemFavorite, addToFavorites, removeFromFavorites, itemId, type]);

  return {
    isFavorite: isItemFavorite,
    toggleFavorite
  };
}