"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Eye, EyeOff, ChevronRight, ChevronDown, Lock, Unlock, Folder, FolderOpen } from "lucide-react";
import { useEditorContext } from "@shadcn-mini/editor-react";
import type { NodeId } from "@shadcn-mini/editor-core";
import { Button } from "@/components/ui/button";

interface LayerItemProps {
  nodeId: NodeId;
  depth?: number;
  index?: number;
}

function LayerItem({ nodeId, depth = 0, index = 0 }: LayerItemProps) {
  const { document, selectedIds, selectNode, toggleVisibility, toggleLock, enterGroup, editingGroupId } = useEditorContext();
  const [isExpanded, setIsExpanded] = useState(true);

  const node = document.nodes[nodeId];
  if (!node) return null;

  const isSelected = selectedIds.has(nodeId);
  const isVisible = node.visible !== false;
  const isLocked = node.locked === true;
  const isGroup = node.type === "Group";
  const hasChildren = isGroup && node.children && node.children.length > 0;
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

  return (
    <>
      <motion.div
        className={`flex items-center gap-1 px-2 py-1.5 cursor-pointer text-sm ${
          isSelected
            ? "bg-editor-selection-bg text-editor-selection"
            : "hover:bg-muted/50"
        } ${!isVisible ? "opacity-50" : ""} ${isEditing ? "ring-1 ring-blue-500/50" : ""}`}
        style={{ paddingLeft: 8 + depth * 12 }}
        onClick={(e) => {
          selectNode(nodeId, { addToSelection: e.shiftKey || e.metaKey || e.ctrlKey });
        }}
        onDoubleClick={handleDoubleClick}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.02 }}
      >
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
      </motion.div>

      {hasChildren && isExpanded && (
        <div>
          {[...node.children!].reverse().map((childId, childIndex) => (
            <LayerItem
              key={childId}
              nodeId={childId}
              depth={depth + 1}
              index={childIndex}
            />
          ))}
        </div>
      )}
    </>
  );
}

export function LayersPanel() {
  const { document } = useEditorContext();

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
          reversedIds.map((id, index) => (
            <LayerItem key={id} nodeId={id} index={index} />
          ))
        )}
      </div>
    </aside>
  );
}
