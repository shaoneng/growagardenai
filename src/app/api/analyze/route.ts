// 🚀 简化的分析 API - 确保稳定的 JSON 响应
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  console.log('🚀 API: Starting analysis...');
  
  try {
    const body = await req.json();
    console.log('📊 API: Received request:', body);
    
    const { selectedItems, gold, inGameDate, currentDate, interactionMode } = body;
    
    // 输入验证
    if (!selectedItems || Object.keys(selectedItems).length === 0) {
      return NextResponse.json({ 
        error: 'Bad Request: selectedItems is missing or empty.' 
      }, { status: 400 });
    }
    
    if (typeof gold !== 'number' || gold < 0) {
      return NextResponse.json({ 
        error: 'Bad Request: gold must be a non-negative number.' 
      }, { status: 400 });
    }
    
    // 生成稳定的报告响应
    const reportObject = {
      reportId: `STABLE-${Date.now()}`,
      publicationDate: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      mainTitle: "Garden Analysis Report",
      subTitle: "STRATEGIC RECOMMENDATIONS",
      visualAnchor: "G",
      playerProfile: {
        title: "Player Profile",
        archetype: "Garden Strategist",
        summary: `You have ${gold} gold and ${Object.keys(selectedItems).length} item types selected. Focus on strategic growth and efficient resource management.`
      },
      midBreakerQuote: "Smart planning and strategic thinking lead to abundant harvests and sustainable growth.",
      sections: [
        {
          id: "immediate_actions",
          title: "Immediate Actions 🎯",
          points: Object.entries(selectedItems).slice(0, 3).map(([id, quantity]) => ({
            action: `Optimize Item ${id}`,
            reasoning: `You have ${quantity} units of this item. Consider its growth potential and market value for maximum returns.`,
            tags: ["High Priority", "Strategic"]
          }))
        },
        {
          id: "strategic_planning",
          title: "Strategic Planning 🗺️",
          points: [
            {
              action: "Diversify your portfolio",
              reasoning: "Spread your investments across different item types to reduce risk and maximize opportunities.",
              tags: ["Growth", "Risk Management"]
            },
            {
              action: "Monitor seasonal changes",
              reasoning: `Current season: ${inGameDate}. Plan your strategy according to seasonal bonuses and market conditions.`,
              tags: ["Seasonal", "Planning"]
            }
          ]
        },
        {
          id: "optimization_tips",
          title: "Optimization Tips ✨",
          points: [
            {
              action: "Focus on high-yield opportunities",
              reasoning: "Prioritize items and strategies that offer the best return on investment for your current situation.",
              tags: ["Efficiency", "ROI"]
            }
          ]
        }
      ],
      footerAnalysis: {
        title: "Strategic Summary",
        conclusion: `Your current portfolio shows good potential with ${Object.keys(selectedItems).length} item types and ${gold} gold. Focus on balanced growth and strategic optimization.`,
        callToAction: "Continue building your collection systematically and monitor market opportunities."
      }
    };
    
    console.log('✅ API: Report generated successfully');
    console.log(`- Report title: ${reportObject.mainTitle}`);
    console.log(`- Sections: ${reportObject.sections.length}`);
    
    return NextResponse.json(reportObject, { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
    
  } catch (error) {
    console.error('❌ API Route Error:', error);
    
    // 确保总是返回有效的 JSON 错误响应
    const errorResponse = {
      error: 'Failed to process request',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    };
    
    return NextResponse.json(errorResponse, { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
  }
}