import { useState, useEffect, useCallback, useMemo } from 'react';
import { Product, ProductFilters, ProductStats, ProductCategory } from '@/types/product';
import { ApiResponse } from '@/types/api';
import { API_ENDPOINTS, PAGINATION } from '@/lib/constants';
import { getStoredProducts, saveProducts } from '@/lib/storage';
import { mockProducts } from '@/data/mockProducts';

interface UseProductsOptions {
  filters?: ProductFilters;
  page?: number;
  limit?: number;
}

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  stats: ProductStats;
  totalPages: number;
  currentPage: number;
  refetch: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Product>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  getProductById: (id: string) => Product | undefined;
}

export const useProducts = (options: UseProductsOptions = {}): UseProductsReturn => {
  const { filters = {}, page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT } = options;
  
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

const loadProducts = useCallback(async () => {
  try {
    setLoading(true);
    setError(null);

    if (isClient) {
      try {
        const storedProducts = getStoredProducts();
        if (storedProducts && storedProducts.length > 0) {
          setAllProducts(storedProducts);
          setLoading(false);
          return;
        }
      } catch (storageError) {
        console.warn('Failed to load from localStorage:', storageError);
      }
    }

    try {
      const response = await fetch(API_ENDPOINTS.PRODUCTS);
      if (response.ok) {
        const data: ApiResponse<Product[]> = await response.json();
        setAllProducts(data.data);
        if (isClient) {
          try {
            saveProducts(data.data);
          } catch (saveError) {
            console.warn('Failed to save to localStorage:', saveError);
          }
        }
      } else {
        throw new Error(`API request failed: ${response.status}`);
      }
    } catch (apiError) {
      console.warn('API request failed, using mock data:', apiError);
      setAllProducts(mockProducts);
      if (isClient) {
        try {
          saveProducts(mockProducts);
        } catch (saveError) {
          console.warn('Failed to save mock data to localStorage:', saveError);
        }
      }
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to load products';
    setError(errorMessage);
    console.error('Error in loadProducts:', err);
    setAllProducts(mockProducts);
  } finally {
    setLoading(false);
  }
}, [isClient]);

  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts];

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.tags.some(tag => tag.toLowerCase().includes(query)) ||
        product.brand?.toLowerCase().includes(query)
      );
    }

    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    if (filters.minPrice !== undefined) {
      filtered = filtered.filter(product => product.price >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter(product => product.price <= filters.maxPrice!);
    }

    if (filters.inStock !== undefined) {
      filtered = filtered.filter(product => product.inStock === filters.inStock);
    }

    if (filters.sortBy) {
      filtered.sort((a, b) => {
        let aValue: string | number | Date | undefined = a[filters.sortBy!];
        let bValue: string | number | Date | undefined = b[filters.sortBy!];

        if (filters.sortBy === 'price') {
          aValue = Number(aValue);
          bValue = Number(bValue);
        } else if (filters.sortBy === 'createdAt') {
          aValue = new Date(aValue).getTime();
          bValue = new Date(bValue).getTime();
        } else {
          aValue = String(aValue).toLowerCase();
          bValue = String(bValue).toLowerCase();
        }

        if (filters.sortOrder === 'desc') {
          return bValue > aValue ? 1 : bValue < aValue ? -1 : 0;
        }
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      });
    }

    return filtered;
  }, [allProducts, filters]);

  const products = useMemo(() => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, page, limit]);

  const stats = useMemo((): ProductStats => {
    const total = allProducts.length;
    const inStock = allProducts.filter(p => p.inStock).length;
    const outOfStock = total - inStock;
    
    const categories: Record<ProductCategory, number> = {} as Record<ProductCategory, number>;
    Object.values(ProductCategory).forEach(category => {
      categories[category] = allProducts.filter(p => p.category === category).length;
    });

    return {
      total,
      inStock,
      outOfStock,
      categories
    };
  }, [allProducts]);

  const totalPages = Math.ceil(filteredProducts.length / limit);

  const addProduct = useCallback(async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
    try {
      const newProduct: Product = {
        ...productData,
        id: `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const updatedProducts = [newProduct, ...allProducts];
      setAllProducts(updatedProducts);
      
      if (isClient) {
        try {
          saveProducts(updatedProducts);
        } catch (saveError) {
          console.warn('Failed to save to localStorage after adding product:', saveError);
        }
      }
      
      return newProduct;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add product';
      console.error('Error adding product:', err);
      throw new Error(errorMessage);
    }
  }, [allProducts, isClient]);

  const updateProduct = useCallback(async (id: string, updates: Partial<Product>): Promise<Product> => {
    try {
      const updatedProducts = allProducts.map(product =>
        product.id === id
          ? { ...product, ...updates, updatedAt: new Date().toISOString() }
          : product
      );

      const updatedProduct = updatedProducts.find(p => p.id === id);
      if (!updatedProduct) {
        throw new Error('Product not found');
      }

      setAllProducts(updatedProducts);
      
      if (isClient) {
        try {
          saveProducts(updatedProducts);
        } catch (saveError) {
          console.warn('Failed to save to localStorage after updating product:', saveError);
        }
      }
      
      return updatedProduct;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update product';
      console.error('Error updating product:', err);
      throw new Error(errorMessage);
    }
  }, [allProducts, isClient]);

  const deleteProduct = useCallback(async (id: string): Promise<void> => {
    try {
      const updatedProducts = allProducts.filter(product => product.id !== id);
      setAllProducts(updatedProducts);
      
      if (isClient) {
        try {
          saveProducts(updatedProducts);
        } catch (saveError) {
          console.warn('Failed to save to localStorage after deleting product:', saveError);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete product';
      console.error('Error deleting product:', err);
      throw new Error(errorMessage);
    }
  }, [allProducts, isClient]);

  const getProductById = useCallback((id: string): Product | undefined => {
    return allProducts.find(product => product.id === id);
  }, [allProducts]);

  const refetch = useCallback(async () => {
    await loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    if (isClient) {
      loadProducts();
    }
  }, [isClient, loadProducts]);

  return {
    products,
    loading,
    error,
    stats,
    totalPages,
    currentPage: page,
    refetch,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById
  };
};