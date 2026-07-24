import type { Expense } from "../../types/types";
import type { Currency } from "../../types/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ExpensesStore {
  expenses: Expense[];
  advanceAmount: number;
  advanceCurrency: Currency;
  addExpense: (data: Omit<Expense, "id">) => void;
  removeExpense: (id: string) => void;
  setAdvance: (amount: number, currency: Currency) => void;
}

export const useExpensesStore = create<ExpensesStore>()(
  persist(
    (set) => ({
      expenses: [],
      advanceAmount: 0,
      advanceCurrency: "usd",
      addExpense: (data) =>
        set((state) => {
          const newExpense: Expense = { ...data, id: crypto.randomUUID() };
          return { expenses: [...state.expenses, newExpense] };
        }),
      removeExpense: (id) =>
        set((state) => ({
          expenses: state.expenses.filter((e) => e.id !== id),
        })),
      setAdvance: (amount, currency) =>
        set({ advanceAmount: amount, advanceCurrency: currency }),
    }),
    {
      name: "sea-expenses-storage",
    },
  ),
);
