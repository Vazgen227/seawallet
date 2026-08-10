import type { Contract } from "../../types/types";

export const daysElapsed = (contract: Contract) => {
    const startDate = new Date(contract.startDate)
    const endDate = new Date()
    const diff = endDate.getTime() - startDate.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    return days;
}

export const daysLeft = (contract: Contract) => {
    const durationDays = contract.durationDays
    const elapsed = daysElapsed(contract)

    return Math.max(0, durationDays - elapsed)
}

export const progressPercent = (contract: Contract) => {
   const durationDays = contract.durationDays
   const elapsed = daysElapsed(contract)
   if(elapsed > durationDays){
    return 100
   }

   return Math.round((elapsed / durationDays) * 100)
}

export const earnedToDate = (contract: Contract) => {
    const dailyRate = contract.dailyRate;
    const elapsed = daysElapsed(contract);

    return dailyRate * elapsed;
}

export const overtimeTotal = (contract: Contract) => {
    const overtimeRate = contract.overtimeRate;
    const overtimeHoursPerMonth = contract.overtimeHoursPerMonth;
    const durationDays = contract.durationDays;
    if (typeof overtimeRate !== 'number' || typeof overtimeHoursPerMonth !== 'number') return 0;
    
    return overtimeRate * overtimeHoursPerMonth * (durationDays / 30)
}

export const projectedTotal = (contract: Contract) => {
    const dailyRate = contract.dailyRate
    const durationDays = contract.durationDays
    const bonus = contract.bonus
    
    if (typeof dailyRate !== 'number' || typeof durationDays !== 'number') return 0;
    
    return dailyRate * durationDays + overtimeTotal(contract) + (bonus ?? 0)
}

export const contractEndDate = (contract: Contract): string => {
    const start = new Date(contract.startDate);
    start.setDate(start.getDate() + contract.durationDays);
    return start.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}