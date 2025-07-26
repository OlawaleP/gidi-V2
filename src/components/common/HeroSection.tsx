import Link from 'next/link';
import { Container } from '@/components/common/Container';
import Button from '@/components/ui/Button';

export function HeroSection({ className }: { className?: string }) {
  return (
    <section className={`relative from-primary-600 via-primary-700 to-primary-800 text-white ${className}`}>
      <div className="absolute inset-0 bg-black/20" />
      <Container className="relative py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8">
            Discover Amazing
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200">
              Products
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            Shop from our curated collection of high-quality products across multiple categories. 
            Find exactly what you&apos;re looking for with our smart filtering and search features.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="lg">
              <Link href="/products">Browse Products</Link>
            </Button>
            <Button variant="primary" size="lg">
              <Link href="/products/add">Add Product</Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}