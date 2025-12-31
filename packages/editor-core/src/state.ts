import type { Command, ReorderDirection } from "./commands";
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
    case "group":
      return applyGroup(state, command.nodeIds, command.groupId);
    case "ungroup":
      return applyUngroup(state, command.groupId);
    case "reorder":
      return applyReorder(state, command.nodeIds, command.direction);
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

function getAbsolutePosition(
  nodes: Record<NodeId, NodeBase>,
  nodeId: NodeId
): Position {
  const node = nodes[nodeId];
  if (!node) return { x: 0, y: 0 };

  const parentId = findParentId(nodes, nodeId);
  if (!parentId) return node.position;

  const parentPos = getAbsolutePosition(nodes, parentId);
  return {
    x: parentPos.x + node.position.x,
    y: parentPos.y + node.position.y,
  };
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

    const isReparenting = parentId !== undefined && currentParentId !== targetParentId;

    if (isReparenting && !position && !delta) {
      const absPos = getAbsolutePosition(state.nodes, id);
      const newParentAbsPos = getAbsolutePosition(state.nodes, targetParentId);
      nodes[id] = {
        ...nodes[id],
        position: {
          x: absPos.x - newParentAbsPos.x,
          y: absPos.y - newParentAbsPos.y,
        },
      };
    }

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

function calculateBoundingBox(
  nodes: Record<NodeId, NodeBase>,
  nodeIds: NodeId[]
): { x: number; y: number; width: number; height: number } {
  const validNodes = nodeIds
    .map((id) => nodes[id])
    .filter(Boolean) as NodeBase[];

  if (validNodes.length === 0) {
    return { x: 0, y: 0, width: 100, height: 100 };
  }

  const minX = Math.min(...validNodes.map((n) => n.position.x));
  const minY = Math.min(...validNodes.map((n) => n.position.y));
  const maxX = Math.max(...validNodes.map((n) => n.position.x + n.size.width));
  const maxY = Math.max(...validNodes.map((n) => n.position.y + n.size.height));

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

function applyGroup(
  state: DocumentState,
  nodeIds: NodeId[],
  groupId: NodeId
): DocumentState {
  if (nodeIds.length < 2) return state;
  if (state.nodes[groupId]) return state;

  const validNodeIds = nodeIds.filter((id) => state.nodes[id] && id !== state.rootId);
  if (validNodeIds.length < 2) return state;

  const firstNodeId = validNodeIds[0];
  const commonParentId = findParentId(state.nodes, firstNodeId) ?? state.rootId;
  const parentChildren = state.nodes[commonParentId]?.children ?? [];

  const sortedNodeIds = [...validNodeIds].sort((a, b) => {
    return parentChildren.indexOf(a) - parentChildren.indexOf(b);
  });

  const indices = sortedNodeIds.map((id) => parentChildren.indexOf(id)).filter((i) => i !== -1);
  const maxIndex = indices.length > 0 ? Math.max(...indices) : parentChildren.length;

  const bounds = calculateBoundingBox(state.nodes, sortedNodeIds);

  const groupNode: NodeBase = {
    id: groupId,
    type: "Group",
    position: { x: bounds.x, y: bounds.y },
    size: { width: bounds.width, height: bounds.height },
    props: {},
    children: sortedNodeIds,
  };

  const nodes: Record<NodeId, NodeBase> = { ...state.nodes, [groupId]: groupNode };

  for (const nodeId of sortedNodeIds) {
    const parentId = findParentId(nodes, nodeId);
    if (parentId && nodes[parentId]) {
      const parent = nodes[parentId];
      const filtered = (parent.children ?? []).filter((cid) => cid !== nodeId);
      nodes[parentId] = { ...parent, children: filtered };
    }
  }

  const parent = nodes[commonParentId];
  const filteredChildren = (parent.children ?? []).filter((cid) => !sortedNodeIds.includes(cid));
  const insertIndex = Math.min(maxIndex - (sortedNodeIds.length - 1), filteredChildren.length);
  filteredChildren.splice(Math.max(0, insertIndex), 0, groupId);
  nodes[commonParentId] = { ...parent, children: filteredChildren };

  return { ...state, nodes };
}

function applyUngroup(state: DocumentState, groupId: NodeId): DocumentState {
  const group = state.nodes[groupId];
  if (!group || group.type !== "Group") return state;

  const children = group.children ?? [];
  const parentId = findParentId(state.nodes, groupId) ?? state.rootId;

  const nodes: Record<NodeId, NodeBase> = { ...state.nodes };

  delete nodes[groupId];

  const parent = nodes[parentId];
  const groupIndex = (parent.children ?? []).indexOf(groupId);
  const newChildren = (parent.children ?? []).filter((cid) => cid !== groupId);

  for (let i = 0; i < children.length; i++) {
    newChildren.splice(groupIndex + i, 0, children[i]);
  }

  nodes[parentId] = { ...parent, children: newChildren };

  return { ...state, nodes };
}

function applyReorder(
  state: DocumentState,
  nodeIds: NodeId[],
  direction: ReorderDirection
): DocumentState {
  if (nodeIds.length === 0) return state;

  const nodes = { ...state.nodes };

  const parentGroups = new Map<NodeId, NodeId[]>();
  for (const nodeId of nodeIds) {
    const parentId = findParentId(nodes, nodeId) ?? state.rootId;
    const group = parentGroups.get(parentId) ?? [];
    group.push(nodeId);
    parentGroups.set(parentId, group);
  }

  for (const [parentId, childNodeIds] of parentGroups) {
    const parent = nodes[parentId];
    if (!parent?.children) continue;

    const children = [...parent.children];

    const indices = childNodeIds
      .map((id) => children.indexOf(id))
      .filter((i) => i !== -1)
      .sort((a, b) => a - b);

    if (indices.length === 0) continue;

    switch (direction) {
      case "forward": {
        for (let i = indices.length - 1; i >= 0; i--) {
          const idx = indices[i];
          if (idx < children.length - 1) {
            [children[idx], children[idx + 1]] = [children[idx + 1], children[idx]];
          }
        }
        break;
      }
      case "backward": {
        for (let i = 0; i < indices.length; i++) {
          const idx = indices[i];
          if (idx > 0) {
            [children[idx], children[idx - 1]] = [children[idx - 1], children[idx]];
          }
        }
        break;
      }
      case "front": {
        const selected = childNodeIds.filter((id) => children.includes(id));
        const others = children.filter((id) => !childNodeIds.includes(id));
        children.length = 0;
        children.push(...others, ...selected);
        break;
      }
      case "back": {
        const selected = childNodeIds.filter((id) => children.includes(id));
        const others = children.filter((id) => !childNodeIds.includes(id));
        children.length = 0;
        children.push(...selected, ...others);
        break;
      }
    }

    nodes[parentId] = { ...parent, children };
  }

  return { ...state, nodes };
}
