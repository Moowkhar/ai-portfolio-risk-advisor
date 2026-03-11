import { motion } from "framer-motion";

const steps = [
  { label: "User Input", icon: "→" },
  { label: "AI Risk Engine", icon: "→" },
  { label: "Portfolio Analysis", icon: "→" },
  { label: "Recommendation" },
];

export const ArchitectureNote = () => {
  return (
    <div className="rounded-2xl bg-card p-6" style={{ boxShadow: "0 0 0 1px hsl(210 10% 23% / 0.5), 0px 2px 8px hsl(0 0% 0% / 0.2)" }}>
      <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
        Architecture
      </span>
      <div className="flex items-center gap-2 mt-3 flex-wrap">
        {steps.map((step, i) => (
          <motion.div
            key={step.label}
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, type: "spring", duration: 0.4, bounce: 0 }}
          >
            <span className="text-sm font-medium text-foreground bg-secondary px-3 py-1.5 rounded-lg">
              {step.label}
            </span>
            {step.icon && (
              <span className="text-muted-foreground text-lg">→</span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
