// Finance Dashboard Types

export interface FinanceOwner {
  _id: string;
  name: string;
  email: string;
  cafeId: string;
  cafeName: string;
  role: 'owner' | 'viewer';
}

export interface Transaction {
  _id: string;
  cafeId: string;
  ownerId: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  transactionCount: number;
  monthlyTrend: Array<{
    _id: { year: number; month: number };
    income: number;
    expenses: number;
  }>;
  categoryBreakdown: Array<{
    _id: string;
    total: number;
  }>;
  recentTransactions: Transaction[];
}

export interface Insights {
  topCategories: Array<{ _id: string; total: number; count: number }>;
  topIncomeSources: Array<{ _id: string; total: number; count: number }>;
  currentMonth: { income: number; expenses: number; profit: number };
  previousMonth: { income: number; expenses: number; profit: number };
  dailyAvg: Array<{ _id: string; income: number; expenses: number }>;
}

export interface TransactionFormData {
  type: 'income' | 'expense';
  category: string;
  amount: string;
  description: string;
  date: string;
}

export const CATEGORIES = [
  'Sales', 'Beverages', 'Food', 'Supplies', 'Rent',
  'Utilities', 'Staff', 'Marketing', 'Equipment', 'Maintenance', 'Other'
];

export const CATEGORY_COLORS: Record<string, string> = {
  Sales: '#10b981', Beverages: '#3b82f6', Food: '#f59e0b',
  Supplies: '#ef4444', Rent: '#8b5cf6', Utilities: '#06b6d4',
  Staff: '#ec4899', Marketing: '#f97316', Equipment: '#6366f1',
  Maintenance: '#14b8a6', Other: '#6b7280'
};
