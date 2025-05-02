import React from "react";
import { cn } from "@/lib/utils";

const ChipLabel = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary",
        className
      )}
    >
      {children}
    </span>
  );
};

export default ChipLabel;
