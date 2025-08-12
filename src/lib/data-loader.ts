// /src/lib/data-loader.ts
// 数据加载和验证工具

import { z } from 'zod';
import type { Crop, Pet, GameItem } from '@/types';

/**
 * 游戏物品基础验证模式
 */
const GameItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  display_name: z.string(),
  tier: z.enum(['Common', 'Uncommon', 'Rare', 'Legendary']),
  source: z.string(),
  obtainable: z.boolean().optional(),
  prices: z.record(z.string(), z.number()).optional()
});

/**
 * 作物验证模式
 */
const CropSchema = GameItemSchema.extend({
  multi_harvest: z.boolean(),
  growth_time: z.number().optional(),
  harvest_count: z.number().optional(),
  season_bonus: z.array(z.string()).optional(),
  base_price: z.number().optional(),
  sell_price: z.number().optional(),
  xp_reward: z.number().optional()
});

/**
 * 宠物验证模式
 */
const PetSchema = GameItemSchema.extend({
  bonus_type: z.enum(['growth_speed', 'gold_multiplier', 'xp_multiplier', 'special']).optional(),
  bonus_value: z.number().optional(),
  range: z.number().optional(),
  special_effect: z.string().optional(),
  attraction_items: z.array(z.string()).optional()
});

/**
 * 数据加载器类
 */
export class DataLoader {
  private static instance: DataLoader;
  private cropsCache: Crop[] | null = null;
  private petsCache: Pet[] | null = null;
  private lastLoadTime: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5分钟缓存

  private constructor() {}

  /**
   * 获取单例实例
   */
  public static getInstance(): DataLoader {
    if (!DataLoader.instance) {
      DataLoader.instance = new DataLoader();
    }
    return DataLoader.instance;
  }

  /**
   * 验证作物数据
   */
  public validateCrops(data: unknown[]): Crop[] {
    try {
      return data.map((item, index) => {
        const result = CropSchema.safeParse(item);
        if (!result.success) {
          console.warn(`Crop validation failed at index ${index}:`, result.error.issues);
          // 返回一个默认的作物对象，而不是抛出错误
          return {
            id: (item as any)?.id || index,
            name: (item as any)?.name || 'Unknown',
            display_name: (item as any)?.display_name || 'Unknown Crop',
            tier: 'Common' as const,
            source: (item as any)?.source || 'Unknown',
            multi_harvest: (item as any)?.multi_harvest || false
          } as Crop;
        }
        return result.data as Crop;
      });
    } catch (error) {
      console.error('Failed to validate crops data:', error);
      return [];
    }
  }

  /**
   * 验证宠物数据
   */
  public validatePets(data: unknown[]): Pet[] {
    try {
      return data.map((item, index) => {
        const result = PetSchema.safeParse(item);
        if (!result.success) {
          console.warn(`Pet validation failed at index ${index}:`, result.error.issues);
          // 返回一个默认的宠物对象
          return {
            id: (item as any)?.id || index,
            name: (item as any)?.name || 'Unknown',
            display_name: (item as any)?.display_name || 'Unknown Pet',
            tier: 'Common' as const,
            source: (item as any)?.source || 'Unknown'
          } as Pet;
        }
        return result.data as Pet;
      });
    } catch (error) {
      console.error('Failed to validate pets data:', error);
      return [];
    }
  }

  /**
   * 加载作物数据（带缓存）
   */
  public async loadCrops(): Promise<Crop[]> {
    if (this.cropsCache && this.isCacheValid()) {
      return this.cropsCache;
    }

    try {
      // 暂时返回空数组，实际实现时会从CSV文件加载
      // 这个方法主要用于演示数据验证功能
      this.cropsCache = [];
      this.lastLoadTime = Date.now();
      
      return this.cropsCache;
    } catch (error) {
      console.error('Failed to load crops data:', error);
      return [];
    }
  }

  /**
   * 加载宠物数据（带缓存）
   */
  public async loadPets(): Promise<Pet[]> {
    if (this.petsCache && this.isCacheValid()) {
      return this.petsCache;
    }

    try {
      // 暂时返回空数组，实际实现时会从CSV文件加载
      // 这个方法主要用于演示数据验证功能
      this.petsCache = [];
      this.lastLoadTime = Date.now();
      
      return this.petsCache;
    } catch (error) {
      console.error('Failed to load pets data:', error);
      return [];
    }
  }

  /**
   * 根据ID查找物品
   */
  public async findItemById(id: number): Promise<GameItem | null> {
    const [crops, pets] = await Promise.all([
      this.loadCrops(),
      this.loadPets()
    ]);
    
    const allItems = [...crops, ...pets];
    return allItems.find(item => item.id === id) || null;
  }

  /**
   * 根据名称搜索物品
   */
  public async searchItems(query: string): Promise<GameItem[]> {
    const [crops, pets] = await Promise.all([
      this.loadCrops(),
      this.loadPets()
    ]);
    
    const allItems = [...crops, ...pets];
    const lowerQuery = query.toLowerCase();
    
    return allItems.filter(item => 
      item.name.toLowerCase().includes(lowerQuery) ||
      item.display_name.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * 按稀有度筛选物品
   */
  public async filterByTier(tier: GameItem['tier']): Promise<GameItem[]> {
    const [crops, pets] = await Promise.all([
      this.loadCrops(),
      this.loadPets()
    ]);
    
    const allItems = [...crops, ...pets];
    return allItems.filter(item => item.tier === tier);
  }

  /**
   * 获取新手推荐物品
   */
  public async getBeginnerRecommendations(): Promise<GameItem[]> {
    const [crops, pets] = await Promise.all([
      this.loadCrops(),
      this.loadPets()
    ]);
    
    // 推荐Common和Uncommon级别的物品
    const allItems = [...crops, ...pets];
    return allItems.filter(item => 
      item.tier === 'Common' || item.tier === 'Uncommon'
    ).slice(0, 20); // 限制数量
  }

  /**
   * 清除缓存
   */
  public clearCache(): void {
    this.cropsCache = null;
    this.petsCache = null;
    this.lastLoadTime = 0;
  }

  /**
   * 检查缓存是否有效
   */
  private isCacheValid(): boolean {
    return Date.now() - this.lastLoadTime < this.CACHE_DURATION;
  }

  /**
   * 获取数据统计信息
   */
  public async getDataStats(): Promise<{
    totalCrops: number;
    totalPets: number;
    tierDistribution: Record<string, number>;
    lastUpdated: Date;
  }> {
    const [crops, pets] = await Promise.all([
      this.loadCrops(),
      this.loadPets()
    ]);
    
    const allItems = [...crops, ...pets];
    const tierDistribution = allItems.reduce((acc, item) => {
      acc[item.tier] = (acc[item.tier] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalCrops: crops.length,
      totalPets: pets.length,
      tierDistribution,
      lastUpdated: new Date(this.lastLoadTime)
    };
  }
}

/**
 * 导出单例实例
 */
export const dataLoader = DataLoader.getInstance();

/**
 * 便捷函数
 */
export const loadCrops = () => dataLoader.loadCrops();
export const loadPets = () => dataLoader.loadPets();
export const findItemById = (id: number) => dataLoader.findItemById(id);
export const searchItems = (query: string) => dataLoader.searchItems(query);
export const getBeginnerRecommendations = () => dataLoader.getBeginnerRecommendations();