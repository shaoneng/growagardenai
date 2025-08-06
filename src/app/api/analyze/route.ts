// /src/app/api/analyze/route.ts

export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import itemsData from "../../../../public/data/items.json";

const MODEL_NAME = "gemini-2.5-pro";
interface Item { id: number; name: string; display_name: string; multi_harvest: boolean; properties?: string[]; }
const allItems: Item[] = itemsData;
const itemsMap = new Map(allItems.map(item => [item.id, item]));

// --- 关键改动 1: 更新请求体接口 ---
interface RequestBody { selectedItems: Record<string, number>; gold: number; inGameDate: string; currentDate: string; }
interface DetailedItem { name: string; quantity: number; properties: string[]; }

export async function POST(req: NextRequest) {
  const API_KEY = process.env.GEMINI_API_KEY;
  if (!API_KEY) {
    return NextResponse.json({ error: 'Server configuration error: Missing API Key.' }, { status: 500 });
  }

  try {
    const body: RequestBody = await req.json();
    // --- 关键改动 2: 从请求体中解构出 currentDate ---
    const { selectedItems, gold, inGameDate, currentDate } = body;

    // 增加对 currentDate 的校验
    if (!currentDate) { return NextResponse.json({ error: 'Bad Request: currentDate is missing.' }, { status: 400 }); }
    if (!selectedItems || Object.keys(selectedItems).length === 0) { return NextResponse.json({ error: 'Bad Request: selectedItems is missing or empty.' }, { status: 400 }); }
    if (gold === undefined || typeof gold !== 'number' || gold < 0) { return NextResponse.json({ error: 'Bad Request: gold must be a non-negative number.' }, { status: 400 }); }
    if (!inGameDate || !/^(Spring|Summer|Autumn|Winter), Day \d{1,2}$/.test(inGameDate)) { return NextResponse.json({ error: `Bad Request: inGameDate is missing or invalid (received: ${inGameDate}).` }, { status: 400 }); }

    const detailedItemsList = Object.entries(selectedItems).map(([id, quantity]) => {
      const item = itemsMap.get(parseInt(id));
      if (!item) return null;
      
      const itemDetails: DetailedItem = { name: item.display_name, quantity: quantity, properties: [] };
      if (item.multi_harvest) { itemDetails.properties.push("multi-harvest"); }
      if (item.display_name === 'Zen Rocks') { itemDetails.properties.push("non-sellable", "decoration"); }
      return itemDetails;
    }).filter(Boolean);

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({
        model: MODEL_NAME,
        generationConfig: { 
          responseMimeType: "application/json" 
        },
        safetySettings: [
            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        ]
    });
    
    // --- 关键改动 3: 移除服务器端日期生成，直接在Prompt中使用客户端传来的日期 ---
    const prompt = `You are a world-class visual director and a seasoned strategist for the game "Grow a Garden." Your design philosophy is "print in the digital age," meaning your analysis is dense, insightful, and visually impactful. Your tone is that of an elite mentor: authoritative, concise, and highly strategic.

    CRITICAL: Your entire response must be in authentic, natural-sounding English. You must generate content that is suitable for a high-density, magazine-style layout.

    TASK: Analyze the user's data and generate a "Strategic Briefing" JSON object.

    User's current status:
    - In-game date: ${inGameDate}
    - Gold: ${gold}
    - Detailed Items List: ${JSON.stringify(detailedItemsList)}

    The JSON output MUST follow this exact structure:
    {
      "reportId": "A unique identifier, like 'GGSB-${new Date().getTime()}'.",
      "publicationDate": "${currentDate}", // <-- 使用从客户端传来的日期
      "mainTitle": "Strategic Briefing",
      "subTitle": "GROW A GARDEN INTELLIGENCE REPORT",
      "visualAnchor": "A single, impactful letter or number representing the core of the strategy. For example, 'A' for an 'Aggressive Growth' phase, or '3' for '3 Key Steps'.",
      "playerProfile": {
        "title": "Player Profile",
        "archetype": "A concise player archetype in English, e.g., 'Early-Stage Capital Accumulator' or 'Mid-Game Expander'.",
        "summary": "A powerful, single-sentence summary defining the player's current strategic position."
      },
      "midBreakerQuote": "A single, powerful, insightful quote distilled from the analysis, for the mid-page visual breaker.",
      "sections": [
        {
          "id": "priority_one",
          "title": "Priority One 🎯",
          "points": [
            {
              "action": "A short, verb-first command.",
              "reasoning": "A concise explanation of the strategic value of this action.",
              "tags": ["High ROI", "Short-Term"]
            }
          ]
        },
        {
          "id": "next_steps",
          "title": "Mid-Term Plays 🗺️",
          "points": [
            {
              "action": "A key task for mid-term development.",
              "reasoning": "Explain its profound impact on the late game.",
              "tags": ["Long-Term", "Infrastructure"]
            }
          ]
        },
        {
          "id": "hidden_gems",
          "title": "Hidden Gems ✨",
          "points": [
            {
              "action": "Reveal an overlooked item combo or strategy.",
              "reasoning": "Clarify how this synergy creates a 1+1>2 effect.",
              "synergy": ["item_name_1", "item_name_2"],
              "tags": ["Synergy"]
            }
          ]
        }
      ],
      "footerAnalysis": {
        "title": "The Final Verdict",
        "conclusion": "The final summary of this strategic briefing, giving a clear, directional recommendation.",
        "callToAction": "Immediate Action: [Fill in the single most important thing to do]"
      }
    }

    Ensure all 'icon' values are valid Font Awesome 5 class names (e.g., 'fas fa-bullseye'). The entire output must be a single, valid JSON object and nothing else.
    `;
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    const jsonText = response.text();
    const reportObject = JSON.parse(jsonText);

    return NextResponse.json(reportObject, { status: 200 });

  } catch (error) {
    console.error('API Route Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'An internal server error occurred while analyzing the data.', details: errorMessage }, { status: 500 });
  }
}