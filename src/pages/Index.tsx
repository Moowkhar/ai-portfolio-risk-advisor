import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RiskGauge } from "@/components/RiskGauge";
import { PortfolioPieChart } from "@/components/PortfolioPieChart";
import { PortfolioSlider } from "@/components/PortfolioSlider";
import { ArchitectureNote } from "@/components/ArchitectureNote";

const ASSETS = [
  { key: "BTC", label: "BTC", color: "hsl(45, 100%, 51%)", volatility: 0.4 },
  { key: "ETH", label: "ETH", color: "hsl(228, 55%, 55%)", volatility: 0.5 },
  { key: "BNB", label: "BNB", color: "hsl(45, 85%, 58%)", volatility: 0.45 },
  { key: "SOL", label: "SOL", color: "hsl(280, 55%, 55%)", volatility: 0.7 },
  { key: "Other", label: "Other", color: "hsl(195, 45%, 45%)", volatility: 0.8 },
];

const DEFAULT_ALLOC: Record<string, number> = { BTC: 20, ETH: 20, BNB: 20, SOL: 20, Other: 20 };
const EXAMPLE_ALLOC: Record<string, number> = { BTC: 40, ETH: 30, BNB: 0, SOL: 20, Other: 10 };

const spring = { type: "spring" as const, duration: 0.4, bounce: 0 };
const stagger = {
  initial: { opacity: 0, y: 16 },
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

const StatCard = ({ label, value, color }: { label: string; value: string; color?: string }) => (
  <div className="bg-secondary/60 border border-border rounded-lg px-3 py-2.5 text-center flex-1 min-w-0">
    <span className="text-[10px] text-muted-foreground block uppercase tracking-wider font-medium">{label}</span>
    <span className={`font-mono font-bold text-base tabular-nums ${color || "text-foreground"}`}>{value}</span>
  </div>
);

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

  const runExample = () => { setAlloc(EXAMPLE_ALLOC); setHasAnalyzed(true); };
  const runAnalysis = () => { setHasAnalyzed(true); };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* ── Header ── */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs font-mono">Ai</span>
            </div>
            <span className="font-semibold text-sm text-foreground tracking-tight">
              Portfolio Risk Advisor
            </span>
            <span className="hidden sm:inline text-[10px] text-muted-foreground border border-border rounded px-1.5 py-0.5 font-mono">
              v1.0
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-green" />
              LIVE
            </div>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="flex-1">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-5">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-12 gap-4"
            initial="initial"
            animate="animate"
            transition={{ staggerChildren: 0.05 }}
          >
            {/* ── LEFT: Input Panel ── */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              {/* Allocation Card */}
              <motion.div variants={stagger} transition={spring} className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                  <span className="text-[11px] font-semibold tracking-wider uppercase text-primary font-mono">
                    Portfolio Allocation
                  </span>
                  <span className={`text-xs font-mono font-bold tabular-nums ${total === 100 ? "text-accent-green" : total > 100 ? "text-accent-red" : "text-accent-yellow"}`}>
                    {total}/100%
                  </span>
                </div>
                <div className="p-4 flex flex-col gap-3">
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
                  <div className="px-4 pb-3">
                    <div className="text-[11px] text-accent-yellow/80 bg-accent-yellow/5 border border-accent-yellow/10 rounded px-3 py-1.5 text-center font-medium">
                      Adjust to 100% for accurate analysis
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Action Buttons */}
              <motion.div variants={stagger} transition={spring} className="grid grid-cols-5 gap-3">
                <motion.button
                  onClick={runAnalysis}
                  className="col-span-3 bg-primary text-primary-foreground font-bold py-2.5 rounded-lg text-xs tracking-wide font-mono uppercase"
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.98 }}
                  transition={spring}
                >
                  Analyze
                </motion.button>
                <motion.button
                  onClick={runExample}
                  className="col-span-2 bg-card border border-border font-semibold py-2.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors font-mono uppercase"
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.98 }}
                  transition={spring}
                >
                  Example
                </motion.button>
              </motion.div>

              {/* Chart Card */}
              <motion.div variants={stagger} transition={spring} className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="px-4 py-3 border-b border-border">
                  <span className="text-[11px] font-semibold tracking-wider uppercase text-primary font-mono">
                    Allocation Chart
                  </span>
                </div>
                <div className="p-4">
                  <PortfolioPieChart segments={segments} />
                </div>
              </motion.div>

              {/* Architecture */}
              <motion.div variants={stagger} transition={spring}>
                <ArchitectureNote />
              </motion.div>
            </div>

            {/* ── RIGHT: Results Panel ── */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              {/* Risk Gauge Card */}
              <motion.div variants={stagger} transition={spring} className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="px-4 py-3 border-b border-border">
                  <span className="text-[11px] font-semibold tracking-wider uppercase text-primary font-mono">
                    Risk Assessment
                  </span>
                </div>
                <div className="p-4">
                  <div className="flex flex-col items-center">
                    <RiskGauge score={hasAnalyzed ? analysis.score : 0} riskLevel={hasAnalyzed ? analysis.level : "—"} />
                  </div>
                  <AnimatePresence>
                    {hasAnalyzed && (
                      <motion.div
                        className="mt-5 flex gap-2"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                      >
                        <StatCard label="Volatility" value={`${analysis.volatilityScore}%`} />
                        <StatCard label="Risk" value={`${analysis.score}`} color="text-primary" />
                        <StatCard
                          label="Stability"
                          value={`${analysis.stabilityScore}`}
                          color={analysis.stabilityScore >= 67 ? "text-accent-green" : analysis.stabilityScore >= 34 ? "text-accent-yellow" : "text-accent-red"}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* AI Explanation */}
              <AnimatePresence mode="wait">
                {hasAnalyzed ? (
                  <motion.div
                    key="analysis"
                    className="bg-card border border-border rounded-lg overflow-hidden"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={spring}
                  >
                    <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                      <span className="text-[11px] font-semibold tracking-wider uppercase text-primary font-mono">
                        AI Analysis
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        analysis.level === "Low" ? "text-accent-green bg-accent-green/10 border border-accent-green/20" :
                        analysis.level === "Moderate" ? "text-accent-yellow bg-accent-yellow/10 border border-accent-yellow/20" :
                        "text-accent-red bg-accent-red/10 border border-accent-red/20"
                      }`}>
                        {analysis.level.toUpperCase()} RISK
                      </span>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="bg-secondary/50 border border-border rounded-md p-3.5">
                        <h3 className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Analysis</h3>
                        <p className="text-foreground/90 text-[13px] leading-relaxed">
                          {analysis.explanation}
                        </p>
                      </div>
                      <div className="bg-accent-green/5 border border-accent-green/10 rounded-md p-3.5">
                        <h3 className="text-[10px] font-mono font-semibold uppercase tracking-wider text-accent-green mb-1.5">Recommendation</h3>
                        <p className="text-foreground/90 text-[13px] leading-relaxed">
                          {analysis.suggestion}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    variants={stagger}
                    transition={spring}
                    className="bg-card border border-border rounded-lg flex flex-col items-center justify-center text-center px-6 py-10"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-3">
                      <span className="text-primary text-base">⚡</span>
                    </div>
                    <p className="text-muted-foreground text-xs max-w-xs leading-relaxed">
                      Configure your portfolio allocation and click{" "}
                      <span className="text-primary font-semibold">Analyze</span>{" "}
                      to generate AI-powered risk insights.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-border py-3">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground font-mono">AI Portfolio Risk Advisor — Demo</span>
          <span className="text-[10px] text-muted-foreground font-mono">Not financial advice</span>
        </div>
      </footer>
    </div>
  );
};

export default Index;
