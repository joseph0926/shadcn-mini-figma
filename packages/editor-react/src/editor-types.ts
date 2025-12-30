import type { DocumentState, NodeId, Position } from "@shadcn-mini/editor-core";
import type { ReactNode } from "react";

export interface EditorState {
  document: DocumentState;
  selectedId: NodeId | null;
}

export interface EditorActions {
  addNode: (type: string, position: Position) => NodeId;
  selectNode: (id: NodeId | null) => void;
  moveNode: (id: NodeId, delta: Position) => void;
}

export type DraggableData =
  | { type: "palette-item"; nodeType: string }
  | { type: "canvas-node"; nodeId: NodeId };

export interface DroppableData {
  type: "canvas";
}

export interface PaletteItem {
  type: string;
  label: string;
  icon?: ReactNode;
}

export const DEFAULT_SIZES: Record<string, { width: number; height: number }> = {
  Button: { width: 100, height: 40 },
  Card: { width: 300, height: 200 },
  Input: { width: 200, height: 40 },
};

export const DEFAULT_PROPS: Record<string, Record<string, unknown>> = {
  Button: { label: "Button", variant: "default" },
  Card: { title: "Card Title", description: "Card description" },
  Input: { placeholder: "Enter text..." },
};
