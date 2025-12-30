import { createContext, useContext, type ReactNode } from "react";
import { type DocumentState } from "@shadcn-mini/editor-core";
import { useEditor, type UseEditorReturn } from "../hooks/useEditor";

const EditorContext = createContext<UseEditorReturn | null>(null);

export interface EditorProviderProps {
  children: ReactNode;
  initialDocument?: DocumentState;
}

export function EditorProvider({
  children,
  initialDocument,
}: EditorProviderProps) {
  const editor = useEditor(initialDocument);
  return (
    <EditorContext.Provider value={editor}>{children}</EditorContext.Provider>
  );
}

export function useEditorContext(): UseEditorReturn {
  const ctx = useContext(EditorContext);
  if (!ctx) {
    throw new Error("useEditorContext must be used within EditorProvider");
  }
  return ctx;
}
