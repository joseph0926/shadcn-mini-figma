import type { RendererRegistry } from "@shadcn-mini/editor-react";
import { ButtonRenderer } from "./ButtonRenderer";
import { CardRenderer } from "./CardRenderer";
import { InputRenderer } from "./InputRenderer";

export const editorRegistry: RendererRegistry = {
  Button: ButtonRenderer,
  Card: CardRenderer,
  Input: InputRenderer,
};
