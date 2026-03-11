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

  // Arc from -135deg to 135deg (270deg sweep)
  const radius = 80;
  const circumference = (270 / 360) * 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-[220px] h-[140px]">
        <svg
          viewBox="0 0 200 130"
          className="w-full h-full overflow-visible"
        >
          {/* Background arc */}
          <path
            d="M 25 115 A 80 80 0 1 1 175 115"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Value arc */}
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
          />
        </svg>
        {/* Score display */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
          <motion.span
            className="font-display font-bold text-6xl tracking-tighter tabular-nums text-foreground"
            key={score}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={spring}
          >
            {score}
          </motion.span>
        </div>
      </div>
      <div className="text-center">
        <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
          Risk Level
        </span>
        <motion.p
          className={`font-display font-semibold text-xl ${getLevelColor()}`}
          key={riskLevel}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {riskLevel}
        </motion.p>
      </div>
    </div>
  );
};
