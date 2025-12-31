export type NodeId = string;

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface NodeBase {
  id: NodeId;
  type: string;
  position: Position;
  size: Size;
  props: Record<string, unknown>;
  children?: NodeId[];
  visible?: boolean;
  locked?: boolean;
}

export interface DocumentState {
  schemaVersion: number;
  rootId: NodeId;
  nodes: Record<NodeId, NodeBase>;
}

export const CONTAINER_TYPES = ["Group", "Card", "Frame"] as const;
export type ContainerType = (typeof CONTAINER_TYPES)[number];

export function isContainerType(type: string): type is ContainerType {
  return CONTAINER_TYPES.includes(type as ContainerType);
}

export function findParentId(
  nodes: Record<NodeId, NodeBase>,
  nodeId: NodeId
): NodeId | null {
  for (const [id, node] of Object.entries(nodes)) {
    if (node.children?.includes(nodeId)) {
      return id;
    }
  }
  return null;
}

export function isDescendantOf(
  nodes: Record<NodeId, NodeBase>,
  ancestorId: NodeId,
  nodeId: NodeId
): boolean {
  const ancestor = nodes[ancestorId];
  if (!ancestor?.children) return false;
  for (const childId of ancestor.children) {
    if (childId === nodeId) return true;
    if (isDescendantOf(nodes, childId, nodeId)) return true;
  }
  return false;
}
