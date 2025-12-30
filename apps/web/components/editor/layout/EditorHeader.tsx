"use client";

import { Undo2, Redo2, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EditorHeader() {
  return (
    <header className="h-12 flex items-center justify-between px-4 border-b border-editor-panel-border bg-editor-panel-bg">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-primary" />
          <span className="font-semibold text-sm">shadcn-mini</span>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <span className="text-sm text-muted-foreground">Untitled</span>
      </div>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Undo2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Redo2 className="h-4 w-4" />
        </Button>
        <div className="w-px h-4 bg-border mx-1" />
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Eye className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
