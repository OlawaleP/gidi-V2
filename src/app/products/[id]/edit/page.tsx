import { Metadata } from 'next';
import { Suspense } from 'react';
import { Container } from '@/components/common/Container';
import { EditProductContent } from '@/components/product/EditProductContent';
import { SEO_DEFAULTS } from '@/lib/constants';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export const metadata: Metadata = {
  title: 'Edit Product',
  description: 'Edit an existing product in your catalog.',
  openGraph: {
    title: `Edit Product | ${SEO_DEFAULTS.SITE_NAME}`,
    description: 'Edit an existing product in your catalog.',
    url: '/products/[id]/edit',
  },
};

function EditProductLoading() {
  return (
    <div className="flex justify-center items-center py-16">
      <LoadingSpinner size="lg" aria-label="Loading product edit form" />
    </div>
  );
}

export default function EditProductPage() {
  return (
    <div className=" dark:bg-gray-900">
      <Container className="py-8">
        <Suspense fallback={<EditProductLoading />}>
          <EditProductContent />
        </Suspense>
      </Container>
    </div>
  );
}