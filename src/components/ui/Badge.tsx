import React from 'react';
import { cn } from './Button';

export type BadgeVariant = 'success' | 'danger' | 'warning' | 'default';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const badgeVariants: Record<BadgeVariant, string> = {
  success: 'bg-success/10 text-success border-success/20',
  danger: 'bg-danger/10 text-danger border-danger/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
  default: 'bg-elevated text-text-primary border-border',
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1 px-2 py-0.5 rounded-badge text-xs font-medium border',
          badgeVariants[variant],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
