import React from 'react';
import { BaseComponent } from '@/types/common';
import { cn } from '@/lib/utils';

interface FormFieldProps extends BaseComponent {
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
  helpText?: string;
  labelClassName?: string;
  errorClassName?: string;
  helpTextClassName?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  htmlFor,
  error,
  required = false,
  helpText,
  children,
  className,
  labelClassName,
  errorClassName,
  helpTextClassName
}) => {
  return (
    <div className={cn('space-y-1', className)}>
      <label
        htmlFor={htmlFor}
        className={cn(
          'block text-sm font-medium text-gray-700',
          labelClassName
        )}
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="required">
            *
          </span>
        )}
      </label>

      <div className="relative">
        {children}
      </div>

      {error && (
        <p
          className={cn(
            'text-sm text-red-600',
            errorClassName
          )}
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}

      {helpText && !error && (
        <p
          className={cn(
            'text-sm text-gray-500',
            helpTextClassName
          )}
        >
          {helpText}
        </p>
      )}
    </div>
  );
};

interface TextFieldProps extends Omit<FormFieldProps, 'children'> {
  type?: 'text' | 'email' | 'url' | 'tel' | 'password';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  autoComplete?: string;
  inputClassName?: string;
}

export const TextField: React.FC<TextFieldProps> = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  disabled = false,
  autoComplete,
  inputClassName,
  error,
  ...fieldProps
}) => {
  return (
    <FormField error={error} {...fieldProps}>
      <input
        type={type}
        id={fieldProps.htmlFor}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete={autoComplete}
        className={cn(
          'block w-full rounded-md border-gray-300 shadow-sm',
          'focus:border-blue-500 focus:ring-blue-500',
          'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
          error && 'border-red-300 focus:border-red-500 focus:ring-red-500',
          inputClassName
        )}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${fieldProps.htmlFor}-error` : undefined}
      />
    </FormField>
  );
};

interface NumberFieldProps extends Omit<FormFieldProps, 'children'> {
  value: string | number;
  onChange: (value: string) => void;
  min?: number;
  max?: number;
  step?: string | number;
  placeholder?: string;
  disabled?: boolean;
  inputClassName?: string;
}

export const NumberField: React.FC<NumberFieldProps> = ({
  value,
  onChange,
  min,
  max,
  step,
  placeholder,
  disabled = false,
  inputClassName,
  error,
  ...fieldProps
}) => {
  return (
    <FormField error={error} {...fieldProps}>
      <input
        type="number"
        id={fieldProps.htmlFor}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          'block w-full rounded-md border-gray-300 shadow-sm',
          'focus:border-blue-500 focus:ring-blue-500',
          'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
          error && 'border-red-300 focus:border-red-500 focus:ring-red-500',
          inputClassName
        )}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${fieldProps.htmlFor}-error` : undefined}
      />
    </FormField>
  );
};

interface TextAreaFieldProps extends Omit<FormFieldProps, 'children'> {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
  inputClassName?: string;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export const TextAreaField: React.FC<TextAreaFieldProps> = ({
  value,
  onChange,
  placeholder,
  disabled = false,
  rows = 3,
  inputClassName,
  resize = 'vertical',
  error,
  ...fieldProps
}) => {
  const resizeClass = {
    none: 'resize-none',
    vertical: 'resize-y',
    horizontal: 'resize-x',
    both: 'resize'
  }[resize];

  return (
    <FormField error={error} {...fieldProps}>
      <textarea
        id={fieldProps.htmlFor}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className={cn(
          'block w-full rounded-md border-gray-300 shadow-sm',
          'focus:border-blue-500 focus:ring-blue-500',
          'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
          error && 'border-red-300 focus:border-red-500 focus:ring-red-500',
          resizeClass,
          inputClassName
        )}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${fieldProps.htmlFor}-error` : undefined}
      />
    </FormField>
  );
};

interface CheckboxFieldProps extends Omit<FormFieldProps, 'children' | 'htmlFor'> {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  inputClassName?: string;
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  id,
  checked,
  onChange,
  disabled = false,
  inputClassName,
  error,
  ...fieldProps
}) => {
  return (
    <FormField htmlFor={id} error={error} {...fieldProps}>
      <div className="flex items-center">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className={cn(
            'h-4 w-4 text-blue-600 border-gray-300 rounded',
            'focus:ring-blue-500 focus:ring-2',
            'disabled:text-gray-400 disabled:cursor-not-allowed',
            error && 'border-red-300 focus:ring-red-500',
            inputClassName
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        <label
          htmlFor={id}
          className="ml-2 block text-sm text-gray-900 cursor-pointer"
        >
          {fieldProps.label}
          {fieldProps.required && (
            <span className="text-red-500 ml-1" aria-label="required">
              *
            </span>
          )}
        </label>
      </div>
    </FormField>
  );
};