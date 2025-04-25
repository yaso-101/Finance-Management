
import React, { useState } from "react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";
import CardContainer from "../common/CardContainer";
import ChipLabel from "../common/ChipLabel";
import { formatCurrency } from "@/lib/utils";
import { CurrencyType } from "./IncomeForm";

interface ChartData {
  month: string;
  income: number;
  expenses: number;
  savings: number;
}

interface FinancialChartProps {
  data: ChartData[];
  currency: CurrencyType;
}

const FinancialChart = ({ data, currency }: FinancialChartProps) => {
  const [activeType, setActiveType] = useState<"all" | "income" | "expenses" | "savings">("all");
  
  const chartTypes = [
    { id: "all", label: "All Data" },
    { id: "income", label: "Income" },
    { id: "expenses", label: "Expenses" },
    { id: "savings", label: "Savings" },
  ];
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 shadow-lg rounded-lg border border-slate-100">
          <p className="text-sm font-bold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div 
              key={`tooltip-${index}`} 
              className="flex items-center justify-between text-sm mb-1"
            >
              <span style={{ color: entry.color }} className="font-medium mr-4 capitalize">
                {entry.name}:
              </span>
              <span className="font-semibold">
                {formatCurrency(entry.value, currency)}
              </span>
            </div>
          ))}
        </div>
      );
    }
  
    return null;
  };

  return (
    <CardContainer>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <ChipLabel variant="primary" className="mb-2 animate-slide-up">
            Financial Overview
          </ChipLabel>
          <h3 className="text-xl font-semibold animate-slide-up stagger-1">Yearly Finance Trends</h3>
        </div>
        
        <div className="flex space-x-1 mt-4 md:mt-0 animate-slide-in-right">
          {chartTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setActiveType(type.id as any)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${
                activeType === type.id
                  ? "bg-primary text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="h-80 w-full chart-container animate-fade-in">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }} 
            />
            <YAxis 
              tickFormatter={(value) => {
                const currencySymbol = currency === "USD" ? "$" : "IQD";
                return `${currencySymbol}${value/1000}k`;
              }}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
              width={55}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            {(activeType === "all" || activeType === "income") && (
              <Area
                type="monotone"
                dataKey="income"
                stroke="#4F46E5"
                fillOpacity={1}
                fill="url(#colorIncome)"
                strokeWidth={2}
              />
            )}
            
            {(activeType === "all" || activeType === "expenses") && (
              <Area
                type="monotone"
                dataKey="expenses"
                stroke="#F59E0B"
                fillOpacity={1}
                fill="url(#colorExpenses)"
                strokeWidth={2}
              />
            )}
            
            {(activeType === "all" || activeType === "savings") && (
              <Area
                type="monotone"
                dataKey="savings"
                stroke="#10B981"
                fillOpacity={1}
                fill="url(#colorSavings)"
                strokeWidth={2}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </CardContainer>
  );
};

export default FinancialChart;
