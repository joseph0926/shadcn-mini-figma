import type { NodeRendererProps } from "@shadcn-mini/editor-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function BadgeRenderer({ node }: NodeRendererProps) {
  const content = (node.props.content as string) ?? "Badge";
  const variant = (node.props.variant as "default" | "secondary" | "destructive" | "outline") ?? "default";
  const textColor = (node.props.textColor as string) ?? "";
  const bgColor = (node.props.bgColor as string) ?? "";

  return (
    <div className="pointer-events-none w-full h-full flex items-center justify-center">
      <Badge variant={variant} className={cn(textColor, bgColor)}>
        {content}
      </Badge>
    </div>
  );
}
