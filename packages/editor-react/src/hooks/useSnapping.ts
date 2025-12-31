import { useMemo, useCallback } from "react";
import type { DocumentState, NodeId, Position, Size } from "@shadcn-mini/editor-core";

export interface Guide {
  type: "vertical" | "horizontal";
  position: number;
  start: number;
  end: number;
}

export interface SnapResult {
  position: Position;
  guides: Guide[];
}

interface SnapLine {
  value: number;
  nodeId: NodeId;
}

export function useSnapping(
  document: DocumentState,
  excludeIds: Set<NodeId>,
  threshold: number = 5
) {
  const snapLines = useMemo(() => {
    const verticalLines: SnapLine[] = [];
    const horizontalLines: SnapLine[] = [];

    const rootNode = document.nodes[document.rootId];
    const childIds = rootNode?.children ?? [];

    for (const id of childIds) {
      if (excludeIds.has(id)) continue;
      const node = document.nodes[id];
      if (!node) continue;

      const left = node.position.x;
      const centerX = node.position.x + node.size.width / 2;
      const right = node.position.x + node.size.width;
      const top = node.position.y;
      const centerY = node.position.y + node.size.height / 2;
      const bottom = node.position.y + node.size.height;

      verticalLines.push(
        { value: left, nodeId: id },
        { value: centerX, nodeId: id },
        { value: right, nodeId: id }
      );

      horizontalLines.push(
        { value: top, nodeId: id },
        { value: centerY, nodeId: id },
        { value: bottom, nodeId: id }
      );
    }

    return { verticalLines, horizontalLines };
  }, [document, excludeIds]);

  const snap = useCallback(
    (position: Position, size: Size): SnapResult => {
      const guides: Guide[] = [];
      let snappedX = position.x;
      let snappedY = position.y;

      const sourceLeft = position.x;
      const sourceCenterX = position.x + size.width / 2;
      const sourceRight = position.x + size.width;
      const sourceTop = position.y;
      const sourceCenterY = position.y + size.height / 2;
      const sourceBottom = position.y + size.height;

      let minDeltaX = Infinity;
      for (const line of snapLines.verticalLines) {
        const checkPoints = [
          { source: sourceLeft, offset: 0 },
          { source: sourceCenterX, offset: size.width / 2 },
          { source: sourceRight, offset: size.width },
        ];

        for (const { source, offset } of checkPoints) {
          const delta = Math.abs(source - line.value);
          if (delta < threshold && delta < minDeltaX) {
            minDeltaX = delta;
            snappedX = line.value - offset;

            const targetNode = document.nodes[line.nodeId];
            if (targetNode) {
              guides.push({
                type: "vertical",
                position: line.value,
                start: Math.min(sourceTop, targetNode.position.y),
                end: Math.max(sourceBottom, targetNode.position.y + targetNode.size.height),
              });
            }
          }
        }
      }

      let minDeltaY = Infinity;
      for (const line of snapLines.horizontalLines) {
        const checkPoints = [
          { source: sourceTop, offset: 0 },
          { source: sourceCenterY, offset: size.height / 2 },
          { source: sourceBottom, offset: size.height },
        ];

        for (const { source, offset } of checkPoints) {
          const delta = Math.abs(source - line.value);
          if (delta < threshold && delta < minDeltaY) {
            minDeltaY = delta;
            snappedY = line.value - offset;

            const targetNode = document.nodes[line.nodeId];
            if (targetNode) {
              guides.push({
                type: "horizontal",
                position: line.value,
                start: Math.min(sourceLeft, targetNode.position.x),
                end: Math.max(sourceRight, targetNode.position.x + targetNode.size.width),
              });
            }
          }
        }
      }

      return {
        position: { x: snappedX, y: snappedY },
        guides,
      };
    },
    [snapLines, threshold, document.nodes]
  );

  return { snap };
}
