'use client';

import { useState, useMemo, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { ProductSearch } from '@/components/product/ProductSearch';
import { ProductForm } from '@/components/product/ProductForm';
import { useProducts } from '@/hooks/useProducts';
import { useDebounce } from '@/hooks/useDebounce';
import { useToastActions } from '@/components/ui/Toast';
import { ProductFilters as ProductFiltersType, ProductCategory, Product } from '@/types/product';
import { PAGINATION, SORT_OPTIONS } from '@/lib/constants';
import { cn, getCategoryIcon } from '@/lib/utils';
import { CategoryIcon } from '../organisms/CategoryIcon';
import LoadingSpinner from '../ui/LoadingSpinner';
import Button from '../ui/Button';
import ProductFilters from './ProductFilters';
import ProductCard from './ProductCard';
import { Pagination } from './Pagination';
import Modal from '../ui/Modal';

export function ProductsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const toast = useToastActions();

  const initialFilters = useMemo<ProductFiltersType>(() => ({
    category: (searchParams.get('category') as ProductCategory) || undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    inStock: searchParams.get('inStock') ? searchParams.get('inStock') === 'true' : undefined,
    searchQuery: searchParams.get('search') || undefined,
    sortBy: (searchParams.get('sortBy') as 'name' | 'price' | 'createdAt') || 'createdAt',
    sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
  }), [searchParams]);

  const [filters, setFilters] = useState<ProductFiltersType>(initialFilters);
  const [searchQuery, setSearchQuery] = useState(initialFilters.searchQuery || '');
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page') || '1'));
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const finalFilters = useMemo(
    () => ({ ...filters, searchQuery: debouncedSearchQuery }),
    [filters, debouncedSearchQuery]
  );

  const { products, loading, error, stats, totalPages, refetch, updateProduct, deleteProduct } = useProducts({
    filters: finalFilters,
    page: currentPage,
    limit: PAGINATION.DEFAULT_LIMIT,
  });

  const updateURL = useCallback(
    (newFilters: ProductFiltersType, page: number = 1) => {
      const params = new URLSearchParams();
      if (newFilters.category) params.set('category', newFilters.category);
      if (newFilters.minPrice !== undefined) params.set('minPrice', newFilters.minPrice.toString());
      if (newFilters.maxPrice !== undefined) params.set('maxPrice', newFilters.maxPrice.toString());
      if (newFilters.inStock !== undefined) params.set('inStock', newFilters.inStock.toString());
      if (newFilters.searchQuery) params.set('search', newFilters.searchQuery);
      if (newFilters.sortBy) params.set('sortBy', newFilters.sortBy);
      if (newFilters.sortOrder) params.set('sortOrder', newFilters.sortOrder);
      if (page > 1) params.set('page', page.toString());
      router.push(`${pathname}${params.toString() ? `?${params.toString()}` : ''}`, { scroll: false });
    },
    [router, pathname]
  );

  const handleFiltersChange = useCallback(
    (newFilters: ProductFiltersType) => {
      setFilters(newFilters);
      setCurrentPage(1);
      updateURL(newFilters, 1);
    },
    [updateURL]
  );

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      updateURL(finalFilters, page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [finalFilters, updateURL]
  );

  const handleSortChange = useCallback(
    (sortValue: string) => {
      const [sortBy, sortOrder] = sortValue.split('-') as ['name' | 'price' | 'createdAt', 'asc' | 'desc'];
      handleFiltersChange({ ...filters, sortBy, sortOrder });
    },
    [filters, handleFiltersChange]
  );

  const clearFilters = useCallback(() => {
    const clearedFilters: ProductFiltersType = {
      sortBy: 'createdAt',
      sortOrder: 'desc',
    };
    setFilters(clearedFilters);
    setSearchQuery('');
    setCurrentPage(1);
    updateURL(clearedFilters, 1);
  }, [updateURL]);

  const hasActiveFilters = useMemo(
    () => !!(filters.category || filters.minPrice !== undefined || filters.maxPrice !== undefined || filters.inStock !== undefined || debouncedSearchQuery),
    [filters, debouncedSearchQuery]
  );

  const handleEditProduct = useCallback((product: Product) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
  }, []);

  const handleEditSubmit = useCallback(
    async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
      if (!editingProduct) return;

      try {
        setIsUpdating(true);
        await updateProduct(editingProduct.id, productData);
        toast.success('Product updated', `${productData.name} has been updated successfully`);
        setIsEditModalOpen(false);
        setEditingProduct(null);
        refetch();
      } catch (error) {
        console.error('Error updating product:', error);
        toast.error('Failed to update product', error instanceof Error ? error.message : 'An error occurred');
        throw error;
      } finally {
        setIsUpdating(false);
      }
    },
    [editingProduct, updateProduct, toast, refetch]
  );

  const handleEditCancel = useCallback(() => {
    setIsEditModalOpen(false);
    setEditingProduct(null);
  }, []);

  const handleDeleteProduct = useCallback(
    async (productId: string) => {
      try {
        const product = products.find((p) => p.id === productId);
        await deleteProduct(productId);
        toast.success('Product deleted', `${product?.name || 'Product'} has been removed from your catalog`);
        refetch();
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Failed to delete product', error instanceof Error ? error.message : 'An error occurred');
        throw error;
      }
    },
    [deleteProduct, toast, refetch, products]
  );

  const handleAddToCart = useCallback(
    (product: Product) => {
      toast.success('Added to cart', `${product.name} added to your cart`);
    },
    [toast]
  );

  const handleToggleFavorite = useCallback(
    (productId: string) => {
      const product = products.find((p) => p.id === productId);
      toast.info('Favorites updated', `${product?.name || 'Product'} added to favorites`);
    },
    [toast, products]
  );

  const handleGoBack = useCallback(() => {
    router.push('/');
  }, [router]);

  if (error) {
    return (
      <ErrorMessage
        error={error}
        onRetry={refetch}
        onGoBack={handleGoBack}
      />
    );
  }

  return (
    <>
      <header className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Products</h1>
            <p className="text-gray-600 dark:text-gray-300">
              {loading ? 'Loading products...' : `${stats.total} products available`}
            </p>
          </div>
          <div className="flex items-center gap-3 mt-4 sm:mt-0">
            <Button>
              <Link href="/products/add">Add Product</Link>
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <ProductSearch
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search products by name, description, or tags..."
              aria-label="Search products"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Sort by:
              </label>
              <select
                id="sort"
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                aria-label="Sort products"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
              className="lg:hidden"
              aria-expanded={isMobileFiltersOpen}
              aria-controls="mobile-filters"
            >
              Filters
              {hasActiveFilters && (
                <span className="ml-2 w-2 h-2 bg-primary-600 rounded-full" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Active filters:</span>
            {filters.category && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-md text-sm">
                Category: {filters.category}
                <button
                  onClick={() => handleFiltersChange({ ...filters, category: undefined })}
                  className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-200"
                  aria-label={`Remove ${filters.category} filter`}
                >
                  ×
                </button>
              </span>
            )}
            {filters.minPrice !== undefined && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-md text-sm">
                Min: ${filters.minPrice}
                <button
                  onClick={() => handleFiltersChange({ ...filters, minPrice: undefined })}
                  className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-200"
                  aria-label="Remove minimum price filter"
                >
                  ×
                </button>
              </span>
            )}
            {filters.maxPrice !== undefined && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-md text-sm">
                Max: ${filters.maxPrice}
                <button
                  onClick={() => handleFiltersChange({ ...filters, maxPrice: undefined })}
                  className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-200"
                  aria-label="Remove maximum price filter"
                >
                  ×
                </button>
              </span>
            )}
            {filters.inStock !== undefined && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-md text-sm">
                {filters.inStock ? 'In Stock' : 'Out of Stock'}
                <button
                  onClick={() => handleFiltersChange({ ...filters, inStock: undefined })}
                  className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-200"
                  aria-label="Remove stock status filter"
                >
                  ×
                </button>
              </span>
            )}
            {debouncedSearchQuery && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-md text-sm">
                Search: &quot;{debouncedSearchQuery}&quot;
                <button
                  onClick={() => handleSearchChange('')}
                  className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-200"
                  aria-label="Remove search query filter"
                >
                  ×
                </button>
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              aria-label="Clear all filters"
            >
              Clear all
            </Button>
          </div>
        )}
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside
          id="mobile-filters"
          className={cn('lg:w-64 lg:flex-shrink-0', isMobileFiltersOpen ? 'block' : 'hidden lg:block')}
        >
          <div className="sticky top-24">
            <ProductFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              stats={stats}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
            />
          </div>
        </aside>

        <main className="flex-1">
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <LoadingSpinner size="lg" aria-label="Loading products" />
            </div>
          ) : products.length === 0 ? (
<div className="text-center py-16">
  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
    <CategoryIcon config={getCategoryIcon('' as ProductCategory)} />
  </div>
  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
    No products found
  </h3>
  <p className="text-gray-600 dark:text-gray-300 mb-6">
    {hasActiveFilters
      ? "We couldn't find any products matching your criteria. Try adjusting your filters."
      : 'No products available yet. Be the first to add a product!'}
  </p>
  <div className="flex justify-center gap-4">
    {hasActiveFilters ? (
      <Button onClick={clearFilters} aria-label="Clear all filters">
        Clear Filters
      </Button>
    ) : (
      <Button>
        <Link href="/products/add">Add First Product</Link>
      </Button>
    )}
  </div>
</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onEdit={handleEditProduct}
                    onDelete={handleDeleteProduct}
                    onAddToCart={handleAddToCart}
                    onToggleFavorite={handleToggleFavorite}
                    showAdminActions={true}
                    showActions={true}
                  />
                ))}
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                className="mt-8"
              />
            </>
          )}
        </main>
      </div>

      <Modal
        isOpen={isEditModalOpen}
        onClose={handleEditCancel}
        title="Edit Product"
        size="lg"
        closeOnOverlayClick={!isUpdating}
        closeOnEscape={!isUpdating}
      >
        {editingProduct && (
          <ProductForm
            product={editingProduct}
            onSubmit={handleEditSubmit}
            onCancel={handleEditCancel}
            isLoading={isUpdating}
            submitButtonText="Update Product"
          />
        )}
      </Modal>
    </>
  );
}