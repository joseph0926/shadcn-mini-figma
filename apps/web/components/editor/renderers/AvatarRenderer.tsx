import type { NodeRendererProps } from "@shadcn-mini/editor-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export function AvatarRenderer({ node }: NodeRendererProps) {
  const src = (node.props.src as string) ?? "";
  const fallback = (node.props.fallback as string) ?? "AB";
  const bgColor = (node.props.bgColor as string) ?? "";

  return (
    <div className="pointer-events-none w-full h-full flex items-center justify-center">
      <Avatar className="w-full h-full">
        {src && <AvatarImage src={src} alt="Avatar" />}
        <AvatarFallback className={cn(bgColor)}>{fallback}</AvatarFallback>
      </Avatar>
    </div>
  );
}
