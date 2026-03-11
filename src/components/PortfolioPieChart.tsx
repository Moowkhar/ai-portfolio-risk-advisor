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

  const cx = 100, cy = 100, r = 72, innerR = 48;
  let cumulative = 0;

  const filtered = segments.filter(s => s.value > 0);

  const paths = filtered.map((seg, i) => {
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
        className="cursor-pointer"
        opacity={hoveredIndex !== null && hoveredIndex !== i ? 0.4 : 1}
        onMouseEnter={() => setHoveredIndex(i)}
        onMouseLeave={() => setHoveredIndex(null)}
        initial={{ opacity: 0 }}
        animate={{ opacity: hoveredIndex !== null && hoveredIndex !== i ? 0.4 : 1 }}
        transition={spring}
      />
    );
  });

  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 200 200" className="w-36 h-36 flex-shrink-0">
        {paths}
        {/* Center text */}
        <text x="100" y="96" textAnchor="middle" className="fill-foreground" style={{ fontSize: "18px", fontWeight: 700, fontFamily: "IBM Plex Mono" }}>
          {total}%
        </text>
        <text x="100" y="112" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: "8px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "1px" }}>
          TOTAL
        </text>
      </svg>
      <div className="flex flex-col gap-2">
        {filtered.map((seg, i) => (
          <div
            key={seg.label}
            className="flex items-center gap-2 text-xs cursor-default"
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: seg.color }} />
            <span className="text-muted-foreground font-mono">{seg.label}</span>
            <span className="font-mono font-semibold tabular-nums text-foreground ml-auto">
              {seg.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
