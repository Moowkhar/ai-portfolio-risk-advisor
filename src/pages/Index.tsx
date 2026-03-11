import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { RiskGauge } from "@/components/RiskGauge";
import { PortfolioPieChart } from "@/components/PortfolioPieChart";
import { PortfolioSlider } from "@/components/PortfolioSlider";
import { ArchitectureNote } from "@/components/ArchitectureNote";

const ASSETS = [
  { key: "BTC", label: "BTC", color: "hsl(45, 100%, 51%)", volatility: 0.4 },
  { key: "ETH", label: "ETH", color: "hsl(230, 60%, 55%)", volatility: 0.5 },
  { key: "BNB", label: "BNB", color: "hsl(45, 90%, 60%)", volatility: 0.45 },
  { key: "SOL", label: "SOL", color: "hsl(270, 60%, 55%)", volatility: 0.7 },
  { key: "Other", label: "Other", color: "hsl(200, 50%, 45%)", volatility: 0.8 },
];

const DEFAULT_ALLOC: Record<string, number> = { BTC: 20, ETH: 20, BNB: 20, SOL: 20, Other: 20 };
const EXAMPLE_ALLOC: Record<string, number> = { BTC: 40, ETH: 30, BNB: 0, SOL: 20, Other: 10 };

const cardBorder = "1px solid hsl(0 0% 16%)";
const spring = { type: "spring" as const, duration: 0.4, bounce: 0 };
const stagger = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

function analyzeRisk(alloc: Record<string, number>) {
  const total = Object.values(alloc).reduce((s, v) => s + v, 0);
  if (total === 0) return { score: 0, level: "Low", explanation: "", suggestion: "", volatilityScore: 0, stabilityScore: 100 };

  let weightedVol = 0;
  ASSETS.forEach((a) => {
    const pct = (alloc[a.key] || 0) / total;
    weightedVol += pct * a.volatility;
  });

  const shares = ASSETS.map((a) => ((alloc[a.key] || 0) / total) * 100);
  const hhi = shares.reduce((s, p) => s + (p / 100) ** 2, 0);
  const altcoinPct = ((alloc.SOL || 0) + (alloc.Other || 0)) / total;

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

  const stabilityScore = Math.round(Math.min(100, Math.max(0, 100 - score)));

  return { score, level, explanation, suggestion, volatilityScore, stabilityScore };
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
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">B</span>
            </div>
            <div>
              <h1 className="font-display font-bold text-lg tracking-tight text-foreground">
                AI Portfolio Risk Advisor
              </h1>
              <p className="text-muted-foreground text-xs">
                Powered by Binance Analytics
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-muted-foreground bg-secondary px-2 py-1 rounded">
              LIVE
            </span>
            <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-12 gap-5"
          initial="initial"
          animate="animate"
          transition={{ staggerChildren: 0.06 }}
        >
          {/* Left Column — 5 cols */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {/* Portfolio Input */}
            <motion.div
              variants={stagger}
              transition={spring}
              className="rounded-xl bg-card p-5"
              style={{ border: cardBorder }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold tracking-widest uppercase text-primary">
                  Portfolio Allocation
                </span>
                <span className={`text-xs font-mono tabular-nums ${total === 100 ? "text-accent-green" : total > 100 ? "text-accent-red" : "text-accent-yellow"}`}>
                  {total}%
                </span>
              </div>
              <div className="flex flex-col gap-3.5">
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
              {total !== 100 && (
                <div className="mt-3 text-xs text-accent-yellow bg-secondary rounded-lg px-3 py-2 text-center">
                  Adjust to 100% for accurate analysis
                </div>
              )}
            </motion.div>

            {/* Actions */}
            <motion.div variants={stagger} transition={spring} className="flex gap-3">
              <motion.button
                onClick={runAnalysis}
                className="flex-1 bg-primary text-primary-foreground font-bold py-3 px-6 rounded-lg text-sm tracking-wide"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={spring}
              >
                Analyze Portfolio
              </motion.button>
              <motion.button
                onClick={runExample}
                className="flex-1 bg-card font-semibold py-3 px-6 rounded-lg text-sm text-foreground"
                style={{ border: cardBorder }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={spring}
              >
                Example
              </motion.button>
            </motion.div>

            {/* Pie Chart */}
            <motion.div
              variants={stagger}
              transition={spring}
              className="rounded-xl bg-card p-5"
              style={{ border: cardBorder }}
            >
              <span className="text-xs font-semibold tracking-widest uppercase text-primary">
                Allocation Breakdown
              </span>
              <div className="mt-4">
                <PortfolioPieChart segments={segments} />
              </div>
            </motion.div>

            {/* Architecture */}
            <motion.div variants={stagger} transition={spring}>
              <ArchitectureNote />
            </motion.div>
          </div>

          {/* Right Column — 7 cols */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            {/* Risk Score */}
            <motion.div
              variants={stagger}
              transition={spring}
              className="rounded-xl bg-card p-5"
              style={{ border: cardBorder }}
            >
              <span className="text-xs font-semibold tracking-widest uppercase text-primary">
                Risk Assessment
              </span>
              <div className="mt-4 flex flex-col items-center">
                <RiskGauge score={hasAnalyzed ? analysis.score : 0} riskLevel={hasAnalyzed ? analysis.level : "—"} />
              </div>
              {hasAnalyzed && (
                <motion.div
                  className="mt-6 grid grid-cols-3 gap-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="bg-secondary rounded-lg p-3 text-center border border-border">
                    <span className="text-[10px] text-muted-foreground block uppercase tracking-wider">Volatility</span>
                    <span className="font-display font-bold text-xl tabular-nums text-foreground">{analysis.volatilityScore}%</span>
                  </div>
                  <div className="bg-secondary rounded-lg p-3 text-center border border-border">
                    <span className="text-[10px] text-muted-foreground block uppercase tracking-wider">Risk</span>
                    <span className="font-display font-bold text-xl tabular-nums text-primary">{analysis.score}/100</span>
                  </div>
                  <div className="bg-secondary rounded-lg p-3 text-center border border-border">
                    <span className="text-[10px] text-muted-foreground block uppercase tracking-wider">Stability</span>
                    <span className={`font-display font-bold text-xl tabular-nums ${analysis.stabilityScore >= 67 ? "text-accent-green" : analysis.stabilityScore >= 34 ? "text-accent-yellow" : "text-accent-red"}`}>{analysis.stabilityScore}/100</span>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* AI Explanation */}
            {hasAnalyzed && (
              <motion.div
                className="rounded-xl bg-card p-5"
                style={{ border: cardBorder }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={spring}
              >
                <span className="text-xs font-semibold tracking-widest uppercase text-primary">
                  AI Explanation
                </span>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">Risk Level:</span>
                    <span className={`font-display font-bold text-sm px-2 py-0.5 rounded ${analysis.level === "Low" ? "text-accent-green bg-accent-green/10" : analysis.level === "Moderate" ? "text-accent-yellow bg-accent-yellow/10" : "text-accent-red bg-accent-red/10"}`}>
                      {analysis.level}
                    </span>
                  </div>
                  <div className="bg-secondary rounded-lg p-4 border border-border">
                    <h3 className="font-display font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-2">Reason</h3>
                    <p className="text-foreground text-sm leading-relaxed">
                      {analysis.explanation}
                    </p>
                  </div>
                  <div className="bg-secondary rounded-lg p-4 border border-border">
                    <h3 className="font-display font-semibold text-xs uppercase tracking-wider text-accent-green mb-2">Suggestion</h3>
                    <p className="text-foreground text-sm leading-relaxed">
                      {analysis.suggestion}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {!hasAnalyzed && (
              <motion.div
                variants={stagger}
                transition={spring}
                className="rounded-xl bg-card p-8 flex flex-col items-center justify-center text-center"
                style={{ border: cardBorder, minHeight: 160 }}
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-primary text-xl">📊</span>
                </div>
                <p className="text-muted-foreground text-sm max-w-sm">
                  Adjust your portfolio allocation and click <strong className="text-primary">Analyze Portfolio</strong> to see AI-powered risk insights.
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
