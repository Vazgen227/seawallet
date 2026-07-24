import { create } from "zustand";
import type { ChecklistItem } from "../../types/types";
import type { Document } from "../../types/types";
import { persist } from "zustand/middleware";
import type { ChecklistItemStatus } from "../../types/types";

interface ChecklistStore {
  items: ChecklistItem[];
  addChecklistItem(data: Omit<ChecklistItem, "id">): void;
  removeChecklistItem(id: string): void;
  setItemStatus(id: string, status: ChecklistItemStatus): void;

  documents: Document[];
  addDocument(data: Omit<Document, "id">): void;
  removeDocument(id: string): void;
  updateDocument(id: string, updates: Partial<Document>): void;
}

export const useChecklistStore = create<ChecklistStore>()(
  persist(
    (set) => ({
      documents: [],
      items: [],
      addChecklistItem: (data) =>
        set((state) => ({
          items: [...state.items, { ...data, id: crypto.randomUUID() }],
        })),
      removeChecklistItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      setItemStatus: (id, status) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, status } : item,
          ),
        })),
      addDocument: (data) =>
        set((state) => ({
          documents: [...state.documents, { ...data, id: crypto.randomUUID() }],
        })),
      removeDocument: (id) =>
        set((state) => ({
          documents: state.documents.filter((document) => document.id !== id),
        })),
      updateDocument: (id, updates) =>
        set((state) => ({
          documents: state.documents.map((document) =>
            document.id === id ? { ...document, ...updates } : document,
          ),
        })),
    }),
    { name: "sea-checklist-storage" },
  ),
);
