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

const MAX_HISTORY_SIZE = 50;

export interface UseEditorHistoryReturn {
  document: DocumentState;
  dispatch: (command: Command) => void;
  undo: () => void;
  redo: () => void;
  reset: (doc: DocumentState) => void;
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

      const newPast = [...prev.past, prev.present];
      if (newPast.length > MAX_HISTORY_SIZE) {
        newPast.shift();
      }

      return {
        past: newPast,
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

      const newFuture = [prev.present, ...prev.future];
      if (newFuture.length > MAX_HISTORY_SIZE) {
        newFuture.pop();
      }

      return {
        past: newPast,
        present: newPresent,
        future: newFuture,
      };
    });
  }, []);

  const redo = useCallback(() => {
    setHistory((prev) => {
      if (prev.future.length === 0) return prev;

      const [newPresent, ...newFuture] = prev.future;

      const newPast = [...prev.past, prev.present];
      if (newPast.length > MAX_HISTORY_SIZE) {
        newPast.shift();
      }

      return {
        past: newPast,
        present: newPresent,
        future: newFuture,
      };
    });
  }, []);

  const reset = useCallback((doc: DocumentState) => {
    setHistory({
      past: [],
      present: doc,
      future: [],
    });
  }, []);

  return {
    document: history.present,
    dispatch,
    undo,
    redo,
    reset,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
  };
}
