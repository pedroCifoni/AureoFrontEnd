import React, { type ReactNode } from 'react';
import { cn } from './Button'; // importando o utilitário cn

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-xs font-medium uppercase tracking-widest text-text-muted">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            className={cn(
              'w-full bg-elevated border rounded-button px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold transition-colors',
              error ? 'border-danger' : 'border-border',
              icon && 'pr-10', // padding if icon is on the right
              className
            )}
            {...props}
          />
          {icon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors">
              {icon}
            </div>
          )}
        </div>
        {error && <span className="text-xs text-danger">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
