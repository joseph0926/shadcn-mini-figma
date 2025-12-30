import { useState, useCallback } from "react";
import {
  type DocumentState,
  type Command,
  createDocumentState,
  applyCommand,
} from "@shadcn-mini/editor-core";

interface HistoryState {
  past: DocumentState[];
  present: DocumentState;
  future: DocumentState[];
}

export interface UseEditorHistoryReturn {
  document: DocumentState;
  dispatch: (command: Command) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export function useEditorHistory(
  initialDocument?: DocumentState
): UseEditorHistoryReturn {
  const [history, setHistory] = useState<HistoryState>(() => ({
    past: [],
    present: initialDocument ?? createDocumentState(),
    future: [],
  }));

  const dispatch = useCallback((command: Command) => {
    setHistory((prev) => {
      const newPresent = applyCommand(prev.present, command);
      if (newPresent === prev.present) return prev;

      return {
        past: [...prev.past, prev.present],
        present: newPresent,
        future: [],
      };
    });
  }, []);

  const undo = useCallback(() => {
    setHistory((prev) => {
      if (prev.past.length === 0) return prev;

      const newPast = [...prev.past];
      const newPresent = newPast.pop()!;

      return {
        past: newPast,
        present: newPresent,
        future: [prev.present, ...prev.future],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setHistory((prev) => {
      if (prev.future.length === 0) return prev;

      const [newPresent, ...newFuture] = prev.future;

      return {
        past: [...prev.past, prev.present],
        present: newPresent,
        future: newFuture,
      };
    });
  }, []);

  return {
    document: history.present,
    dispatch,
    undo,
    redo,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
  };
}
