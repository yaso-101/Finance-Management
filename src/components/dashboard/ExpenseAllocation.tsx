"use client"

import { useState, useEffect } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { Home, Lightbulb, ShoppingBag, Car, Film, PiggyBank, Utensils, Edit, Plus, Trash2, Check } from "lucide-react"
import CardContainer from "../common/CardContainer"
import ChipLabel from "../common/ChipLabel"
import type { AllocationSuggestion, ExpenseCategory } from "@/utils/financeUtils"
import { formatCurrency, formatPercentage } from "@/lib/utils"
import type { CurrencyType } from "./IncomeForm"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ExpenseAllocationProps {
  allocations: AllocationSuggestion[]
  currency: CurrencyType
}

// Icon mapping for categories
const CategoryIcon = ({ category }: { category: ExpenseCategory }) => {
  const icons = {
    housing: Home,
    utilities: Lightbulb,
    food: Utensils,
    transportation: Car,
    entertainment: Film,
    shopping: ShoppingBag,
    savings: PiggyBank,
  }

  const IconComponent = icons[category as keyof typeof icons] || ShoppingBag

  return <IconComponent className="h-4 w-4" />
}

// Function to display shortened category names
const getShortenedCategory = (category: ExpenseCategory): string => {
  const shortNames: Record<string, string> = {
    housing: "House",
    utilities: "Utils",
    food: "Food",
    transportation: "Transit",
    entertainment: "Ent",
    shopping: "Shop",
    savings: "Save",
    healthcare: "Health",
    education: "Edu",
    // Add any other categories that might be used
  }

  return shortNames[category] || category
}

// Custom colors for pie chart
const COLORS = [
  "#4F46E5", // indigo-600
  "#0EA5E9", // sky-500
  "#10B981", // emerald-500
  "#F59E0B", // amber-500
  "#8B5CF6", // violet-500
  "#EC4899", // pink-500
  "#6366F1", // indigo-500
  "#3B82F6", // blue-500
  "#9CA3AF", // gray-400
]

const ExpenseAllocation = ({ allocations, currency }: ExpenseAllocationProps) => {
  const [showAll, setShowAll] = useState(false)
  const [visibleItems, setVisibleItems] = useState<number[]>([])
  const [animationComplete, setAnimationComplete] = useState(true)
  const [customAllocations, setCustomAllocations] = useState<AllocationSuggestion[]>([])
  const [isCustomizing, setIsCustomizing] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [currentEditItem, setCurrentEditItem] = useState<AllocationSuggestion | null>(null)
  const [currentEditIndex, setCurrentEditIndex] = useState<number | null>(null)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryIcon, setNewCategoryIcon] = useState<ExpenseCategory>("shopping")
  const [newCategoryPercentage, setNewCategoryPercentage] = useState("0")
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [currencyType, setCurrencyType] = useState<"IQD" | "$">("IQD")

  // Initialize custom allocations with the provided allocations
  useEffect(() => {
    if (allocations.length > 0 && customAllocations.length === 0) {
      setCustomAllocations([...allocations])
    }
  }, [allocations, customAllocations.length])

  // Format data for pie chart
  const displayedAllocations = isCustomizing ? customAllocations : allocations
  const filteredAllocations = displayedAllocations.filter((allocation) => allocation.percentage > 0)
  const pieData = filteredAllocations.map((allocation) => ({
    name: allocation.category,
    value: allocation.percentage,
  }))

  // Handle animation of items when showing all
  useEffect(() => {
    if (showAll) {
      // Set animation as not complete
      setAnimationComplete(false)

      // Clear visible items first
      setVisibleItems([])

      // Add items one by one with delay
      const initialCount = Math.min(5, filteredAllocations.length)

      // Start with initial items already visible
      const initialItems = Array.from({ length: initialCount }, (_, i) => i)
      setVisibleItems(initialItems)

      // Then animate the rest
      filteredAllocations.slice(initialCount).forEach((_, index) => {
        const actualIndex = index + initialCount
        setTimeout(
          () => {
            setVisibleItems((prev) => [...prev, actualIndex])

            // If this is the last item, mark animation as complete
            if (actualIndex === filteredAllocations.length - 1) {
              setAnimationComplete(true)
            }
          },
          400 * (index + 1),
        ) // 400ms delay between each item
      })
    } else {
      // When hiding, just show the first 5
      setVisibleItems(Array.from({ length: Math.min(5, filteredAllocations.length) }, (_, i) => i))
      setAnimationComplete(true)
    }
  }, [showAll, filteredAllocations.length])

  // Custom tooltip for the pie chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border border-slate-100">
          <p className="text-sm font-medium capitalize">{data.name}</p>
          <p className="text-sm font-semibold text-primary">{formatPercentage(data.value)}</p>
        </div>
      )
    }
    return null
  }

  // Edit an allocation
  const handleEditAllocation = () => {
    if (currentEditItem && currentEditIndex !== null) {
      const newAllocations = [...customAllocations]
      newAllocations[currentEditIndex] = currentEditItem
      setCustomAllocations(newAllocations)
      setEditDialogOpen(false)
    }
  }

  // Delete an allocation
  const handleDeleteAllocation = (index: number) => {
    const newAllocations = [...customAllocations]
    newAllocations.splice(index, 1)
    setCustomAllocations(newAllocations)
  }

  // Add a new allocation
  const handleAddAllocation = () => {
    const percentage = Number.parseFloat(newCategoryPercentage)
    if (newCategoryName && percentage > 0) {
      // Calculate amount based on percentage and total
      const totalAmount = customAllocations.reduce((sum, item) => sum + item.amount, 0)
      const newAmount = (totalAmount / (100 - percentage)) * percentage

      const newAllocation: AllocationSuggestion = {
        category: newCategoryName.toLowerCase() as ExpenseCategory,
        percentage: percentage,
        amount: newAmount,
      }

      setCustomAllocations([...customAllocations, newAllocation])
      setNewCategoryName("")
      setNewCategoryIcon("shopping")
      setNewCategoryPercentage("0")
      setAddDialogOpen(false)
    }
  }

  // Open edit dialog for an allocation
  const openEditDialog = (allocation: AllocationSuggestion, index: number) => {
    setCurrentEditItem({ ...allocation })
    setCurrentEditIndex(index)
    setEditDialogOpen(true)
  }

  // Available icons for selection
  const availableIcons: ExpenseCategory[] = [
    "housing",
    "utilities",
    "food",
    "transportation",
    "entertainment",
    "shopping",
    "savings",
  ]

  return (
    <CardContainer className="h-full">
      <div className="flex justify-between items-start mb-6">
        <div>
          <ChipLabel variant="primary" className="mb-2 animate-slide-up stagger-1">
            Suggested Allocation
          </ChipLabel>
          <h3 className="text-xl font-semibold animate-slide-up stagger-2">Monthly Budget</h3>
        </div>
        <div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCustomizing(!isCustomizing)}
            className="flex items-center gap-1"
          >
            {isCustomizing ? <Check className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
            {isCustomizing ? "Save" : "Customize"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
        <div className="h-64 animate-fade-in">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-3 animate-slide-up stagger-3">
          {/* This div maintains height during animation */}
          <div
            className="relative"
            style={{
              minHeight:
                showAll && !animationComplete
                  ? `${Math.min(5, filteredAllocations.length) * 60 + (filteredAllocations.length - 5) * 60}px`
                  : "auto",
            }}
          >
            {filteredAllocations.map(
              (allocation, index) =>
                visibleItems.includes(index) && (
                  <div
                    key={`${allocation.category}-${index}`}
                    className="flex items-center p-3 bg-slate-50 rounded-lg mb-3"
                    style={{
                      opacity: 0,
                      transform: "translateY(20px)",
                      animation: visibleItems.includes(index)
                        ? `fadeSlideIn 0.6s ease-out forwards ${index > 4 ? (index - 5) * 0.4 : 0}s`
                        : "none",
                    }}
                  >
                    <div
                      className="h-7 w-7 rounded-full flex-shrink-0 flex items-center justify-center mr-3"
                      style={{ backgroundColor: `${COLORS[index % COLORS.length]}20` }}
                    >
                      <div className="flex items-center justify-center">
                        <CategoryIcon category={allocation.category} />
                      </div>
                    </div>
                    <div className="flex flex-col flex-grow min-w-0">
                      <p className="text-sm font-medium truncate">{getShortenedCategory(allocation.category)}</p>
                      <p className="text-xs text-slate-500 truncate">{formatCurrency(allocation.amount, currency)}</p>
                    </div>
                    {isCustomizing && (
                      <div className="flex gap-1 flex-shrink-0 ml-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => openEditDialog(allocation, index)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-destructive"
                          onClick={() => handleDeleteAllocation(index)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                ),
            )}
          </div>

          {isCustomizing && (
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full flex items-center justify-center gap-1 mt-2">
                  <Plus className="h-4 w-4" /> Add New Section
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Budget Category</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category-name">Category Name</Label>
                    <Input
                      id="category-name"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="e.g., Travel"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category-icon">Icon</Label>
                    <Select
                      value={newCategoryIcon}
                      onValueChange={(value) => setNewCategoryIcon(value as ExpenseCategory)}
                    >
                      <SelectTrigger id="category-icon">
                        <SelectValue placeholder="Select an icon" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableIcons.map((icon) => (
                          <SelectItem key={icon} value={icon}>
                            <div className="flex items-center gap-2">
                              <CategoryIcon category={icon} />
                              <span className="capitalize">{getShortenedCategory(icon)}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="category-percentage">Amount</Label>
                      <div className="flex items-center border rounded-md overflow-hidden">
                        <button
                          type="button"
                          className={`px-3 py-1 text-xs font-medium ${currencyType === "IQD" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                          onClick={() => setCurrencyType("IQD")}
                        >
                          IQD
                        </button>
                        <button
                          type="button"
                          className={`px-3 py-1 text-xs font-medium ${currencyType === "$" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                          onClick={() => setCurrencyType("$")}
                        >
                          $
                        </button>
                      </div>
                    </div>
                    <Input
                      id="category-percentage"
                      type="number"
                      min="0"
                      value={newCategoryPercentage}
                      onChange={(e) => setNewCategoryPercentage(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleAddAllocation}>Add Category</Button>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {isCustomizing && (
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Budget Category</DialogTitle>
                </DialogHeader>
                {currentEditItem && (
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="edit-category-name">Category Name</Label>
                      <Input
                        id="edit-category-name"
                        value={currentEditItem.category}
                        onChange={(e) =>
                          setCurrentEditItem({ ...currentEditItem, category: e.target.value as ExpenseCategory })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-category-icon">Icon</Label>
                      <Select
                        value={currentEditItem.category}
                        onValueChange={(value) =>
                          setCurrentEditItem({ ...currentEditItem, category: value as ExpenseCategory })
                        }
                      >
                        <SelectTrigger id="edit-category-icon">
                          <SelectValue placeholder="Select an icon" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableIcons.map((icon) => (
                            <SelectItem key={icon} value={icon}>
                              <div className="flex items-center gap-2">
                                <CategoryIcon category={icon} />
                                <span className="capitalize">{getShortenedCategory(icon)}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="edit-category-percentage">Amount</Label>
                        <div className="flex items-center border rounded-md overflow-hidden">
                          <button
                            type="button"
                            className={`px-3 py-1 text-xs font-medium ${currencyType === "IQD" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                            onClick={() => setCurrencyType("IQD")}
                          >
                            IQD
                          </button>
                          <button
                            type="button"
                            className={`px-3 py-1 text-xs font-medium ${currencyType === "$" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                            onClick={() => setCurrencyType("$")}
                          >
                            $
                          </button>
                        </div>
                      </div>
                      <Input
                        id="edit-category-percentage"
                        type="number"
                        min="0"
                        value={currentEditItem.percentage}
                        onChange={(e) =>
                          setCurrentEditItem({ ...currentEditItem, percentage: Number.parseFloat(e.target.value) })
                        }
                      />
                    </div>
                  </div>
                )}
                <div className="flex justify-end">
                  <Button onClick={handleEditAllocation}>Save Changes</Button>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {!isCustomizing && filteredAllocations.length > 5 && !showAll && (
            <div className="text-center pt-2">
              <button
                className="text-sm text-primary hover:text-primary/80 font-medium"
                onClick={() => setShowAll(true)}
                disabled={!animationComplete}
              >
                View all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add keyframe animation for the fade-slide effect */}
      <style>{`
        @keyframes fadeSlideIn {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </CardContainer>
  )
}

export default ExpenseAllocation