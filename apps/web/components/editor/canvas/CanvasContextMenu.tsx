"use client";

import { type ReactNode } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useEditorContext } from "@shadcn-mini/editor-react";

interface CanvasContextMenuProps {
  children: ReactNode;
}

export function CanvasContextMenu({ children }: CanvasContextMenuProps) {
  const {
    selectedIds,
    deleteSelectedNodes,
    duplicateSelectedNodes,
    copySelectedNodes,
    cutSelectedNodes,
    pasteNodes,
    groupSelectedNodes,
    ungroupSelectedNodes,
    bringForward,
    sendBackward,
    bringToFront,
    sendToBack,
    document,
  } = useEditorContext();

  const hasSelection = selectedIds.size > 0;
  const canGroup = selectedIds.size >= 2;

  const hasGroupSelected = Array.from(selectedIds).some(
    (id) => document.nodes[id]?.type === "Group"
  );

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuItem onClick={cutSelectedNodes} disabled={!hasSelection}>
          Cut
          <ContextMenuShortcut>⌘X</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem onClick={copySelectedNodes} disabled={!hasSelection}>
          Copy
          <ContextMenuShortcut>⌘C</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem onClick={() => pasteNodes()}>
          Paste
          <ContextMenuShortcut>⌘V</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => duplicateSelectedNodes()}
          disabled={!hasSelection}
        >
          Duplicate
          <ContextMenuShortcut>⌘D</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem
          onClick={deleteSelectedNodes}
          disabled={!hasSelection}
          variant="destructive"
        >
          Delete
          <ContextMenuShortcut>⌫</ContextMenuShortcut>
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuItem onClick={bringForward} disabled={!hasSelection}>
          Bring Forward
          <ContextMenuShortcut>⌘]</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem onClick={sendBackward} disabled={!hasSelection}>
          Send Backward
          <ContextMenuShortcut>⌘[</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem onClick={bringToFront} disabled={!hasSelection}>
          Bring to Front
          <ContextMenuShortcut>⌘⇧]</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem onClick={sendToBack} disabled={!hasSelection}>
          Send to Back
          <ContextMenuShortcut>⌘⇧[</ContextMenuShortcut>
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuItem
          onClick={() => groupSelectedNodes()}
          disabled={!canGroup}
        >
          Group
          <ContextMenuShortcut>⌘G</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem
          onClick={ungroupSelectedNodes}
          disabled={!hasGroupSelected}
        >
          Ungroup
          <ContextMenuShortcut>⌘⇧G</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
