"use client";

import React from 'react';
import Image from 'next/image';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Product } from '@/types/product';
import { BaseComponent } from '@/types/common';
import { cn, formatPrice } from '@/lib/utils';
import { DEFAULT_PRODUCT_IMAGE } from '@/lib/constants';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export interface ProductDetailsProps extends BaseComponent {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onToggleFavorite?: (productId: string) => void;
  isFavorite?: boolean;
}

const ProductDetails = React.forwardRef<HTMLDivElement, ProductDetailsProps>(
  ({ className, product, onAddToCart, onToggleFavorite, isFavorite = false }, ref) => {
    const [imageError, setImageError] = React.useState(false);

    const handleImageError = () => {
      setImageError(true);
    };

    const handleAddToCart = () => {
      onAddToCart?.(product);
    };

    const handleToggleFavorite = () => {
      onToggleFavorite?.(product.id);
    };

    const imageUrl = imageError ? DEFAULT_PRODUCT_IMAGE : product.imageUrl;

    return (
      <div className={cn('py-8', className)} ref={ref}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          <div className="relative aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              onError={handleImageError}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {!product.inStock && (
              <Badge variant="error" className="absolute top-4 left-4">
                Out of Stock
              </Badge>
            )}
          </div>

          <div className="space-y-6">
            <div>
              {product.brand && (
                <p className="text-sm text-gray-500 uppercase tracking-wide">
                  {product.brand}
                </p>
              )}
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              <p className="text-lg text-gray-600">{product.category.replace('_', ' ')}</p>
            </div>

            <div className="flex items-center gap-2">
              {product.rating && (
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'h-4 w-4',
                        i < Math.floor(product.rating!)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      )}
                    />
                  ))}
                </div>
              )}
              {product.reviewCount && (
                <span className="text-sm text-gray-500">({product.reviewCount} reviews)</span>
              )}
            </div>

            <p className="text-xl font-bold text-gray-900">{formatPrice(product.price)}</p>

            <p className="text-gray-600">{product.description}</p>

            {product.sku && (
              <p className="text-sm text-gray-500">SKU: {product.sku}</p>
            )}

            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <Badge key={tag} variant="ghost" size="sm">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex gap-4">
              <Button
                variant="primary"
                size="lg"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={handleToggleFavorite}
              >
                <Heart
                  className={cn(
                    'h-5 w-5',
                    isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'
                  )}
                />
              </Button>
            </div>

            {!product.inStock && (
              <p className="text-sm text-red-600 font-medium">
                Currently unavailable
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }
);

ProductDetails.displayName = 'ProductDetails';

export default ProductDetails;