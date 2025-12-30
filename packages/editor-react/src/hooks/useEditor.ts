import { useState, useCallback } from "react";
import {
  type DocumentState,
  type NodeId,
  type NodeBase,
  type Position,
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
}

export function useEditor(initialDocument?: DocumentState): UseEditorReturn {
  const { document, dispatch, undo, redo, canUndo, canRedo } =
    useEditorHistory(initialDocument);
  const [selectedId, setSelectedId] = useState<NodeId | null>(null);

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
  };
}
