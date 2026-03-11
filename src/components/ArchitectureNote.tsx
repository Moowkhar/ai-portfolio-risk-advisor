import { motion } from "framer-motion";

const steps = [
  { label: "User Input" },
  { label: "AI Risk Engine" },
  { label: "Portfolio Analysis" },
  { label: "Output" },
];

export const ArchitectureNote = () => {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <span className="text-[11px] font-semibold tracking-wider uppercase text-primary font-mono">
          Architecture
        </span>
      </div>
      <div className="px-4 py-3 flex items-center gap-1 flex-wrap">
        {steps.map((step, i) => (
          <motion.div
            key={step.label}
            className="flex items-center gap-1"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08, type: "spring", duration: 0.4, bounce: 0 }}
          >
            <span className="text-[11px] font-mono font-medium text-foreground/80 bg-secondary border border-border px-2 py-1 rounded">
              {step.label}
            </span>
            {i < steps.length - 1 && (
              <span className="text-primary text-[10px] font-mono">→</span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
