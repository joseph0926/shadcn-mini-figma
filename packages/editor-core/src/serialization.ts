import type { DocumentState } from "./types";
import { createDocumentState } from "./state";

export function serializeDocument(doc: DocumentState): string {
  return JSON.stringify(doc, null, 2);
}

export type DeserializeResult =
  | { success: true; document: DocumentState }
  | { success: false; error: string };

export function deserializeDocument(json: string): DeserializeResult {
  try {
    const parsed = JSON.parse(json);

    if (typeof parsed !== "object" || parsed === null) {
      return { success: false, error: "Invalid document: not an object" };
    }
    if (typeof parsed.schemaVersion !== "number") {
      return { success: false, error: "Invalid document: missing schemaVersion" };
    }
    if (typeof parsed.rootId !== "string") {
      return { success: false, error: "Invalid document: missing rootId" };
    }
    if (typeof parsed.nodes !== "object" || parsed.nodes === null) {
      return { success: false, error: "Invalid document: missing nodes" };
    }
    if (!parsed.nodes[parsed.rootId]) {
      return { success: false, error: "Invalid document: root node not found" };
    }

    return { success: true, document: parsed as DocumentState };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to parse JSON",
    };
  }
}

export function deserializeDocumentOrDefault(json: string): DocumentState {
  const result = deserializeDocument(json);
  if (result.success) {
    return result.document;
  }
  return createDocumentState();
}
