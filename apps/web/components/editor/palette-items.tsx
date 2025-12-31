import type { PaletteItem } from "@shadcn-mini/editor-react";
import { Square, CreditCard, TextCursor, Type, Tag, CircleUser, Minus } from "lucide-react";

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
  {
    type: "Text",
    label: "Text",
    icon: <Type className="w-4 h-4" />,
  },
  {
    type: "Badge",
    label: "Badge",
    icon: <Tag className="w-4 h-4" />,
  },
  {
    type: "Avatar",
    label: "Avatar",
    icon: <CircleUser className="w-4 h-4" />,
  },
  {
    type: "Separator",
    label: "Separator",
    icon: <Minus className="w-4 h-4" />,
  },
];
