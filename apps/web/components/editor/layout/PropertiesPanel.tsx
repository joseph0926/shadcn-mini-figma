"use client";

import { useEditorContext, COMPONENT_SCHEMAS, type PropSchema } from "@shadcn-mini/editor-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function PropertiesPanel() {
  const { selectedId, document, updateNode } = useEditorContext();
  const selectedNode = selectedId ? document.nodes[selectedId] : null;

  if (!selectedNode) {
    return (
      <aside className="w-64 border-l border-editor-panel-border bg-editor-panel-bg shrink-0">
        <div className="p-4 border-b border-editor-panel-border">
          <h3 className="text-sm font-medium">Properties</h3>
        </div>
        <div className="p-4 text-sm text-muted-foreground">
          Select a component to edit properties
        </div>
      </aside>
    );
  }

  const handlePositionChange = (axis: "x" | "y", value: string) => {
    if (!selectedId) return;
    const num = parseFloat(value);
    if (isNaN(num)) return;
    updateNode(selectedId, {
      position: { ...selectedNode.position, [axis]: num },
    });
  };

  const handleSizeChange = (dim: "width" | "height", value: string) => {
    if (!selectedId) return;
    const num = parseFloat(value);
    if (isNaN(num) || num < 1) return;
    updateNode(selectedId, {
      size: { ...selectedNode.size, [dim]: num },
    });
  };

  const handlePropChange = (key: string, value: string) => {
    if (!selectedId) return;
    updateNode(selectedId, {
      props: { [key]: value },
    });
  };

  return (
    <aside className="w-64 border-l border-editor-panel-border bg-editor-panel-bg shrink-0 overflow-y-auto">
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
                onChange={(e) => handlePositionChange("x", e.target.value)}
                className="h-8 text-sm"
              />
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Y</span>
              <Input
                type="number"
                value={Math.round(selectedNode.position.y)}
                onChange={(e) => handlePositionChange("y", e.target.value)}
                className="h-8 text-sm"
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
                onChange={(e) => handleSizeChange("width", e.target.value)}
                className="h-8 text-sm"
              />
            </div>
            <div>
              <span className="text-xs text-muted-foreground">H</span>
              <Input
                type="number"
                value={selectedNode.size.height}
                onChange={(e) => handleSizeChange("height", e.target.value)}
                className="h-8 text-sm"
              />
            </div>
          </div>
        </div>

        {(() => {
          const schema = COMPONENT_SCHEMAS[selectedNode.type] ?? [];
          if (schema.length === 0) return null;
          return (
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                Props
              </label>
              <div className="space-y-2">
                {schema.map((prop: PropSchema) => (
                  <div key={prop.key}>
                    <span className="text-xs text-muted-foreground">{prop.label}</span>
                    {prop.type === "select" && prop.options ? (
                      <Select
                        value={String(selectedNode.props[prop.key] ?? prop.defaultValue ?? "")}
                        onValueChange={(value) => handlePropChange(prop.key, value)}
                      >
                        <SelectTrigger className="h-8 text-sm w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {prop.options.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        value={String(selectedNode.props[prop.key] ?? prop.defaultValue ?? "")}
                        onChange={(e) => handlePropChange(prop.key, e.target.value)}
                        className="h-8 text-sm"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </div>
    </aside>
  );
}
