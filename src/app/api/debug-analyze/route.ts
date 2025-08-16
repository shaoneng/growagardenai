// 🔧 调试版本的分析 API
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
  const requestId = `debug_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  APIMonitor.startTimer(requestId);

  console.log(`🔧 DEBUG API [${requestId}]: Starting analysis...`);
  console.log(`🔧 DEBUG API [${requestId}]: Environment check:`);
  console.log(`   - NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`   - GEMINI_API_KEY exists: ${!!process.env.GEMINI_API_KEY}`);
  console.log(`   - NEXT_PUBLIC_GEMINI_API_KEY exists: ${!!process.env.NEXT_PUBLIC_GEMINI_API_KEY}`);

  try {
    // 解析请求体
    let body: AnalyzeRequest;
    try {
      body = await req.json();
      console.log(`🔧 DEBUG API [${requestId}]: Request parsed successfully`);
    } catch (parseError) {
      console.error(`❌ DEBUG API [${requestId}]: JSON parse error:`, parseError);
      return ResponseBuilder.error(
        ErrorHandler.createError(
          ErrorType.DATA_ERROR,
          'Invalid JSON in request body',
          parseError
        ),
        400
      );
    }

    console.log(`📊 DEBUG API [${requestId}]: Request data:`, {
      itemCount: Object.keys(body.selectedItems || {}).length,
      gold: body.gold,
      mode: body.interactionMode
    });

    // 基本验证（简化版）
    if (!body.selectedItems || Object.keys(body.selectedItems).length === 0) {
      console.log(`❌ DEBUG API [${requestId}]: No items selected`);
      return ResponseBuilder.validation('At least one item must be selected');
    }

    if (typeof body.gold !== 'number' || body.gold < 0) {
      console.log(`❌ DEBUG API [${requestId}]: Invalid gold value`);
      return ResponseBuilder.validation('Gold must be a non-negative number');
    }

    // 生成详细物品列表
    const detailedItemsList = Object.entries(body.selectedItems)
      .map(([id, quantity]) => {
        const item = itemsMap.get(parseInt(id));
        if (!item) {
          console.warn(`⚠️ DEBUG API [${requestId}]: Unknown item ID: ${id}`);
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

    console.log(`🔄 DEBUG API [${requestId}]: Processing ${detailedItemsList.length} items...`);

    // 测试AI服务管理器
    console.log(`🤖 DEBUG API [${requestId}]: Testing AI Service Manager...`);
    
    try {
      const { AIServiceManager } = await import('@/lib/ai/service-manager');
      console.log(`✅ DEBUG API [${requestId}]: AI Service Manager imported successfully`);
      
      // 检查服务状态
      const status = AIServiceManager.getServiceStatus();
      console.log(`📊 DEBUG API [${requestId}]: Service status:`, status);
      
      const aiRequest = {
        items: detailedItemsList,
        gold: body.gold,
        inGameDate: body.inGameDate,
        currentDate: body.currentDate,
        interactionMode: body.interactionMode,
        expertOptions: body.expertOptions
      };

      console.log(`🚀 DEBUG API [${requestId}]: Calling AI Service Manager...`);
      const reportObject = await AIServiceManager.generateReport(aiRequest);
      console.log(`✅ DEBUG API [${requestId}]: Report generated successfully`);
      console.log(`   - Report ID: ${reportObject.reportId}`);
      console.log(`   - Title: ${reportObject.mainTitle}`);

      const processingTime = APIMonitor.endTimer(requestId);
      return ResponseBuilder.success(reportObject, processingTime);

    } catch (aiError) {
      console.error(`❌ DEBUG API [${requestId}]: AI Service Manager error:`, aiError);
      
      // 回退到简单报告
      console.log(`🔄 DEBUG API [${requestId}]: Using simple fallback...`);
      
      const fallbackReport = {
        reportId: `DEBUG-FALLBACK-${Date.now()}`,
        publicationDate: body.currentDate,
        mainTitle: "Debug Garden Analysis Report",
        subTitle: "FALLBACK MODE - AI SERVICE UNAVAILABLE",
        visualAnchor: "🔧",
        playerProfile: {
          title: "Debug Player Profile",
          archetype: "Debug User",
          summary: `Debug mode: You have ${body.gold} gold and ${detailedItemsList.length} item types. AI service encountered an error: ${aiError.message}`
        },
        midBreakerQuote: "Debug mode: Testing system functionality.",
        sections: [
          {
            id: "debug_info",
            title: "Debug Information 🔧",
            points: [
              {
                action: "Check AI service status",
                reasoning: `AI service failed with error: ${aiError.message}`,
                tags: ["Debug", "Error"]
              },
              {
                action: "Verify environment configuration",
                reasoning: "Ensure all environment variables are properly set and API keys are valid.",
                tags: ["Debug", "Configuration"]
              }
            ]
          }
        ],
        footerAnalysis: {
          title: "Debug Summary",
          conclusion: `Debug mode active. AI service error: ${aiError.message}`,
          callToAction: "Check server logs and configuration for more details."
        }
      };

      const processingTime = APIMonitor.endTimer(requestId);
      return ResponseBuilder.success(fallbackReport, processingTime);
    }

  } catch (error) {
    APIMonitor.endTimer(requestId);
    console.error(`❌ DEBUG API [${requestId}]: Unexpected error:`, error);
    return ResponseBuilder.error(error, 500);
  }
}