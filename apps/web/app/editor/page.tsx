"use client";

import { useState, createContext, useContext } from "react";
import { motion } from "motion/react";
import { PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen } from "lucide-react";
import {
  EditorProvider,
  RegistryProvider,
  DndProvider,
  Canvas,
  Palette,
} from "@shadcn-mini/editor-react";
import { editorRegistry } from "@/components/editor/renderers";
import { paletteItems } from "@/components/editor/palette-items";
import { EditorHeader } from "@/components/editor/layout/EditorHeader";
import { EditorFooter } from "@/components/editor/layout/EditorFooter";
import { PropertiesPanel } from "@/components/editor/layout/PropertiesPanel";
import { LayersPanel } from "@/components/editor/layout/LayersPanel";
import { CanvasContextMenu } from "@/components/editor/canvas/CanvasContextMenu";
import { Button } from "@/components/ui/button";
import { OnboardingTooltip } from "@/components/editor/onboarding/OnboardingTooltip";
import { useOnboarding } from "@/components/editor/onboarding/useOnboarding";

interface PanelState {
  leftCollapsed: boolean;
  rightCollapsed: boolean;
  toggleLeft: () => void;
  toggleRight: () => void;
}

const PanelContext = createContext<PanelState | null>(null);

export function usePanelState() {
  const ctx = useContext(PanelContext);
  if (!ctx) throw new Error("usePanelState must be used within PanelProvider");
  return ctx;
}

export default function EditorPage() {
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const onboarding = useOnboarding();

  const panelState: PanelState = {
    leftCollapsed,
    rightCollapsed,
    toggleLeft: () => setLeftCollapsed((prev) => !prev),
    toggleRight: () => setRightCollapsed((prev) => !prev),
  };

  return (
    <EditorProvider>
      <RegistryProvider registry={editorRegistry}>
        <DndProvider>
          <PanelContext.Provider value={panelState}>
            <div className="flex flex-col h-screen bg-editor-canvas-bg">
              <EditorHeader />
              <div className="flex flex-1 overflow-hidden relative">
                <motion.aside
                  className="border-r border-editor-panel-border bg-editor-panel-bg shrink-0 overflow-hidden"
                  animate={{ width: leftCollapsed ? 0 : 240 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="w-60 h-full overflow-y-auto">
                    <Palette items={paletteItems} />
                  </div>
                </motion.aside>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-1 top-1/2 -translate-y-1/2 z-10 h-6 w-6 bg-editor-panel-bg border border-editor-panel-border shadow-sm"
                  onClick={panelState.toggleLeft}
                  title={leftCollapsed ? "Show left panel" : "Hide left panel"}
                >
                  {leftCollapsed ? (
                    <PanelLeftOpen className="h-3 w-3" />
                  ) : (
                    <PanelLeftClose className="h-3 w-3" />
                  )}
                </Button>
                <main className="flex-1 relative overflow-hidden">
                  <CanvasContextMenu>
                    <Canvas className="h-full bg-[radial-gradient(circle,hsl(var(--editor-grid))_1px,transparent_1px)] bg-size-[20px_20px]" />
                  </CanvasContextMenu>
                </main>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 z-10 h-6 w-6 bg-editor-panel-bg border border-editor-panel-border shadow-sm"
                  onClick={panelState.toggleRight}
                  title={rightCollapsed ? "Show right panel" : "Hide right panel"}
                >
                  {rightCollapsed ? (
                    <PanelRightOpen className="h-3 w-3" />
                  ) : (
                    <PanelRightClose className="h-3 w-3" />
                  )}
                </Button>
                <motion.div
                  className="flex shrink-0 overflow-hidden"
                  animate={{ width: rightCollapsed ? 0 : "auto" }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  <LayersPanel />
                  <PropertiesPanel />
                </motion.div>
              </div>
              <EditorFooter />
            </div>
            {onboarding.activeStep && (
              <OnboardingTooltip
                step={onboarding.activeStep}
                currentIndex={onboarding.currentStep ?? 0}
                totalSteps={onboarding.totalSteps}
                onNext={onboarding.nextStep}
                onSkip={onboarding.skipOnboarding}
              />
            )}
          </PanelContext.Provider>
        </DndProvider>
      </RegistryProvider>
    </EditorProvider>
  );
}
