import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "shadcn-mini-onboarding";

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  target: "palette" | "canvas" | "properties";
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: "palette",
    title: "Component Palette",
    description: "Drag components from here to the canvas",
    target: "palette",
  },
  {
    id: "canvas",
    title: "Canvas",
    description: "Click to select, drag to move, resize with handles",
    target: "canvas",
  },
  {
    id: "properties",
    title: "Properties Panel",
    description: "Edit selected component properties here",
    target: "properties",
  },
];

export function useOnboarding() {
  const [currentStep, setCurrentStep] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "complete") {
      setIsComplete(true);
      setCurrentStep(null);
    } else {
      setIsComplete(false);
      setCurrentStep(0);
    }
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep === null) return;
    if (currentStep >= ONBOARDING_STEPS.length - 1) {
      localStorage.setItem(STORAGE_KEY, "complete");
      setIsComplete(true);
      setCurrentStep(null);
    } else {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep]);

  const skipOnboarding = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, "complete");
    setIsComplete(true);
    setCurrentStep(null);
  }, []);

  const resetOnboarding = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setIsComplete(false);
    setCurrentStep(0);
  }, []);

  const activeStep = currentStep !== null ? ONBOARDING_STEPS[currentStep] : null;

  return {
    currentStep,
    activeStep,
    isComplete,
    totalSteps: ONBOARDING_STEPS.length,
    nextStep,
    skipOnboarding,
    resetOnboarding,
  };
}
