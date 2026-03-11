import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { RiskGauge } from "@/components/RiskGauge";
import { PortfolioPieChart } from "@/components/PortfolioPieChart";
import { PortfolioSlider } from "@/components/PortfolioSlider";
import { ArchitectureNote } from "@/components/ArchitectureNote";

const ASSETS = [
  { key: "BTC", label: "BTC", color: "hsl(38, 90%, 55%)", volatility: 0.4 },
  { key: "ETH", label: "ETH", color: "hsl(230, 70%, 60%)", volatility: 0.5 },
  { key: "BNB", label: "BNB", color: "hsl(45, 90%, 50%)", volatility: 0.45 },
  { key: "SOL", label: "SOL", color: "hsl(270, 70%, 60%)", volatility: 0.7 },
  { key: "Other", label: "Other", color: "hsl(200, 60%, 50%)", volatility: 0.8 },
];

const DEFAULT_ALLOC: Record<string, number> = { BTC: 20, ETH: 20, BNB: 20, SOL: 20, Other: 20 };
const EXAMPLE_ALLOC: Record<string, number> = { BTC: 40, ETH: 30, BNB: 0, SOL: 20, Other: 10 };

const cardShadow = "0 0 0 1px hsl(210 10% 23% / 0.5), 0px 2px 8px hsl(0 0% 0% / 0.2)";
const spring = { type: "spring" as const, duration: 0.4, bounce: 0 };
const stagger = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

function analyzeRisk(alloc: Record<string, number>) {
  const total = Object.values(alloc).reduce((s, v) => s + v, 0);
  if (total === 0) return { score: 0, level: "Low", explanation: "", suggestion: "", volatilityScore: 0, stabilityScore: 100 };

  // Weighted volatility
  let weightedVol = 0;
  ASSETS.forEach((a) => {
    const pct = (alloc[a.key] || 0) / total;
    weightedVol += pct * a.volatility;
  });

  // Concentration (HHI)
  const shares = ASSETS.map((a) => ((alloc[a.key] || 0) / total) * 100);
  const hhi = shares.reduce((s, p) => s + (p / 100) ** 2, 0);

  // Altcoin exposure
  const altcoinPct = ((alloc.SOL || 0) + (alloc.Other || 0)) / total;

  // Composite score
  const volScore = weightedVol * 40;
  const concScore = hhi * 30;
  const altScore = altcoinPct * 30;
  let score = Math.round(Math.min(100, Math.max(0, volScore + concScore + altScore)));

  const level = score <= 33 ? "Low" : score <= 66 ? "Moderate" : "High";
  const volatilityScore = Math.round(weightedVol * 100);

  let explanation = "";
  let suggestion = "";

  if (score <= 33) {
    explanation = "Your portfolio is well-diversified with strong allocation to stable assets like BTC and ETH. Volatility exposure is controlled and concentration risk is minimal.";
    suggestion = "Maintain current allocation. Consider small positions in emerging assets only if you can tolerate additional risk.";
  } else if (score <= 66) {
    explanation = "Your portfolio has moderate risk. There's a balance between stable and volatile assets, but concentration in certain positions could amplify losses during downturns.";
    suggestion = "Consider rebalancing by increasing BTC allocation and reducing exposure to high-volatility altcoins to improve stability.";
  } else {
    explanation = `The portfolio has high exposure to volatile assets${altcoinPct > 0.25 ? " like SOL and altcoins" : ""}. Diversification is limited and correlation between assets increases risk during market downturns.`;
    suggestion = "Reduce altcoin exposure and increase BTC or ETH allocation to stabilize the portfolio. Aim for no more than 20% in high-volatility assets.";
  }

  return { score, level, explanation, suggestion, volatilityScore };
}

const Index = () => {
  const [alloc, setAlloc] = useState<Record<string, number>>(DEFAULT_ALLOC);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const handleChange = useCallback((key: string, value: number) => {
    setAlloc((prev) => ({ ...prev, [key]: value }));
  }, []);

  const analysis = useMemo(() => analyzeRisk(alloc), [alloc]);
  const total = Object.values(alloc).reduce((s, v) => s + v, 0);

  const segments = ASSETS.map((a) => ({
    label: a.label,
    value: total > 0 ? Math.round((alloc[a.key] / total) * 100) : 0,
    color: a.color,
  }));

  const runExample = () => {
    setAlloc(EXAMPLE_ALLOC);
    setHasAnalyzed(true);
  };

  const runAnalysis = () => {
    setHasAnalyzed(true);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <motion.div
        className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6"
        initial="initial"
        animate="animate"
        transition={{ staggerChildren: 0.07 }}
      >
        {/* Left Column */}
        <div className="flex flex-col gap-6">
          {/* Header */}
          <motion.div variants={stagger} transition={spring}>
            <h1 className="font-display font-semibold text-2xl md:text-3xl tracking-tight text-foreground">
              AI Portfolio Risk Advisor
            </h1>
            <p className="text-muted-foreground text-base mt-1">
              Instant risk analysis for your Binance portfolio.
            </p>
          </motion.div>

          {/* Portfolio Input */}
          <motion.div
            variants={stagger}
            transition={spring}
            className="rounded-2xl bg-card p-6"
            style={{ boxShadow: cardShadow }}
          >
            <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
              Portfolio Allocation
            </span>
            <div className="flex flex-col gap-4 mt-4">
              {ASSETS.map((asset) => (
                <PortfolioSlider
                  key={asset.key}
                  label={asset.label}
                  value={alloc[asset.key]}
                  onChange={(v) => handleChange(asset.key, v)}
                  color={asset.color}
                />
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Total: <span className={`font-display font-semibold tabular-nums ${total === 100 ? "text-accent-green" : total > 100 ? "text-accent-red" : "text-accent-yellow"}`}>{total}%</span>
              </span>
              {total !== 100 && (
                <span className="text-xs text-accent-yellow">Adjust to 100% for accurate analysis</span>
              )}
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            variants={stagger}
            transition={spring}
            className="flex gap-3"
          >
            <motion.button
              onClick={runAnalysis}
              className="flex-1 bg-primary text-primary-foreground font-semibold py-3 px-6 rounded-lg text-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={spring}
            >
              Analyze Portfolio
            </motion.button>
            <motion.button
              onClick={runExample}
              className="flex-1 bg-card font-semibold py-3 px-6 rounded-lg text-sm text-foreground"
              style={{ boxShadow: cardShadow }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={spring}
            >
              Run Example Analysis
            </motion.button>
          </motion.div>

          {/* Architecture */}
          <motion.div variants={stagger} transition={spring}>
            <ArchitectureNote />
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          {/* Risk Score */}
          <motion.div
            variants={stagger}
            transition={spring}
            className="rounded-2xl bg-card p-6"
            style={{ boxShadow: cardShadow }}
          >
            <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
              Risk Assessment
            </span>
            <div className="mt-4 flex flex-col items-center">
              <RiskGauge score={hasAnalyzed ? analysis.score : 0} riskLevel={hasAnalyzed ? analysis.level : "—"} />
            </div>
            {hasAnalyzed && (
              <motion.div
                className="mt-6 grid grid-cols-2 gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="bg-secondary rounded-lg p-3 text-center">
                  <span className="text-xs text-muted-foreground block">Volatility</span>
                  <span className="font-display font-semibold text-lg tabular-nums text-foreground">{analysis.volatilityScore}%</span>
                </div>
                <div className="bg-secondary rounded-lg p-3 text-center">
                  <span className="text-xs text-muted-foreground block">Score</span>
                  <span className="font-display font-semibold text-lg tabular-nums text-foreground">{analysis.score}/100</span>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* AI Explanation — directly below Risk Assessment */}
          {hasAnalyzed && (
            <motion.div
              className="rounded-2xl bg-card p-6"
              style={{ boxShadow: cardShadow }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={spring}
            >
              <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
                AI Explanation
              </span>
              <div className="mt-4 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">Risk Level:</span>
                  <span className={`font-display font-semibold text-sm ${analysis.level === "Low" ? "text-accent-green" : analysis.level === "Moderate" ? "text-accent-yellow" : "text-accent-red"}`}>
                    {analysis.level}
                  </span>
                </div>
                <div>
                  <h3 className="font-display font-semibold text-sm text-foreground mb-1">Reason</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {analysis.explanation}
                  </p>
                </div>
                <div className="border-t border-border pt-4">
                  <h3 className="font-display font-semibold text-sm text-accent-green mb-1">Suggestion</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {analysis.suggestion}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Pie Chart */}
          <motion.div
            variants={stagger}
            transition={spring}
            className="rounded-2xl bg-card p-6"
            style={{ boxShadow: cardShadow }}
          >
            <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
              Allocation Breakdown
            </span>
            <div className="mt-4">
              <PortfolioPieChart segments={segments} />
            </div>
          </motion.div>

          {!hasAnalyzed && (
            <motion.div
              variants={stagger}
              transition={spring}
              className="rounded-2xl bg-card p-6 flex items-center justify-center"
              style={{ boxShadow: cardShadow, minHeight: 120 }}
            >
              <p className="text-muted-foreground text-sm text-center">
                Adjust your portfolio allocation and click <strong className="text-foreground">Analyze Portfolio</strong> to see AI-powered risk insights.
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Index;
