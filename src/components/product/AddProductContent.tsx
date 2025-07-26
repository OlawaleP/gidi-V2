'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Container } from '@/components/common/Container';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { ProductForm } from '@/components/product/ProductForm';
import { useToastActions } from '@/components/ui/Toast';
import { useProducts } from '@/hooks/useProducts';
import { Product } from '@/types/product';
import LoadingSpinner from '../ui/LoadingSpinner';
import { SuccessMessage } from './SuccessMessage';

export function AddProductContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToastActions();
  const { addProduct, updateProduct, getProductById, loading: productsLoading, error: productsError } = useProducts();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processedProduct, setProcessedProduct] = useState<Product | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [pageLoading, setPageLoading] = useState(true);

  const editId = searchParams.get('edit');
  const isEditMode = !!editId;

  useEffect(() => {
    if (isEditMode && editId) {
      try {
        const product = getProductById(editId);
        if (!product) {
          setSubmitError('Product not found');
          setPageLoading(false);
          return;
        }
        setEditProduct(product);
        setPageLoading(false);
      } catch (error) {
        console.error('Error loading product for edit:', error);
        setSubmitError('Failed to load product');
        setPageLoading(false);
      }
    } else {
      setPageLoading(false);
    }
  }, [isEditMode, editId, getProductById]);

  const handleSubmitProduct = useCallback(
    async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
      try {
        setIsSubmitting(true);
        setSubmitError(null);

        let resultProduct: Product;

        if (isEditMode && editProduct) {
          resultProduct = await updateProduct(editProduct.id, productData);
          toast.success('Product updated', `${resultProduct.name} has been updated successfully`);
        } else {
          resultProduct = await addProduct(productData);
          toast.success('Product added', `${resultProduct.name} has been added successfully`);
        }

        setProcessedProduct(resultProduct);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : `Failed to ${isEditMode ? 'update' : 'add'} product`;
        console.error(`Error ${isEditMode ? 'updating' : 'adding'} product:`, error);
        setSubmitError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    },
    [addProduct, updateProduct, isEditMode, editProduct, toast]
  );

  const handleAddNew = useCallback(() => {
    setProcessedProduct(null);
    setSubmitError(null);
    setEditProduct(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleViewProduct = useCallback(() => {
    if (processedProduct) {
      router.push(`/products/${processedProduct.id}`);
    }
  }, [processedProduct, router]);

  const handleViewAll = useCallback(() => {
    router.push('/products');
  }, [router]);

  const handleCancel = useCallback(() => {
    if (isEditMode && editProduct) {
      router.push(`/products/${editProduct.id}`);
    } else {
      router.back();
    }
  }, [router, isEditMode, editProduct]);

  const handleRetry = useCallback(() => {
    setSubmitError(null);
  }, []);

  const handleGoBack = useCallback(() => {
    if (isEditMode && editProduct) {
      router.push(`/products/${editProduct.id}`);
    } else {
      router.back();
    }
  }, [router, isEditMode, editProduct]);

  if (pageLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <LoadingSpinner size="lg" aria-label="Loading product form" />
      </div>
    );
  }

  return (
    <Container className="py-8">
      {productsLoading && (
        <div className="flex justify-center items-center py-16">
          <LoadingSpinner size="lg" aria-label="Loading products" />
        </div>
      )}

      {!productsLoading && productsError && (
        <ErrorMessage
          error={`Failed to initialize products: ${productsError}`}
          onRetry={handleRetry}
          onGoBack={handleGoBack}
        />
      )}

      {submitError && (
        <ErrorMessage
          error={submitError}
          onRetry={handleRetry}
          onGoBack={handleGoBack}
        />
      )}

      {!productsLoading && !productsError && !submitError && processedProduct && (
        <SuccessMessage
          product={processedProduct}
          isEdit={isEditMode}
          onAddNew={handleAddNew}
          onViewProduct={handleViewProduct}
          onViewAll={handleViewAll}
          className="max-w-2xl mx-auto"
        />
      )}

      {!productsLoading && !productsError && !submitError && !processedProduct && (
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2">
              {isEditMode ? 'Edit Product' : 'Add New Product'}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {isEditMode
                ? `Update the details for ${editProduct?.name || 'this product'}.`
                : 'Fill in the details below to add a new product to your catalog.'}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8">
            <ProductForm
              product={editProduct || undefined}
              onSubmit={handleSubmitProduct}
              onCancel={handleCancel}
              isLoading={isSubmitting}
              submitButtonText={isEditMode ? 'Update Product' : 'Add Product'}
              mode={isEditMode ? 'edit' : 'create'}
            />
          </div>

          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
              Tips for {isEditMode ? 'editing' : 'adding'} products:
            </h3>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Use clear, descriptive product names</li>
              <li>• Add detailed descriptions to help customers understand your product</li>
              <li>• Include relevant tags to make your product easier to find</li>
              <li>• Use high-quality images for better presentation</li>
              <li>• Set accurate pricing and stock status</li>
              {isEditMode && <li>• Changes will be saved immediately when you submit</li>}
            </ul>
          </div>
        </div>
      )}
    </Container>
  );
}