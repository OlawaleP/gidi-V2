import { Metadata } from 'next';
import { mockProducts } from '@/data/mockProducts';
import { generateSEOMetadata } from '@/components/common/SEOHead';
import { Container } from '@/components/common/Container';
import ProductDetails from '@/components/product/ProductDetails';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = mockProducts.find((p) => p.id === id);

  if (!product) {
    return generateSEOMetadata({
      title: 'Product Not Found | gidi-e',
      description: 'The product you are looking for does not exist.',
      image: '/images/placeholder.jpg',
      url: `/products/${id}`,
    });
  }

  return generateSEOMetadata({
    title: `${product.name} | gidi-e`,
    description: product.description,
    image: product.imageUrl,
    url: `/products/${product.id}`,
    type: 'product',
    price: product.price,
    availability: product.inStock ? 'in_stock' : 'out_of_stock',
  });
}

export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = mockProducts.find((p) => p.id === id);

  if (!product) {
    return (
      <Container>
        <p className="text-red-500 text-center">Product not found</p>
      </Container>
    );
  }

  return (
    <Container>
      <ProductDetails product={product} />
    </Container>
  );
}