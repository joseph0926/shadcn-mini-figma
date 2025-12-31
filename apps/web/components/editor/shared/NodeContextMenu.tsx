"use client";

import React, { useRef, useEffect, useCallback } from "react";
import { useEditorContext } from "@shadcn-mini/editor-react";

interface MenuPosition {
  x: number;
  y: number;
}

interface NodeContextMenuProps {
  open: boolean;
  position: MenuPosition;
  onClose: () => void;
}

export function NodeContextMenu({ open, position, onClose }: NodeContextMenuProps) {
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

  const menuRef = useRef<HTMLDivElement>(null);

  const handleAction = useCallback((action: () => void) => {
    action();
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  if (!open) return null;

  const hasSelection = selectedIds.size > 0;
  const canGroup = selectedIds.size >= 2;

  const hasGroupSelected = Array.from(selectedIds).some(
    (id) => document.nodes[id]?.type === "Group"
  );

  const menuItems = [
    { label: "Cut", shortcut: "⌘X", action: cutSelectedNodes, disabled: !hasSelection },
    { label: "Copy", shortcut: "⌘C", action: copySelectedNodes, disabled: !hasSelection },
    { label: "Paste", shortcut: "⌘V", action: () => pasteNodes(), disabled: false },
    { label: "Duplicate", shortcut: "⌘D", action: () => duplicateSelectedNodes(), disabled: !hasSelection },
    { label: "Delete", shortcut: "⌫", action: deleteSelectedNodes, disabled: !hasSelection, destructive: true },
    { separator: true },
    { label: "Bring Forward", shortcut: "⌘]", action: bringForward, disabled: !hasSelection },
    { label: "Send Backward", shortcut: "⌘[", action: sendBackward, disabled: !hasSelection },
    { label: "Bring to Front", shortcut: "⌘⇧]", action: bringToFront, disabled: !hasSelection },
    { label: "Send to Back", shortcut: "⌘⇧[", action: sendToBack, disabled: !hasSelection },
    { separator: true },
    { label: "Group", shortcut: "⌘G", action: () => groupSelectedNodes(), disabled: !canGroup },
    { label: "Ungroup", shortcut: "⌘⇧G", action: ungroupSelectedNodes, disabled: !hasGroupSelected },
  ];

  return (
    <div
      ref={menuRef}
      className="fixed z-50 min-w-32 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95"
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      {menuItems.map((item, index) => {
        if ("separator" in item) {
          return <div key={index} className="bg-border -mx-1 my-1 h-px" />;
        }

        return (
          <button
            key={item.label}
            className={`relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors ${
              item.disabled
                ? "pointer-events-none opacity-50"
                : item.destructive
                ? "text-destructive focus:bg-destructive/10 focus:text-destructive"
                : "focus:bg-accent focus:text-accent-foreground"
            }`}
            onClick={() => !item.disabled && handleAction(item.action)}
            disabled={item.disabled}
          >
            {item.label}
            <span className="ml-auto text-xs tracking-widest text-muted-foreground">
              {item.shortcut}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function useContextMenu() {
  const [open, setOpen] = React.useState(false);
  const [position, setPosition] = React.useState<MenuPosition>({ x: 0, y: 0 });

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setPosition({ x: e.clientX, y: e.clientY });
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  return {
    open,
    position,
    handleContextMenu,
    handleClose,
  };
}
