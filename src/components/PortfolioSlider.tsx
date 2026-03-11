interface PortfolioSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  color: string;
}

export const PortfolioSlider = ({ label, value, onChange, color }: PortfolioSliderProps) => {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-mono font-medium text-muted-foreground w-12 flex-shrink-0">{label}</span>
      <div className="flex-1 relative">
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, ${color} ${value}%, hsl(var(--muted)) ${value}%)`,
          }}
        />
      </div>
      <input
        type="number"
        min={0}
        max={100}
        value={value}
        onChange={(e) => {
          const v = Math.min(100, Math.max(0, Number(e.target.value) || 0));
          onChange(v);
        }}
        className="w-14 text-right font-mono font-medium tabular-nums text-xs bg-secondary border border-border rounded-md px-2 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
      />
      <span className="text-[10px] text-muted-foreground">%</span>
    </div>
  );
};
