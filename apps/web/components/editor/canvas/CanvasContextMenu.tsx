"use client";

import React, { type ReactNode } from "react";
import { NodeContextMenu, useContextMenu } from "../shared/NodeContextMenu";

interface CanvasContextMenuProps {
  children: ReactNode;
}

export function CanvasContextMenu({ children }: CanvasContextMenuProps) {
  const { open, position, handleContextMenu, handleClose } = useContextMenu();

  return (
    <>
      {React.cloneElement(children as React.ReactElement<{ onContextMenu?: React.MouseEventHandler }>, {
        onContextMenu: handleContextMenu,
      })}
      <NodeContextMenu open={open} position={position} onClose={handleClose} />
    </>
  );
}
