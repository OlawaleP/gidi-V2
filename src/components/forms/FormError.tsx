import React from 'react';
import { BaseComponent } from '@/types/common';
import { ValidationError } from '@/lib/validation';
import { cn } from '@/lib/utils';

interface FormErrorProps extends BaseComponent {
  error?: string | ValidationError | ValidationError[];
  field?: string;
  showIcon?: boolean;
}

export const FormError: React.FC<FormErrorProps> = ({
  error,
  field,
  showIcon = true,
  className,
  children
}) => {
  if (!error && !children) {
    return null;
  }

  const renderError = () => {
    if (children) {
      return children;
    }

    if (typeof error === 'string') {
      return error;
    }

    if (Array.isArray(error)) {
      if (field) {
        const fieldError = error.find(e => e.field === field);
        return fieldError?.message || null;
      }

      return error.length > 0 ? (
        <ul className="list-disc list-inside space-y-1">
          {error.map((err, index) => (
            <li key={index} className="text-sm">
              <span className="font-medium">{err.field}:</span> {err.message}
            </li>
          ))}
        </ul>
      ) : null;
    }

    if (error && typeof error === 'object' && 'field' in error) {
      return error.message;
    }

    return null;
  };

  const errorContent = renderError();

  if (!errorContent) {
    return null;
  }

  return (
    <div
      className={cn(
        'flex items-start space-x-2 text-red-600',
        className
      )}
      role="alert"
      aria-live="polite"
    >
      {showIcon && (
        <svg
          className="w-4 h-4 mt-0.5 flex-shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      )}
      <div className="text-sm flex-1">
        {errorContent}
      </div>
    </div>
  );
};

interface InlineErrorProps extends BaseComponent {
  message?: string;
  show?: boolean;
}

export const InlineError: React.FC<InlineErrorProps> = ({
  message,
  show = true,
  className,
  children
}) => {
  if (!show || (!message && !children)) {
    return null;
  }

  return (
    <p
      className={cn(
        'mt-1 text-sm text-red-600',
        className
      )}
      role="alert"
      aria-live="polite"
    >
      {children || message}
    </p>
  );
};

interface ErrorSummaryProps extends BaseComponent {
  errors: ValidationError[];
  title?: string;
  showTitle?: boolean;
}

export const ErrorSummary: React.FC<ErrorSummaryProps> = ({
  errors,
  title = 'Please correct the following errors:',
  showTitle = true,
  className
}) => {
  if (!errors || errors.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        'rounded-md bg-red-50 border border-red-200 p-4',
        className
      )}
      role="alert"
      aria-live="polite"
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-red-400"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          {showTitle && (
            <h3 className="text-sm font-medium text-red-800 mb-2">
              {title}
            </h3>
          )}
          <div className="text-sm text-red-700">
            <ul className="list-disc list-inside space-y-1">
              {errors.map((error, index) => (
                <li key={index}>
                  <span className="font-medium capitalize">{error.field}:</span>{' '}
                  {error.message}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

interface SuccessMessageProps extends BaseComponent {
  message: string;
  show?: boolean;
  showIcon?: boolean;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({
  message,
  show = true,
  showIcon = true,
  className
}) => {
  if (!show || !message) {
    return null;
  }

  return (
    <div
      className={cn(
        'rounded-md bg-green-50 border border-green-200 p-4',
        className
      )}
      role="alert"
      aria-live="polite"
    >
      <div className="flex">
        {showIcon && (
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-green-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
        <div className="ml-3">
          <p className="text-sm font-medium text-green-800">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};