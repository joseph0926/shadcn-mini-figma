"use client";

import { motion } from "motion/react";
import { Eye, EyeOff, ChevronRight, Lock, Unlock } from "lucide-react";
import { useEditorContext } from "@shadcn-mini/editor-react";
import { Button } from "@/components/ui/button";

export function LayersPanel() {
  const { document, selectedIds, selectNode, toggleVisibility, toggleLock } = useEditorContext();

  const rootNode = document.nodes[document.rootId];
  const childIds = rootNode?.children ?? [];

  const reversedIds = [...childIds].reverse();

  return (
    <aside className="w-48 border-l border-editor-panel-border bg-editor-panel-bg shrink-0 overflow-y-auto">
      <div className="p-3 border-b border-editor-panel-border">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Layers
        </h3>
      </div>
      <div className="py-1">
        {reversedIds.length === 0 ? (
          <div className="px-3 py-4 text-xs text-muted-foreground text-center">
            No layers
          </div>
        ) : (
          reversedIds.map((id, index) => {
            const node = document.nodes[id];
            if (!node) return null;
            const isSelected = selectedIds.has(id);

            const isVisible = node.visible !== false;
            const isLocked = node.locked === true;

            return (
              <motion.div
                key={id}
                className={`flex items-center gap-1 px-2 py-1.5 cursor-pointer text-sm ${
                  isSelected
                    ? "bg-editor-selection-bg text-editor-selection"
                    : "hover:bg-muted/50"
                } ${!isVisible ? "opacity-50" : ""}`}
                onClick={(e) => {
                  selectNode(id, { addToSelection: e.shiftKey || e.metaKey || e.ctrlKey });
                }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.02 }}
              >
                <ChevronRight className="h-3 w-3 text-muted-foreground" />
                <span className="flex-1 truncate text-xs">{node.type}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 opacity-50 hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLock(id);
                  }}
                >
                  {isLocked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 opacity-50 hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleVisibility(id);
                  }}
                >
                  {isVisible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                </Button>
              </motion.div>
            );
          })
        )}
      </div>
    </aside>
  );
}
