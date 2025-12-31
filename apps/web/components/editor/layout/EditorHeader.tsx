"use client";

import { useRef } from "react";
import { Undo2, Redo2, Eye, Download, Sun, Moon, Save, Upload } from "lucide-react";
import { useTheme } from "next-themes";
import { useEditorContext } from "@shadcn-mini/editor-react";
import { Button } from "@/components/ui/button";
import { exportCanvasToPng, downloadDataUrl } from "@/lib/export";

export function EditorHeader() {
  const { undo, redo, canUndo, canRedo, saveDocument, loadDocument } = useEditorContext();
  const { theme, setTheme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    const canvas = document.querySelector("[data-canvas]") as HTMLElement;
    if (!canvas) return;
    try {
      const dataUrl = await exportCanvasToPng(canvas);
      downloadDataUrl(dataUrl, "design.png");
    } catch (err) {
      console.error("Export failed:", err);
    }
  };

  const handleSave = () => {
    const json = saveDocument();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    downloadDataUrl(url, "design.json");
    URL.revokeObjectURL(url);
  };

  const handleLoadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        loadDocument(reader.result as string);
      } catch (err) {
        console.error("Load failed:", err);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

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
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={undo}
          disabled={!canUndo}
        >
          <Undo2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={redo}
          disabled={!canRedo}
        >
          <Redo2 className="h-4 w-4" />
        </Button>
        <div className="w-px h-4 bg-border mx-1" />
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleSave}>
          <Save className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleLoadClick}>
          <Upload className="h-4 w-4" />
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={handleFileChange}
        />
        <div className="w-px h-4 bg-border mx-1" />
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Eye className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleExport}>
          <Download className="h-4 w-4" />
        </Button>
        <div className="w-px h-4 bg-border mx-1" />
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>
      </div>
    </header>
  );
}
