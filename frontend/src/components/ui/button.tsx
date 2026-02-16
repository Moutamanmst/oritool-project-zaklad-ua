import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-amber-500 text-zinc-900 shadow-lg shadow-amber-500/25 hover:bg-amber-400 focus-visible:ring-amber-500",
        destructive:
          "bg-red-600 text-white shadow-lg shadow-red-600/25 hover:bg-red-500 focus-visible:ring-red-600",
        outline:
          "border-2 border-zinc-700 bg-transparent text-zinc-100 hover:bg-zinc-800 hover:border-amber-500 focus-visible:ring-amber-500",
        secondary:
          "bg-zinc-800 text-zinc-100 hover:bg-zinc-700 focus-visible:ring-zinc-700",
        ghost:
          "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 focus-visible:ring-zinc-700",
        link: "text-amber-500 underline-offset-4 hover:underline focus-visible:ring-amber-500",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

