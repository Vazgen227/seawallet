import { create } from "zustand";
import type { Currency } from "../../types/types";
import { persist } from "zustand/middleware";
import type { ConversionRecord } from "../../types/types";
import { fetchCurrency } from "../../lib/api";

interface CurrencyStore {
    history: ConversionRecord[];
    lastResult: ConversionRecord | null;
    isLoading: boolean;
    error: string | null;
    convert: (amount: number, from: Currency, to: Currency) => Promise<void>
    clearHistory: () => void
}

export const useCurrencyStore = create<CurrencyStore>()(
    persist((set) =>({
        history: [],
        lastResult: null,
        isLoading: false,
        error: null,

        clearHistory: () => set({history: []}),
        convert: async (amount: number, from: Currency, to: Currency) => {
            set({ isLoading: true, error: null });
            try{
             
            const rates = await fetchCurrency(from);
            const rate = rates[to]
            if (rate === undefined) throw new Error(`Курс для ${to} не найден`);
            const result = amount * rate;
                const newEntry: ConversionRecord = {
                    id: crypto.randomUUID(),
                    amount, from, to, result, rate, date: new Date().toISOString()
                };

                set((state)=>({lastResult: newEntry, history: [newEntry, ...state.history], isLoading: false}));

            }catch(err){
                set({ error: 'Failed to fetch currency: ' + err, isLoading: false, lastResult: null })
            }
            
        }
    }),
    { name: 'sea-currency-storage', partialize: (state)=>({ history: state.history}) }
)
    
)