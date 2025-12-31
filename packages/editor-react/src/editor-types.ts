import type { DocumentState, NodeId, NodeBase, Position } from "@shadcn-mini/editor-core";
import type { ReactNode } from "react";

export interface EditorState {
  document: DocumentState;
  selectedId: NodeId | null;
}

export interface EditorActions {
  addNode: (type: string, position: Position) => NodeId;
  selectNode: (id: NodeId | null) => void;
  moveNode: (id: NodeId, delta: Position) => void;
  updateNode: (id: NodeId, patch: Partial<Omit<NodeBase, "id">>) => void;
  deleteNode: (id: NodeId) => void;
  duplicateNode: (id: NodeId) => NodeId;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
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
  Button: { label: "Button", variant: "default", size: "default" },
  Card: { title: "Card Title", description: "Card description" },
  Input: { placeholder: "Enter text..." },
};

export interface PropSchemaOption {
  value: string;
  label: string;
}

export interface PropSchema {
  key: string;
  label: string;
  type: "text" | "select" | "number" | "boolean";
  options?: PropSchemaOption[];
  defaultValue?: unknown;
}

export const COMPONENT_SCHEMAS: Record<string, PropSchema[]> = {
  Button: [
    { key: "label", label: "Label", type: "text", defaultValue: "Button" },
    {
      key: "variant",
      label: "Variant",
      type: "select",
      options: [
        { value: "default", label: "Default" },
        { value: "destructive", label: "Destructive" },
        { value: "outline", label: "Outline" },
        { value: "secondary", label: "Secondary" },
        { value: "ghost", label: "Ghost" },
        { value: "link", label: "Link" },
      ],
      defaultValue: "default",
    },
    {
      key: "size",
      label: "Size",
      type: "select",
      options: [
        { value: "default", label: "Default" },
        { value: "sm", label: "Small" },
        { value: "lg", label: "Large" },
        { value: "icon", label: "Icon" },
      ],
      defaultValue: "default",
    },
  ],
  Card: [
    { key: "title", label: "Title", type: "text", defaultValue: "Card Title" },
    { key: "description", label: "Description", type: "text", defaultValue: "Card description" },
  ],
  Input: [
    { key: "placeholder", label: "Placeholder", type: "text", defaultValue: "Enter text..." },
  ],
};
