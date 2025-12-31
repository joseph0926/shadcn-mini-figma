"use client";

import { Minus, Plus, Grid3X3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEditorContext } from "@shadcn-mini/editor-react";

export function EditorFooter() {
  const { selectedId, document, zoom, zoomIn, zoomOut, gridEnabled, setGridEnabled, gridSize, setGridSize } = useEditorContext();
  const selectedNode = selectedId ? document.nodes[selectedId] : null;

  const gridSizes = [8, 16, 32];
  const cycleGridSize = () => {
    const currentIndex = gridSizes.indexOf(gridSize);
    const nextIndex = (currentIndex + 1) % gridSizes.length;
    setGridSize(gridSizes[nextIndex]);
  };

  return (
    <footer className="h-8 flex items-center justify-between px-4 border-t border-editor-panel-border bg-editor-panel-bg text-xs text-muted-foreground">
      <div className="flex items-center gap-2">
        {selectedNode ? (
          <span>
            {selectedNode.type} ({Math.round(selectedNode.position.x)},{" "}
            {Math.round(selectedNode.position.y)})
          </span>
        ) : (
          <span>No selection</span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <Button
            variant={gridEnabled ? "secondary" : "ghost"}
            size="icon"
            className="h-6 w-6"
            onClick={() => setGridEnabled(!gridEnabled)}
            title={gridEnabled ? "Disable grid snap" : "Enable grid snap"}
          >
            <Grid3X3 className="h-3 w-3" />
          </Button>
          {gridEnabled && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={cycleGridSize}
              title="Change grid size"
            >
              {gridSize}px
            </Button>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={zoomOut}
            disabled={zoom <= 0.25}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-12 text-center">{Math.round(zoom * 100)}%</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={zoomIn}
            disabled={zoom >= 4}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </footer>
  );
}
