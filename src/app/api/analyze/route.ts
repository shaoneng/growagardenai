// 🚀 稳定的分析 API - 统一错误处理和响应格式
import { NextRequest } from 'next/server';
import { ResponseBuilder, RequestValidator, APIMonitor } from '@/lib/api/response';
import { ErrorHandler, ErrorType } from '@/lib/errors';
import type { GameItem } from '@/types';
import itemsData from "../../../../public/data/items.json";

interface AnalyzeRequest {
  selectedItems: Record<string, number>;
  gold: number;
  inGameDate: string;
  currentDate: string;
  interactionMode?: string;
  expertOptions?: any;
}

interface Item extends GameItem {
  multi_harvest: boolean;
  properties?: string[];
}

const allItems = itemsData as Item[];
const itemsMap = new Map(allItems.map(item => [item.id, item]));

export async function POST(req: NextRequest) {
  const requestId = `analyze_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  APIMonitor.startTimer(requestId);

  console.log(`🚀 API [${requestId}]: Starting analysis...`);

  try {
    // 解析请求体
    let body: AnalyzeRequest;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error(`❌ API [${requestId}]: JSON parse error:`, parseError);
      return ResponseBuilder.error(
        ErrorHandler.createError(
          ErrorType.DATA_ERROR,
          'Invalid JSON in request body',
          parseError
        ),
        400
      );
    }

    console.log(`📊 API [${requestId}]: Request received:`, {
      itemCount: Object.keys(body.selectedItems || {}).length,
      gold: body.gold,
      mode: body.interactionMode
    });

    // 验证必需字段
    const missingFields = RequestValidator.validateRequired(body, [
      'selectedItems',
      'gold',
      'inGameDate',
      'currentDate'
    ]);

    if (missingFields.length > 0) {
      return ResponseBuilder.validation(
        `Missing required fields: ${missingFields.join(', ')}`,
        { missingFields }
      );
    }

    // 验证数据类型
    const typeErrors = RequestValidator.validateTypes(body, {
      gold: 'number',
      inGameDate: 'string',
      currentDate: 'string'
    });

    if (typeErrors.length > 0) {
      return ResponseBuilder.validation(
        `Type validation failed: ${typeErrors.join(', ')}`,
        { typeErrors }
      );
    }

    // 验证数据范围
    const goldRangeError = RequestValidator.validateRange(
      body.gold,
      0,
      1000000,
      'gold'
    );

    if (goldRangeError) {
      return ResponseBuilder.validation(goldRangeError);
    }

    // 验证选中的物品
    if (!body.selectedItems || Object.keys(body.selectedItems).length === 0) {
      return ResponseBuilder.validation(
        'At least one item must be selected',
        { selectedItems: body.selectedItems }
      );
    }

    // 验证物品数量
    for (const [itemId, quantity] of Object.entries(body.selectedItems)) {
      if (typeof quantity !== 'number' || quantity <= 0) {
        return ResponseBuilder.validation(
          `Invalid quantity for item ${itemId}: must be a positive number`,
          { itemId, quantity }
        );
      }
    }

    // 生成详细物品列表
    const detailedItemsList = Object.entries(body.selectedItems)
      .map(([id, quantity]) => {
        const item = itemsMap.get(parseInt(id));
        if (!item) {
          console.warn(`⚠️ API [${requestId}]: Unknown item ID: ${id}`);
          return {
            name: `Unknown Item ${id}`,
            quantity,
            properties: []
          };
        }

        return {
          name: item.display_name || item.name,
          quantity,
          properties: item.multi_harvest ? ['multi-harvest'] : []
        };
      });

    console.log(`🔄 API [${requestId}]: Processing ${detailedItemsList.length} items...`);

    // 使用AI服务管理器生成报告
    const { AIServiceManager } = await import('@/lib/ai/service-manager');
    
    const aiRequest = {
      items: detailedItemsList,
      gold: body.gold,
      inGameDate: body.inGameDate,
      currentDate: body.currentDate,
      interactionMode: body.interactionMode,
      expertOptions: body.expertOptions
    };

    const reportObject = await AIServiceManager.generateReport(aiRequest);

    const processingTime = APIMonitor.endTimer(requestId);

    console.log(`✅ API [${requestId}]: Report generated successfully in ${processingTime}ms`);
    console.log(`- Report title: ${reportObject.mainTitle}`);
    console.log(`- Sections: ${reportObject.sections.length}`);
    console.log(`- Items processed: ${detailedItemsList.length}`);

    return ResponseBuilder.success(reportObject, processingTime);

  } catch (error) {
    APIMonitor.endTimer(requestId);
    console.error(`❌ API [${requestId}]: Unexpected error:`, error);
    return ResponseBuilder.error(error, 500);
  }
}