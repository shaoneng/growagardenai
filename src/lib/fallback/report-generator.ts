// 回退报告生成器 - 基于规则的报告生成
import type { AnalysisResult } from '@/types';

export interface DetailedItem {
    name: string;
    quantity: number;
    properties: string[];
}

export interface FallbackRequest {
    items: DetailedItem[];
    gold: number;
    inGameDate: string;
    currentDate: string;
    interactionMode?: string;
}

export class FallbackReportGenerator {
    /**
     * 生成基于规则的报告
     */
    static generateBasicReport(request: FallbackRequest): AnalysisResult {
        const { items, gold, inGameDate, currentDate, interactionMode = 'balanced' } = request;

        console.log('🔄 Generating fallback report...');

        // 分析玩家状态
        const playerLevel = Math.floor(gold / 100) + 1;
        const gamePhase = this.determineGamePhase(gold);
        const [season] = inGameDate.split(', ');

        // 分析物品组合
        const itemAnalysis = this.analyzeItems(items);

        // 根据交互模式调整内容
        const modeConfig = this.getModeConfiguration(interactionMode);

        return {
            reportId: `FALLBACK-${Date.now()}`,
            publicationDate: currentDate,
            mainTitle: modeConfig.title,
            subTitle: modeConfig.subtitle,
            visualAnchor: modeConfig.emoji,
            playerProfile: {
                title: "Player Profile",
                archetype: this.determineArchetype(items, gold),
                summary: this.generatePlayerSummary(items, gold, gamePhase)
            },
            midBreakerQuote: this.getSeasonalQuote(season),
            sections: [
                {
                    id: "immediate_actions",
                    title: "Priority Actions 🎯",
                    points: this.generateImmediateActions(items, gold, modeConfig)
                },
                {
                    id: "strategic_planning",
                    title: "Strategic Planning 🗺️",
                    points: this.generateStrategicActions(items, gold, season, modeConfig)
                },
                {
                    id: "optimization_tips",
                    title: "Optimization Tips ✨",
                    points: this.generateOptimizationTips(items, gold, gamePhase, modeConfig)
                }
            ],
            footerAnalysis: {
                title: "Strategic Assessment",
                conclusion: this.generateConclusion(items, gold, gamePhase),
                callToAction: this.generateCallToAction(gamePhase, season)
            }
        };
    }

    private static determineGamePhase(gold: number): string {
        if (gold < 200) return "Early Game";
        if (gold < 1000) return "Mid Game";
        return "Late Game";
    }

    private static getModeConfiguration(mode: string) {
        const configs = {
            beginner: {
                title: "Your Garden Journey Begins",
                subtitle: "SIMPLE STEPS TO SUCCESS",
                emoji: "🌱",
                complexity: "simple"
            },
            expert: {
                title: "Advanced Strategic Analysis",
                subtitle: "OPTIMIZATION & EFFICIENCY FOCUS",
                emoji: "📊",
                complexity: "advanced"
            },
            balanced: {
                title: "Garden Strategy Report",
                subtitle: "BALANCED GROWTH APPROACH",
                emoji: "🎯",
                complexity: "balanced"
            }
        };

        return configs[mode as keyof typeof configs] || configs.balanced;
    }

    private static analyzeItems(items: DetailedItem[]) {
        const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
        const diversity = items.length;
        const hasMultiHarvest = items.some(item => item.properties.includes('multi-harvest'));

        return {
            totalQuantity,
            diversity,
            hasMultiHarvest,
            averageQuantity: Math.round(totalQuantity / diversity) || 0
        };
    }

    private static determineArchetype(items: DetailedItem[], gold: number): string {
        const analysis = this.analyzeItems(items);

        if (gold > 1000 && analysis.diversity > 5) return "Strategic Investor";
        if (analysis.hasMultiHarvest) return "Efficiency Expert";
        if (analysis.diversity > 3) return "Diversified Grower";
        if (gold < 200) return "Ambitious Beginner";
        return "Garden Strategist";
    }

    private static generatePlayerSummary(items: DetailedItem[], gold: number, gamePhase: string): string {
        const analysis = this.analyzeItems(items);

        return `You're in the ${gamePhase} with ${gold} gold and ${analysis.diversity} different item types. ${analysis.hasMultiHarvest
            ? "Your multi-harvest crops show smart long-term thinking."
            : "Consider adding some multi-harvest crops for steady returns."
            } Focus on ${gamePhase === "Early Game" ? "building your foundation" : gamePhase === "Mid Game" ? "expanding strategically" : "optimizing for maximum efficiency"}.`;
    }

    private static getSeasonalQuote(season: string): string {
        const quotes = {
            Spring: "Every garden begins with a single seed and the courage to plant it.",
            Summer: "In the peak of growth, wise gardeners prepare for tomorrow's harvest.",
            Autumn: "The fruits of patience and planning are sweetest when shared.",
            Winter: "In quiet seasons, the best strategies take root and grow strong."
        };

        return quotes[season as keyof typeof quotes] || "Success grows from the seeds of smart planning and patient cultivation.";
    }

    private static generateImmediateActions(items: DetailedItem[], gold: number, modeConfig: any) {
        const actions = [];

        // 基于物品的建议
        if (items.length > 0) {
            const topItem = items.reduce((prev, current) =>
                prev.quantity > current.quantity ? prev : current
            );

            actions.push({
                action: `Focus on ${topItem.name}`,
                reasoning: `You have ${topItem.quantity} units of ${topItem.name}, making it your strongest asset. ${topItem.properties.includes('multi-harvest')
                    ? "This multi-harvest crop will provide ongoing returns."
                    : "Maximize its potential through strategic placement and timing."
                    }`,
                tags: ["High Priority", "Resource Management"]
            });
        }

        // 基于金币的建议
        if (gold > 500) {
            actions.push({
                action: "Invest in expansion",
                reasoning: `With ${gold} gold available, you have good resources for strategic investments. Consider diversifying your portfolio or upgrading existing assets.`,
                tags: ["Investment", "Growth"]
            });
        } else {
            actions.push({
                action: "Focus on efficiency",
                reasoning: `With ${gold} gold, prioritize high-return activities and avoid unnecessary expenses. Build your foundation steadily.`,
                tags: ["Efficiency", "Foundation"]
            });
        }

        // 基于复杂度的建议
        if (modeConfig.complexity === "simple") {
            actions.push({
                action: "Start with basics",
                reasoning: "Master the fundamentals first. Focus on understanding core mechanics before exploring advanced strategies.",
                tags: ["Learning", "Basics"]
            });
        }

        return actions.slice(0, 3); // 限制为3个建议
    }

    private static generateStrategicActions(items: DetailedItem[], gold: number, season: string, modeConfig: any) {
        const actions = [];

        // 季节性建议
        const seasonalAdvice = {
            Spring: {
                action: "Plan for growth season",
                reasoning: "Spring offers the best planting opportunities. Focus on establishing new crops and expanding your garden layout.",
                tags: ["Seasonal", "Planning", "Growth"]
            },
            Summer: {
                action: "Maximize productivity",
                reasoning: "Summer's peak growing conditions are perfect for high-yield strategies. Optimize your harvesting schedule.",
                tags: ["Seasonal", "Productivity", "Optimization"]
            },
            Autumn: {
                action: "Prepare for harvest",
                reasoning: "Autumn is harvest time. Focus on collecting resources and preparing for the quieter winter season.",
                tags: ["Seasonal", "Harvest", "Preparation"]
            },
            Winter: {
                action: "Strategic planning",
                reasoning: "Winter's slower pace is perfect for planning next year's strategy and making infrastructure improvements.",
                tags: ["Seasonal", "Strategy", "Infrastructure"]
            }
        };

        actions.push(seasonalAdvice[season as keyof typeof seasonalAdvice] || seasonalAdvice.Spring);

        // 多样化建议
        if (items.length < 3) {
            actions.push({
                action: "Diversify your collection",
                reasoning: "Having only a few item types increases risk. Consider adding complementary items to create a more balanced portfolio.",
                tags: ["Diversification", "Risk Management"]
            });
        } else {
            actions.push({
                action: "Optimize synergies",
                reasoning: "With multiple item types, look for combinations that work well together and create beneficial synergies.",
                tags: ["Synergy", "Optimization"]
            });
        }

        return actions;
    }

    private static generateOptimizationTips(items: DetailedItem[], gold: number, gamePhase: string, modeConfig: any) {
        const tips = [];

        // 基于游戏阶段的建议
        if (gamePhase === "Early Game") {
            tips.push({
                action: "Build strong foundations",
                reasoning: "Early game success comes from establishing reliable income sources and learning core mechanics thoroughly.",
                tags: ["Foundation", "Learning"]
            });
        } else if (gamePhase === "Mid Game") {
            tips.push({
                action: "Scale strategically",
                reasoning: "Mid game is about smart expansion. Balance growth with stability, and don't overextend your resources.",
                tags: ["Scaling", "Balance"]
            });
        } else {
            tips.push({
                action: "Pursue perfection",
                reasoning: "Late game allows for fine-tuning and optimization. Focus on maximizing efficiency and exploring advanced strategies.",
                tags: ["Optimization", "Advanced"]
            });
        }

        // 资源管理建议
        tips.push({
            action: "Manage resources wisely",
            reasoning: `With ${gold} gold and ${items.length} item types, balance immediate needs with long-term investments for sustainable growth.`,
            tags: ["Resource Management", "Sustainability"]
        });

        return tips;
    }

    private static generateConclusion(items: DetailedItem[], gold: number, gamePhase: string): string {
        const analysis = this.analyzeItems(items);

        return `Your ${gamePhase.toLowerCase()} strategy shows ${analysis.diversity > 3 ? "good diversification" : "focused approach"
            } with ${gold} gold in resources. ${analysis.hasMultiHarvest
                ? "Your multi-harvest investments demonstrate smart long-term thinking."
                : "Consider adding multi-harvest options for steady income."
            } Continue building systematically while staying adaptable to new opportunities.`;
    }

    private static generateCallToAction(gamePhase: string, season: string): string {
        const actions = {
            "Early Game": "Focus on learning and building your foundation step by step.",
            "Mid Game": "Expand strategically while maintaining what you've built.",
            "Late Game": "Optimize for maximum efficiency and explore advanced techniques."
        };

        const seasonalNote = season === "Spring" ? " Take advantage of the growing season!" :
            season === "Summer" ? " Make the most of peak productivity!" :
                season === "Autumn" ? " Prepare for a successful harvest!" :
                    " Use this planning time wisely!";

        return actions[gamePhase as keyof typeof actions] + seasonalNote;
    }
}