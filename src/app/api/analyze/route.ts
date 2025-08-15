// 🚀 Gemini AI 驱动的分析 API
import { NextRequest, NextResponse } from 'next/server';
import { 
  generateStrategicAdvice, 
  isRuleEngineAvailable, 
  InteractionMode,
  type DetailedItem, 
  type AnalysisRequest,
  type EnhancedAnalysisRequest 
} from '@/lib/advisor-engine';
import type { GameItem } from '@/types';
import itemsData from "../../../../public/data/items.json";

interface Item extends GameItem { 
  multi_harvest: boolean; 
  properties?: string[]; 
}

const allItems = itemsData as Item[];
const itemsMap = new Map(allItems.map(item => [item.id, item]));

export async function POST(req: NextRequest) {
  console.log('🚀 API: Starting Gemini AI-powered analysis...');
  
  // 检查规则引擎是否可用（作为备用）
  if (!isRuleEngineAvailable()) {
    return NextResponse.json({ 
      error: 'Server configuration error: Analysis engine is not available.' 
    }, { status: 500 });
  }

  try {
    const body: EnhancedAnalysisRequest = await req.json();
    const { selectedItems, gold, inGameDate, currentDate, interactionMode, expertOptions } = body;
    
    console.log('📊 API: Processing request with Gemini AI...');
    console.log(`- Items: ${Object.keys(selectedItems).length} types`);
    console.log(`- Gold: ${gold}`);
    console.log(`- Mode: ${interactionMode || 'ADVANCED'}`);
    console.log(`- Date: ${inGameDate}`);

    // 输入验证
    if (!currentDate) {
      return NextResponse.json({ 
        error: 'Bad Request: currentDate is missing.' 
      }, { status: 400 });
    }
    
    if (!selectedItems || Object.keys(selectedItems).length === 0) {
      return NextResponse.json({ 
        error: 'Bad Request: selectedItems is missing or empty.' 
      }, { status: 400 });
    }
    
    if (gold === undefined || typeof gold !== 'number' || gold < 0) {
      return NextResponse.json({ 
        error: 'Bad Request: gold must be a non-negative number.' 
      }, { status: 400 });
    }
    
    if (!inGameDate || !/^(Spring|Summer|Autumn|Winter), Day \d{1,2}$/.test(inGameDate)) {
      return NextResponse.json({ 
        error: `Bad Request: inGameDate is missing or invalid (received: ${inGameDate}).` 
      }, { status: 400 });
    }

    // 构建详细物品列表
    const detailedItemsList: DetailedItem[] = Object.entries(selectedItems)
      .map(([id, quantity]) => {
        const item = itemsMap.get(parseInt(id));
        if (!item) return null;
        
        const itemDetails: DetailedItem = { 
          name: item.display_name, 
          quantity: quantity, 
          properties: [] 
        };
        
        if (item.multi_harvest) { 
          itemDetails.properties.push("multi-harvest"); 
        }
        
        if (item.display_name === 'Zen Rocks') { 
          itemDetails.properties.push("non-sellable", "decoration"); 
        }
        
        return itemDetails;
      })
      .filter((item): item is DetailedItem => item !== null);

    // 🤖 使用 Gemini AI 生成智能分析报告
    console.log('🤖 API: Calling Gemini AI via generateStrategicAdvice...');
    const reportObject = await generateStrategicAdvice(
      detailedItemsList,
      gold,
      inGameDate,
      currentDate,
      interactionMode || InteractionMode.ADVANCED,
      expertOptions
    );

    console.log('✅ API: Gemini AI report generated successfully!');
    console.log(`- Report title: ${reportObject.mainTitle}`);
    console.log(`- Sections: ${reportObject.sections?.length || 0}`);
    
    return NextResponse.json(reportObject, { status: 200 });

  } catch (error) {
    console.error('❌ API Route Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    
    // 提供更详细的错误信息
    if (errorMessage.includes('API key')) {
      return NextResponse.json({ 
        error: 'Gemini API configuration error. Please check your API key.', 
        details: 'GEMINI_API_KEY is missing or invalid' 
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      error: 'An internal server error occurred while generating AI analysis.', 
      details: errorMessage 
    }, { status: 500 });
  }
}