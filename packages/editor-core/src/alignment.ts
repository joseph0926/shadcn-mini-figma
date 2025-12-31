import type { NodeBase, NodeId, Position } from "./types";

export type AlignmentType = "left" | "center" | "right" | "top" | "middle" | "bottom";
export type DistributionType = "horizontal" | "vertical";

export function alignNodes(
  nodes: NodeBase[],
  type: AlignmentType
): Map<NodeId, Position> {
  const result = new Map<NodeId, Position>();
  if (nodes.length < 2) return result;

  let targetValue: number;

  switch (type) {
    case "left":
      targetValue = Math.min(...nodes.map((n) => n.position.x));
      for (const node of nodes) {
        result.set(node.id, { x: targetValue, y: node.position.y });
      }
      break;
    case "center": {
      const centers = nodes.map((n) => n.position.x + n.size.width / 2);
      targetValue = (Math.min(...centers) + Math.max(...centers)) / 2;
      for (const node of nodes) {
        result.set(node.id, {
          x: targetValue - node.size.width / 2,
          y: node.position.y,
        });
      }
      break;
    }
    case "right":
      targetValue = Math.max(...nodes.map((n) => n.position.x + n.size.width));
      for (const node of nodes) {
        result.set(node.id, {
          x: targetValue - node.size.width,
          y: node.position.y,
        });
      }
      break;
    case "top":
      targetValue = Math.min(...nodes.map((n) => n.position.y));
      for (const node of nodes) {
        result.set(node.id, { x: node.position.x, y: targetValue });
      }
      break;
    case "middle": {
      const middles = nodes.map((n) => n.position.y + n.size.height / 2);
      targetValue = (Math.min(...middles) + Math.max(...middles)) / 2;
      for (const node of nodes) {
        result.set(node.id, {
          x: node.position.x,
          y: targetValue - node.size.height / 2,
        });
      }
      break;
    }
    case "bottom":
      targetValue = Math.max(...nodes.map((n) => n.position.y + n.size.height));
      for (const node of nodes) {
        result.set(node.id, {
          x: node.position.x,
          y: targetValue - node.size.height,
        });
      }
      break;
  }

  return result;
}

export function distributeNodes(
  nodes: NodeBase[],
  type: DistributionType
): Map<NodeId, Position> {
  const result = new Map<NodeId, Position>();
  if (nodes.length < 3) return result;

  const sorted = [...nodes].sort((a, b) => {
    if (type === "horizontal") {
      return a.position.x - b.position.x;
    }
    return a.position.y - b.position.y;
  });

  if (type === "horizontal") {
    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    const startX = first.position.x + first.size.width / 2;
    const endX = last.position.x + last.size.width / 2;
    const totalSpace = endX - startX;
    const step = totalSpace / (nodes.length - 1);

    for (let i = 0; i < sorted.length; i++) {
      const node = sorted[i];
      const centerX = startX + step * i;
      result.set(node.id, {
        x: centerX - node.size.width / 2,
        y: node.position.y,
      });
    }
  } else {
    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    const startY = first.position.y + first.size.height / 2;
    const endY = last.position.y + last.size.height / 2;
    const totalSpace = endY - startY;
    const step = totalSpace / (nodes.length - 1);

    for (let i = 0; i < sorted.length; i++) {
      const node = sorted[i];
      const centerY = startY + step * i;
      result.set(node.id, {
        x: node.position.x,
        y: centerY - node.size.height / 2,
      });
    }
  }

  return result;
}
