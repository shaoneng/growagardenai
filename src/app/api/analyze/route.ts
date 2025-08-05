// /src/app/api/analyze/route.ts (Final Spelling Fix)

export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import itemsData from "../../../../public/data/items.json";

const MODEL_NAME = "gemini-2.5-pro";
interface Item { id: number; name: string; display_name: string; multi_harvest: boolean; properties?: string[]; }
const allItems: Item[] = itemsData;
const itemsMap = new Map(allItems.map(item => [item.id, item]));
interface RequestBody { selectedItems: Record<string, number>; gold: number; inGameDate: string; }
interface DetailedItem { name: string; quantity: number; properties: string[]; }

export async function POST(req: NextRequest) {
  const API_KEY = process.env.GEMINI_API_KEY;
  if (!API_KEY) {
    return NextResponse.json({ error: 'Server configuration error: Missing API Key.' }, { status: 500 });
  }

  try {
    const body: RequestBody = await req.json();
    const { selectedItems, gold, inGameDate } = body;

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
        // --- 这是关键改动 ---
        // 修正: 将 response_mime_type 改为驼峰式的 responseMimeType
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

    const prompt = `You are an expert player and mentor for the farming simulation game "Grow a Garden". 
      Your tone should be encouraging, strategic, and use authentic, natural English.

      A player has provided their current game status. Your task is to provide a detailed strategic report.
      
      Player's current status:
      - In-game date: ${inGameDate}
      - Gold: ${gold}
      - Detailed Items List: ${JSON.stringify(detailedItemsList)}

      When analyzing the 'Detailed Items List', pay close attention to the 'properties' array for each item. 
      'multi-harvest' means the crop can be harvested multiple times. 'non-sellable' means it cannot be sold for gold.

      Please analyze this information and generate a strategic report. The report MUST be a valid JSON object with the following structure:
      {
        "summary": "A brief, overall assessment of the player's situation.",
        "sections": [
          {
            "id": "immediate_actions",
            "title": "Immediate Actions",
            "icon": "Zap",
            "summary": "A summary of the immediate actions.",
            "points": ["A list of bullet points for what to do right now."]
          },
          {
            "id": "mid_term_goals",
            "title": "Mid-term Goals",
            "icon": "Target",
            "summary": "A summary of mid-term goals.",
            "points": ["A list of bullet points for goals in the near future."]
          },
          {
            "id": "hidden_potential",
            "title": "Hidden Potential",
            "icon": "Sparkles",
            "summary": "A summary of hidden opportunities.",
            "points": ["A list of bullet points for non-obvious strategies."]
          },
          {
            "id": "warnings",
            "title": "Warnings & Alerts",
            "icon": "ShieldAlert",
            "summary": "A summary of potential risks.",
            "points": ["A list of bullet points for things to avoid."]
          }
        ]
      }

      For each point in the 'points' arrays, provide not just *what* to do, but also *why* it's a good idea. The 'icon' values MUST be valid names from the lucide-react library like 'Zap', 'Target', 'Sparkles', 'ShieldAlert'.
    `; // Prompt内容保持不变
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    const jsonText = response.text();
    const reportObject = JSON.parse(jsonText);

    console.log("Final AI Response Object:", JSON.stringify(reportObject, null, 2));

    return NextResponse.json(reportObject, { status: 200 });

  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: 'An internal server error occurred while analyzing the data.' }, { status: 500 });
  }
}