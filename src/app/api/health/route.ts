// Health/status API (Edge Runtime)
export const runtime = 'edge';

import { NextRequest } from 'next/server';
import { CloudflareJSONHandler } from '@/lib/cloudflare-json-handler';

export async function GET(_req: NextRequest) {
  const requestId = `health_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  try {
    const { AIServiceManager } = await import('@/lib/ai/service-manager');
    const status = await AIServiceManager.getServiceStatus();

    const payload = {
      ok: true,
      service: status,
      timestamp: new Date().toISOString(),
    };

    return CloudflareJSONHandler.createResponse(payload, 200, { requestId });
  } catch (error) {
    return CloudflareJSONHandler.createErrorResponse(error, 500, requestId);
  }
}

