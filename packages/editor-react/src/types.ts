import type { NodeBase } from "@shadcn-mini/editor-core";
import type { ReactElement } from "react";

export interface NodeRendererProps<TNode extends NodeBase = NodeBase> {
  node: TNode;
  isSelected: boolean;
}

export type NodeRenderer<TNode extends NodeBase = NodeBase> = (
  props: NodeRendererProps<TNode>
) => ReactElement | null;

export type RendererRegistry = Record<string, NodeRenderer>;
