import type { NodeRendererProps } from "@shadcn-mini/editor-react";
import { Input } from "@/components/ui/input";

export function InputRenderer({ node }: NodeRendererProps) {
  const placeholder = (node.props.placeholder as string) ?? "Enter text...";

  return (
    <Input
      placeholder={placeholder}
      className="pointer-events-none"
      style={{ width: "100%", height: "100%" }}
      readOnly
    />
  );
}
