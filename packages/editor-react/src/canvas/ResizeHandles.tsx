import React, { useCallback } from "react";
import type { Size, Position } from "@shadcn-mini/editor-core";

export interface ResizeHandlesProps {
  size: Size;
  zoom?: number;
  onResize: (newSize: Size, positionDelta: Position) => void;
}

type HandlePosition = "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w";

const HANDLE_SIZE = 8;

const handlePositions: Record<HandlePosition, React.CSSProperties> = {
  nw: { top: -HANDLE_SIZE / 2, left: -HANDLE_SIZE / 2, cursor: "nwse-resize" },
  n: { top: -HANDLE_SIZE / 2, left: "50%", marginLeft: -HANDLE_SIZE / 2, cursor: "ns-resize" },
  ne: { top: -HANDLE_SIZE / 2, right: -HANDLE_SIZE / 2, cursor: "nesw-resize" },
  e: { top: "50%", right: -HANDLE_SIZE / 2, marginTop: -HANDLE_SIZE / 2, cursor: "ew-resize" },
  se: { bottom: -HANDLE_SIZE / 2, right: -HANDLE_SIZE / 2, cursor: "nwse-resize" },
  s: { bottom: -HANDLE_SIZE / 2, left: "50%", marginLeft: -HANDLE_SIZE / 2, cursor: "ns-resize" },
  sw: { bottom: -HANDLE_SIZE / 2, left: -HANDLE_SIZE / 2, cursor: "nesw-resize" },
  w: { top: "50%", left: -HANDLE_SIZE / 2, marginTop: -HANDLE_SIZE / 2, cursor: "ew-resize" },
};

export function ResizeHandles({ size, zoom = 1, onResize }: ResizeHandlesProps) {
  const handleMouseDown = useCallback(
    (handle: HandlePosition) => (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();

      const startX = e.clientX;
      const startY = e.clientY;
      const startWidth = size.width;
      const startHeight = size.height;

      const handleMouseMove = (moveE: MouseEvent) => {
        const dx = (moveE.clientX - startX) / zoom;
        const dy = (moveE.clientY - startY) / zoom;

        let newWidth = startWidth;
        let newHeight = startHeight;
        let posX = 0;
        let posY = 0;

        if (handle.includes("e")) newWidth = startWidth + dx;
        if (handle.includes("w")) {
          newWidth = startWidth - dx;
          posX = dx;
        }
        if (handle.includes("s")) newHeight = startHeight + dy;
        if (handle.includes("n")) {
          newHeight = startHeight - dy;
          posY = dy;
        }

        const minSize = 20;
        if (newWidth < minSize) {
          if (handle.includes("w")) posX -= minSize - newWidth;
          newWidth = minSize;
        }
        if (newHeight < minSize) {
          if (handle.includes("n")) posY -= minSize - newHeight;
          newHeight = minSize;
        }

        onResize({ width: newWidth, height: newHeight }, { x: posX, y: posY });
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [size, zoom, onResize]
  );

  return (
    <>
      {(Object.keys(handlePositions) as HandlePosition[]).map((pos) => (
        <div
          key={pos}
          className="bg-editor-selection"
          style={{
            position: "absolute",
            width: HANDLE_SIZE,
            height: HANDLE_SIZE,
            border: "1px solid white",
            borderRadius: 2,
            ...handlePositions[pos],
          }}
          onMouseDown={handleMouseDown(pos)}
        />
      ))}
    </>
  );
}
