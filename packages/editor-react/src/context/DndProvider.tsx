import React, { useState, useRef, type ReactNode } from "react";
import {
  DndContext,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
  type DragOverEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { type NodeId } from "@shadcn-mini/editor-core";
import { ResizeAwarePointerSensor } from "../sensors/ResizeAwarePointerSensor";
import { useEditorContext } from "./EditorContext";
import { useRendererRegistry } from "./RegistryContext";
import { DragPreview } from "../canvas/DragPreview";
import type { DraggableData } from "../editor-types";

export interface DndProviderProps {
  children: ReactNode;
}

export function DndProvider({ children }: DndProviderProps) {
  const { document, addNode, moveNode, selectedIds, moveSelectedNodes, zoom, snapToGrid, reparentNode, canDropOnNode } = useEditorContext();
  const registry = useRendererRegistry();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeData, setActiveData] = useState<DraggableData | null>(null);
  const [dropTargetId, setDropTargetId] = useState<NodeId | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);

  const sensors = useSensors(
    useSensor(ResizeAwarePointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
    setActiveData(event.active.data.current as DraggableData);
    setDropTargetId(null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over, active } = event;
    const data = active.data.current as DraggableData;

    if (!over || data?.type !== "canvas-node") {
      setDropTargetId(null);
      return;
    }

    const targetId = String(over.id);
    if (targetId === "canvas") {
      setDropTargetId(null);
      return;
    }

    if (canDropOnNode(data.nodeId, targetId)) {
      setDropTargetId(targetId);
    } else {
      setDropTargetId(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over, delta } = event;
    const currentDropTarget = dropTargetId;
    setActiveId(null);
    setActiveData(null);
    setDropTargetId(null);

    if (!over) return;

    const data = active.data.current as DraggableData;

    if (data.type === "canvas-node" && currentDropTarget) {
      reparentNode(data.nodeId, currentDropTarget);
      return;
    }

    if (over.id !== "canvas") return;

    if (data.type === "palette-item") {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const activatorEvent = event.activatorEvent as PointerEvent;
      const rawPosition = {
        x: (activatorEvent.clientX - rect.left + delta.x) / zoom,
        y: (activatorEvent.clientY - rect.top + delta.y) / zoom,
      };
      const position = snapToGrid(rawPosition);
      addNode(data.nodeType, position);
    } else if (data.type === "canvas-node") {
      const rawDelta = { x: delta.x / zoom, y: delta.y / zoom };
      const node = document.nodes[data.nodeId];
      if (node) {
        const currentPos = node.position;
        const newPos = snapToGrid({ x: currentPos.x + rawDelta.x, y: currentPos.y + rawDelta.y });
        const snappedDelta = { x: newPos.x - currentPos.x, y: newPos.y - currentPos.y };
        if (selectedIds.has(data.nodeId) && selectedIds.size > 1) {
          moveSelectedNodes(snappedDelta);
        } else {
          moveNode(data.nodeId, snappedDelta);
        }
      }
    }
  };

  const setCanvasRef = (node: HTMLDivElement | null) => {
    canvasRef.current = node;
  };

  return (
    <DndContext
      id="editor-dnd"
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <DropTargetContext.Provider value={dropTargetId}>
        <DndCanvasRefContext.Provider value={setCanvasRef}>
          {children}
        </DndCanvasRefContext.Provider>
      </DropTargetContext.Provider>
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

const DropTargetContext = React.createContext<NodeId | null>(null);

export function useDndCanvasRef() {
  const context = React.useContext(DndCanvasRefContext);
  if (!context) {
    throw new Error("useDndCanvasRef must be used within DndProvider");
  }
  return context;
}

export function useDropTarget(): NodeId | null {
  return React.useContext(DropTargetContext);
}
