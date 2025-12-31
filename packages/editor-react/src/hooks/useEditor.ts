import { useState, useCallback } from "react";
import {
  type DocumentState,
  type NodeId,
  type NodeBase,
  type Position,
  serializeDocument,
  deserializeDocument,
} from "@shadcn-mini/editor-core";
import { nanoid } from "nanoid";
import { useEditorHistory } from "./useEditorHistory";
import { DEFAULT_SIZES, DEFAULT_PROPS } from "../editor-types";

export interface UseEditorReturn {
  document: DocumentState;
  selectedId: NodeId | null;
  addNode: (type: string, position: Position) => NodeId;
  selectNode: (id: NodeId | null) => void;
  moveNode: (id: NodeId, delta: Position) => void;
  updateNode: (id: NodeId, patch: Partial<Omit<NodeBase, "id">>) => void;
  deleteNode: (id: NodeId) => void;
  duplicateNode: (id: NodeId) => NodeId;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  zoom: number;
  setZoom: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  saveDocument: () => string;
  loadDocument: (json: string) => void;
}

export function useEditor(initialDocument?: DocumentState): UseEditorReturn {
  const { document, dispatch, undo, redo, reset, canUndo, canRedo } =
    useEditorHistory(initialDocument);
  const [selectedId, setSelectedId] = useState<NodeId | null>(null);
  const [zoom, setZoomState] = useState(1);

  const setZoom = useCallback((z: number) => {
    setZoomState(Math.max(0.25, Math.min(4, z)));
  }, []);

  const zoomIn = useCallback(() => {
    setZoomState((prev) => Math.min(4, prev + 0.1));
  }, []);

  const zoomOut = useCallback(() => {
    setZoomState((prev) => Math.max(0.25, prev - 0.1));
  }, []);

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
      setSelectedId(id);
      return id;
    },
    [dispatch]
  );

  const selectNode = useCallback((id: NodeId | null) => {
    setSelectedId(id);
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
      setSelectedId((prev) => (prev === id ? null : prev));
    },
    [dispatch]
  );

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
      setSelectedId(newId);
      return newId;
    },
    [dispatch, document.nodes]
  );

  const saveDocument = useCallback(() => {
    return serializeDocument(document);
  }, [document]);

  const loadDocument = useCallback(
    (json: string) => {
      const doc = deserializeDocument(json);
      reset(doc);
      setSelectedId(null);
    },
    [reset]
  );

  return {
    document,
    selectedId,
    addNode,
    selectNode,
    moveNode,
    updateNode,
    deleteNode,
    duplicateNode,
    undo,
    redo,
    canUndo,
    canRedo,
    zoom,
    setZoom,
    zoomIn,
    zoomOut,
    saveDocument,
    loadDocument,
  };
}
