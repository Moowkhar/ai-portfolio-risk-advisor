interface PortfolioSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  color: string;
}

export const PortfolioSlider = ({ label, value, onChange, color }: PortfolioSliderProps) => {
  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-muted-foreground w-14 flex-shrink-0 font-medium">{label}</span>
      <div className="flex-1 relative">
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer bg-muted"
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
        className="w-16 text-right font-display font-semibold tabular-nums text-sm bg-background border border-border rounded-lg px-2 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
      />
      <span className="text-xs text-muted-foreground">%</span>
    </div>
  );
};
