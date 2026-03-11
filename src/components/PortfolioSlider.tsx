interface PortfolioSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  color: string;
}

export const PortfolioSlider = ({ label, value, onChange, color }: PortfolioSliderProps) => {
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-[11px] font-mono font-semibold text-muted-foreground w-10 flex-shrink-0 tracking-wider">{label}</span>
      <div className="flex-1 relative">
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-1 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, ${color} ${value}%, hsl(var(--muted)) ${value}%)`,
          }}
        />
      </div>
      <div className="flex items-center bg-secondary border border-border rounded px-1.5">
        <input
          type="number"
          min={0}
          max={100}
          value={value}
          onChange={(e) => {
            const v = Math.min(100, Math.max(0, Number(e.target.value) || 0));
            onChange(v);
          }}
          className="w-8 text-right font-mono font-semibold tabular-nums text-[11px] bg-transparent py-1 text-foreground focus:outline-none"
        />
        <span className="text-[10px] text-muted-foreground font-mono ml-0.5">%</span>
      </div>
    </div>
  );
};
