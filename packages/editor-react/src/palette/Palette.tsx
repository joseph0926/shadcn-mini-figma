import React from "react";
import { motion } from "motion/react";
import { useDraggable } from "@dnd-kit/core";
import type { PaletteItem, DraggableData } from "../editor-types";

export interface PaletteProps {
  items: PaletteItem[];
  className?: string;
}

export function Palette({ items, className }: PaletteProps) {
  return (
    <div className={`flex flex-col h-full ${className ?? ""}`}>
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-sm font-medium">Components</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        <div className="grid gap-2">
          {items.map((item) => (
            <PaletteItemDraggable key={item.type} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

interface PaletteItemDraggableProps {
  item: PaletteItem;
}

function PaletteItemDraggable({ item }: PaletteItemDraggableProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${item.type}`,
    data: { type: "palette-item", nodeType: item.type } satisfies DraggableData,
  });

  return (
    <motion.div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`
        flex items-center gap-3 px-3 py-2.5
        border border-border rounded-lg
        cursor-grab select-none
        bg-background
        hover:bg-accent
        transition-colors
        ${isDragging ? "opacity-50 cursor-grabbing" : ""}
      `}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex items-center justify-center w-8 h-8 rounded-md bg-muted">
        {item.icon}
      </div>
      <span className="text-sm font-medium">{item.label}</span>
    </motion.div>
  );
}
