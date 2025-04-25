
import React from "react";
import { cn } from "@/lib/utils";

interface ChipLabelProps {
  children: React.ReactNode;
  variant?: "default" | "primary" | "success" | "warning" | "destructive";
  className?: string;
}

const ChipLabel = ({
  children,
  variant = "default",
  className,
}: ChipLabelProps) => {
  const variantClasses = {
    default: "bg-secondary text-secondary-foreground",
    primary: "bg-primary/10 text-primary",
    success: "bg-green-100 text-green-700",
    warning: "bg-amber-100 text-amber-700",
    destructive: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

export default ChipLabel;
