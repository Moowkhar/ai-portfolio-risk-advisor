import { motion } from "framer-motion";
import { useState } from "react";

interface Segment {
  label: string;
  value: number;
  color: string;
}

interface PortfolioPieChartProps {
  segments: Segment[];
}

const spring = { type: "spring" as const, duration: 0.4, bounce: 0 };

export const PortfolioPieChart = ({ segments }: PortfolioPieChartProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  if (total === 0) return null;

  const cx = 100, cy = 100, r = 70, innerR = 45;
  let cumulative = 0;

  const paths = segments.filter(s => s.value > 0).map((seg, i) => {
    const startAngle = (cumulative / total) * 360 - 90;
    cumulative += seg.value;
    const endAngle = (cumulative / total) * 360 - 90;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    const outerR = hoveredIndex === i ? r + 4 : r;
    const x1 = cx + outerR * Math.cos(startRad);
    const y1 = cy + outerR * Math.sin(startRad);
    const x2 = cx + outerR * Math.cos(endRad);
    const y2 = cy + outerR * Math.sin(endRad);
    const x3 = cx + innerR * Math.cos(endRad);
    const y3 = cy + innerR * Math.sin(endRad);
    const x4 = cx + innerR * Math.cos(startRad);
    const y4 = cy + innerR * Math.sin(startRad);

    const d = `M ${x1} ${y1} A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 ${largeArc} 0 ${x4} ${y4} Z`;

    return (
      <motion.path
        key={seg.label}
        d={d}
        fill={seg.color}
        className="cursor-pointer transition-opacity duration-200"
        opacity={hoveredIndex !== null && hoveredIndex !== i ? 0.5 : 1}
        onMouseEnter={() => setHoveredIndex(i)}
        onMouseLeave={() => setHoveredIndex(null)}
        initial={{ opacity: 0 }}
        animate={{ opacity: hoveredIndex !== null && hoveredIndex !== i ? 0.5 : 1 }}
        transition={spring}
      />
    );
  });

  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 200 200" className="w-40 h-40 flex-shrink-0">
        {paths}
      </svg>
      <div className="flex flex-col gap-2">
        {segments.filter(s => s.value > 0).map((seg, i) => (
          <div
            key={seg.label}
            className="flex items-center gap-2 text-sm cursor-default"
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: seg.color }} />
            <span className="text-muted-foreground">{seg.label}</span>
            <span className="font-display font-semibold tabular-nums text-foreground ml-auto">
              {seg.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
