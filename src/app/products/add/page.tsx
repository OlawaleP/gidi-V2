import { Metadata } from 'next';
import { Suspense } from 'react';
import { Container } from '@/components/common/Container';
import { AddProductContent } from '@/components/product/AddProductContent';
import { SEO_DEFAULTS } from '@/lib/constants';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export const metadata: Metadata = {
  title: 'Add Product',
  description: 'Add a new product to your catalog or edit an existing one.',
  openGraph: {
    title: `Add Product | ${SEO_DEFAULTS.SITE_NAME}`,
    description: 'Add a new product to your catalog or edit an existing one.',
    url: '/products/add',
  },
};

function AddProductLoading() {
  return (
    <div className="flex justify-center items-center py-16">
      <LoadingSpinner size="lg" aria-label="Loading product form" />
    </div>
  );
}

export default function AddProductPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Container className="py-8">
        <Suspense fallback={<AddProductLoading />}>
          <AddProductContent />
        </Suspense>
      </Container>
    </div>
  );
}