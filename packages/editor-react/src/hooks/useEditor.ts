import { useState, useCallback, useMemo } from "react";
import {
  type DocumentState,
  type NodeId,
  type NodeBase,
  type Position,
  type AlignmentType,
  type DistributionType,
  serializeDocument,
  deserializeDocument,
  alignNodes,
  distributeNodes,
} from "@shadcn-mini/editor-core";
import { nanoid } from "nanoid";
import { useEditorHistory } from "./useEditorHistory";
import { DEFAULT_SIZES, DEFAULT_PROPS, type SelectOptions } from "../editor-types";

export interface UseEditorReturn {
  document: DocumentState;
  selectedId: NodeId | null;
  selectedIds: Set<NodeId>;
  addNode: (type: string, position: Position) => NodeId;
  selectNode: (id: NodeId | null, options?: SelectOptions) => void;
  selectNodes: (ids: NodeId[]) => void;
  selectAll: () => void;
  clearSelection: () => void;
  moveNode: (id: NodeId, delta: Position) => void;
  moveSelectedNodes: (delta: Position) => void;
  updateNode: (id: NodeId, patch: Partial<Omit<NodeBase, "id">>) => void;
  deleteNode: (id: NodeId) => void;
  deleteSelectedNodes: () => void;
  duplicateNode: (id: NodeId) => NodeId;
  duplicateSelectedNodes: () => NodeId[];
  alignSelection: (type: AlignmentType) => void;
  distributeSelection: (type: DistributionType) => void;
  toggleVisibility: (id: NodeId) => void;
  toggleLock: (id: NodeId) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  zoom: number;
  setZoom: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  gridEnabled: boolean;
  setGridEnabled: (enabled: boolean) => void;
  gridSize: number;
  setGridSize: (size: number) => void;
  snapToGrid: (position: Position) => Position;
  clipboard: NodeBase[];
  copySelectedNodes: () => void;
  pasteNodes: () => NodeId[];
  cutSelectedNodes: () => void;
  saveDocument: () => string;
  loadDocument: (json: string) => void;
}

export function useEditor(initialDocument?: DocumentState): UseEditorReturn {
  const { document, dispatch, undo, redo, reset, canUndo, canRedo } =
    useEditorHistory(initialDocument);
  const [selectedIdsState, setSelectedIdsState] = useState<Set<NodeId>>(new Set());
  const [zoom, setZoomState] = useState(1);
  const [gridEnabled, setGridEnabled] = useState(false);
  const [gridSize, setGridSize] = useState(16);
  const [clipboard, setClipboard] = useState<NodeBase[]>([]);

  const selectedId = useMemo(() => {
    const arr = Array.from(selectedIdsState);
    return arr.length > 0 ? arr[0] : null;
  }, [selectedIdsState]);

  const setZoom = useCallback((z: number) => {
    setZoomState(Math.max(0.25, Math.min(4, z)));
  }, []);

  const zoomIn = useCallback(() => {
    setZoomState((prev) => Math.min(4, prev + 0.1));
  }, []);

  const zoomOut = useCallback(() => {
    setZoomState((prev) => Math.max(0.25, prev - 0.1));
  }, []);

  const snapToGrid = useCallback(
    (position: Position): Position => {
      if (!gridEnabled) return position;
      return {
        x: Math.round(position.x / gridSize) * gridSize,
        y: Math.round(position.y / gridSize) * gridSize,
      };
    },
    [gridEnabled, gridSize]
  );

  const addNode = useCallback(
    (type: string, position: Position): NodeId => {
      const id = nanoid();
      dispatch({
        type: "add",
        node: {
          id,
          type,
          position,
          size: DEFAULT_SIZES[type] ?? { width: 100, height: 40 },
          props: DEFAULT_PROPS[type] ?? {},
        },
      });
      setSelectedIdsState(new Set([id]));
      return id;
    },
    [dispatch]
  );

  const selectNode = useCallback((id: NodeId | null, options?: SelectOptions) => {
    if (id === null) {
      setSelectedIdsState(new Set());
      return;
    }
    if (options?.addToSelection) {
      setSelectedIdsState((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        return next;
      });
    } else {
      setSelectedIdsState(new Set([id]));
    }
  }, []);

  const selectNodes = useCallback((ids: NodeId[]) => {
    setSelectedIdsState(new Set(ids));
  }, []);

  const selectAll = useCallback(() => {
    const rootNode = document.nodes[document.rootId];
    const childIds = rootNode?.children ?? [];
    setSelectedIdsState(new Set(childIds));
  }, [document]);

  const clearSelection = useCallback(() => {
    setSelectedIdsState(new Set());
  }, []);

  const moveNode = useCallback(
    (id: NodeId, delta: Position) => {
      dispatch({
        type: "move",
        id,
        delta,
      });
    },
    [dispatch]
  );

  const moveSelectedNodes = useCallback(
    (delta: Position) => {
      for (const id of selectedIdsState) {
        dispatch({
          type: "move",
          id,
          delta,
        });
      }
    },
    [dispatch, selectedIdsState]
  );

  const updateNode = useCallback(
    (id: NodeId, patch: Partial<Omit<NodeBase, "id">>) => {
      dispatch({
        type: "update",
        id,
        patch,
      });
    },
    [dispatch]
  );

  const deleteNode = useCallback(
    (id: NodeId) => {
      dispatch({
        type: "delete",
        id,
      });
      setSelectedIdsState((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    },
    [dispatch]
  );

  const deleteSelectedNodes = useCallback(() => {
    for (const id of selectedIdsState) {
      dispatch({
        type: "delete",
        id,
      });
    }
    setSelectedIdsState(new Set());
  }, [dispatch, selectedIdsState]);

  const duplicateNode = useCallback(
    (id: NodeId): NodeId => {
      const newId = nanoid();
      const node = document.nodes[id];
      if (!node) return newId;

      const offset = { x: 20, y: 20 };
      dispatch({
        type: "duplicate",
        id,
        newId,
        position: {
          x: node.position.x + offset.x,
          y: node.position.y + offset.y,
        },
      });
      setSelectedIdsState(new Set([newId]));
      return newId;
    },
    [dispatch, document.nodes]
  );

  const duplicateSelectedNodes = useCallback((): NodeId[] => {
    const newIds: NodeId[] = [];
    for (const id of selectedIdsState) {
      const newId = nanoid();
      const node = document.nodes[id];
      if (!node) continue;

      const offset = { x: 20, y: 20 };
      dispatch({
        type: "duplicate",
        id,
        newId,
        position: {
          x: node.position.x + offset.x,
          y: node.position.y + offset.y,
        },
      });
      newIds.push(newId);
    }
    setSelectedIdsState(new Set(newIds));
    return newIds;
  }, [dispatch, selectedIdsState, document.nodes]);

  const alignSelection = useCallback(
    (type: AlignmentType) => {
      const nodes = Array.from(selectedIdsState)
        .map((id) => document.nodes[id])
        .filter(Boolean) as NodeBase[];
      if (nodes.length < 2) return;

      const positions = alignNodes(nodes, type);
      for (const [id, position] of positions) {
        dispatch({ type: "move", id, position });
      }
    },
    [dispatch, selectedIdsState, document.nodes]
  );

  const distributeSelection = useCallback(
    (type: DistributionType) => {
      const nodes = Array.from(selectedIdsState)
        .map((id) => document.nodes[id])
        .filter(Boolean) as NodeBase[];
      if (nodes.length < 3) return;

      const positions = distributeNodes(nodes, type);
      for (const [id, position] of positions) {
        dispatch({ type: "move", id, position });
      }
    },
    [dispatch, selectedIdsState, document.nodes]
  );

  const toggleVisibility = useCallback(
    (id: NodeId) => {
      const node = document.nodes[id];
      if (!node) return;
      dispatch({
        type: "update",
        id,
        patch: { visible: node.visible === false },
      });
    },
    [dispatch, document.nodes]
  );

  const toggleLock = useCallback(
    (id: NodeId) => {
      const node = document.nodes[id];
      if (!node) return;
      dispatch({
        type: "update",
        id,
        patch: { locked: !node.locked },
      });
    },
    [dispatch, document.nodes]
  );

  const copySelectedNodes = useCallback(() => {
    const nodes = Array.from(selectedIdsState)
      .map((id) => document.nodes[id])
      .filter(Boolean) as NodeBase[];
    if (nodes.length === 0) return;
    setClipboard(structuredClone(nodes));
  }, [selectedIdsState, document.nodes]);

  const pasteNodes = useCallback((): NodeId[] => {
    if (clipboard.length === 0) return [];
    const newIds: NodeId[] = [];
    const offset = { x: 20, y: 20 };
    for (const node of clipboard) {
      const newId = nanoid();
      dispatch({
        type: "add",
        node: {
          ...node,
          id: newId,
          position: {
            x: node.position.x + offset.x,
            y: node.position.y + offset.y,
          },
        },
      });
      newIds.push(newId);
    }
    setSelectedIdsState(new Set(newIds));
    return newIds;
  }, [clipboard, dispatch]);

  const cutSelectedNodes = useCallback(() => {
    copySelectedNodes();
    deleteSelectedNodes();
  }, [copySelectedNodes, deleteSelectedNodes]);

  const saveDocument = useCallback(() => {
    return serializeDocument(document);
  }, [document]);

  const loadDocument = useCallback(
    (json: string) => {
      const result = deserializeDocument(json);
      if (!result.success) {
        console.error("Failed to load document:", result.error);
        return;
      }
      reset(result.document);
      setSelectedIdsState(new Set());
    },
    [reset]
  );

  return {
    document,
    selectedId,
    selectedIds: selectedIdsState,
    addNode,
    selectNode,
    selectNodes,
    selectAll,
    clearSelection,
    moveNode,
    moveSelectedNodes,
    updateNode,
    deleteNode,
    deleteSelectedNodes,
    duplicateNode,
    duplicateSelectedNodes,
    alignSelection,
    distributeSelection,
    toggleVisibility,
    toggleLock,
    undo,
    redo,
    canUndo,
    canRedo,
    zoom,
    setZoom,
    zoomIn,
    zoomOut,
    gridEnabled,
    setGridEnabled,
    gridSize,
    setGridSize,
    snapToGrid,
    clipboard,
    copySelectedNodes,
    pasteNodes,
    cutSelectedNodes,
    saveDocument,
    loadDocument,
  };
}
