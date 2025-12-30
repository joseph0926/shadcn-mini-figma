import { useState, useCallback } from "react";
import {
  type DocumentState,
  type NodeId,
  type Position,
  createDocumentState,
  applyCommand,
} from "@shadcn-mini/editor-core";
import { nanoid } from "nanoid";
import { DEFAULT_SIZES, DEFAULT_PROPS } from "../editor-types";

export interface UseEditorReturn {
  document: DocumentState;
  selectedId: NodeId | null;
  addNode: (type: string, position: Position) => NodeId;
  selectNode: (id: NodeId | null) => void;
  moveNode: (id: NodeId, delta: Position) => void;
}

export function useEditor(initialDocument?: DocumentState): UseEditorReturn {
  const [document, setDocument] = useState<DocumentState>(
    () => initialDocument ?? createDocumentState()
  );
  const [selectedId, setSelectedId] = useState<NodeId | null>(null);

  const addNode = useCallback((type: string, position: Position): NodeId => {
    const id = nanoid();
    setDocument((prev) =>
      applyCommand(prev, {
        type: "add",
        node: {
          id,
          type,
          position,
          size: DEFAULT_SIZES[type] ?? { width: 100, height: 40 },
          props: DEFAULT_PROPS[type] ?? {},
        },
      })
    );
    setSelectedId(id);
    return id;
  }, []);

  const selectNode = useCallback((id: NodeId | null) => {
    setSelectedId(id);
  }, []);

  const moveNode = useCallback((id: NodeId, delta: Position) => {
    setDocument((prev) =>
      applyCommand(prev, {
        type: "move",
        id,
        delta,
      })
    );
  }, []);

  return { document, selectedId, addNode, selectNode, moveNode };
}
