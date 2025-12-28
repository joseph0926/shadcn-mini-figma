import type { Command } from "./commands";
import type { DocumentState, NodeBase, NodeId, Position } from "./types";

export const DEFAULT_SCHEMA_VERSION = 1;

export interface CreateDocumentOptions {
  schemaVersion?: number;
  rootId?: NodeId;
  root?: NodeBase;
  nodes?: Record<NodeId, NodeBase>;
}

export function createDocumentState(
  options: CreateDocumentOptions = {}
): DocumentState {
  const rootId = options.rootId ?? options.root?.id ?? "root";
  const root: NodeBase =
    options.root ??
    ({
      id: rootId,
      type: "Root",
      position: { x: 0, y: 0 },
      size: { width: 0, height: 0 },
      props: {},
      children: [],
    } satisfies NodeBase);

  const nodes: Record<NodeId, NodeBase> = {
    [rootId]: root,
    ...(options.nodes ?? {}),
  };

  return {
    schemaVersion: options.schemaVersion ?? DEFAULT_SCHEMA_VERSION,
    rootId,
    nodes,
  };
}

export function applyCommand(
  state: DocumentState,
  command: Command
): DocumentState {
  switch (command.type) {
    case "add":
      return applyAdd(state, command.node, command.parentId, command.index);
    case "move":
      return applyMove(state, command.id, command.position, command.delta, command.parentId, command.index);
    case "update":
      return applyUpdate(state, command.id, command.patch);
    case "delete":
      return applyDelete(state, command.id);
    case "duplicate":
      return applyDuplicate(state, command.id, command.newId, command.position);
    default:
      return state;
  }
}

function applyAdd(
  state: DocumentState,
  node: NodeBase,
  parentId?: NodeId,
  index?: number
): DocumentState {
  if (state.nodes[node.id]) {
    return state;
  }

  const nodes = { ...state.nodes, [node.id]: node };
  const targetParentId = resolveParentId(nodes, state.rootId, parentId);
  const parent = nodes[targetParentId];
  const children = insertChild(parent.children ?? [], node.id, index);
  nodes[targetParentId] = { ...parent, children };

  return { ...state, nodes };
}

function applyMove(
  state: DocumentState,
  id: NodeId,
  position?: Position,
  delta?: Position,
  parentId?: NodeId,
  index?: number
): DocumentState {
  const node = state.nodes[id];
  if (!node) return state;

  let nextPosition = node.position;
  if (position) {
    nextPosition = position;
  } else if (delta) {
    nextPosition = { x: node.position.x + delta.x, y: node.position.y + delta.y };
  }

  const nodes = { ...state.nodes, [id]: { ...node, position: nextPosition } };

  if (parentId || index !== undefined) {
    const currentParentId = findParentId(nodes, id);
    const targetParentId = resolveParentId(nodes, state.rootId, parentId ?? currentParentId);

    if (currentParentId && nodes[currentParentId]) {
      const currentParent = nodes[currentParentId];
      const filtered = (currentParent.children ?? []).filter((childId) => childId !== id);
      nodes[currentParentId] = { ...currentParent, children: filtered };
    }

    if (targetParentId && nodes[targetParentId]) {
      const targetParent = nodes[targetParentId];
      const children = insertChild(targetParent.children ?? [], id, index);
      nodes[targetParentId] = { ...targetParent, children };
    }
  }

  return { ...state, nodes };
}

function applyUpdate(
  state: DocumentState,
  id: NodeId,
  patch: Partial<Omit<NodeBase, "id">>
): DocumentState {
  const node = state.nodes[id];
  if (!node) return state;

  const next: NodeBase = {
    ...node,
    ...patch,
    props: patch.props ? { ...node.props, ...patch.props } : node.props,
  };

  const nodes = { ...state.nodes, [id]: next };
  return { ...state, nodes };
}

function applyDelete(state: DocumentState, id: NodeId): DocumentState {
  if (id === state.rootId) return state;
  if (!state.nodes[id]) return state;

  const idsToDelete = new Set<NodeId>();
  collectIds(state.nodes, id, idsToDelete);

  const nodes: Record<NodeId, NodeBase> = { ...state.nodes };
  for (const deleteId of idsToDelete) {
    delete nodes[deleteId];
  }

  const parentId = findParentId(nodes, id);
  if (parentId && nodes[parentId]) {
    const parent = nodes[parentId];
    const children = (parent.children ?? []).filter((childId) => childId !== id);
    nodes[parentId] = { ...parent, children };
  }

  return { ...state, nodes };
}

function applyDuplicate(
  state: DocumentState,
  id: NodeId,
  newId: NodeId,
  position?: Position
): DocumentState {
  if (state.nodes[newId]) return state;
  const source = state.nodes[id];
  if (!source) return state;

  const duplicate: NodeBase = {
    ...source,
    id: newId,
    position: position ?? source.position,
    children: source.children ? [] : source.children,
  };

  const nodes = { ...state.nodes, [newId]: duplicate };
  const parentId = findParentId(nodes, id) ?? state.rootId;
  if (parentId && nodes[parentId]) {
    const parent = nodes[parentId];
    const children = insertChild(parent.children ?? [], newId, undefined, id);
    nodes[parentId] = { ...parent, children };
  }

  return { ...state, nodes };
}

function insertChild(
  children: NodeId[],
  id: NodeId,
  index?: number,
  afterId?: NodeId
): NodeId[] {
  const next = children.filter((childId) => childId !== id);

  if (afterId) {
    const afterIndex = next.indexOf(afterId);
    const insertAt = afterIndex === -1 ? next.length : afterIndex + 1;
    next.splice(insertAt, 0, id);
    return next;
  }

  if (typeof index === "number") {
    const insertAt = Math.max(0, Math.min(index, next.length));
    next.splice(insertAt, 0, id);
    return next;
  }

  next.push(id);
  return next;
}

function resolveParentId(
  nodes: Record<NodeId, NodeBase>,
  rootId: NodeId,
  preferredParentId?: NodeId
): NodeId {
  if (preferredParentId && nodes[preferredParentId]) {
    return preferredParentId;
  }
  if (nodes[rootId]) {
    return rootId;
  }
  throw new Error("Invalid document state: root node is missing.");
}

function findParentId(nodes: Record<NodeId, NodeBase>, id: NodeId): NodeId | undefined {
  for (const [nodeId, node] of Object.entries(nodes)) {
    if (node.children?.includes(id)) {
      return nodeId;
    }
  }
  return undefined;
}

function collectIds(
  nodes: Record<NodeId, NodeBase>,
  id: NodeId,
  bucket: Set<NodeId>
): void {
  if (bucket.has(id)) return;
  bucket.add(id);
  const node = nodes[id];
  if (!node?.children) return;
  for (const childId of node.children) {
    collectIds(nodes, childId, bucket);
  }
}
