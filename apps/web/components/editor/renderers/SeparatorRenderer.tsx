import type { NodeRendererProps } from "@shadcn-mini/editor-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export function SeparatorRenderer({ node }: NodeRendererProps) {
  const orientation = (node.props.orientation as "horizontal" | "vertical") ?? "horizontal";
  const bgColor = (node.props.bgColor as string) ?? "";

  return (
    <div className="pointer-events-none w-full h-full flex items-center justify-center">
      <Separator
        orientation={orientation}
        className={cn(
          orientation === "horizontal" ? "w-full" : "h-full",
          bgColor
        )}
      />
    </div>
  );
}
