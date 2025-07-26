'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Container } from '@/components/common/Container';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { useProducts } from '@/hooks/useProducts';
import { Product } from '@/types/product';
import { useToastActions } from '@/components/ui/Toast';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { ProductImageGallery } from '@/components/product/ImageGallery';
import { ProductInfo } from '@/components/product/Info';

const Modal = dynamic(() => import('@/components/ui/Modal'), {
  loading: () => <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <LoadingSpinner size="lg" />
  </div>,
});

const ProductForm = dynamic(() => import('@/components/product/ProductForm').then(mod => ({ default: mod.ProductForm })));
const DeleteConfirmationModal = dynamic(() => import('@/components/product/DeleteConfirmationModal').then(mod => ({ default: mod.DeleteConfirmationModal })));
const DeleteSuccessMessage = dynamic(() => import('@/components/product/DeleteSuccessModal').then(mod => ({ default: mod.DeleteSuccessMessage })));

function ProductError({ error, productId, onRetry }: { error: string; productId: string; onRetry: () => void }) {
  return (
    <Container className="py-16">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {error === 'Product not found' ? 'Product Not Found' : 'Error Loading Product'}
          </h2>
          <p className="text-red-600 dark:text-red-400 mb-2">{error}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Product ID: {productId}</p>
        </div>
        <div className="space-x-4">
          <Button onClick={onRetry} variant="primary">
            Try Again
          </Button>
          <Button onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </div>
    </Container>
  );
}

function ProductDetailLoading({ productId, stage }: { productId: string; stage: string }) {
  return (
    <Container className="py-16">
      <div className="flex flex-col justify-center items-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">
          {stage}
        </p>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">
          Product ID: {productId}
        </p>
      </div>
    </Container>
  );
}

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToastActions();
  const { getProductById, updateProduct, deleteProduct, loading: productsLoading } = useProducts();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDeleted, setIsDeleted] = useState(false);

  const productId = params.id as string;

  const loadingStage = useMemo(() => {
    if (productsLoading) return 'Loading products...';
    if (loading) return `Loading product ${productId}...`;
    return 'Loading...';
  }, [productsLoading, loading, productId]);

  const loadProduct = useCallback(() => {
    try {
      setLoading(true);
      setError(null);
      const foundProduct = getProductById(productId);
      if (!foundProduct) {
        setError('Product not found');
        return;
      }
      setProduct(foundProduct);
    } catch (error) {
      console.error('Error loading product:', error);
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  }, [productId, getProductById]);

  useEffect(() => {
    if (productId && !productsLoading) {
      loadProduct();
    } else if (productId && productsLoading) {
      setLoading(true);
    }
  }, [productId, productsLoading, loadProduct]);

  const handleEditProduct = useCallback(
    async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
      if (!product) return;

      try {
        setIsUpdating(true);
        const updatedProduct = await updateProduct(product.id, productData);
        setProduct(updatedProduct);
        setIsEditModalOpen(false);
        toast.success(`${updatedProduct.name} has been updated successfully`);
      } catch (error) {
        console.error('Error updating product:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to update product';
        toast.error(`Update failed: ${errorMessage}`);
        throw error;
      } finally {
        setIsUpdating(false);
      }
    },
    [product, updateProduct, toast]
  );

  const handleDeleteProduct = useCallback(async () => {
    if (!product) return;

    try {
      setIsDeleting(true);
      await deleteProduct(product.id);
      setIsDeleted(true);
      toast.success(`${product.name} has been deleted successfully`);
      
      setTimeout(() => {
        router.push('/products');
      }, 1500);
    } catch (error) {
      console.error('Error deleting product:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete product';
      toast.error(`Delete failed: ${errorMessage}`);
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  }, [product, deleteProduct, router, toast]);

  const handleOpenEditModal = useCallback(() => setIsEditModalOpen(true), []);
  const handleCloseEditModal = useCallback(() => !isUpdating && setIsEditModalOpen(false), [isUpdating]);
  const handleOpenDeleteModal = useCallback(() => setIsDeleteModalOpen(true), []);
  const handleCloseDeleteModal = useCallback(() => setIsDeleteModalOpen(false), []);

  const handleNavigateBack = useCallback(() => {
    router.push('/products');
  }, [router]);

  useEffect(() => {
    if (!loading && !productsLoading && error === 'Product not found' && !isDeleted) {
      notFound();
    }
  }, [loading, productsLoading, error, isDeleted]);

  if (loading || productsLoading) {
    return <ProductDetailLoading productId={productId} stage={loadingStage} />;
  }

  if (error && error !== 'Product not found') {
    return <ProductError error={error} productId={productId} onRetry={loadProduct} />;
  }

  if (!product) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Container className="py-8">
        <Breadcrumb product={product} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <ProductImageGallery product={product} />
          <ProductInfo
            product={product}
            onEdit={handleOpenEditModal}
            onDelete={handleOpenDeleteModal}
            isDeleting={isDeleting}
          />
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <Button onClick={handleNavigateBack} className="inline-flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Products
          </Button>
        </div>
      </Container>

      {isEditModalOpen && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          title="Edit Product"
          size="lg"
        >
          <ProductForm
            product={product}
            onSubmit={handleEditProduct}
            onCancel={handleCloseEditModal}
            isLoading={isUpdating}
            submitButtonText="Update Product"
            mode="edit"
          />
        </Modal>
      )}

      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onConfirm={handleDeleteProduct}
          productName={product.name}
          isDeleting={isDeleting}
        />
      )}

      {isDeleted && (
        <DeleteSuccessMessage onBack={handleNavigateBack} />
      )}
    </div>
  );
}