import type { NodeBase, NodeId, Position } from "./types";

export type CommandType = "add" | "move" | "update" | "delete" | "duplicate" | "group" | "ungroup" | "reorder";

export type ReorderDirection = "forward" | "backward" | "front" | "back";

export interface AddNodeCommand {
  type: "add";
  node: NodeBase;
  parentId?: NodeId;
  index?: number;
}

export interface MoveNodeCommand {
  type: "move";
  id: NodeId;
  position?: Position;
  delta?: Position;
  parentId?: NodeId;
  index?: number;
}

export interface UpdateNodeCommand {
  type: "update";
  id: NodeId;
  patch: Partial<Omit<NodeBase, "id">>;
}

export interface DeleteNodeCommand {
  type: "delete";
  id: NodeId;
}

export interface DuplicateNodeCommand {
  type: "duplicate";
  id: NodeId;
  newId: NodeId;
  position?: Position;
}

export interface GroupNodeCommand {
  type: "group";
  nodeIds: NodeId[];
  groupId: NodeId;
}

export interface UngroupNodeCommand {
  type: "ungroup";
  groupId: NodeId;
}

export interface ReorderNodeCommand {
  type: "reorder";
  nodeIds: NodeId[];
  direction: ReorderDirection;
}

export type Command =
  | AddNodeCommand
  | MoveNodeCommand
  | UpdateNodeCommand
  | DeleteNodeCommand
  | DuplicateNodeCommand
  | GroupNodeCommand
  | UngroupNodeCommand
  | ReorderNodeCommand;
