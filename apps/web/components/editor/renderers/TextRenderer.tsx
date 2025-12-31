import type { NodeRendererProps } from "@shadcn-mini/editor-react";
import { cn } from "@/lib/utils";

export function TextRenderer({ node }: NodeRendererProps) {
  const content = (node.props.content as string) ?? "Text";
  const fontSize = (node.props.fontSize as string) ?? "base";
  const fontWeight = (node.props.fontWeight as string) ?? "normal";
  const textAlign = (node.props.textAlign as string) ?? "left";
  const textColor = (node.props.textColor as string) ?? "";
  const bgColor = (node.props.bgColor as string) ?? "";

  const fontSizeClass = {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
  }[fontSize] ?? "text-base";

  const fontWeightClass = {
    light: "font-light",
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
  }[fontWeight] ?? "font-normal";

  const textAlignClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }[textAlign] ?? "text-left";

  return (
    <div
      className={cn(
        "pointer-events-none w-full h-full flex items-center overflow-hidden",
        fontSizeClass,
        fontWeightClass,
        textAlignClass,
        textColor,
        bgColor
      )}
    >
      <span className="w-full truncate px-1">{content}</span>
    </div>
  );
}
