// 简化的测试 API 路由
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  console.log('🧪 Test API: Starting simple test...');
  
  try {
    const body = await req.json();
    console.log('📊 Test API: Received data:', body);
    
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
    
    console.log('✅ Test API: Returning test response');
    return NextResponse.json(testResponse, { status: 200 });
    
  } catch (error) {
    console.error('❌ Test API Error:', error);
    return NextResponse.json({ 
      error: 'Test API failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}