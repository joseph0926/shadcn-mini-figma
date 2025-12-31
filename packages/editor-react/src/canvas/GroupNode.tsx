import React, { useCallback, useState } from "react";
import { motion } from "motion/react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Lock, FolderOpen } from "lucide-react";
import type { NodeId, Size, Position } from "@shadcn-mini/editor-core";
import { useEditorContext } from "../context/EditorContext";
import { ResizeHandles } from "./ResizeHandles";
import { CanvasNode } from "./CanvasNode";
import type { DraggableData } from "../editor-types";

export interface GroupNodeProps {
  nodeId: NodeId;
}

export function GroupNode({ nodeId }: GroupNodeProps) {
  const {
    document,
    selectedIds,
    selectNode,
    updateNode,
    moveNode,
    zoom,
    enterGroup,
    editingGroupId,
  } = useEditorContext();
  const node = document.nodes[nodeId];
  const [isResizing, setIsResizing] = useState(false);

  const isLocked = node?.locked === true;
  const isEditing = editingGroupId === nodeId;

  const moveNodeWithChildren = useCallback(
    (id: NodeId, delta: Position) => {
      moveNode(id, delta);
      const n = document.nodes[id];
      if (n?.children) {
        for (const childId of n.children) {
          moveNodeWithChildren(childId, delta);
        }
      }
    },
    [moveNode, document.nodes]
  );

  const scaleChildren = useCallback(
    (scaleX: number, scaleY: number, originX: number, originY: number) => {
      const children = node?.children ?? [];
      for (const childId of children) {
        const child = document.nodes[childId];
        if (!child) continue;

        const relX = child.position.x - originX;
        const relY = child.position.y - originY;
        const newX = originX + relX * scaleX;
        const newY = originY + relY * scaleY;
        const newWidth = child.size.width * scaleX;
        const newHeight = child.size.height * scaleY;

        updateNode(childId, {
          position: { x: newX, y: newY },
          size: { width: Math.max(10, newWidth), height: Math.max(10, newHeight) },
        });
      }
    },
    [node?.children, document.nodes, updateNode]
  );

  const handleResizeStart = useCallback(() => {
    setIsResizing(true);
  }, []);

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
  }, []);

  const handleResize = useCallback(
    (newSize: Size, positionDelta: Position) => {
      if (isLocked || !node) return;

      const scaleX = newSize.width / node.size.width;
      const scaleY = newSize.height / node.size.height;

      const newOriginX = node.position.x + positionDelta.x;
      const newOriginY = node.position.y + positionDelta.y;

      scaleChildren(scaleX, scaleY, node.position.x, node.position.y);

      updateNode(nodeId, { size: newSize });
      if (positionDelta.x !== 0 || positionDelta.y !== 0) {
        moveNodeWithChildren(nodeId, positionDelta);
      }
    },
    [nodeId, node, updateNode, moveNodeWithChildren, scaleChildren, isLocked]
  );

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: nodeId,
      data: { type: "canvas-node", nodeId } satisfies DraggableData,
      disabled: isLocked || isResizing || isEditing,
    });

  if (!node || node.visible === false) return null;

  const isSelected = selectedIds.has(nodeId);
  const children = node.children ?? [];

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isEditing) {
      selectNode(nodeId, { addToSelection: e.shiftKey || e.metaKey || e.ctrlKey });
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLocked) {
      enterGroup(nodeId);
    }
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
        transform: isResizing ? undefined : CSS.Translate.toString(transform),
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{
        opacity: isDragging ? 0.8 : 1,
        scale: 1,
        zIndex: isDragging ? 1000 : isEditing ? 100 : 1,
      }}
      transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      {...(isEditing ? {} : { ...listeners, ...attributes })}
      data-node-id={nodeId}
      className={`rounded-md ${isLocked ? "cursor-not-allowed" : isEditing ? "cursor-default" : isDragging ? "cursor-grabbing" : "cursor-grab"}`}
    >
      <div
        className={`absolute inset-0 pointer-events-none rounded-md border ${
          isEditing
            ? "border-blue-500 bg-blue-500/5 border-solid"
            : isSelected
            ? "border-blue-400/50 bg-blue-500/3 border-dashed"
            : "border-muted-foreground/20 border-dashed"
        }`}
      />

      {isEditing && (
        <div className="absolute -top-6 left-0 flex items-center gap-1 text-xs text-blue-500 bg-background px-1.5 py-0.5 rounded border border-blue-500/30">
          <FolderOpen className="h-3 w-3" />
          <span>Editing Group</span>
        </div>
      )}

      {isSelected && !isEditing && (
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
          {!isLocked && (
            <ResizeHandles
              size={node.size}
              zoom={zoom}
              onResize={handleResize}
              onResizeStart={handleResizeStart}
              onResizeEnd={handleResizeEnd}
            />
          )}
        </>
      )}

      {isLocked && (
        <div className="absolute -top-2 -right-2 bg-muted rounded-full p-0.5 shadow-sm border border-border">
          <Lock className="h-3 w-3 text-muted-foreground" />
        </div>
      )}

      <div
        className="absolute inset-0"
        style={{ pointerEvents: isEditing ? "auto" : "none" }}
      >
        {children.map((childId) => (
          <CanvasNode key={childId} nodeId={childId} />
        ))}
      </div>
    </motion.div>
  );
}
