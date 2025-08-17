// 简化的测试 API 路由 - Cloudflare Pages优化版本
export const runtime = 'edge';

import { NextRequest } from 'next/server';
import { CloudflareJSONHandler } from '@/lib/cloudflare-json-handler';

export async function POST(req: NextRequest) {
  const requestId = `test_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  console.log(`🧪 Test API [${requestId}]: Starting simple test...`);
  
  try {
    // 使用Cloudflare优化的请求解析
    let body;
    try {
      const rawBody = await req.text();
      if (!rawBody.trim()) {
        return CloudflareJSONHandler.createErrorResponse(
          new Error('Empty request body'),
          400,
          requestId
        );
      }
      body = JSON.parse(rawBody);
    } catch (parseError) {
      return CloudflareJSONHandler.createErrorResponse(
        new Error('Invalid JSON in request body'),
        400,
        requestId
      );
    }
    
    console.log(`📊 Test API [${requestId}]: Received data:`, body);
    
    // 返回简单的测试响应
    const testResponse = {
      reportId: `TEST-${Date.now()}`,
      publicationDate: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      mainTitle: "Test Report - API Working",
      subTitle: "SIMPLE TEST RESPONSE",
      visualAnchor: "T",
      playerProfile: {
        title: "Test Profile",
        archetype: "Test User",
        summary: "This is a test response to verify API connectivity."
      },
      midBreakerQuote: "API is working correctly!",
      sections: [
        {
          id: "test_section",
          title: "Test Section 🧪",
          points: [
            {
              action: "API is responding correctly",
              reasoning: "This confirms the API route is working and can return JSON data.",
              tags: ["Test", "Success"]
            }
          ]
        }
      ],
      footerAnalysis: {
        title: "Test Complete",
        conclusion: "The API route is functioning properly and can return structured JSON data.",
        callToAction: "Ready to integrate with Gemini AI!"
      }
    };
    
    // 验证响应结构
    const validation = CloudflareJSONHandler.validateResponseStructure(testResponse);
    if (!validation.valid) {
      console.error(`❌ Test API [${requestId}]: Invalid response structure:`, validation.errors);
      return CloudflareJSONHandler.createErrorResponse(
        new Error(`Invalid response structure: ${validation.errors.join(', ')}`),
        500,
        requestId
      );
    }
    
    console.log(`✅ Test API [${requestId}]: Returning test response`);
    return CloudflareJSONHandler.createResponse(testResponse, 200, { requestId });
    
  } catch (error) {
    console.error(`❌ Test API [${requestId}]: Error:`, error);
    return CloudflareJSONHandler.createErrorResponse(error, 500, requestId);
  }
}