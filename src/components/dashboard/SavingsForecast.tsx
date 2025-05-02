/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Calculator } from "lucide-react"
import CardContainer from "../common/CardContainer"
import ChipLabel from "../common/ChipLabel"
import { calculateSavingsForecast } from "@/utils/financeUtils"
import { formatCurrency } from "@/lib/utils"
import type { CurrencyType } from "./IncomeForm"

interface SavingsForecastProps {
  monthlySavings: number
  currency: CurrencyType
}

const FORECAST_PERIODS = [
  { label: "3 Months", value: 3 },
  { label: "6 Months", value: 6 },
  { label: "1 Year", value: 12 },
  { label: "2 Years", value: 24 },
]

const SavingsForecast = ({ monthlySavings, currency }: SavingsForecastProps) => {
  const [activePeriod, setActivePeriod] = useState(FORECAST_PERIODS[2])
  const [interestRate, setInterestRate] = useState(1.5) // Default interest rate

  // Generate forecast data
  const forecastData = FORECAST_PERIODS.map((period) => {
    const forecast = calculateSavingsForecast(monthlySavings, period.value, interestRate)
    return {
      period: period.label,
      forecast,
    }
  })

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 shadow-lg rounded-lg border border-slate-100">
          <p className="text-sm font-bold mb-1">{label}</p>
          <p className="text-primary text-sm font-semibold">{formatCurrency(payload[0].value, currency)}</p>
          <p className="text-xs text-slate-500 mt-1">Projected savings</p>
        </div>
      )
    }

    return null
  }

  return (
    <CardContainer>
      <div className="flex items-start mb-6">
        <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center mr-4">
          <Calculator className="h-5 w-5 text-primary" />
        </div>
        <div>
          <ChipLabel  className="mb-1 animate-slide-up">
            Future Planning
          </ChipLabel>
          <h3 className="text-xl font-semibold animate-slide-up stagger-1">Savings Forecast</h3>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-slate-500 animate-slide-up stagger-2">
          Monthly savings:{" "}
          <span className="font-medium text-slate-700">{formatCurrency(monthlySavings, currency)}</span>
        </p>

        <div className="flex items-center animate-slide-in-right">
          <span className="text-sm text-slate-500 mr-2">Interest:</span>
          <select
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="text-sm border border-slate-200 rounded-md px-2 py-1"
          >
            <option value="0">0%</option>
            <option value="1.5">1.5%</option>
            <option value="3">3%</option>
            <option value="5">5%</option>
            <option value="7">7%</option>
          </select>
        </div>
      </div>

      <div className="h-64 w-full mb-4 animate-fade-in">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={forecastData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="period" tick={{ fontSize: 12 }} tickLine={false} axisLine={{ stroke: "#e2e8f0" }} />
            <YAxis
              tickFormatter={(value) => {
                const currencySymbol = currency === "USD" ? "$" : "IQD"
                return `${currencySymbol}${value / 1000}k`
              }}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: "#e2e8f0" }}
              width={55}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="forecast" fill="#4F46E5" radius={[4, 4, 0, 0]} animationDuration={1000} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </CardContainer>
  )
}

export default SavingsForecast