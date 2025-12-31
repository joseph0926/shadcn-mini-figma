import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { useDroppable } from "@dnd-kit/core";
import { useEditorContext } from "../context/EditorContext";
import { useDndCanvasRef } from "../context/DndProvider";
import { useEditorKeyboard } from "../hooks/useEditorKeyboard";
import { CanvasNode } from "./CanvasNode";

export interface CanvasProps {
  className?: string;
}

export function Canvas({ className }: CanvasProps) {
  const { document, selectNode, zoom } = useEditorContext();
  const setCanvasRef = useDndCanvasRef();
  useEditorKeyboard();

  const { setNodeRef, isOver } = useDroppable({
    id: "canvas",
    data: { type: "canvas" },
  });

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      selectNode(null);
    }
  };

  const rootNode = document.nodes[document.rootId];
  const childIds = rootNode?.children ?? [];

  const setRefs = (node: HTMLDivElement | null) => {
    setNodeRef(node);
    setCanvasRef(node);
  };

  return (
    <motion.div
      ref={setRefs}
      data-canvas
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
      animate={{
        backgroundColor: isOver ? "hsl(var(--editor-selection-bg))" : "transparent",
      }}
      transition={{ duration: 0.15 }}
      onClick={handleCanvasClick}
    >
      <AnimatePresence>
        {isOver && (
          <motion.div
            className="absolute inset-4 border-2 border-dashed rounded-lg pointer-events-none border-editor-selection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          />
        )}
      </AnimatePresence>

      <div
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "0 0",
          width: "100%",
          height: "100%",
        }}
      >
        {childIds.map((id) => (
          <CanvasNode key={id} nodeId={id} />
        ))}
      </div>
    </motion.div>
  );
}
