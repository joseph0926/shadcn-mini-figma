import { PointerSensor } from "@dnd-kit/core";
import type { PointerSensorOptions } from "@dnd-kit/core";

export class ResizeAwarePointerSensor extends PointerSensor {
  static activators = [
    {
      eventName: "onPointerDown" as const,
      handler: (
        { nativeEvent: event }: { nativeEvent: PointerEvent },
        { onActivation }: PointerSensorOptions
      ): boolean => {
        const target = event.target as HTMLElement;

        if (target.closest("[data-resize-handle]")) {
          return false;
        }

        if (event.button !== 0 || !event.isPrimary) {
          return false;
        }

        onActivation?.({ event });
        return true;
      },
    },
  ];
}
