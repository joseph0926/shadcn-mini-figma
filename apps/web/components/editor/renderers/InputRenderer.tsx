import type { NodeRendererProps } from "@shadcn-mini/editor-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function InputRenderer({ node }: NodeRendererProps) {
  const placeholder = (node.props.placeholder as string) ?? "Enter text...";
  const textColor = (node.props.textColor as string) ?? "";
  const bgColor = (node.props.bgColor as string) ?? "";
  const borderColor = (node.props.borderColor as string) ?? "";

  return (
    <Input
      placeholder={placeholder}
      className={cn("pointer-events-none", textColor, bgColor, borderColor)}
      style={{ width: "100%", height: "100%" }}
      readOnly
    />
  );
}
