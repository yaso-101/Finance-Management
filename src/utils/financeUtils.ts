
// Financial category types
export type ExpenseCategory = 
  | "housing" 
  | "utilities" 
  | "food" 
  | "transportation" 
  | "healthcare" 
  | "entertainment" 
  | "education" 
  | "shopping" 
  | "savings" 
  | "other";

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  date: Date;
  description: string;
}

export interface Income {
  id: string;
  amount: number;
  date: Date;
  source: string;
}

export interface AllocationSuggestion {
  category: ExpenseCategory;
  percentage: number;
  amount: number;
}

// Sample expense categories with recommended percentages
export const DEFAULT_ALLOCATION_PERCENTAGES: Record<ExpenseCategory, number> = {
  housing: 30,
  utilities: 10,
  food: 15,
  transportation: 10,
  healthcare: 10,
  entertainment: 5,
  education: 5,
  shopping: 5,
  savings: 10,
  other: 0,
};

// Generate allocation suggestions based on income
export const generateAllocationSuggestions = (
  income: number,
  userProfile?: {
    allocations?: Partial<Record<ExpenseCategory, number>>;
  }
): AllocationSuggestion[] => {
  // Use custom allocations if available, otherwise use defaults
  const allocations = userProfile?.allocations || DEFAULT_ALLOCATION_PERCENTAGES;
  
  const suggestions: AllocationSuggestion[] = [];
  
  Object.entries(allocations).forEach(([category, percentage]) => {
    suggestions.push({
      category: category as ExpenseCategory,
      percentage,
      amount: (income * percentage) / 100,
    });
  });
  
  // Sort by amount (highest first)
  return suggestions.sort((a, b) => b.amount - a.amount);
};

// Calculate savings projection
export const calculateSavingsForecast = (
  monthlySavings: number,
  months: number,
  annualInterestRate = 0
): number => {
  const monthlyInterestRate = annualInterestRate / 12 / 100;
  
  if (monthlyInterestRate === 0) {
    return monthlySavings * months;
  }
  
  // Compound interest calculation
  let total = 0;
  for (let i = 0; i < months; i++) {
    total += monthlySavings;
    total *= 1 + monthlyInterestRate;
  }
  
  return total;
};

// Generate sample data for charts
export const generateSampleChartData = (months = 6): { date: string; amount: number }[] => {
  const data = [];
  const now = new Date();
  
  for (let i = 0; i < months; i++) {
    const date = new Date(now);
    date.setMonth(now.getMonth() - (months - i - 1));
    
    // Add some randomness to the data
    const baseAmount = 5000;
    const randomFactor = Math.random() * 0.3 + 0.85; // 0.85 to 1.15
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short' }),
      amount: Math.round(baseAmount * randomFactor),
    });
  }
  
  return data;
};

// Generate category icons mapping (returns the name of the icon for use with lucide-react)
export const getCategoryIcon = (category: ExpenseCategory): string => {
  const iconMap: Record<ExpenseCategory, string> = {
    housing: "Home",
    utilities: "Lightbulb",
    food: "Utensils",
    transportation: "Car",
    healthcare: "Stethoscope",
    entertainment: "Film",
    education: "GraduationCap",
    shopping: "ShoppingBag",
    savings: "PiggyBank",
    other: "MoreHorizontal",
  };
  
  return iconMap[category] || "Circle";
};

// Get color for category
export const getCategoryColor = (category: ExpenseCategory): string => {
  const colorMap: Record<ExpenseCategory, string> = {
    housing: "#4F46E5", // indigo-600
    utilities: "#0EA5E9", // sky-500
    food: "#10B981", // emerald-500
    transportation: "#F59E0B", // amber-500
    healthcare: "#EF4444", // red-500
    entertainment: "#8B5CF6", // violet-500
    education: "#EC4899", // pink-500
    shopping: "#6366F1", // indigo-500
    savings: "#3B82F6", // blue-500
    other: "#9CA3AF", // gray-400
  };
  
  return colorMap[category] || "#9CA3AF"; // default to gray
};
