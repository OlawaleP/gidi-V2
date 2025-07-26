'use client'

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { ProductForm } from '@/components/product/ProductForm';
import { SuccessMessage } from '@/components/product/SuccessMessage';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useProducts } from '@/hooks/useProducts';
import { Product } from '@/types/product';
import { ArrowLeft } from 'lucide-react';
import { ErrorMessage } from '../common/ErrorMessage';

export function EditProductContent() {
  const params = useParams();
  const router = useRouter();
  const { updateProduct, getProductById, loading: productsLoading, error: productsError } = useProducts();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updatedProduct, setUpdatedProduct] = useState<Product | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [pageLoading, setPageLoading] = useState(true);

  const productId = params.id as string;

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && productId) {
      try {
        const foundProduct = getProductById(productId);
        if (!foundProduct) {
          setSubmitError('Product not found');
          setPageLoading(false);
          return;
        }
        setProduct(foundProduct);
        setPageLoading(false);
      } catch (error) {
        console.error('Error loading product for edit:', error);
        setSubmitError('Failed to load product');
        setPageLoading(false);
      }
    }
  }, [isClient, productId, getProductById]);

  useEffect(() => {
    if (isClient && !pageLoading && !product && !submitError) {
      router.push('/products');
    }
  }, [isClient, pageLoading, product, submitError, router]);

  const handleUpdateProduct = useCallback(
    async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
      if (!product) return;

      try {
        setIsSubmitting(true);
        setSubmitError(null);
        const resultProduct = await updateProduct(product.id, productData);
        setUpdatedProduct(resultProduct);
        setProduct(resultProduct);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to update product';
        console.error('Error updating product:', error);
        setSubmitError(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    },
    [product, updateProduct]
  );

  const handleEditAgain = useCallback(() => {
    setUpdatedProduct(null);
    setSubmitError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleViewProduct = useCallback(() => {
    if (product) {
      router.push(`/products/${product.id}`);
    }
  }, [product, router]);

  const handleViewAllProducts = useCallback(() => {
    router.push('/products');
  }, [router]);

  const handleCancel = useCallback(() => {
    if (product) {
      router.push(`/products/${product.id}`);
    } else {
      router.push('/products');
    }
  }, [router, product]);

  const handleRetry = useCallback(() => {
    setSubmitError(null);
  }, []);

  const handleGoBack = useCallback(() => {
    if (product) {
      router.push(`/products/${product.id}`);
    } else {
      router.back();
    }
  }, [router, product]);

  if (!isClient || pageLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      {product && <Breadcrumb product={product} />}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Edit Product
        </h1>
        <Button
          variant="ghost"
          onClick={handleCancel}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Product
        </Button>
      </div>
      {product && (
        <p className="text-gray-600 dark:text-gray-300 mt-1 mb-6">
          Update the details for <strong>{product.name}</strong>.
        </p>
      )}
      {productsLoading && (
        <div className="flex justify-center items-center py-16">
          <LoadingSpinner size="lg" />
        </div>
      )}
      {!productsLoading && productsError && (
        <ErrorMessage
          error={`Failed to initialize products: ${productsError}`}
          onRetry={handleRetry}
          onGoBack={handleGoBack}
        />
      )}
      {!productsLoading && !productsError && submitError && (
        <ErrorMessage
          error={submitError}
          onRetry={handleRetry}
          onGoBack={handleGoBack}
        />
      )}
      {!productsLoading && !productsError && !submitError && updatedProduct && (
        <SuccessMessage
          product={updatedProduct}
          isEdit={true}
          onAddNew={handleEditAgain}
          onViewProduct={handleViewProduct}
          onViewAll={handleViewAllProducts}
        />
      )}
      {!productsLoading && !productsError && !submitError && !updatedProduct && product && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 md:p-8">
            <ProductForm
              product={product}
              onSubmit={handleUpdateProduct}
              onCancel={handleCancel}
              isLoading={isSubmitting}
              submitButtonText="Update Product"
              mode="edit"
            />
          </div>
        </div>
      )}
      {product && !productsLoading && !productsError && !submitError && !updatedProduct && (
        <div className="mt-6 max-w-2xl mx-auto p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
            Tips for editing products:
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Make sure all required fields are filled out completely</li>
            <li>• Changes will be saved immediately when you submit</li>
            <li>• Use the preview to see how your product will look</li>
            <li>• You can always cancel to go back without saving changes</li>
            <li>• Product ID and creation date cannot be changed</li>
          </ul>
        </div>
      )}
    </>
  );
}