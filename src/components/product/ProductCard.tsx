import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { Product } from '@/types/product';
import { BaseComponent } from '@/types/common';
import { cn, formatPrice, truncateText } from '@/lib/utils';
import { DEFAULT_PRODUCT_IMAGE } from '@/lib/constants';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export interface ProductCardProps extends BaseComponent {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onToggleFavorite?: (productId: string) => void;
  isFavorite?: boolean;
  showActions?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
}

const ProductCard = React.forwardRef<HTMLDivElement, ProductCardProps>(
  ({
    className,
    product,
    onAddToCart,
    onToggleFavorite,
    isFavorite = false,
    showActions = true,
    variant = 'default',
    ...props
  }, ref) => {
    const [imageError, setImageError] = React.useState(false);
    const [isHovered, setIsHovered] = React.useState(false);

    const handleImageError = () => {
      setImageError(true);
    };

    const handleAddToCart = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onAddToCart?.(product);
    };

    const handleToggleFavorite = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onToggleFavorite?.(product.id);
    };

    const imageUrl = imageError ? DEFAULT_PRODUCT_IMAGE : product.imageUrl;
    const isCompact = variant === 'compact';
    const isDetailed = variant === 'detailed';

    return (
      <Card
        ref={ref}
        className={cn(
          'group relative overflow-hidden transition-all duration-300',
          'hover:shadow-medium',
          !product.inStock && 'opacity-75',
          className
        )}
        variant="default"
        padding="none"
        hover
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...props}
      >
        <Link href={`/products/${product.id}`} className="block">
          <div className={cn(
            'relative overflow-hidden bg-gray-100',
            isCompact ? 'aspect-square' : 'aspect-[4/3]'
          )}>
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              onError={handleImageError}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            
            {!product.inStock && (
              <Badge
                variant="error"
                className="absolute top-2 left-2 z-10"
              >
                Out of Stock
              </Badge>
            )}

            <Badge
              variant="secondary"
              className="absolute top-2 right-2 z-10 capitalize"
            >
              {product.category.replace('_', ' ')}
            </Badge>

            {showActions && isHovered && (
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleToggleFavorite}
                  className="bg-white/90 hover:bg-white"
                >
                  <Heart
                    className={cn(
                      'h-4 w-4',
                      isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
                    )}
                  />
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="bg-blue-600/90 hover:bg-blue-700"
                >
                  <ShoppingCart className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/90 hover:bg-white"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <div className={cn('p-4', isCompact && 'p-3')}>

            {product.brand && !isCompact && (
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                {product.brand}
              </p>
            )}

            <h3 className={cn(
              'font-semibold text-gray-900 mb-2 line-clamp-2',
              isCompact ? 'text-sm' : 'text-base'
            )}>
              {isCompact ? truncateText(product.name, 40) : product.name}
            </h3>

            {isDetailed && product.description && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {truncateText(product.description, 100)}
              </p>
            )}

            {product.rating && product.reviewCount && !isCompact && (
              <div className="flex items-center gap-1 mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'h-3 w-3',
                        i < Math.floor(product.rating!)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      )}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500">
                  ({product.reviewCount})
                </span>
              </div>
            )}

            {isDetailed && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {product.tags.slice(0, 3).map((tag) => (
                  <Badge
                    key={tag}
                    variant="ghost"
                    size="sm"
                    className="text-xs px-2 py-1"
                  >
                    #{tag}
                  </Badge>
                ))}
                {product.tags.length > 3 && (
                  <Badge
                    variant="ghost"
                    size="sm"
                    className="text-xs px-2 py-1"
                  >
                    +{product.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className={cn(
                  'font-bold text-gray-900',
                  isCompact ? 'text-base' : 'text-lg'
                )}>
                  {formatPrice(product.price)}
                </span>
                {product.sku && !isCompact && (
                  <span className="text-xs text-gray-500">
                    SKU: {product.sku}
                  </span>
                )}
              </div>

              {showActions && (
                <div className="flex gap-1 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleToggleFavorite}
                    className="p-1 h-8 w-8"
                  >
                    <Heart
                      className={cn(
                        'h-4 w-4',
                        isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'
                      )}
                    />
                  </Button>
                  {product.inStock && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleAddToCart}
                      className="p-1 h-8 w-8"
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}
            </div>

            {!product.inStock && (
              <p className="text-sm text-red-600 font-medium mt-2">
                Currently unavailable
              </p>
            )}
          </div>
        </Link>
      </Card>
    );
  }
);

ProductCard.displayName = 'ProductCard';

export default ProductCard;