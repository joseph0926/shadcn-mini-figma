import type { NodeRendererProps } from "@shadcn-mini/editor-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ButtonRenderer({ node }: NodeRendererProps) {
  const label = (node.props.label as string) ?? "Button";
  const variant = (node.props.variant as "default" | "destructive" | "outline" | "secondary" | "ghost" | "link") ?? "default";
  const size = (node.props.size as "default" | "sm" | "lg" | "icon") ?? "default";
  const textColor = (node.props.textColor as string) ?? "";
  const bgColor = (node.props.bgColor as string) ?? "";
  const borderColor = (node.props.borderColor as string) ?? "";

  return (
    <Button
      variant={variant}
      size={size}
      className={cn("pointer-events-none", textColor, bgColor, borderColor)}
      style={{ width: "100%", height: "100%" }}
    >
      {label}
    </Button>
  );
}
