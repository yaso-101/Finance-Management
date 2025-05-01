import { ArrowUpRight, ArrowDownRight, Wallet } from "lucide-react"
import CardContainer from "../common/CardContainer"
import ChipLabel from "../common/ChipLabel"
import { formatCurrency } from "@/lib/utils"
import type { CurrencyType } from "./IncomeForm"

interface BalanceCardProps {
  balance: number
  growth?: number
  currency: CurrencyType
}

const BalanceCard = ({ balance, growth = 8.5, currency }: BalanceCardProps) => {
  const isPositive = growth >= 0

  return (
    <CardContainer className="flex flex-col justify-between h-full overflow-hidden">
      {/* Top Section */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col items-start">
          <ChipLabel variant="primary" className="mb-2 animate-slide-up stagger-1">
            Current Balance
          </ChipLabel>
        </div>
        <div className="h-14 w-14 bg-primary/10 rounded-full flex items-center justify-center animate-slide-in-right">
          <Wallet className="h-7 w-7 text-primary" />
        </div>
      </div>

      {/* Centered Currency Value */}
      <div className="flex-grow flex justify-center items-center">
        <h3 className="text-3xl md:text-4xl font-display font-semibold animate-slide-up stagger-2">
          {formatCurrency(balance, currency)}
        </h3>
      </div>
    </CardContainer>
  )
}

export default BalanceCard