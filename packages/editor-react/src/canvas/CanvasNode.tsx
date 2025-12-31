import React, { useCallback } from "react";
import { motion } from "motion/react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { NodeId, Size, Position } from "@shadcn-mini/editor-core";
import { useEditorContext } from "../context/EditorContext";
import { useRendererRegistry } from "../context/RegistryContext";
import { ResizeHandles } from "./ResizeHandles";
import type { DraggableData } from "../editor-types";

export interface CanvasNodeProps {
  nodeId: NodeId;
}

export function CanvasNode({ nodeId }: CanvasNodeProps) {
  const { document, selectedId, selectNode, updateNode, moveNode, zoom } = useEditorContext();
  const registry = useRendererRegistry();
  const node = document.nodes[nodeId];

  const handleResize = useCallback(
    (newSize: Size, positionDelta: Position) => {
      updateNode(nodeId, { size: newSize });
      if (positionDelta.x !== 0 || positionDelta.y !== 0) {
        moveNode(nodeId, positionDelta);
      }
    },
    [nodeId, updateNode, moveNode]
  );

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: nodeId,
      data: { type: "canvas-node", nodeId } satisfies DraggableData,
    });

  if (!node) return null;

  const isSelected = selectedId === nodeId;
  const Renderer = registry[node.type];

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectNode(nodeId);
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
      className={`cursor-grab rounded-md ${isDragging ? "cursor-grabbing" : ""}`}
    >
      {isSelected && (
        <>
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              outline: "2px solid hsl(217, 91%, 60%)",
              outlineOffset: "2px",
            }}
            layoutId={`selection-${nodeId}`}
          />
          <ResizeHandles size={node.size} zoom={zoom} onResize={handleResize} />
        </>
      )}
      {Renderer ? <Renderer node={node} isSelected={isSelected} /> : null}
    </motion.div>
  );
}
