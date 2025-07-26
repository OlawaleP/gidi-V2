import { Suspense } from 'react';
import { PageTemplate } from '@/components/templates/PageTemplate';
import { LazyComponents } from '@/components/common/LazyComponents';
import { LoadingStates } from '@/components/common/LoadingStates';
import { MetadataTemplates } from '@/lib/metadata';

export const metadata = MetadataTemplates.products();

export default function ProductsPage() {
  return (
    <PageTemplate>
      <Suspense fallback={<LoadingStates.ProductsPage />}>
        <LazyComponents.ProductsContent />
      </Suspense>
    </PageTemplate>
  );
}