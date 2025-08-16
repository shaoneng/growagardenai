// 🚀 稳定的分析 API - Cloudflare Pages优化版本
export const runtime = 'edge';

import { NextRequest } from 'next/server';
import { CloudflareJSONHandler } from '@/lib/cloudflare-json-handler';
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
  const requestId = `analyze_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  APIMonitor.startTimer(requestId);

  console.log(`🚀 API [${requestId}]: Starting analysis with Cloudflare optimization...`);

  try {
    // 解析请求体 - Cloudflare优化版本
    let body: AnalyzeRequest;
    try {
      const rawBody = await req.text();
      console.log(`📥 API [${requestId}]: Raw request body length: ${rawBody.length}`);
      
      if (!rawBody.trim()) {
        return CloudflareJSONHandler.createErrorResponse(
          new Error('Empty request body'),
          400,
          requestId
        );
      }
      
      body = JSON.parse(rawBody);
    } catch (parseError) {
      console.error(`❌ API [${requestId}]: JSON parse error:`, parseError);
      return CloudflareJSONHandler.createErrorResponse(
        ErrorHandler.createError(
          ErrorType.DATA_ERROR,
          'Invalid JSON in request body',
          parseError
        ),
        400,
        requestId
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
      return CloudflareJSONHandler.createErrorResponse(
        new Error(`Missing required fields: ${missingFields.join(', ')}`),
        400,
        requestId
      );
    }

    // 验证数据类型
    const typeErrors = RequestValidator.validateTypes(body, {
      gold: 'number',
      inGameDate: 'string',
      currentDate: 'string'
    });

    if (typeErrors.length > 0) {
      return CloudflareJSONHandler.createErrorResponse(
        new Error(`Type validation failed: ${typeErrors.join(', ')}`),
        400,
        requestId
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
      return CloudflareJSONHandler.createErrorResponse(
        new Error(goldRangeError),
        400,
        requestId
      );
    }

    // 验证选中的物品
    if (!body.selectedItems || Object.keys(body.selectedItems).length === 0) {
      return CloudflareJSONHandler.createErrorResponse(
        new Error('At least one item must be selected'),
        400,
        requestId
      );
    }

    // 验证物品数量
    for (const [itemId, quantity] of Object.entries(body.selectedItems)) {
      if (typeof quantity !== 'number' || quantity <= 0) {
        return CloudflareJSONHandler.createErrorResponse(
          new Error(`Invalid quantity for item ${itemId}: must be a positive number`),
          400,
          requestId
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

    // 验证响应结构
    const validation = CloudflareJSONHandler.validateResponseStructure(reportObject);
    if (!validation.valid) {
      console.error(`❌ API [${requestId}]: Invalid response structure:`, validation.errors);
      return CloudflareJSONHandler.createErrorResponse(
        new Error(`Invalid response structure: ${validation.errors.join(', ')}`),
        500,
        requestId
      );
    }

    // 使用Cloudflare兼容的响应处理
    return CloudflareJSONHandler.createResponse(reportObject, 200, {
      requestId,
      processingTime
    });

  } catch (error) {
    APIMonitor.endTimer(requestId);
    console.error(`❌ API [${requestId}]: Unexpected error:`, error);
    
    // 确保错误响应也是有效的JSON
    return CloudflareJSONHandler.createErrorResponse(error, 500, requestId);
  }
}