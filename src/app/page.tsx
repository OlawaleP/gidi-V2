import { HeroSection } from '@/components/common/HeroSection';
import { CategoriesSection } from '@/components/product/CategoriesSection';
import { LazyComponents } from '@/components/common/LazyComponents';
import { MetadataTemplates } from '@/lib/metadata';
import { Suspense } from 'react';

export const metadata = MetadataTemplates.home();

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <CategoriesSection />
      
      <Suspense>
        <LazyComponents.FeaturedProducts />
      </Suspense>
      
      <LazyComponents.FeaturesSection />
    </div>
  );
}