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
  Text: { width: 120, height: 32 },
  Badge: { width: 80, height: 32 },
  Avatar: { width: 48, height: 48 },
  Separator: { width: 200, height: 4 },
};

export const DEFAULT_PROPS: Record<string, Record<string, unknown>> = {
  Button: { label: "Button", variant: "default", size: "default" },
  Card: { title: "Card Title", description: "Card description" },
  Input: { placeholder: "Enter text..." },
  Text: { content: "Text", fontSize: "base", fontWeight: "normal", textAlign: "left" },
  Badge: { content: "Badge", variant: "default" },
  Avatar: { src: "", fallback: "AB" },
  Separator: { orientation: "horizontal" },
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

export const DEFAULT_VALUE = "__default__";

export const TAILWIND_COLORS: PropSchemaOption[] = [
  { value: DEFAULT_VALUE, label: "Default" },
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
      { value: DEFAULT_VALUE, label: "Default" },
      ...TAILWIND_COLORS.filter(c => c.value !== DEFAULT_VALUE).map(c => ({
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
      { value: DEFAULT_VALUE, label: "Default" },
      ...TAILWIND_COLORS.filter(c => c.value !== DEFAULT_VALUE).map(c => ({
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
      { value: DEFAULT_VALUE, label: "Default" },
      ...TAILWIND_COLORS.filter(c => c.value !== DEFAULT_VALUE).map(c => ({
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
  Text: [
    { key: "content", label: "Content", type: "text", defaultValue: "Text" },
    {
      key: "fontSize",
      label: "Font Size",
      type: "select",
      options: [
        { value: "xs", label: "XS" },
        { value: "sm", label: "Small" },
        { value: "base", label: "Base" },
        { value: "lg", label: "Large" },
        { value: "xl", label: "XL" },
        { value: "2xl", label: "2XL" },
        { value: "3xl", label: "3XL" },
      ],
      defaultValue: "base",
    },
    {
      key: "fontWeight",
      label: "Weight",
      type: "select",
      options: [
        { value: "light", label: "Light" },
        { value: "normal", label: "Normal" },
        { value: "medium", label: "Medium" },
        { value: "semibold", label: "Semibold" },
        { value: "bold", label: "Bold" },
      ],
      defaultValue: "normal",
    },
    {
      key: "textAlign",
      label: "Align",
      type: "select",
      options: [
        { value: "left", label: "Left" },
        { value: "center", label: "Center" },
        { value: "right", label: "Right" },
      ],
      defaultValue: "left",
    },
    ...COLOR_PROPS_SCHEMA,
  ],
  Badge: [
    { key: "content", label: "Content", type: "text", defaultValue: "Badge" },
    {
      key: "variant",
      label: "Variant",
      type: "select",
      options: [
        { value: "default", label: "Default" },
        { value: "secondary", label: "Secondary" },
        { value: "destructive", label: "Destructive" },
        { value: "outline", label: "Outline" },
      ],
      defaultValue: "default",
    },
    ...COLOR_PROPS_SCHEMA,
  ],
  Avatar: [
    { key: "src", label: "Image URL", type: "text", defaultValue: "" },
    { key: "fallback", label: "Fallback", type: "text", defaultValue: "AB" },
    ...COLOR_PROPS_SCHEMA,
  ],
  Separator: [
    {
      key: "orientation",
      label: "Orientation",
      type: "select",
      options: [
        { value: "horizontal", label: "Horizontal" },
        { value: "vertical", label: "Vertical" },
      ],
      defaultValue: "horizontal",
    },
    ...COLOR_PROPS_SCHEMA,
  ],
};
