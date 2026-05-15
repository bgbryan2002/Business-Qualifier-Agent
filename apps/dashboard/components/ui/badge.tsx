import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-secondary text-secondary-foreground",
        outline: "border-border text-foreground",
        primary:
          "border-transparent bg-primary text-primary-foreground",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground",
        warn:
          "border-transparent bg-warn text-warn-foreground",
        positive:
          "border-transparent bg-positive text-positive-foreground",
        info:
          "border-transparent bg-info text-info-foreground",
        muted:
          "border-transparent bg-muted text-muted-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}
