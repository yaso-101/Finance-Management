import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import BalanceCard from "@/components/dashboard/BalanceCard";
import ExpenseAllocation from "@/components/dashboard/ExpenseAllocation";
import FinancialChart from "@/components/dashboard/FinancialChart";
import IncomeForm from "@/components/dashboard/IncomeForm";
import SavingsForecast from "@/components/dashboard/SavingsForecast";
import { useFinance } from "@/context/FinanceContext";
import useAuthRedirect from "@/hooks/useAuthRedirect";

const Index = () => {
  const loading = useAuthRedirect({ requireAuth: true, redirectTo: "/login" });
  if (loading) return <div className="flex items-center justify-center min-h-screen">Checking session...</div>;

  const {
    income,
    setIncome,
    balance,
    allocationSuggestions,
    savings,
    yearlyData,
    currency
  } = useFinance();

  return (
    <MainLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <BalanceCard balance={balance} currency={currency} />
        <div className="md:col-span-2">
          <IncomeForm onSubmit={setIncome} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <FinancialChart data={yearlyData} currency={currency} />
        </div>
        <ExpenseAllocation allocations={allocationSuggestions} currency={currency} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <SavingsForecast monthlySavings={savings} currency={currency} />
      </div>
    </MainLayout>
  );
};

export default Index;
