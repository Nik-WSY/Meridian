export type ExpenseStatus = "pending" | "approved" | "rejected";
export type ExpenseCategory = "provisioning" | "fuel" | "docking" | "maintenance" | "other";

export interface Expense {
  id: string;
  submitter_id: string;
  description: string;
  amount_cents: number;
  category: ExpenseCategory;
  port: string | null;
  date_needed: string | null;
  receipt_path: string | null;
  status: ExpenseStatus;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
}