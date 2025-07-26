'use client'

import Link from 'next/link'
import { Container } from '@/components/common/Container'
import ProductGrid from '@/components/product/ProductGrid'
import Button from '@/components/ui/Button'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { useProducts } from '@/hooks/useProducts'
import { DEFAULT_PRODUCT_IMAGE } from '@/lib/constants'

export default function FeaturedProductsClient() {
  const { products: allProducts, loading, error } = useProducts({
    filters: {},
    page: 1,
    limit: 100, 
  })

  const featuredProducts = allProducts
    .filter(product => product.inStock)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4)
    .map(p => ({
      ...p,
      imageUrl: p.imageUrl || DEFAULT_PRODUCT_IMAGE
    }))

  console.log('Featured Products from useProducts:', allProducts)
  console.log('Filtered Featured Products:', featuredProducts)

  if (loading) {
    return (
      <section className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-800">
        <Container>
          <div className="text-center">
            <LoadingSpinner />
          </div>
        </Container>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-800">
        <Container>
          <div className="text-center">
            <p className="text-red-500 mb-4">Error loading products: {error}</p>
          </div>
        </Container>
      </section>
    )
  }

  if (featuredProducts.length === 0) {
    return (
      <section className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-800">
        <Container>
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              No products available yet. Start by adding some products!
            </p>
            <Button>
              <Link href="/products/add">
                Add First Product
              </Link>
            </Button>
          </div>
        </Container>
      </section>
    )
  }

  return (
    <section className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-800">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Featured Products
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Check out our latest and most popular products
          </p>
        </div>
        <ProductGrid
          products={featuredProducts}
          variant="compact"
          columns={{
            mobile: 2,
            tablet: 3,
            desktop: 6
          }}
          showActions={false}
          className="gap-4"
        />
        <div className="text-center mt-12">
          <Button size="lg">
            <Link href="/products">
              View All Products
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  )
}