import React, { useState, useRef, type ReactNode } from "react";
import {
  DndContext,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useEditorContext } from "./EditorContext";
import { useRendererRegistry } from "./RegistryContext";
import { DragPreview } from "../canvas/DragPreview";
import type { DraggableData } from "../editor-types";

export interface DndProviderProps {
  children: ReactNode;
}

export function DndProvider({ children }: DndProviderProps) {
  const { document, addNode, moveNode } = useEditorContext();
  const registry = useRendererRegistry();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeData, setActiveData] = useState<DraggableData | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

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

  const setCanvasRef = (node: HTMLDivElement | null) => {
    canvasRef.current = node;
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <DndCanvasRefContext.Provider value={setCanvasRef}>
        {children}
      </DndCanvasRefContext.Provider>
      <DragOverlay dropAnimation={null}>
        {activeId && activeData && (
          <DragPreview data={activeData} document={document} registry={registry} />
        )}
      </DragOverlay>
    </DndContext>
  );
}

const DndCanvasRefContext = React.createContext<
  ((node: HTMLDivElement | null) => void) | null
>(null);

export function useDndCanvasRef() {
  const context = React.useContext(DndCanvasRefContext);
  if (!context) {
    throw new Error("useDndCanvasRef must be used within DndProvider");
  }
  return context;
}
