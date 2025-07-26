import Link from 'next/link';
import { Product } from '@/types/product';
import { CATEGORY_LABELS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface BreadcrumbProps {
  product: Product;
  className?: string;
}

export function Breadcrumb({ product, className }: BreadcrumbProps) {
  return (
    <nav className={cn('flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 mb-8', className)} aria-label="Breadcrumb">
      <Link href="/" className="hover:text-primary-600 transition-colors">
        Home
      </Link>
      <span>/</span>
      <Link href="/products" className="hover:text-primary-600 transition-colors">
        Products
      </Link>
      <span>/</span>
      <Link
        href={`/products?category=${product.category}`}
        className="hover:text-primary-600 transition-colors"
      >
        {CATEGORY_LABELS[product.category]}
      </Link>
      <span>/</span>
      <span className="text-gray-900 dark:text-white font-medium truncate">
        {product.name}
      </span>
    </nav>
  );
}