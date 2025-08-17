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
                title: "玩家画像",
                archetype: this.determineArchetype(items, gold),
                summary: this.generatePlayerSummary(items, gold, gamePhase)
            },
            midBreakerQuote: this.getSeasonalQuote(season),
            sections: [
                {
                    id: "immediate_actions",
                    title: "优先行动 🎯",
                    points: this.generateImmediateActions(items, gold, modeConfig)
                },
                {
                    id: "strategic_planning",
                    title: "战略规划 🗺️",
                    points: this.generateStrategicActions(items, gold, season, modeConfig)
                },
                {
                    id: "optimization_tips",
                    title: "效率优化 ✨",
                    points: this.generateOptimizationTips(items, gold, gamePhase, modeConfig)
                }
            ],
            footerAnalysis: {
                title: "策略裁断",
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
                title: "你的花园之旅启程",
                subtitle: "简单清晰的起步动作",
                emoji: "🌱",
                complexity: "simple"
            },
            expert: {
                title: "进阶战略分析",
                subtitle: "优化与效率并举",
                emoji: "📊",
                complexity: "advanced"
            },
            balanced: {
                title: "花园策略报告",
                subtitle: "均衡发展的路径",
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

        if (gold > 1000 && analysis.diversity > 5) return "战略型投资者";
        if (analysis.hasMultiHarvest) return "效率专家";
        if (analysis.diversity > 3) return "多元化种植者";
        if (gold < 200) return "有志的新手";
        return "花园策士";
    }

    private static generatePlayerSummary(items: DetailedItem[], gold: number, gamePhase: string): string {
        const analysis = this.analyzeItems(items);
        const phaseCN = gamePhase === 'Early Game' ? '前期' : gamePhase === 'Mid Game' ? '中期' : '后期';

        return `你处于${phaseCN}阶段，拥有金币${gold}，已选择${analysis.diversity}类道具。${analysis.hasMultiHarvest
            ? "多次收获类道具展现了你的长线思维。"
            : "可考虑增加可多次收获的道具，以获得更稳健的回报。"
            } 当前应当${gamePhase === "Early Game" ? "夯实基础" : gamePhase === "Mid Game" ? "稳步扩张" : "精益求精，追求极致效率"}。`;
    }

    private static getSeasonalQuote(season: string): string {
        const quotes = {
            Spring: "一粒种子，点亮整座春天。",
            Summer: "盛长之际，亦为明日的收成布局。",
            Autumn: "耐心与规划的果实，最宜分享。",
            Winter: "静默之季，伟大的策略在土壤中扎根。"
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
                action: `聚焦 ${topItem.name}`,
                reasoning: `你拥有 ${topItem.quantity} 份 ${topItem.name}，是你当前最强势的资产。${topItem.properties.includes('multi-harvest')
                    ? "其可多次收获的属性将带来持续回报。"
                    : "通过布局与时机管理，可进一步放大价值。"
                    }`,
                tags: ["优先", "资源管理"]
            });
        }

        // 基于金币的建议
        if (gold > 500) {
            actions.push({
                action: "投入扩张",
                reasoning: `当前金币 ${gold} 足以支持策略性投资。考虑适度分散或升级既有资产。`,
                tags: ["投资", "增长"]
            });
        } else {
            actions.push({
                action: "优先效率",
                reasoning: `在金币 ${gold} 的前提下，优先高回报动作，避免不必要支出，稳步夯实基础。`,
                tags: ["效率", "基础"]
            });
        }

        // 基于复杂度的建议
        if (modeConfig.complexity === "simple") {
            actions.push({
                action: "从基础入手",
                reasoning: "先掌握核心机制，再逐步尝试进阶策略。",
                tags: ["学习", "基础"]
            });
        }

        return actions.slice(0, 3); // 限制为3个建议
    }

    private static generateStrategicActions(items: DetailedItem[], gold: number, season: string, modeConfig: any) {
        const actions = [];

        // 季节性建议
        const seasonalAdvice = {
            Spring: {
                action: "顺势育新",
                reasoning: "春季播种窗口最佳，宜确立作物基础并优化布局。",
                tags: ["季节", "规划", "成长"]
            },
            Summer: {
                action: "峰值增效",
                reasoning: "夏季生长旺盛，适合高产策略，优化收获节奏。",
                tags: ["季节", "产能", "优化"]
            },
            Autumn: {
                action: "收束与储备",
                reasoning: "秋季收成在即，聚焦资源回收与冬季储备。",
                tags: ["季节", "收获", "预备"]
            },
            Winter: {
                action: "静思布局",
                reasoning: "冬季节奏舒缓，适合梳理策略与改善基础设施。",
                tags: ["季节", "策略", "基建"]
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
                action: "夯实地基",
                reasoning: "前期成功依赖于建立稳定收益来源并系统掌握核心机制。",
                tags: ["基础", "学习"]
            });
        } else if (gamePhase === "Mid Game") {
            tips.push({
                action: "策略性扩张",
                reasoning: "中期强调聪明扩张，在增长与稳定间取得平衡，避免资源过度外延。",
                tags: ["扩张", "平衡"]
            });
        } else {
            tips.push({
                action: "追求极致",
                reasoning: "后期适合精细化打磨与优化，围绕效率极大化探索进阶策略。",
                tags: ["优化", "进阶"]
            });
        }

        // 资源管理建议
        tips.push({
            action: "精明管控资源",
            reasoning: `在金币 ${gold} 与 ${items.length} 类道具的约束下，平衡当下所需与长线投入，以实现可持续增长。`,
            tags: ["资源管理", "可持续"]
        });

        return tips;
    }

    private static generateConclusion(items: DetailedItem[], gold: number, gamePhase: string): string {
        const analysis = this.analyzeItems(items);
        const phaseCN = gamePhase === 'Early Game' ? '前期' : gamePhase === 'Mid Game' ? '中期' : '后期';

        return `你的${phaseCN}策略体现出${analysis.diversity > 3 ? "良好的分散度" : "聚焦与专注"}，当前资源为金币 ${gold}。${analysis.hasMultiHarvest
                ? "多次收获类配置展现长期主义与稳定现金流。"
                : "可考量引入可多次收获的配置以平滑收益曲线。"
            } 建议在有序推进中保持弹性，拥抱新的机会窗口。`;
    }

    private static generateCallToAction(gamePhase: string, season: string): string {
        const actions = {
            "Early Game": "循序渐进，打牢地基。",
            "Mid Game": "稳步扩张，巩固所建。",
            "Late Game": "精细打磨，追求极致。"
        };

        const seasonalNote = season === "Spring" ? " 把握生长季的东风。" :
            season === "Summer" ? " 善用产能峰值的时机。" :
                season === "Autumn" ? " 为丰收做好收束与储备。" :
                    " 利用静季完善长线布局。";

        return actions[gamePhase as keyof typeof actions] + seasonalNote;
    }
}
