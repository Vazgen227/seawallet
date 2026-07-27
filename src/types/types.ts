export interface Contract {
  id: string;
  company: string;
  rank: string;
  durationDays: number;
  dailyRate: number;
  currency: string;
  startDate: string;
  overtimeRate?: number;
  overtimeHoursPerMonth?: number;
  bonus?: number;
}

export type Currency = "usd" | "eur" | "uah" | "inr" | "php" | "aed" | "gbp";
export type ExpenseCategory =
  | "food"
  | "sim"
  | "souvenirs"
  | "transport"
  | "health"
  | "other";

export interface ConversionRecord {
  id: string;
  amount: number;
  from: Currency;
  to: Currency;
  rate: number;
  result: number;
  date: string;
}

export interface Expense {
  id: string;
  amount: number;
  currency: Currency;
  category: ExpenseCategory;
  date: string;
  note?: string;
  contractId?: string;
}

export type DocumentCategory = "passport" | "visa" | "insurance" | "other" | "workPermit" | "seamanBook" | "certificates";

export interface Document {
  id: string;
  title: string;
  description?: string;
  category: DocumentCategory;
  dateExpired: string;
  photoId?: string;
}

export type ChecklistItemStatus = "pending" | "accepted" | "rejected";

export interface ChecklistItem {
  id: string;
  title: string
  contractId?: string;
  status: ChecklistItemStatus;
}