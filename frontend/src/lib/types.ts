export interface User {
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  name: string;
  email: string;
}

export interface Transaction {
  id: number;
  merchant: string;
  description: string;
  amount: number;
  category: string;
  transactionDate: string;
  paymentMethod: string;
  anomalyScore: number;
  isAnomaly: boolean;
  createdAt: string;
}

export interface TransactionRequest {
  merchant: string;
  description: string;
  amount: number;
  category?: string;
  transactionDate: string;
  paymentMethod: string;
}

export interface DashboardSummary {
  totalSpend: number;
  totalBudget: number;
  remainingBudget: number;
  anomalyCount: number;
  transactionCount: number;
}

export interface CategoryTotal {
  category: string;
  total: number;
  percentage: number;
}

export interface MonthlyTotal {
  month: number;
  year: number;
  total: number;
}

export interface MonthComparison {
  currentMonthTotal: number;
  previousMonthTotal: number;
  percentageChange: number;
  categoryBreakdown: CategoryTotal[];
}

export interface Budget {
  id: number;
  category: string;
  limitAmount: number;
  month: number;
  year: number;
  spentAmount: number;
  percentageUsed: number;
}

export interface BudgetRequest {
  category: string;
  limitAmount: number;
  month: number;
  year: number;
}

export interface ApiError {
  status: number;
  message: string;
  path: string;
  timestamp: string;
}
