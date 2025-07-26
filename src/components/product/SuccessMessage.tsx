import Button from '@/components/ui/Button';
import { Product } from '@/types/product';

interface SuccessMessageProps {
  product: Product;
  isEdit: boolean;
  onAddNew: () => void;
  onViewProduct: () => void;
  onViewAll: () => void;
  className?: string;
}

export function SuccessMessage({
  product,
  isEdit,
  onAddNew,
  onViewProduct,
  onViewAll,
  className,
}: SuccessMessageProps) {
  return (
    <div className={`max-w-2xl mx-auto text-center py-16 ${className}`}>
      <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg
          className="w-8 h-8 text-green-600 dark:text-green-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
        Product {isEdit ? 'Updated' : 'Created'} Successfully!
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-8">
        <strong>{product.name}</strong> has been {isEdit ? 'updated in' : 'added to'} your product catalog.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={onViewProduct} className="sm:flex-none">
          View Product
        </Button>
        {!isEdit && (
          <Button variant="secondary" onClick={onAddNew} className="sm:flex-none">
            Add Another Product
          </Button>
        )}
        <Button variant="ghost" onClick={onViewAll} className="sm:flex-none">
          View All Products
        </Button>
      </div>
    </div>
  );
}