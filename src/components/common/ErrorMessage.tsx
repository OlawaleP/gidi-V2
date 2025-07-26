import Button from '@/components/ui/Button';
import { Container } from '@/components/common/Container';
import { cn } from '@/lib/utils';

interface ErrorMessageProps {
  error: string;
  onRetry?: () => void;
  onGoBack?: () => void;
  className?: string;
}

export function ErrorMessage({ error, onRetry, onGoBack, className }: ErrorMessageProps) {
  return (
    <Container className={cn('py-16 text-center', className)}>
      <div className="max-w-md mx-auto">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-red-600 dark:text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          Something Went Wrong
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {onRetry && (
            <Button onClick={onRetry} className="sm:flex-none">
              Try Again
            </Button>
          )}
          {onGoBack && (
            <Button variant="ghost" onClick={onGoBack} className="sm:flex-none">
              Go Back
            </Button>
          )}
        </div>
      </div>
    </Container>
  );
}