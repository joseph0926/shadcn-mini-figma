"use client";

import { useEditorContext } from "@shadcn-mini/editor-react";
import { Input } from "@/components/ui/input";

export function PropertiesPanel() {
  const { selectedId, document } = useEditorContext();
  const selectedNode = selectedId ? document.nodes[selectedId] : null;

  if (!selectedNode) {
    return (
      <aside className="w-64 border-l border-editor-panel-border bg-editor-panel-bg flex-shrink-0">
        <div className="p-4 border-b border-editor-panel-border">
          <h3 className="text-sm font-medium">Properties</h3>
        </div>
        <div className="p-4 text-sm text-muted-foreground">
          Select a component to edit properties
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-64 border-l border-editor-panel-border bg-editor-panel-bg flex-shrink-0 overflow-y-auto">
      <div className="p-4 border-b border-editor-panel-border">
        <h3 className="text-sm font-medium">{selectedNode.type}</h3>
      </div>

      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">
            Position
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-xs text-muted-foreground">X</span>
              <Input
                type="number"
                value={Math.round(selectedNode.position.x)}
                className="h-8 text-sm"
                readOnly
              />
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Y</span>
              <Input
                type="number"
                value={Math.round(selectedNode.position.y)}
                className="h-8 text-sm"
                readOnly
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">
            Size
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-xs text-muted-foreground">W</span>
              <Input
                type="number"
                value={selectedNode.size.width}
                className="h-8 text-sm"
                readOnly
              />
            </div>
            <div>
              <span className="text-xs text-muted-foreground">H</span>
              <Input
                type="number"
                value={selectedNode.size.height}
                className="h-8 text-sm"
                readOnly
              />
            </div>
          </div>
        </div>

        {Object.keys(selectedNode.props).length > 0 && (
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">
              Props
            </label>
            <div className="space-y-2">
              {Object.entries(selectedNode.props).map(([key, value]) => (
                <div key={key}>
                  <span className="text-xs text-muted-foreground">{key}</span>
                  <Input
                    value={String(value)}
                    className="h-8 text-sm"
                    readOnly
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
