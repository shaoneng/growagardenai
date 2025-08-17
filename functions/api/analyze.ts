// Cloudflare Pages Function: /api/analyze
// Mirrors src/app/api/analyze/route.ts logic for Pages Functions

import { CloudflareJSONHandler } from '../../src/lib/cloudflare-json-handler';
import type { GameItem } from '../../src/types';

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

// Import prebuilt items data
// Note: JSON imports are supported by Wrangler bundler
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import itemsData from '../../public/data/items.json';

const allItems = (itemsData as Item[]) || [];
const itemsMap = new Map(allItems.map((item: Item) => [item.id, item]));

export const onRequestPost: PagesFunction = async (context) => {
  const requestId = `analyze_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  const { request } = context;

  try {
    const rawBody = await request.text();
    if (!rawBody.trim()) {
      return CloudflareJSONHandler.createErrorResponse(new Error('Empty request body'), 400, requestId);
    }

    let body: AnalyzeRequest;
    try {
      body = JSON.parse(rawBody);
    } catch (e) {
      return CloudflareJSONHandler.createErrorResponse(new Error('Invalid JSON in request body'), 400, requestId);
    }

    // Basic validations
    if (!body.selectedItems || typeof body.selectedItems !== 'object') {
      return CloudflareJSONHandler.createErrorResponse(new Error('Missing selectedItems'), 400, requestId);
    }
    if (typeof body.gold !== 'number' || body.gold < 0) {
      return CloudflareJSONHandler.createErrorResponse(new Error('Invalid gold value'), 400, requestId);
    }
    if (!body.inGameDate || !body.currentDate) {
      return CloudflareJSONHandler.createErrorResponse(new Error('Missing date fields'), 400, requestId);
    }

    // Validate quantities
    for (const [itemId, quantity] of Object.entries(body.selectedItems)) {
      if (typeof quantity !== 'number' || quantity <= 0) {
        return CloudflareJSONHandler.createErrorResponse(
          new Error(`Invalid quantity for item ${itemId}: must be a positive number`),
          400,
          requestId
        );
      }
    }

    const detailedItemsList = Object.entries(body.selectedItems).map(([id, quantity]) => {
      const item = itemsMap.get(parseInt(id));
      if (!item) {
        return { name: `Unknown Item ${id}`, quantity, properties: [] as string[] };
      }
      return {
        name: item.display_name || item.name,
        quantity,
        properties: item.multi_harvest ? ['multi-harvest'] : []
      };
    });

    // Use AI service manager with fallback and sanitization
    const { AIServiceManager } = await import('../../src/lib/ai/service-manager');
    const reportObject = await AIServiceManager.generateReport({
      items: detailedItemsList,
      gold: body.gold,
      inGameDate: body.inGameDate,
      currentDate: body.currentDate,
      interactionMode: body.interactionMode,
      expertOptions: body.expertOptions
    });

    // Validate and respond
    const validation = CloudflareJSONHandler.validateResponseStructure(reportObject);
    if (!validation.valid) {
      return CloudflareJSONHandler.createErrorResponse(
        new Error(`Invalid response structure: ${validation.errors.join(', ')}`),
        500,
        requestId
      );
    }

    return CloudflareJSONHandler.createResponse(reportObject, 200, { requestId });
  } catch (error) {
    return CloudflareJSONHandler.createErrorResponse(error, 500, requestId);
  }
};

