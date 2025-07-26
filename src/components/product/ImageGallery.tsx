import Image from 'next/image';
import { Product } from '@/types/product';
import { DEFAULT_PRODUCT_IMAGE } from '@/lib/constants';

interface ProductImageGalleryProps {
  product: Product;
  className?: string;
}

export function ProductImageGallery({ product, className }: ProductImageGalleryProps) {
  return (
    <div className={`aspect-square w-full bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden ${className}`}>
      <Image
        src={product.imageUrl || DEFAULT_PRODUCT_IMAGE}
        alt={product.name}
        width={400}
        height={400}
        className="w-full h-full object-cover"
        priority
        unoptimized={!!product.imageUrl?.startsWith('http')}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = DEFAULT_PRODUCT_IMAGE;
        }}
      />
    </div>
  );
}