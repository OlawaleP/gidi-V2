import React from 'react';
import { cn } from '@/lib/utils';
import { BaseComponent, Size, SelectOption } from '@/types/common';

export interface SelectProps extends BaseComponent {
  id?: string;
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  size?: Size;
  disabled?: boolean;
  required?: boolean;
  error?: boolean | string;
  label?: string;
  helperText?: string;
  errorMessage?: string;
  onChange?: (value: string) => void;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({
    id,
    className,
    options,
    value,
    defaultValue,
    placeholder,
    size = 'md',
    disabled = false,
    required = false,
    error = false,
    label,
    helperText,
    errorMessage,
    onChange,
    ...props
  }, ref) => {
    const baseClasses = 'w-full rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed appearance-none bg-white';
    
    const stateClasses = error
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';

    const sizeClasses = {
      xs: 'px-2 py-1 text-xs pr-8',
      sm: 'px-3 py-1.5 text-sm pr-9',
      md: 'px-3 py-2 text-sm pr-10',
      lg: 'px-4 py-3 text-base pr-12',
      xl: 'px-6 py-4 text-lg pr-14'
    };

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange?.(e.target.value);
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
          <select
            id={id}
            {...props}
            ref={ref}
            value={value}
            defaultValue={defaultValue}
            disabled={disabled}
            required={required}
            onChange={handleChange}
            className={cn(
              baseClasses,
              stateClasses,
              sizeClasses[size],
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
          
          {/* Custom dropdown arrow */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              className="h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
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

Select.displayName = 'Select';

export default Select;