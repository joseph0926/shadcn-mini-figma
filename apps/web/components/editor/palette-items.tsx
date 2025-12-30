import type { PaletteItem } from "@shadcn-mini/editor-react";
import { Square, CreditCard, TextCursor } from "lucide-react";

export const paletteItems: PaletteItem[] = [
  {
    type: "Button",
    label: "Button",
    icon: <Square className="w-4 h-4" />,
  },
  {
    type: "Card",
    label: "Card",
    icon: <CreditCard className="w-4 h-4" />,
  },
  {
    type: "Input",
    label: "Input",
    icon: <TextCursor className="w-4 h-4" />,
  },
];
