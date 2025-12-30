import type { NodeRendererProps } from "@shadcn-mini/editor-react";
import { Input } from "@/components/ui/input";

export function InputRenderer({ node }: NodeRendererProps) {
  const placeholder = (node.props.placeholder as string) ?? "Enter text...";

  return (
    <Input
      placeholder={placeholder}
      className="w-[200px] pointer-events-none"
      readOnly
    />
  );
}
