import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', isLoading, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={isLoading || props.disabled}
        className={cn(
          'inline-flex items-center justify-center text-sm px-4 py-2 rounded-button font-semibold transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-base disabled:opacity-40 disabled:cursor-not-allowed',
          variant === 'primary' && 'bg-gold hover:bg-gold-muted text-base',
          variant === 'secondary' &&
            'border border-border text-text-secondary hover:text-text-primary hover:border-text-secondary',
          className
        )}
        {...props}
      >
        {isLoading ? 'Carregando...' : children}
      </button>
    );
  }
);

Button.displayName = 'Button';
