import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  DndContext,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from "@dnd-kit/core";
import { useEditorContext } from "../context/EditorContext";
import { useRendererRegistry } from "../context/RegistryContext";
import { CanvasNode } from "./CanvasNode";
import { DragPreview } from "./DragPreview";
import type { DraggableData } from "../editor-types";

export interface CanvasProps {
  className?: string;
}

export function Canvas({ className }: CanvasProps) {
  const { document, addNode, moveNode, selectNode } = useEditorContext();
  const registry = useRendererRegistry();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeData, setActiveData] = useState<DraggableData | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const { setNodeRef, isOver } = useDroppable({
    id: "canvas",
    data: { type: "canvas" },
  });

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
    setActiveData(event.active.data.current as DraggableData);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over, delta } = event;
    setActiveId(null);
    setActiveData(null);

    if (!over || over.id !== "canvas") return;

    const data = active.data.current as DraggableData;

    if (data.type === "palette-item") {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const activatorEvent = event.activatorEvent as PointerEvent;
      const position = {
        x: activatorEvent.clientX - rect.left + delta.x,
        y: activatorEvent.clientY - rect.top + delta.y,
      };
      addNode(data.nodeType, position);
    } else if (data.type === "canvas-node") {
      moveNode(data.nodeId, { x: delta.x, y: delta.y });
    }
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      selectNode(null);
    }
  };

  const rootNode = document.nodes[document.rootId];
  const childIds = rootNode?.children ?? [];

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <motion.div
        ref={(node) => {
          setNodeRef(node);
          (canvasRef as React.MutableRefObject<HTMLDivElement | null>).current =
            node;
        }}
        className={className}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}
        animate={{
          backgroundColor: isOver
            ? "hsl(217, 91%, 97%)"
            : "transparent",
        }}
        transition={{ duration: 0.15 }}
        onClick={handleCanvasClick}
      >
        <AnimatePresence>
          {isOver && (
            <motion.div
              className="absolute inset-4 border-2 border-dashed rounded-lg pointer-events-none"
              style={{ borderColor: "hsl(217, 91%, 60%)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            />
          )}
        </AnimatePresence>

        {childIds.map((id) => (
          <CanvasNode key={id} nodeId={id} />
        ))}
      </motion.div>

      <DragOverlay dropAnimation={null}>
        {activeId && activeData && (
          <DragPreview data={activeData} document={document} registry={registry} />
        )}
      </DragOverlay>
    </DndContext>
  );
}
