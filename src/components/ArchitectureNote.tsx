import { motion } from "framer-motion";

const steps = [
  { label: "User Input", icon: "→" },
  { label: "AI Risk Engine", icon: "→" },
  { label: "Portfolio Analysis", icon: "→" },
  { label: "Recommendation" },
];

export const ArchitectureNote = () => {
  return (
    <div className="rounded-xl bg-card p-5" style={{ border: "1px solid hsl(0 0% 16%)" }}>
      <span className="text-xs font-semibold tracking-widest uppercase text-primary">
        Architecture
      </span>
      <div className="flex items-center gap-1.5 mt-3 flex-wrap">
        {steps.map((step, i) => (
          <motion.div
            key={step.label}
            className="flex items-center gap-1.5"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, type: "spring", duration: 0.4, bounce: 0 }}
          >
            <span className="text-xs font-medium text-foreground bg-secondary border border-border px-2.5 py-1.5 rounded-md">
              {step.label}
            </span>
            {step.icon && (
              <span className="text-primary text-sm font-bold">→</span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
