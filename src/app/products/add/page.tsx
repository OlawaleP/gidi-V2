"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProducts } from '@/hooks/useProducts';
import { Container } from '@/components/common/Container';
import ProductForm from '@/components/product/ProductForm';
import Head from 'next/head';
import { ProductFormData } from '@/types/product';

export default function AddProductPage() {
  const router = useRouter();
  const { addProduct, loading, error } = useProducts();
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (formData: ProductFormData) => {
    try {
      setFormError(null);
      const newProduct = await addProduct({
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        imageUrl: formData.imageUrl,
        inStock: formData.inStock,
        tags: formData.tags.split(',').map((tag) => tag.trim()),
        sku: formData.sku,
        brand: formData.brand,
      });
      router.push(`/products/${newProduct.id}`);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to add product');
    }
  };

  return (
    <>
      <Head>
        <title>Add Product | gidi-e</title>
        <meta name="description" content="Add a new product to the e-commerce platform." />
        <meta property="og:title" content="Add Product | gidi-e" />
        <meta property="og:description" content="Add a new product to the e-commerce platform." />
        <meta property="og:image" content="/images/placeholder.jpg" />
        <meta property="og:url" content="/products/add" />
      </Head>
      <Container>
        <h1 className="text-3xl font-bold mb-6">Add New Product</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {formError && <p className="text-red-500 mb-4">{formError}</p>}
        <ProductForm onSubmit={handleSubmit} isLoading={loading} />
      </Container>
    </>
  );
}