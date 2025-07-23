import React from 'react';
import { cn } from '@/lib/utils';
import { BaseComponent, Size } from '@/types/common';

export interface TextareaProps extends BaseComponent {
  id?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  rows?: number;
  cols?: number;
  size?: Size;
  disabled?: boolean;
  required?: boolean;
  error?: boolean | string;
  label?: string;
  helperText?: string;
  errorMessage?: string;
  maxLength?: number;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({
    id,
    className,
    placeholder,
    value,
    defaultValue,
    rows = 3,
    cols,
    size = 'md',
    disabled = false,
    required = false,
    error = false,
    label,
    helperText,
    errorMessage,
    maxLength,
    resize = 'vertical',
    onChange,
    onFocus,
    onBlur,
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

    const resizeClasses = {
      none: 'resize-none',
      vertical: 'resize-y',
      horizontal: 'resize-x',
      both: 'resize'
    };

    const characterCount = value ? value.length : 0;
    const showCharacterCount = maxLength && maxLength > 0;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <textarea
          id={id}
          ref={ref}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          rows={rows}
          cols={cols}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          className={cn(
            baseClasses,
            stateClasses,
            sizeClasses[size],
            resizeClasses[resize],
            className
          )}
          {...props}
        />
        
        <div className="flex justify-between items-center mt-1">
          <div>
            {(helperText || errorMessage) && (
              <p className={cn(
                'text-xs',
                error ? 'text-red-600' : 'text-gray-500'
              )}>
                {error && errorMessage ? errorMessage : helperText}
              </p>
            )}
          </div>
          
          {showCharacterCount && (
            <div className="text-xs text-gray-500">
              <span className={cn(
                characterCount > maxLength ? 'text-red-600' : 'text-gray-500'
              )}>
                {characterCount}
              </span>
              <span className="text-gray-400">/{maxLength}</span>
            </div>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;