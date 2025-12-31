import type { NodeRendererProps } from "@shadcn-mini/editor-react";
import { Button } from "@/components/ui/button";

export function ButtonRenderer({ node }: NodeRendererProps) {
  const label = (node.props.label as string) ?? "Button";
  const variant = (node.props.variant as "default" | "destructive" | "outline" | "secondary" | "ghost" | "link") ?? "default";
  const size = (node.props.size as "default" | "sm" | "lg" | "icon") ?? "default";

  return (
    <Button
      variant={variant}
      size={size}
      className="pointer-events-none"
      style={{ width: "100%", height: "100%" }}
    >
      {label}
    </Button>
  );
}
