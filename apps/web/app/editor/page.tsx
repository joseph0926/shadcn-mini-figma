"use client";

import {
  EditorProvider,
  RegistryProvider,
  DndProvider,
  Canvas,
  Palette,
} from "@shadcn-mini/editor-react";
import { editorRegistry } from "@/components/editor/renderers";
import { paletteItems } from "@/components/editor/palette-items";
import { EditorHeader } from "@/components/editor/layout/EditorHeader";
import { EditorFooter } from "@/components/editor/layout/EditorFooter";
import { PropertiesPanel } from "@/components/editor/layout/PropertiesPanel";

export default function EditorPage() {
  return (
    <EditorProvider>
      <RegistryProvider registry={editorRegistry}>
        <DndProvider>
          <div className="flex flex-col h-screen bg-editor-canvas-bg">
            <EditorHeader />
            <div className="flex flex-1 overflow-hidden">
              <aside className="w-60 border-r border-editor-panel-border bg-editor-panel-bg flex-shrink-0 overflow-y-auto">
                <Palette items={paletteItems} />
              </aside>
              <main className="flex-1 relative overflow-hidden">
                <Canvas className="h-full bg-[linear-gradient(to_right,hsl(var(--editor-panel-border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--editor-panel-border))_1px,transparent_1px)] bg-[size:20px_20px]" />
              </main>
              <PropertiesPanel />
            </div>
            <EditorFooter />
          </div>
        </DndProvider>
      </RegistryProvider>
    </EditorProvider>
  );
}
