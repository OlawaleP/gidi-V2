"use client";

import React, { useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import ProductGrid from '@/components/product/ProductGrid';
import ProductFilters from '@/components/product/ProductFilters';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Container } from '@/components/common/Container';
import { SEOHead } from '@/components/common/SEOHead'; 
import { ProductFilters as ProductFiltersType } from '@/types/product';

const ProductsPage = () => {
  const [filters, setFilters] = useState<ProductFiltersType>({});

  const {
    products,
    loading,
    error,
    stats,
    totalPages,
    currentPage,
    refetch,
  } = useProducts({
    filters,
    page: 1,
    limit: 12, 
  });

  const handleFiltersChange = (newFilters: ProductFiltersType) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  if (loading && !products.length) {
    return (
      <Container>
        <LoadingSpinner />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <p className="text-red-500 text-center">{error}</p>
        <button
          onClick={refetch}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </Container>
    );
  }

  return (
    <>
      <SEOHead
      />
      <Container>
        <h1 className="text-3xl font-bold mb-6">Our Products</h1>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/4">
            <ProductFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
              totalProducts={stats.total}
              isLoading={loading}
            />
          </div>
          <div className="w-full md:w-3/4">
            <ProductGrid
              products={products}
              loading={loading}
              variant="default" 
              columns={{ mobile: 1, tablet: 2, desktop: 3 }}
            />
          </div>
        </div>
      </Container>
    </>
  );
};

export default ProductsPage;