import axios from "axios";
import { AuthResponse, Transaction, TransactionRequest, DashboardSummary, CategoryTotal, MonthlyTotal, MonthComparison, Budget, BudgetRequest } from "./types";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor — attach JWT token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — redirect on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ─── Auth ────────────────────────────────────────────────────
export const register = async (name: string, email: string, password: string): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>("/auth/register", { name, email, password });
  return data;
};

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>("/auth/login", { email, password });
  return data;
};

// ─── Transactions ────────────────────────────────────────────
export const getTransactions = async (): Promise<Transaction[]> => {
  const { data } = await api.get<Transaction[]>("/transactions");
  return data;
};

export const getTransaction = async (id: number): Promise<Transaction> => {
  const { data } = await api.get<Transaction>(`/transactions/${id}`);
  return data;
};

export const createTransaction = async (payload: TransactionRequest): Promise<Transaction> => {
  const { data } = await api.post<Transaction>("/transactions", payload);
  return data;
};

export const updateTransaction = async (id: number, payload: TransactionRequest): Promise<Transaction> => {
  const { data } = await api.put<Transaction>(`/transactions/${id}`, payload);
  return data;
};

export const deleteTransaction = async (id: number): Promise<void> => {
  await api.delete(`/transactions/${id}`);
};

export const getRecentTransactions = async (): Promise<Transaction[]> => {
  const { data } = await api.get<Transaction[]>("/transactions/recent");
  return data;
};

export const importCsv = async (file: File): Promise<Transaction[]> => {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await api.post<Transaction[]>("/transactions/import", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

// ─── Dashboard ───────────────────────────────────────────────
export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  const { data } = await api.get<DashboardSummary>("/dashboard/summary");
  return data;
};

// ─── Analytics ───────────────────────────────────────────────
export const getCategoryTotals = async (month?: number, year?: number): Promise<CategoryTotal[]> => {
  const params: Record<string, number> = {};
  if (month) params.month = month;
  if (year) params.year = year;
  const { data } = await api.get<CategoryTotal[]>("/analytics/categories", { params });
  return data;
};

export const getMonthlyTotals = async (year?: number): Promise<MonthlyTotal[]> => {
  const params: Record<string, number> = {};
  if (year) params.year = year;
  const { data } = await api.get<MonthlyTotal[]>("/analytics/monthly", { params });
  return data;
};

export const getComparison = async (): Promise<MonthComparison> => {
  const { data } = await api.get<MonthComparison>("/analytics/comparison");
  return data;
};

// ─── Budgets ─────────────────────────────────────────────────
export const getBudgets = async (month?: number, year?: number): Promise<Budget[]> => {
  const params: Record<string, number> = {};
  if (month) params.month = month;
  if (year) params.year = year;
  const { data } = await api.get<Budget[]>("/budgets", { params });
  return data;
};

export const getBudgetStatus = async (): Promise<Budget[]> => {
  const { data } = await api.get<Budget[]>("/budgets/status");
  return data;
};

export const createBudget = async (payload: BudgetRequest): Promise<Budget> => {
  const { data } = await api.post<Budget>("/budgets", payload);
  return data;
};

export const deleteBudget = async (id: number): Promise<void> => {
  await api.delete(`/budgets/${id}`);
};

export default api;
