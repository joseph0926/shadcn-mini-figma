"use client";

import { motion, AnimatePresence } from "motion/react";
import { X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { OnboardingStep } from "./useOnboarding";

interface OnboardingTooltipProps {
  step: OnboardingStep;
  currentIndex: number;
  totalSteps: number;
  onNext: () => void;
  onSkip: () => void;
}

export function OnboardingTooltip({
  step,
  currentIndex,
  totalSteps,
  onNext,
  onSkip,
}: OnboardingTooltipProps) {
  const positionClasses: Record<string, string> = {
    palette: "left-64 top-32",
    canvas: "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
    properties: "right-72 top-32",
  };

  const arrowClasses: Record<string, string> = {
    palette: "left-0 top-4 -translate-x-full border-r-foreground border-y-transparent border-l-transparent border-r-8 border-y-8 border-l-0",
    canvas: "",
    properties: "right-0 top-4 translate-x-full border-l-foreground border-y-transparent border-r-transparent border-l-8 border-y-8 border-r-0",
  };

  return (
    <AnimatePresence>
      <motion.div
        key={step.id}
        className={`fixed z-50 ${positionClasses[step.target]}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
      >
        <div className="bg-popover border border-border rounded-lg shadow-lg p-4 w-64 relative">
          {arrowClasses[step.target] && (
            <div className={`absolute w-0 h-0 ${arrowClasses[step.target]}`} />
          )}
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-sm">{step.title}</h3>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 -mr-2 -mt-1"
              onClick={onSkip}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mb-3">{step.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {currentIndex + 1} / {totalSteps}
            </span>
            <Button size="sm" onClick={onNext} className="h-7 px-3">
              {currentIndex === totalSteps - 1 ? "Done" : "Next"}
              {currentIndex < totalSteps - 1 && <ArrowRight className="h-3 w-3 ml-1" />}
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
