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
