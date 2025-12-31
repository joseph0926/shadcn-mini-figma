import type { DocumentState } from "./types";

export function serializeDocument(doc: DocumentState): string {
  return JSON.stringify(doc, null, 2);
}

export function deserializeDocument(json: string): DocumentState {
  return JSON.parse(json) as DocumentState;
}
