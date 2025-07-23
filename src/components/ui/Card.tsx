import React from 'react';
import { cn } from '@/lib/utils';
import { BaseComponent } from '@/types/common';

export interface CardProps extends BaseComponent {
  variant?: 'default' | 'outlined' | 'elevated' | 'ghost';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({
    className,
    children,
    variant = 'default',
    padding = 'md',
    hover = false,
    clickable = false,
    onClick,
    ...props
  }, ref) => {
    const baseClasses = 'rounded-lg transition-all duration-200';
    
    const variantClasses = {
      default: 'bg-white border border-gray-200',
      outlined: 'bg-white border-2 border-gray-300',
      elevated: 'bg-white shadow-lg border border-gray-100',
      ghost: 'bg-gray-50 border border-transparent'
    };

    const paddingClasses = {
      none: '',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
      xl: 'p-8'
    };

    const hoverClasses = hover || clickable
      ? 'hover:shadow-md hover:scale-[1.02] hover:border-gray-300'
      : '';

    const clickableClasses = clickable
      ? 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
      : '';

    return (
      <div
        ref={ref}
        onClick={onClick}
        tabIndex={clickable ? 0 : undefined}
        className={cn(
          baseClasses,
          variantClasses[variant],
          paddingClasses[padding],
          hoverClasses,
          clickableClasses,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// Card sub-components
export const CardHeader = React.forwardRef<HTMLDivElement, BaseComponent>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('pb-3 border-b border-gray-200', className)}
      {...props}
    >
      {children}
    </div>
  )
);

CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<HTMLHeadingElement, BaseComponent>(
  ({ className, children, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-lg font-semibold text-gray-900', className)}
      {...props}
    >
      {children}
    </h3>
  )
);

CardTitle.displayName = 'CardTitle';

export const CardContent = React.forwardRef<HTMLDivElement, BaseComponent>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('py-3', className)}
      {...props}
    >
      {children}
    </div>
  )
);

CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef<HTMLDivElement, BaseComponent>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('pt-3 border-t border-gray-200', className)}
      {...props}
    >
      {children}
    </div>
  )
);

CardFooter.displayName = 'CardFooter';

export default Card;