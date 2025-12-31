import React from "react";
import type { Guide } from "../hooks/useSnapping";

export interface GuidelinesProps {
  guides: Guide[];
  zoom?: number;
}

export function Guidelines({ guides, zoom = 1 }: GuidelinesProps) {
  if (guides.length === 0) return null;

  return (
    <>
      {guides.map((guide, index) => {
        if (guide.type === "vertical") {
          return (
            <div
              key={`v-${index}`}
              className="absolute pointer-events-none bg-editor-selection"
              style={{
                left: guide.position * zoom,
                top: guide.start * zoom,
                width: 1,
                height: (guide.end - guide.start) * zoom,
              }}
            />
          );
        }
        return (
          <div
            key={`h-${index}`}
            className="absolute pointer-events-none bg-editor-selection"
            style={{
              left: guide.start * zoom,
              top: guide.position * zoom,
              width: (guide.end - guide.start) * zoom,
              height: 1,
            }}
          />
        );
      })}
    </>
  );
}
