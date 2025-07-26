import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ currentPage, totalPages, onPageChange, className }: PaginationProps) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pages.push(1);
    if (currentPage > 3) pages.push('...');
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
    return pages;
  };

  return (
    <nav className={cn('flex justify-center items-center gap-2', className)} aria-label="Pagination">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Previous page"
      >
        Previous
      </Button>
      {getPageNumbers().map((page, index) => (
        <button
          key={`${page}-${index}`}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          disabled={typeof page === 'string'}
          className={cn(
            'px-3 py-2 text-sm font-medium rounded-md transition-colors',
            typeof page === 'string'
              ? 'text-gray-400 cursor-not-allowed'
              : page === currentPage
              ? 'bg-primary-600 text-white'
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
          )}
          aria-current={page === currentPage ? 'page' : undefined}
          aria-label={typeof page === 'number' ? `Page ${page}` : undefined}
        >
          {page}
        </button>
      ))}
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="Next page"
      >
        Next
      </Button>
    </nav>
  );
}