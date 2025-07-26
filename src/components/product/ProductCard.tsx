"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart, Star, Eye, Edit, Trash2 } from 'lucide-react';
import { Product } from '@/types/product';
import { BaseComponent } from '@/types/common';
import { cn, formatPrice, truncateText } from '@/lib/utils';
import { DEFAULT_PRODUCT_IMAGE } from '@/lib/constants';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal, { ModalFooter } from '@/components/ui/Modal';

export interface ProductCardProps extends BaseComponent {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onToggleFavorite?: (productId: string) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (productId: string) => Promise<void>;
  isFavorite?: boolean;
  showActions?: boolean;
  showAdminActions?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
  priority?: boolean;
}

const ProductCard = React.forwardRef<HTMLDivElement, ProductCardProps>(
  ({
    className,
    product,
    onAddToCart,
    onToggleFavorite,
    onEdit,
    onDelete,
    isFavorite = false,
    showActions = true,
    showAdminActions = false,
    variant = 'default',
    ...props
  }, ref) => {
    const [imageError, setImageError] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showActionMenu, setShowActionMenu] = useState(false);

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

    const handleEdit = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onEdit?.(product);
      setShowActionMenu(false);
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setShowDeleteModal(true);
      setShowActionMenu(false);
    };

    const handleDeleteConfirm = async () => {
      if (!onDelete) return;
      
      try {
        setIsDeleting(true);
        await onDelete(product.id);
        setShowDeleteModal(false);
      } catch (error) {
        console.error('Error deleting product:', error);
      } finally {
        setIsDeleting(false);
      }
    };

    const imageUrl = imageError ? DEFAULT_PRODUCT_IMAGE : product.imageUrl;
    const isCompact = variant === 'compact';
    const isDetailed = variant === 'detailed';

    return (
      <>
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
  sizes={
    isCompact 
      ? "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
      : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  }
  quality={85}
  loading="lazy" 
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R7G"
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

              {showAdminActions && (
                <div className="absolute top-2 right-2 z-20">
                  <div className="relative">
                    
                    {showActionMenu && (
                      <div className="absolute right-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-30 min-w-[120px]">
                        <button
                          onClick={handleEdit}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </button>
                        <button
                          onClick={handleDeleteClick}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {showActions && isHovered && !showAdminActions && (
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

                {showActions && !showAdminActions && (
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

                {showAdminActions && (
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleEdit}
                      className="p-1 h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleDeleteClick}
                      className="p-1 h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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

        <Modal
          isOpen={showDeleteModal}
          onClose={() => !isDeleting && setShowDeleteModal(false)}
          title="Delete Product"
          size="md"
          closeOnOverlayClick={!isDeleting}
          closeOnEscape={!isDeleting}
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-gray-900">&quot;{product.name}&quot;</span>?
            </p>
            <p className="text-sm text-red-600">
              This action cannot be undone.
            </p>
          </div>
          
          <ModalFooter>
            <Button
              variant="ghost"
              onClick={() => setShowDeleteModal(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="error"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Product'}
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
);

ProductCard.displayName = 'ProductCard';

export default ProductCard;