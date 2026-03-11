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

  const cx = 100, cy = 100, r = 74, innerR = 52;
  let cumulative = 0;
  const filtered = segments.filter(s => s.value > 0);

  const paths = filtered.map((seg, i) => {
    const startAngle = (cumulative / total) * 360 - 90;
    cumulative += seg.value;
    const endAngle = (cumulative / total) * 360 - 90;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    const gap = 0.02; // small gap between segments

    const outerR = hoveredIndex === i ? r + 3 : r;
    const x1 = cx + outerR * Math.cos(startRad + gap);
    const y1 = cy + outerR * Math.sin(startRad + gap);
    const x2 = cx + outerR * Math.cos(endRad - gap);
    const y2 = cy + outerR * Math.sin(endRad - gap);
    const x3 = cx + innerR * Math.cos(endRad - gap);
    const y3 = cy + innerR * Math.sin(endRad - gap);
    const x4 = cx + innerR * Math.cos(startRad + gap);
    const y4 = cy + innerR * Math.sin(startRad + gap);

    const d = `M ${x1} ${y1} A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 ${largeArc} 0 ${x4} ${y4} Z`;

    return (
      <motion.path
        key={seg.label}
        d={d}
        fill={seg.color}
        className="cursor-pointer"
        opacity={hoveredIndex !== null && hoveredIndex !== i ? 0.35 : 1}
        onMouseEnter={() => setHoveredIndex(i)}
        onMouseLeave={() => setHoveredIndex(null)}
        initial={{ opacity: 0 }}
        animate={{ opacity: hoveredIndex !== null && hoveredIndex !== i ? 0.35 : 1 }}
        transition={spring}
      />
    );
  });

  return (
    <div className="flex items-center gap-5">
      <svg viewBox="0 0 200 200" className="w-32 h-32 flex-shrink-0">
        {paths}
        <text x="100" y="97" textAnchor="middle" className="fill-foreground" style={{ fontSize: "16px", fontWeight: 700, fontFamily: "IBM Plex Mono" }}>
          {total}%
        </text>
        <text x="100" y="111" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: "7px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1.5px", fontFamily: "IBM Plex Mono" }}>
          TOTAL
        </text>
      </svg>
      <div className="flex flex-col gap-1.5">
        {filtered.map((seg, i) => (
          <div
            key={seg.label}
            className={`flex items-center gap-2 text-[11px] cursor-default transition-opacity ${hoveredIndex !== null && hoveredIndex !== i ? "opacity-40" : ""}`}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="w-2 h-2 rounded-[2px] flex-shrink-0" style={{ background: seg.color }} />
            <span className="text-muted-foreground font-mono">{seg.label}</span>
            <span className="font-mono font-bold tabular-nums text-foreground ml-auto pl-3">
              {seg.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
