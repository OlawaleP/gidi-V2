import React from 'react';
import { cn } from '@/lib/utils';
import { BaseComponent, Size } from '@/types/common';

export interface LoadingSpinnerProps extends BaseComponent {
  size?: Size;
  color?: 'primary' | 'secondary' | 'white' | 'gray';
  thickness?: 'thin' | 'medium' | 'thick';
}

const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({
    className,
    size = 'md',
    color = 'primary',
    thickness = 'medium',
    ...props
  }, ref) => {
    const sizeClasses = {
      xs: 'w-3 h-3',
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
      xl: 'w-12 h-12'
    };

    const colorClasses = {
      primary: 'text-blue-600',
      secondary: 'text-gray-600',
      white: 'text-white',
      gray: 'text-gray-400'
    };

    const thicknessClasses = {
      thin: 'border-2',
      medium: 'border-3',
      thick: 'border-4'
    };

    return (
      <div
        ref={ref}
        className={cn(
          'animate-spin rounded-full border-solid border-current border-r-transparent',
          sizeClasses[size],
          colorClasses[color],
          thicknessClasses[thickness],
          className
        )}
        {...props}
      />
    );
  }
);

LoadingSpinner.displayName = 'LoadingSpinner';

// Overlay variant for full-screen loading
export const LoadingOverlay = React.forwardRef<HTMLDivElement, Omit<LoadingSpinnerProps, 'size'> & { message?: string }>(
  ({
    className,
    message,
    color = 'primary',
    thickness = 'medium',
    ...props
  }, ref) => (
    <div
      ref={ref}
      className={cn(
        'fixed inset-0 z-50 flex flex-col items-center justify-center bg-white bg-opacity-80 backdrop-blur-sm',
        className
      )}
      {...props}
    >
      <LoadingSpinner size="xl" color={color} thickness={thickness} />
      {message && (
        <p className="mt-4 text-sm text-gray-600 font-medium">
          {message}
        </p>
      )}
    </div>
  )
);

LoadingOverlay.displayName = 'LoadingOverlay';

export default LoadingSpinner;