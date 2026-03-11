import { motion } from "framer-motion";

interface RiskGaugeProps {
  score: number;
  riskLevel: string;
}

const spring = { type: "spring" as const, duration: 0.8, bounce: 0 };

export const RiskGauge = ({ score, riskLevel }: RiskGaugeProps) => {
  const getColor = () => {
    if (score <= 33) return "hsl(var(--accent-green))";
    if (score <= 66) return "hsl(var(--accent-yellow))";
    return "hsl(var(--accent-red))";
  };

  const getLevelColor = () => {
    if (score <= 33) return "text-accent-green";
    if (score <= 66) return "text-accent-yellow";
    return "text-accent-red";
  };

  const radius = 80;
  const circumference = (270 / 360) * 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-[200px] h-[130px]">
        <svg viewBox="0 0 200 130" className="w-full h-full overflow-visible">
          {/* Tick marks */}
          {[0, 25, 50, 75, 100].map((tick) => {
            const angle = -135 + (tick / 100) * 270;
            const rad = (angle * Math.PI) / 180;
            const x1 = 100 + 92 * Math.cos(rad);
            const y1 = 115 + 92 * Math.sin(rad);
            const x2 = 100 + 86 * Math.cos(rad);
            const y2 = 115 + 86 * Math.sin(rad);
            return (
              <line
                key={tick}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="hsl(var(--muted-foreground))"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity={0.4}
              />
            );
          })}
          {/* Background arc */}
          <path
            d="M 25 115 A 80 80 0 1 1 175 115"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Glow */}
          <motion.path
            d="M 25 115 A 80 80 0 1 1 175 115"
            fill="none"
            stroke={getColor()}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={spring}
            opacity={0.15}
            filter="url(#gaugeGlow)"
          />
          {/* Main arc */}
          <motion.path
            d="M 25 115 A 80 80 0 1 1 175 115"
            fill="none"
            stroke={getColor()}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={spring}
          />
          <defs>
            <filter id="gaugeGlow">
              <feGaussianBlur stdDeviation="6" />
            </filter>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
          <motion.span
            className="font-mono font-bold text-4xl tracking-tight tabular-nums text-foreground"
            key={score}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={spring}
          >
            {score}
          </motion.span>
        </div>
      </div>
      <motion.div
        className={`font-mono font-bold text-sm ${getLevelColor()}`}
        key={riskLevel}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {riskLevel}
      </motion.div>
    </div>
  );
};
