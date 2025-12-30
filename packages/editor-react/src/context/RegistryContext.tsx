import { createContext, useContext, type ReactNode } from "react";
import type { RendererRegistry } from "../types";

const RegistryContext = createContext<RendererRegistry>({});

export interface RegistryProviderProps {
  children: ReactNode;
  registry: RendererRegistry;
}

export function RegistryProvider({
  children,
  registry,
}: RegistryProviderProps) {
  return (
    <RegistryContext.Provider value={registry}>
      {children}
    </RegistryContext.Provider>
  );
}

export function useRendererRegistry(): RendererRegistry {
  return useContext(RegistryContext);
}
