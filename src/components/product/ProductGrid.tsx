import React, { useMemo } from 'react';
import { Product } from '@/types/product';
import { BaseComponent } from '@/types/common';
import { cn } from '@/lib/utils';
import ProductCard from './ProductCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export interface ProductGridProps extends BaseComponent {
  products: Product[];
  loading?: boolean;
  onAddToCart?: (product: Product) => void;
  onToggleFavorite?: (productId: string) => void;
  favoriteProductIds?: string[];
  variant?: 'default' | 'compact' | 'detailed';
  columns?: {
    mobile?: 1 | 2;
    tablet?: 2 | 3 | 4;
    desktop?: 3 | 4 | 5 | 6;
  };
  emptyState?: React.ReactNode;
  showActions?: boolean;
}

const ProductGrid = React.memo(React.forwardRef<HTMLDivElement, ProductGridProps>(
  ({
    className,
    products,
    loading = false,
    onAddToCart,
    onToggleFavorite,
    favoriteProductIds = [],
    variant = 'default',
    columns = {
      mobile: 1,
      tablet: 2,
      desktop: 3
    },
    emptyState,
    showActions = true,
    ...props
  }, ref) => {
    const gridClasses = useMemo(() => {
      const mobileClass = `grid-cols-${columns.mobile}`;
      const tabletClass = `md:grid-cols-${columns.tablet}`;
      const desktopClass = `lg:grid-cols-${columns.desktop}`;
      
      return `grid gap-6 ${mobileClass} ${tabletClass} ${desktopClass}`;
    }, [columns.mobile, columns.tablet, columns.desktop]);

// Memoize empty state component
const DefaultEmptyState = useMemo(() => {
  const EmptyStateComponent = () => (
    <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <svg
          className="w-8 h-8 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No products found
      </h3>
      <p className="text-gray-500 max-w-md">
        We couldn&apos;t find any products matching your criteria. Try adjusting your filters or search terms.
      </p>
    </div>
  );
  
  EmptyStateComponent.displayName = 'DefaultEmptyState';
  return EmptyStateComponent;
}, []);

    if (loading) {
      return (
        <div ref={ref} className={cn(className)} {...props}>
          <LoadingSpinner />
        </div>
      );
    }

    return (
      <div ref={ref} className={cn(className)} {...props}>
        {products.length === 0 ? (
          <div className="col-span-full">
            {emptyState || <DefaultEmptyState />}
          </div>
        ) : (
          <div className={cn(gridClasses)}>
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                variant={variant}
                onAddToCart={onAddToCart}
                onToggleFavorite={onToggleFavorite}
                isFavorite={favoriteProductIds.includes(product.id)}
                showActions={showActions}
                priority={index < 4}
                className="animate-fade-in"
              />
            ))}
          </div>
        )}
      </div>
    );
  }
));

ProductGrid.displayName = 'ProductGrid';

export default ProductGrid;