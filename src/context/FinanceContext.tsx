
import React, { createContext, useContext, useState, useEffect } from "react";
import { AllocationSuggestion, ExpenseCategory, Expense, Income, generateAllocationSuggestions } from "@/utils/financeUtils";
import { CurrencyType } from "@/components/dashboard/IncomeForm";

interface FinanceContextType {
  income: number;
  setIncome: (amount: number) => void;
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, "id">) => void;
  removeExpense: (id: string) => void;
  allocationSuggestions: AllocationSuggestion[];
  savings: number;
  balance: number;
  monthlyTransactions: Expense[];
  yearlyData: { month: string; income: number; expenses: number; savings: number }[];
  currency: CurrencyType;
  setCurrency: (currency: CurrencyType) => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [income, setIncome] = useState<number>(5000);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [allocationSuggestions, setAllocationSuggestions] = useState<AllocationSuggestion[]>([]);
  const [currency, setCurrency] = useState<CurrencyType>("IQD");

  // Generate allocation suggestions whenever income changes
  useEffect(() => {
    setAllocationSuggestions(generateAllocationSuggestions(income));
  }, [income]);

  // Add a new expense
  const addExpense = (expense: Omit<Expense, "id">) => {
    const newExpense = {
      ...expense,
      id: Math.random().toString(36).substring(2, 11),
    };
    setExpenses((prev) => [...prev, newExpense]);
  };

  // Remove an expense
  const removeExpense = (id: string) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
  };

  // Calculate current savings (income - expenses)
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const savings = income - totalExpenses;
  const balance = savings; // Simplified for now

  // Get transactions for the current month
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  const monthlyTransactions = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
  });

  // Generate mock yearly data for charts
  const yearlyData = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(currentYear, i);
    const monthName = date.toLocaleString('default', { month: 'short' });
    
    // Generate some realistic data with randomization
    const monthlyIncome = income * (0.9 + Math.random() * 0.2);
    const monthlyExpenses = monthlyIncome * (0.6 + Math.random() * 0.3);
    const monthlySavings = monthlyIncome - monthlyExpenses;
    
    return {
      month: monthName,
      income: monthlyIncome,
      expenses: monthlyExpenses,
      savings: monthlySavings,
    };
  });

  const value = {
    income,
    setIncome,
    expenses,
    addExpense,
    removeExpense,
    allocationSuggestions,
    savings,
    balance,
    monthlyTransactions,
    yearlyData,
    currency,
    setCurrency,
  };

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error("useFinance must be used within a FinanceProvider");
  }
  return context;
};
