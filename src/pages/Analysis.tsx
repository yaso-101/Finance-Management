/* eslint-disable @typescript-eslint/no-explicit-any */
import MainLayout from "@/components/layout/MainLayout"
import CardContainer from "@/components/common/CardContainer"
import ChipLabel from "@/components/common/ChipLabel"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { useFinance } from "@/context/FinanceContext"
import useAuthRedirect from "@/hooks/useAuthRedirect";

const COLORS = ["#4F46E5", "#0EA5E9", "#10B981", "#F59E0B", "#8B5CF6", "#EF4444"]

const Analysis = () => {
  const loading = useAuthRedirect({ requireAuth: true, redirectTo: "/login" });

  const { yearlyData, allocationSuggestions, currency } = useFinance()

  // Format allocation data for pie chart
  const pieData = allocationSuggestions
    .filter((item) => item.percentage > 0)
    .map((item) => ({
      name: item.category,
      value: item.percentage,
    }))

  // Custom tooltip for bar chart
  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 shadow-lg rounded-lg border border-slate-100">
          <p className="text-sm font-bold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={`tooltip-${index}`} className="flex items-center justify-between text-sm mb-1">
              <span style={{ color: entry.color }} className="font-medium mr-4 capitalize">
                {entry.name}:
              </span>
              <span className="font-semibold">{currency === "USD" ? `$${entry.value}` : `${entry.value} IQD`}</span>
            </div>
          ))}
        </div>
      )
    }

    return null
  }

  // Custom tooltip for pie chart
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border border-slate-100">
          <p className="text-sm font-medium capitalize">{data.name}</p>
          <p className="text-sm font-semibold text-primary">{data.value}%</p>
        </div>
      )
    }
    return null
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-display font-semibold tracking-tight animate-slide-up">
            Financial Analysis
          </h2>
          <p className="text-slate-500 animate-slide-up stagger-1">Detailed insights into your financial patterns</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <CardContainer>
          <ChipLabel className="mb-2 animate-slide-up">
            Annual Overview
          </ChipLabel>
          <h3 className="text-xl font-semibold mb-6 animate-slide-up stagger-1">Yearly Income vs Expenses</h3>

          <div className="h-80 w-full animate-fade-in">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yearlyData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={false} axisLine={{ stroke: "#e2e8f0" }} />
                <YAxis
                  tickFormatter={(value) => (currency === "USD" ? `$${value / 1000}k` : `${value / 1000}k IQD`)}
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: "#e2e8f0" }}
                  width={55}
                />
                <Tooltip content={<CustomBarTooltip />} />
                <Bar dataKey="income" fill="#4F46E5" radius={[4, 4, 0, 0]} name="Income" />
                <Bar dataKey="expenses" fill="#F59E0B" radius={[4, 4, 0, 0]} name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContainer>

        <CardContainer>
          <ChipLabel className="mb-2 animate-slide-up">
            Budget Breakdown
          </ChipLabel>
          <h3 className="text-xl font-semibold mb-6 animate-slide-up stagger-1">Expense Categories</h3>

          <div className="h-80 w-full animate-fade-in flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContainer>
      </div>

      <CardContainer>
        <ChipLabel className="mb-2 animate-slide-up">
          Savings Progress
        </ChipLabel>
        <h3 className="text-xl font-semibold mb-6 animate-slide-up stagger-1">Monthly Savings Trend</h3>

        <div className="h-80 w-full animate-fade-in">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={yearlyData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={false} axisLine={{ stroke: "#e2e8f0" }} />
              <YAxis
                tickFormatter={(value) => (currency === "USD" ? `$${value / 1000}k` : `${value / 1000}k IQD`)}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: "#e2e8f0" }}
                width={55}
              />
              <Tooltip content={<CustomBarTooltip />} />
              <Bar dataKey="savings" fill="#10B981" radius={[4, 4, 0, 0]} name="Savings" animationDuration={1000} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContainer>
    </MainLayout>
  )
}

export default Analysis