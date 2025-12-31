import type { DocumentState, NodeId, NodeBase, Position } from "@shadcn-mini/editor-core";
import type { ReactNode } from "react";

export interface SelectOptions {
  addToSelection?: boolean;
}

export interface EditorState {
  document: DocumentState;
  selectedId: NodeId | null;
  selectedIds: Set<NodeId>;
}

export interface EditorActions {
  addNode: (type: string, position: Position) => NodeId;
  selectNode: (id: NodeId | null, options?: SelectOptions) => void;
  selectNodes: (ids: NodeId[]) => void;
  selectAll: () => void;
  clearSelection: () => void;
  moveNode: (id: NodeId, delta: Position) => void;
  moveSelectedNodes: (delta: Position) => void;
  updateNode: (id: NodeId, patch: Partial<Omit<NodeBase, "id">>) => void;
  deleteNode: (id: NodeId) => void;
  deleteSelectedNodes: () => void;
  duplicateNode: (id: NodeId) => NodeId;
  duplicateSelectedNodes: () => NodeId[];
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

export const TAILWIND_COLORS: PropSchemaOption[] = [
  { value: "", label: "Default" },
  { value: "gray-100", label: "Gray 100" },
  { value: "gray-300", label: "Gray 300" },
  { value: "gray-500", label: "Gray 500" },
  { value: "gray-700", label: "Gray 700" },
  { value: "gray-900", label: "Gray 900" },
  { value: "red-100", label: "Red 100" },
  { value: "red-300", label: "Red 300" },
  { value: "red-500", label: "Red 500" },
  { value: "red-700", label: "Red 700" },
  { value: "blue-100", label: "Blue 100" },
  { value: "blue-300", label: "Blue 300" },
  { value: "blue-500", label: "Blue 500" },
  { value: "blue-700", label: "Blue 700" },
  { value: "green-100", label: "Green 100" },
  { value: "green-500", label: "Green 500" },
  { value: "green-700", label: "Green 700" },
  { value: "yellow-100", label: "Yellow 100" },
  { value: "yellow-500", label: "Yellow 500" },
  { value: "purple-100", label: "Purple 100" },
  { value: "purple-500", label: "Purple 500" },
  { value: "purple-700", label: "Purple 700" },
];

export const COLOR_PROPS_SCHEMA: PropSchema[] = [
  {
    key: "textColor",
    label: "Text Color",
    type: "select",
    options: [
      { value: "", label: "Default" },
      ...TAILWIND_COLORS.filter(c => c.value).map(c => ({
        value: `text-${c.value}`,
        label: c.label,
      })),
    ],
    defaultValue: "",
  },
  {
    key: "bgColor",
    label: "Background",
    type: "select",
    options: [
      { value: "", label: "Default" },
      ...TAILWIND_COLORS.filter(c => c.value).map(c => ({
        value: `bg-${c.value}`,
        label: c.label,
      })),
    ],
    defaultValue: "",
  },
  {
    key: "borderColor",
    label: "Border",
    type: "select",
    options: [
      { value: "", label: "Default" },
      ...TAILWIND_COLORS.filter(c => c.value).map(c => ({
        value: `border-${c.value}`,
        label: c.label,
      })),
    ],
    defaultValue: "",
  },
];

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
    ...COLOR_PROPS_SCHEMA,
  ],
  Card: [
    { key: "title", label: "Title", type: "text", defaultValue: "Card Title" },
    { key: "description", label: "Description", type: "text", defaultValue: "Card description" },
    ...COLOR_PROPS_SCHEMA,
  ],
  Input: [
    { key: "placeholder", label: "Placeholder", type: "text", defaultValue: "Enter text..." },
    ...COLOR_PROPS_SCHEMA,
  ],
};
