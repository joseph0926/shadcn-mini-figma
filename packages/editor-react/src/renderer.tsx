import React from "react";
import type { DocumentState, NodeBase, NodeId } from "@shadcn-mini/editor-core";
import type { RendererRegistry } from "./types";

export interface RendererProps {
  document: DocumentState;
  registry: RendererRegistry;
  selectedId?: NodeId | null;
  className?: string;
}

export function Renderer({
  document,
  registry,
  selectedId,
  className,
}: RendererProps): React.ReactElement | null {
  const root = document.nodes[document.rootId];
  if (!root) return null;

  return (
    <div data-root-id={document.rootId} className={className}>
      {renderChildren(root, document, registry, selectedId)}
    </div>
  );
}

function renderChildren(
  parent: NodeBase,
  document: DocumentState,
  registry: RendererRegistry,
  selectedId?: NodeId | null
): React.ReactElement[] {
  const children = parent.children ?? [];
  return children
    .map((childId) => document.nodes[childId])
    .filter(Boolean)
    .map((child) => renderNode(child, document, registry, selectedId));
}

function renderNode(
  node: NodeBase,
  document: DocumentState,
  registry: RendererRegistry,
  selectedId?: NodeId | null
): React.ReactElement {
  const RendererComponent = registry[node.type];
  const isSelected = node.id === selectedId;

  const content = RendererComponent
    ? RendererComponent({ node, isSelected })
    : null;

  if (!content) {
    return (
      <div key={node.id} data-node-id={node.id}>
        {renderChildren(node, document, registry, selectedId)}
      </div>
    );
  }

  return (
    <div key={node.id} data-node-id={node.id}>
      {content}
      {renderChildren(node, document, registry, selectedId)}
    </div>
  );
}
