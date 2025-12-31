import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { useDroppable } from "@dnd-kit/core";
import { useEditorContext } from "../context/EditorContext";
import { useDndCanvasRef } from "../context/DndProvider";
import { useEditorKeyboard } from "../hooks/useEditorKeyboard";
import { CanvasNode } from "./CanvasNode";
import { GroupNode } from "./GroupNode";

export interface CanvasProps {
  className?: string;
  onContextMenu?: (e: React.MouseEvent) => void;
}

export const Canvas = React.forwardRef<HTMLDivElement, CanvasProps>(
  function Canvas({ className, onContextMenu }, forwardedRef) {
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
      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    };

  return (
    <div
      ref={setRefs}
      data-canvas
      className={`${className ?? ""} ${isOver ? "bg-editor-selection-bg" : ""} transition-colors`}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
      onClick={handleCanvasClick}
      onContextMenu={onContextMenu}
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
        {childIds.map((id, index) => {
          const node = document.nodes[id];
          if (node?.type === "Group") {
            return <GroupNode key={id} nodeId={id} nodeIndex={index} />;
          }
          return <CanvasNode key={id} nodeId={id} nodeIndex={index} />;
        })}
      </div>
    </div>
  );
  }
);
