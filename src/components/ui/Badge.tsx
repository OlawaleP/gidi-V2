import React from 'react';
import { cn } from '@/lib/utils';
import { BaseComponent, Size, Variant } from '@/types/common';

export interface BadgeProps extends BaseComponent {
  variant?: Variant | 'info';
  size?: Size;
  rounded?: boolean;
  dot?: boolean;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({
    className,
    children,
    variant = 'primary',
    size = 'sm',
    rounded = false,
    dot = false,
    ...props
  }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200';
    
    const variantClasses = {
      primary: 'bg-blue-100 text-blue-800 border border-blue-200',
      secondary: 'bg-gray-100 text-gray-800 border border-gray-200',
      success: 'bg-green-100 text-green-800 border border-green-200',
      warning: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      error: 'bg-red-100 text-red-800 border border-red-200',
      info: 'bg-cyan-100 text-cyan-800 border border-cyan-200',
      ghost: 'bg-transparent text-gray-600 border border-gray-300'
    };

    const sizeClasses = {
      xs: 'px-1.5 py-0.5 text-xs',
      sm: 'px-2 py-1 text-xs',
      md: 'px-2.5 py-1 text-sm',
      lg: 'px-3 py-1.5 text-sm',
      xl: 'px-4 py-2 text-base'
    };

    const roundedClasses = rounded ? 'rounded-full' : 'rounded-md';

    return (
      <span
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          roundedClasses,
          className
        )}
        {...props}
      >
        {dot && (
          <span className="w-1.5 h-1.5 bg-current rounded-full mr-1.5" />
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;