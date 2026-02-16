"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  reviewCount?: number;
  className?: string;
}

export function Rating({
  value,
  max = 5,
  size = "md",
  showValue = true,
  reviewCount,
  className,
}: RatingProps) {
  const sizeClasses = {
    sm: "w-3.5 h-3.5",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: max }).map((_, i) => {
          const filled = i < Math.floor(value);
          const partial = i === Math.floor(value) && value % 1 > 0;

          return (
            <Star
              key={i}
              className={cn(
                sizeClasses[size],
                filled
                  ? "fill-amber-400 text-amber-400"
                  : partial
                  ? "fill-amber-400/50 text-amber-400"
                  : "fill-zinc-700 text-zinc-700"
              )}
            />
          );
        })}
      </div>
      {showValue && (
        <span className={cn("font-semibold text-zinc-100", textSizes[size])}>
          {value.toFixed(1)}
        </span>
      )}
      {reviewCount !== undefined && (
        <span className={cn("text-zinc-500", textSizes[size])}>
          ({reviewCount})
        </span>
      )}
    </div>
  );
}

