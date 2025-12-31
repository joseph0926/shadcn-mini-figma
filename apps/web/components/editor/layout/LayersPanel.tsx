"use client";

import { useState, useRef } from "react";
import { Eye, EyeOff, ChevronRight, ChevronDown, Lock, Unlock, Folder, FolderOpen, GripVertical } from "lucide-react";
import { useEditorContext } from "@shadcn-mini/editor-react";
import { type NodeId, isContainerType } from "@shadcn-mini/editor-core";
import { Button } from "@/components/ui/button";
import { NodeContextMenu, useContextMenu } from "../shared/NodeContextMenu";

type DropPosition = "before" | "inside" | "after" | null;

interface LayerItemProps {
  nodeId: NodeId;
  depth?: number;
  index?: number;
  parentId: NodeId;
  onContextMenu: (e: React.MouseEvent, nodeId: NodeId) => void;
}

function LayerItem({ nodeId, depth = 0, index = 0, parentId, onContextMenu }: LayerItemProps) {
  const { document, selectedIds, selectNode, toggleVisibility, toggleLock, enterGroup, editingGroupId, reparentNode } = useEditorContext();
  const [isExpanded, setIsExpanded] = useState(true);
  const [dropPosition, setDropPosition] = useState<DropPosition>(null);
  const [isDragging, setIsDragging] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);

  const node = document.nodes[nodeId];
  if (!node) return null;

  const isSelected = selectedIds.has(nodeId);
  const isVisible = node.visible !== false;
  const isLocked = node.locked === true;
  const isGroup = node.type === "Group";
  const isContainer = isContainerType(node.type);
  const hasChildren = node.children && node.children.length > 0;
  const isEditing = editingGroupId === nodeId;

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isGroup && !isLocked) {
      enterGroup(nodeId);
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("text/plain", nodeId);
    e.dataTransfer.effectAllowed = "move";
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDropPosition(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!itemRef.current) return;

    const rect = itemRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const percentage = y / rect.height;

    if (percentage < 0.25) {
      setDropPosition("before");
    } else if (percentage > 0.75) {
      setDropPosition("after");
    } else if (isContainer) {
      setDropPosition("inside");
    } else {
      setDropPosition("after");
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.stopPropagation();
    setDropPosition(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const draggedId = e.dataTransfer.getData("text/plain");
    if (!draggedId || draggedId === nodeId) {
      setDropPosition(null);
      return;
    }

    if (dropPosition === "inside" && isContainer) {
      reparentNode(draggedId, nodeId);
    } else {
      const targetParent = parentId;
      const siblings = document.nodes[targetParent]?.children ?? [];
      const currentIndex = siblings.indexOf(nodeId);
      const newIndex = dropPosition === "before" ? currentIndex : currentIndex + 1;
      reparentNode(draggedId, targetParent, newIndex);
    }

    setDropPosition(null);
  };

  const handleItemContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isSelected) {
      selectNode(nodeId);
    }
    onContextMenu(e, nodeId);
  };

  return (
    <>
      <div
        ref={itemRef}
        className={`relative flex items-center gap-1 px-2 py-1.5 cursor-pointer text-sm select-none transition-opacity ${
          isSelected
            ? "bg-editor-selection-bg text-editor-selection"
            : "hover:bg-muted/50"
        } ${!isVisible ? "opacity-50" : ""} ${isEditing ? "ring-1 ring-blue-500/50" : ""} ${isDragging ? "opacity-40" : ""}`}
        style={{ paddingLeft: 8 + depth * 12 }}
        onClick={(e) => {
          selectNode(nodeId, { addToSelection: e.shiftKey || e.metaKey || e.ctrlKey });
        }}
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleItemContextMenu}
        draggable={!isLocked}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {dropPosition === "before" && (
          <div className="absolute left-0 right-0 top-0 h-0.5 bg-blue-500 z-10" />
        )}
        {dropPosition === "inside" && isContainer && (
          <div className="absolute inset-0 border-2 border-blue-500 bg-blue-500/10 rounded z-10 pointer-events-none" />
        )}
        {dropPosition === "after" && (
          <div className="absolute left-0 right-0 bottom-0 h-0.5 bg-blue-500 z-10" />
        )}

        <div className="cursor-grab active:cursor-grabbing p-0.5 -ml-1 opacity-40 hover:opacity-100 transition-opacity">
          <GripVertical className="h-3 w-3 text-muted-foreground" />
        </div>

        {hasChildren ? (
          <button
            onClick={handleToggleExpand}
            className="p-0.5 hover:bg-muted rounded"
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-3 w-3 text-muted-foreground" />
            )}
          </button>
        ) : (
          <span className="w-4" />
        )}

        {isGroup ? (
          isExpanded ? (
            <FolderOpen className="h-3 w-3 text-blue-500" />
          ) : (
            <Folder className="h-3 w-3 text-blue-500" />
          )
        ) : null}

        <span className="flex-1 truncate text-xs">
          {isGroup ? "Group" : node.type}
        </span>

        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5 opacity-50 hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            toggleLock(nodeId);
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
            toggleVisibility(nodeId);
          }}
        >
          {isVisible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
        </Button>
      </div>

      {hasChildren && isExpanded && (
        <div>
          {[...node.children!].reverse().map((childId, childIndex) => (
            <LayerItem
              key={childId}
              nodeId={childId}
              depth={depth + 1}
              index={childIndex}
              parentId={nodeId}
              onContextMenu={onContextMenu}
            />
          ))}
        </div>
      )}
    </>
  );
}

export function LayersPanel() {
  const { document } = useEditorContext();
  const { open, position, handleContextMenu, handleClose } = useContextMenu();

  const rootNode = document.nodes[document.rootId];
  const childIds = rootNode?.children ?? [];

  const reversedIds = [...childIds].reverse();

  const handleLayerContextMenu = (e: React.MouseEvent, _nodeId: NodeId) => {
    handleContextMenu(e);
  };

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
          reversedIds.map((id, index) => (
            <LayerItem
              key={id}
              nodeId={id}
              index={index}
              parentId={document.rootId}
              onContextMenu={handleLayerContextMenu}
            />
          ))
        )}
      </div>
      <NodeContextMenu open={open} position={position} onClose={handleClose} />
    </aside>
  );
}
