import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-sky-600 via-cyan-600 to-teal-500 text-white shadow-[0_10px_30px_rgba(14,165,233,0.24)] hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(14,165,233,0.28)]",
        secondary:
          "bg-sky-50 text-sky-900 ring-1 ring-inset ring-sky-100 hover:bg-sky-100",
        outline:
          "border border-slate-200 bg-white text-slate-900 shadow-sm hover:border-sky-200 hover:bg-sky-50/60 hover:text-sky-900",
        ghost: "text-slate-700 hover:bg-sky-50 hover:text-sky-900",
        destructive: "bg-red-600 text-white hover:bg-red-700",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-lg px-3",
        lg: "h-11 px-6",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
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
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
