import React from 'react';
import { cn } from '@/lib/utils';
import { BaseComponent, Size } from '@/types/common';

export interface InputProps extends BaseComponent {
  id?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'search' | 'url';
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  size?: Size;
  disabled?: boolean;
  required?: boolean;
  error?: boolean | string;
  label?: string;
  helperText?: string;
  errorMessage?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  step?: string;
  min?: string;
  max?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    id,
    className,
    type = 'text',
    placeholder,
    value,
    defaultValue,
    size = 'md',
    disabled = false,
    required = false,
    error = false,
    label,
    helperText,
    errorMessage,
    startIcon,
    endIcon,
    onChange,
    onFocus,
    onBlur,
    step,
    min,
    max,
    ...props
  }, ref) => {
    const baseClasses = 'w-full rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const stateClasses = error
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';

    const sizeClasses = {
      xs: 'px-2 py-1 text-xs',
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-3 py-2 text-sm',
      lg: 'px-4 py-3 text-base',
      xl: 'px-6 py-4 text-lg'
    };

    const hasIcons = startIcon || endIcon;
    const iconPadding = {
      xs: startIcon ? 'pl-8' : endIcon ? 'pr-8' : '',
      sm: startIcon ? 'pl-9' : endIcon ? 'pr-9' : '',
      md: startIcon ? 'pl-10' : endIcon ? 'pr-10' : '',
      lg: startIcon ? 'pl-12' : endIcon ? 'pr-12' : '',
      xl: startIcon ? 'pl-14' : endIcon ? 'pr-14' : ''
    };

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          {startIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div className="text-gray-400">{startIcon}</div>
            </div>
          )}
          
          <input
            id={id}
            ref={ref}
            type={type}
            placeholder={placeholder}
            value={value}
            defaultValue={defaultValue}
            disabled={disabled}
            required={required}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            className={cn(
              baseClasses,
              stateClasses,
              sizeClasses[size],
              hasIcons && iconPadding[size],
              className
            )}
            step={step}
            min={min}
            max={max}
            {...props}
          />
          
          {endIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <div className="text-gray-400">{endIcon}</div>
            </div>
          )}
        </div>
        
        {(helperText || errorMessage) && (
          <p className={cn(
            'mt-1 text-xs',
            error ? 'text-red-600' : 'text-gray-500'
          )}>
            {error && errorMessage ? errorMessage : helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;