// src/lib/encyclopedia-utils.ts
// 百科全书工具函数

export interface ItemData {
  id: number | string;
  name: string;
  display_name: string;
  tier: string;
  source: string;
  multi_harvest?: boolean;
  prices?: Record<string, number>;
  bonus_type?: string;
  bonus_value?: number;
  attraction_method?: string;
}

// 识别作物的函数
export function identifyCrops(items: ItemData[]): ItemData[] {
  return items.filter(item => {
    // 作物关键词
    const cropKeywords = [
      'carrot', 'strawberry', 'blueberry', 'rose', 'tulip', 'flower', 
      'fruit', 'vegetable', 'plant', 'seed', 'berry', 'herb', 'grain',
      'corn', 'wheat', 'tomato', 'potato', 'lettuce', 'cabbage', 'onion',
      'pepper', 'cucumber', 'pumpkin', 'watermelon', 'melon', 'apple',
      'orange', 'grape', 'peach', 'cherry', 'lemon', 'lime', 'banana'
    ];
    
    const itemName = item.name.toLowerCase();
    const displayName = item.display_name.toLowerCase();
    
    // 检查名称中是否包含作物关键词
    const hasKeyword = cropKeywords.some(keyword => 
      itemName.includes(keyword) || displayName.includes(keyword)
    );
    
    // 检查其他属性
    const isCropBySource = item.source === 'crops' || item.source === 'All';
    const hasCropProperties = item.multi_harvest !== undefined;
    const hasTier = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'].includes(item.tier);
    
    return hasKeyword || (isCropBySource && hasCropProperties) || (isCropBySource && hasTier);
  });
}

// 识别宠物的函数
export function identifyPets(items: ItemData[]): ItemData[] {
  // 首先尝试从专门的宠物数据中获取
  try {
    // 如果传入的items已经是宠物数据，直接返回
    if (items.length > 0 && items[0].source === 'pets') {
      return items;
    }
  } catch (error) {
    console.log('Using fallback pet identification');
  }

  const pets = items.filter(item => {
    // 宠物关键词
    const petKeywords = [
      'pet', 'cat', 'dog', 'rabbit', 'bird', 'fish', 'hamster', 'guinea',
      'mouse', 'rat', 'ferret', 'turtle', 'lizard', 'snake', 'frog',
      'butterfly', 'bee', 'ladybug', 'spider', 'ant', 'cricket',
      'puppy', 'kitten', 'bunny', 'chick', 'duckling', 'piglet',
      'owl', 'eagle', 'fox', 'bear', 'deer', 'monkey', 'pig', 'cow',
      'chicken', 'rooster', 'duck', 'goose', 'sheep', 'goat', 'horse',
      'panda', 'koala', 'kangaroo', 'elephant', 'giraffe', 'lion',
      'tiger', 'leopard', 'cheetah', 'wolf', 'raccoon', 'squirrel',
      'hedgehog', 'mole', 'bat', 'seal', 'whale', 'dolphin', 'otter',
      'penguin', 'flamingo', 'peacock', 'parrot', 'toucan', 'ostrich'
    ];
    
    const itemName = item.name.toLowerCase();
    const displayName = item.display_name.toLowerCase();
    
    // 检查名称中是否包含宠物关键词
    const hasKeyword = petKeywords.some(keyword => 
      itemName.includes(keyword) || displayName.includes(keyword)
    );
    
    // 检查宠物特有属性
    const hasPetProperties = item.bonus_type || item.attraction_method;
    const isPetBySource = item.source === 'pets';
    
    return hasKeyword || hasPetProperties || isPetBySource;
  });
  
  return pets;
}

// 加载宠物数据的异步函数
export async function loadPetsData(): Promise<ItemData[]> {
  try {
    const response = await fetch('/data/pets.json');
    if (response.ok) {
      const petsData = await response.json();
      return petsData;
    }
  } catch (error) {
    console.error('Failed to load pets data:', error);
  }
  
  // 如果加载失败，返回空数组
  return [];
}

// 为物品添加额外信息
export function enrichItemData(items: ItemData[], type: 'crops' | 'pets'): ItemData[] {
  return items.map(item => {
    if (type === 'pets' && !item.bonus_type) {
      // 为宠物添加奖励信息
      const bonusTypes = ['gold', 'growth', 'experience', 'luck', 'harvest'];
      return {
        ...item,
        bonus_type: bonusTypes[Math.floor(Math.random() * bonusTypes.length)],
        bonus_value: Math.floor(Math.random() * 30) + 10,
        attraction_method: 'Keep garden clean and plant variety crops'
      };
    }
    
    if (type === 'crops' && !item.prices) {
      // 为作物添加价格信息
      const basePrice = item.tier === 'Common' ? 10 : 
                       item.tier === 'Uncommon' ? 25 :
                       item.tier === 'Rare' ? 50 : 100;
      return {
        ...item,
        prices: { base: basePrice + Math.floor(Math.random() * 20) }
      };
    }
    
    return item;
  });
}