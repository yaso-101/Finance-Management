
import React from "react";
import { cn } from "@/lib/utils";

interface CardContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

const CardContainer = ({
  children,
  className,
  hoverable = true,
  ...props
}: CardContainerProps) => {
  return (
    <div
      className={cn(
        "glass rounded-xl p-6 border border-white/20",
        hoverable && "card-hover-effect",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default CardContainer;
