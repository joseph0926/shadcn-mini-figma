import type { RendererRegistry } from "@shadcn-mini/editor-react";
import { ButtonRenderer } from "./ButtonRenderer";
import { CardRenderer } from "./CardRenderer";
import { InputRenderer } from "./InputRenderer";
import { TextRenderer } from "./TextRenderer";
import { BadgeRenderer } from "./BadgeRenderer";
import { AvatarRenderer } from "./AvatarRenderer";
import { SeparatorRenderer } from "./SeparatorRenderer";

export const editorRegistry: RendererRegistry = {
  Button: ButtonRenderer,
  Card: CardRenderer,
  Input: InputRenderer,
  Text: TextRenderer,
  Badge: BadgeRenderer,
  Avatar: AvatarRenderer,
  Separator: SeparatorRenderer,
};
