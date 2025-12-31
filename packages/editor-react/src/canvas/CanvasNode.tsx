import React, { useCallback } from "react";
import { motion } from "motion/react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Lock } from "lucide-react";
import type { NodeId, Size, Position } from "@shadcn-mini/editor-core";
import { useEditorContext } from "../context/EditorContext";
import { useRendererRegistry } from "../context/RegistryContext";
import { ResizeHandles } from "./ResizeHandles";
import type { DraggableData } from "../editor-types";

export interface CanvasNodeProps {
  nodeId: NodeId;
}

export function CanvasNode({ nodeId }: CanvasNodeProps) {
  const { document, selectedIds, selectNode, updateNode, moveNode, zoom } = useEditorContext();
  const registry = useRendererRegistry();
  const node = document.nodes[nodeId];

  const isLocked = node?.locked === true;

  const handleResize = useCallback(
    (newSize: Size, positionDelta: Position) => {
      if (isLocked) return;
      updateNode(nodeId, { size: newSize });
      if (positionDelta.x !== 0 || positionDelta.y !== 0) {
        moveNode(nodeId, positionDelta);
      }
    },
    [nodeId, updateNode, moveNode, isLocked]
  );

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: nodeId,
      data: { type: "canvas-node", nodeId } satisfies DraggableData,
      disabled: isLocked,
    });

  if (!node || node.visible === false) return null;

  const isSelected = selectedIds.has(nodeId);
  const Renderer = registry[node.type];

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectNode(nodeId, { addToSelection: e.shiftKey || e.metaKey || e.ctrlKey });
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={{
        position: "absolute",
        left: node.position.x,
        top: node.position.y,
        width: node.size.width,
        height: node.size.height,
        transform: CSS.Translate.toString(transform),
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{
        opacity: isDragging ? 0.8 : 1,
        scale: 1,
        boxShadow: isDragging
          ? "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)"
          : "0 1px 3px 0 rgba(0,0,0,0.1)",
        zIndex: isDragging ? 1000 : 1,
      }}
      whileHover={{
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
      }}
      transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
      onClick={handleClick}
      {...listeners}
      {...attributes}
      data-node-id={nodeId}
      className={`rounded-md ${isLocked ? "cursor-not-allowed" : isDragging ? "cursor-grabbing" : "cursor-grab"}`}
    >
      {isSelected && (
        <>
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-md outline-editor-selection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              outlineWidth: "2px",
              outlineStyle: "solid",
              outlineOffset: "2px",
            }}
            layoutId={`selection-${nodeId}`}
          />
          {!isLocked && <ResizeHandles size={node.size} zoom={zoom} onResize={handleResize} />}
        </>
      )}
      {isLocked && (
        <div className="absolute -top-2 -right-2 bg-muted rounded-full p-0.5 shadow-sm border border-border">
          <Lock className="h-3 w-3 text-muted-foreground" />
        </div>
      )}
      {Renderer ? <Renderer node={node} isSelected={isSelected} /> : null}
    </motion.div>
  );
}
