
import React, { useState } from "react";
import { Check, PiggyBank, DollarSign} from "lucide-react";
import CardContainer from "../common/CardContainer";
import ChipLabel from "../common/ChipLabel";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFinance } from "@/context/FinanceContext";

interface IncomeFormProps {
  onSubmit: (amount: number) => void;
}

export type CurrencyType = "IQD" | "USD";

const IncomeForm = ({ onSubmit }: IncomeFormProps) => {
  const [amount, setAmount] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { currency, setCurrency } = useFinance();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate a short delay for better UX
    setTimeout(() => {
      onSubmit(Number(amount));
      setAmount("");
      setIsSubmitting(false);
      toast.success(`Income added successfully in ${currency}`);
    }, 600);
  };
  
  const handleCurrencyChange = (value: string) => {
    setCurrency(value as CurrencyType);
  };
  
  // Get the currency symbol for display
  
  return (
    <CardContainer>
      <div className="flex flex-col h-full">
        <div className="flex items-start mb-5">
          <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center mr-4">
            <PiggyBank className="h-5 w-5 text-primary" />
          </div>
          <div>
            <ChipLabel className="mb-1 animate-slide-up">
              Income Allocation
            </ChipLabel>
            <h3 className="text-xl font-semibold animate-slide-up stagger-1">Add Your Income</h3>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="mt-2 animate-slide-up stagger-2">
          <div className="flex gap-2">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {currency === "USD" ? (
                  <DollarSign className="h-5 w-5 text-slate-400" />
                ) : (
                  <span className="text-slate-400 font-medium pl-1">IQD</span>
                )}
              </div>
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="pl-14 pr-4 py-3 w-full rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary transition-colors input-focus-effect"
              />
            </div>
            
            <Select
              value={currency}
              onValueChange={handleCurrencyChange}
            >
              <SelectTrigger className="w-28">
                <SelectValue placeholder="Currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IQD">IQD</SelectItem>
                <SelectItem value="USD">USD ($)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSubmitting ? (
              <span className="animate-pulse">Processing...</span>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Calculate Allocation
              </>
            )}
          </button>
        </form>
        
        <div className="mt-5 pt-5 border-t border-slate-100 animate-slide-up stagger-3">
          <p className="text-sm text-slate-500">
            Enter your income and we'll suggest an optimal allocation across essential categories like housing, utilities, food, and savings.
          </p>
        </div>
      </div>
    </CardContainer>
  );
};

export default IncomeForm;
