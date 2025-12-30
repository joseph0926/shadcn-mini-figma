import React from "react";
import type { DocumentState } from "@shadcn-mini/editor-core";
import type { DraggableData } from "../editor-types";
import type { RendererRegistry } from "../types";
import { DEFAULT_SIZES } from "../editor-types";

export interface DragPreviewProps {
  data: DraggableData;
  document: DocumentState;
  registry: RendererRegistry;
}

export function DragPreview({ data, document, registry }: DragPreviewProps) {
  if (data.type === "palette-item") {
    const size = DEFAULT_SIZES[data.nodeType] ?? { width: 100, height: 40 };

    return (
      <div
        style={{
          width: size.width,
          height: size.height,
          backgroundColor: "hsl(217, 91%, 97%)",
          border: "2px solid hsl(217, 91%, 60%)",
          borderRadius: "6px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "12px",
          color: "hsl(217, 91%, 40%)",
          fontWeight: 500,
          boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
          opacity: 0.9,
        }}
      >
        {data.nodeType}
      </div>
    );
  }

  if (data.type === "canvas-node") {
    const node = document.nodes[data.nodeId];
    if (!node) return null;

    const Renderer = registry[node.type];

    return (
      <div
        style={{
          opacity: 0.9,
          boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
          borderRadius: "6px",
          outline: "2px solid hsl(217, 91%, 60%)",
          outlineOffset: "2px",
        }}
      >
        {Renderer ? <Renderer node={node} isSelected={false} /> : null}
      </div>
    );
  }

  return null;
}
