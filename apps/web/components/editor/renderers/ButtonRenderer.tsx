import type { NodeRendererProps } from "@shadcn-mini/editor-react";
import { Button } from "@/components/ui/button";

export function ButtonRenderer({ node }: NodeRendererProps) {
  const label = (node.props.label as string) ?? "Button";
  const variant = (node.props.variant as "default" | "destructive" | "outline" | "secondary" | "ghost" | "link") ?? "default";

  return (
    <Button variant={variant} className="pointer-events-none">
      {label}
    </Button>
  );
}
