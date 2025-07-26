import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Product } from '@/types/product';
import { CATEGORY_LABELS } from '@/lib/constants';
import { formatPrice, formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';
import LoadingSpinner from '../ui/LoadingSpinner';

interface ProductInfoProps {
  product: Product;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
  className?: string;
}

export function ProductInfo({ product, onEdit, onDelete, isDeleting, className }: ProductInfoProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {product.name}
            </h1>
            {product.brand && (
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
                by {product.brand}
              </p>
            )}
            <div className="flex items-center gap-3">
              <Badge variant={product.inStock ? 'success' : 'error'}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </Badge>
              <Badge variant="secondary">
                {CATEGORY_LABELS[product.category]}
              </Badge>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <span className="text-4xl font-bold text-primary-600">
            {formatPrice(product.price)}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Description
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          {product.sku && (
            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400 block">
                SKU
              </span>
              <span className="text-gray-900 dark:text-white font-mono">
                {product.sku}
              </span>
            </div>
          )}
          
          <div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 block">
              Category
            </span>
            <span className="text-gray-900 dark:text-white">
              {CATEGORY_LABELS[product.category]}
            </span>
          </div>

          {product.rating && (
            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400 block">
                Rating
              </span>
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating!)
                          ? 'text-yellow-400'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {product.rating.toFixed(1)}
                  {product.reviewCount && ` (${product.reviewCount} reviews)`}
                </span>
              </div>
            </div>
          )}

          <div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 block">
              Added partying
            </span>
            <span className="text-gray-900 dark:text-white">
              {formatDate(product.createdAt)}
            </span>
          </div>
        </div>

        {product.tags && product.tags.length > 0 && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-2">
              Tags
            </span>
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag, index) => (
                <Badge key={index} className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
        <Button onClick={onEdit} className="flex-1 sm:flex-none">
          Edit Product
        </Button>
        <Button
          variant="primary"
          onClick={onDelete}
          disabled={isDeleting}
          className="flex-1 sm:flex-none text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 dark:text-red-400 dark:border-red-700 dark:hover:bg-red-900/20"
        >
          {isDeleting ? (
            <>
              <LoadingSpinner size="sm" />
              <span className="ml-2">Deleting...</span>
            </>
          ) : (
            'Delete Product'
          )}
        </Button>
      </div>
    </div>
  );
}