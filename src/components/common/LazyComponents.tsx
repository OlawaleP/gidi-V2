import dynamic from 'next/dynamic';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export const LazyComponents = {
  ProductsContent: dynamic(
    () => import('@/components/product/ProductContent').then(mod => ({ default: mod.ProductsContent })),
    {
      loading: () => (
        <div className="flex justify-center items-center py-16">
          <LoadingSpinner size="lg" aria-label="Loading products" />
        </div>
      ),
    }
  ),

  FeaturedProducts: dynamic(
    () => import('@/components/organisms/FetchedProduct'),
    {
      loading: () => (
        <div className="flex justify-center items-center py-16">
          <LoadingSpinner size="lg" aria-label="Loading featured products" />
        </div>
      ),
    }
  ),

  FeaturesSection: dynamic(
    () => import('@/components/common/FeaturesSection').then(mod => ({ default: mod.FeaturesSection })),
    {
      loading: () => (
        <div className="flex justify-center items-center py-16">
          <LoadingSpinner size="md" />
        </div>
      ),
    }
  ),

  ProductModal: dynamic(() => import('@/components/ui/Modal')),
  ProductForm: dynamic(() => import('@/components/product/ProductForm').then(mod => ({ default: mod.ProductForm }))),
  DeleteConfirmationModal: dynamic(() => import('@/components/product/DeleteConfirmationModal').then(mod => ({ default: mod.DeleteConfirmationModal }))),
};
