// /src/app/components/MagazineReport.jsx
"use client";

import { useAppContext } from "@/context/AppContext";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function MagazineReport() {
    const { isLoading, reportData } = useAppContext();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !reportData) {
            router.replace('/');
        }
    }, [isLoading, reportData, router]);

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>;
    }

    // --- 这是关键改动: 动态生成日期和ID ---
    const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const uniqueId = `GGSB-${new Date().getTime()}`;

    // Use a default/mock reportData if the actual data is not available yet
    const displayData = reportData || {
      "reportId": uniqueId,
      "publicationDate": currentDate,
      "mainTitle": "Strategic Briefing",
      "subTitle": "GROW A GARDEN INTELLIGENCE REPORT",
      "visualAnchor": "A",
      "playerProfile": {
        "title": "Player Profile",
        "archetype": "Early-Stage Capital Accumulator",
        "summary": "You're in a prime starting position with ample gold and immense potential. The core mission is to convert this initial capital into sustainable, high-yield assets—fast."
      },
      "midBreakerQuote": "“Trading short-term, one-off gains for 'asset crops' that produce continuously is the first step from novice to tycoon.”",
      "sections": [
        {
          "id": "priority_one",
          "title": "Priority One 🎯",
          "points": [
            {
              "action": "Liquidate Strawberries, Acquire Blueberries",
              "reasoning": "Strawberries are a one-time sale. Blueberries are 'multi-harvest' assets that will become your stable 'gold printer' for the future.",
              "tags": ["High ROI", "Asset Conversion"]
            },
            {
              "action": "Plant All Carrot Seeds Immediately",
              "reasoning": "Of all starter crops, Carrots have the highest gold-per-minute ratio, enabling the fastest possible initial capital accumulation.",
              "tags": ["High-Efficiency", "Short-Term"]
            }
          ]
        },
        {
          "id": "next_steps",
          "title": "Mid-Term Plays 🗺️",
          "points": [
            {
              "action": "Secure 5,000 Gold for 'Advanced Tools'",
              "reasoning": "This is a critical power spike in your progression. It dramatically boosts farming efficiency, paving the way for large-scale operations.",
              "tags": ["Long-Term Investment", "Efficiency Boost"]
            }
          ]
        },
        {
          "id": "hidden_gems",
          "title": "Hidden Gems ✨",
          "points": [
            {
              "action": "Hold onto the Orange Tulip",
              "reasoning": "While its sale price is low, planting it near a future Beehive yields high-value 'Tulip Honey'—a potential gold mine.",
              "synergy": ["orange_tulip", "beehive"],
              "tags": ["Synergy"]
            }
          ]
        }
      ],
      "footerAnalysis": {
        "title": "The Final Verdict",
        "conclusion": "Your current strategy is crystal clear: **SPEED**. Liquidate low-yield items, convert capital into long-term, interest-bearing assets, and do not get distracted by minor gains.",
        "callToAction": "Immediate Action: Sell all Strawberries and invest every coin into Blueberry seeds."
      }
    };

    const {
        mainTitle,
        subTitle,
        reportId,
        publicationDate,
        visualAnchor,
        playerProfile,
        midBreakerQuote,
        sections,
        footerAnalysis
    } = displayData;

    return (
        <div className="container mx-auto max-w-6xl p-4 md:p-8">
            <header className="border-b-2 border-gray-900 pb-4 mb-8">
                <div className="flex justify-between items-baseline">
                    <div>
                        {/* Now using English fonts for titles */}
                        <h1 className="text-4xl font-black font-english">{mainTitle}</h1>
                        <p className="font-english tracking-[0.2em] uppercase text-sm text-gray-500 font-semibold">{subTitle}</p>
                    </div>
                    <div className="text-right font-english text-sm flex-shrink-0 ml-4">
                        <p className="font-semibold">Report ID: {reportId}</p>
                        <p className="text-gray-400">Date: {publicationDate}</p>
                    </div>
                </div>
            </header>

            <main className="grid grid-cols-12 gap-8">
                <aside className="col-span-12 md:col-span-4 flex items-center justify-center md:order-first order-last mt-8 md:mt-0">
                    <div className="text-[30rem] font-black leading-[0.8] text-transparent [-webkit-text-stroke:2px_#e5e7eb] select-none text-center">
                        {visualAnchor}
                    </div>
                </aside>

                <section className="col-span-12 md:col-span-8 space-y-6">
                    <div className="border border-gray-200 p-6 rounded-lg bg-white/50">
                        <h2 className="text-2xl font-bold font-english mb-2">{playerProfile.title}</h2>
                        <p className="font-english text-green-600 font-semibold text-lg mb-2">{playerProfile.archetype}</p>
                        <p className="text-lg leading-relaxed text-gray-600 font-english">{playerProfile.summary}</p>
                    </div>

                    {sections.map(section => (
                        <div key={section.id} className="border border-gray-200 p-6 rounded-lg bg-white/50">
                            <div className="flex items-center gap-3 mb-4">
                                <i className={`${section.icon} text-green-600 text-xl`}></i>
                                <h3 className="text-2xl font-bold font-english">{section.title}</h3>
                            </div>
                            <div className="space-y-4">
                                {section.points.map((point, index) => (
                                    <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                                        <h4 className="font-english font-bold text-xl">{point.action}</h4>
                                        <p className="text-base leading-relaxed text-gray-600 mt-1 font-english">{point.reasoning}</p>
                                        <div className="mt-3 flex flex-wrap gap-2 items-center">
                                            {point.tags?.map(tag => (
                                                <span key={tag} className="font-english text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{tag}</span>
                                            ))}
                                            {point.synergy && (
                                                <span className="flex items-center gap-2 text-sm text-green-700">
                                                    <i className="fas fa-link"></i>
                                                    <span className="font-english font-semibold">{point.synergy.join(' + ')}</span>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </section>
            </main>

            <section className="my-12 md:my-16 p-8 rounded-lg text-center bg-gradient-to-r from-green-50/50 to-transparent">
                <p className="font-english text-2xl md:text-3xl font-bold text-green-800/80 leading-relaxed">“{midBreakerQuote}”</p>
            </section>

            <footer className="bg-[#1f2937] text-white rounded-lg p-8 mt-8">
                <h2 className="text-3xl font-bold font-english mb-4">{footerAnalysis.title}</h2>
                <p className="text-lg leading-relaxed text-gray-300 mb-6 font-english">{footerAnalysis.conclusion}</p>
                <div className="bg-green-600 text-white font-bold font-english text-center p-4 rounded">
                    <p>{footerAnalysis.callToAction}</p>
                </div>
            </footer>
        </div>
    );
}