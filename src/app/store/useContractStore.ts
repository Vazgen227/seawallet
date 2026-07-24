import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Contract } from "../../types/types";




interface ContractStore {
    contracts: Contract[];
    currentContractId: string | null;
    addContract: (contract: Omit<Contract, 'id'>) => void;
    setCurrentContractId: (id: string | null) => void; // Исправлено тут (Большая С)
    removeContract: (id: string) => void;
    updateContract: (id: string, updates: Partial<Contract>) => void;
}


export function useCurrentContract() {
  const { contracts, currentContractId } = useContractStore();
  return contracts.find((c) => c.id === currentContractId) ?? null;
}

export const useContractStore = create<ContractStore>()(
    persist(
        (set) => ({
            contracts: [],
            currentContractId: null,
               
             addContract: (contractsData:Omit<Contract, 'id'>) => {
                const newContract = {...contractsData, id: crypto.randomUUID()}
                
                set((state) => ({
                    contracts: [...state.contracts, newContract],
                    currentContractId: newContract.id
                }))
             },
       

            setCurrentContractId: (contractId) => 
                set({ currentContractId: contractId }),

            removeContract: (id) => 
                set((state) => ({
                    contracts: state.contracts.filter((c) => c.id !== id),
                    currentContractId: state.currentContractId === id ? null : state.currentContractId
                })),

            updateContract: (id, updates) =>
                set((state) => ({
                    contracts: state.contracts.map((c) => c.id === id ? { ...c, ...updates } : c),
                })),
        }),
        
        {
            name: 'sea-contracts-storage'
        }
    )
);