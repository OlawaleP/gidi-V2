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

type SortableProductKeys = keyof Pick<Product, 'name' | 'price' | 'createdAt' | 'category' | 'brand'>;

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

      let productsToUse: Product[] = [];

      if (isClient) {
        try {
          const storedProducts = getStoredProducts();
          if (Array.isArray(storedProducts) && storedProducts.length > 0) {
            console.log('Loaded products from localStorage:', storedProducts.length);
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
          if (Array.isArray(data.data)) {
            productsToUse = data.data;
            console.log('Loaded products from API:', productsToUse.length);
          }
        } else {
          throw new Error(`API request failed: ${response.status}`);
        }
      } catch (apiError) {
        console.warn('API request failed, using mock data:', apiError);

        if (Array.isArray(mockProducts)) {
          productsToUse = mockProducts;
          console.log('Using mock products:', productsToUse.length);
        }
      }

      if (!Array.isArray(productsToUse)) {
        console.warn('Products data is not an array, using empty array');
        productsToUse = [];
      }

      setAllProducts(productsToUse);
      
      if (isClient && productsToUse.length > 0) {
        try {
          saveProducts(productsToUse);
        } catch (saveError) {
          console.warn('Failed to save to localStorage:', saveError);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load products';
      setError(errorMessage);
      console.error('Error in loadProducts:', err);
      setAllProducts(Array.isArray(mockProducts) ? mockProducts : []);
    } finally {
      setLoading(false);
    }
  }, [isClient]);

  useEffect(() => {
    if (isClient) {
      loadProducts();
    }
  }, [isClient, loadProducts]);

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(allProducts)) {
      console.warn('allProducts is not an array:', allProducts);
      return [];
    }

    let filtered = [...allProducts];

    try {
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        filtered = filtered.filter(product => {
          if (!product || typeof product !== 'object') return false;
          
          const name = product.name?.toLowerCase() || '';
          const description = product.description?.toLowerCase() || '';
          const brand = product.brand?.toLowerCase() || '';
          const tags = Array.isArray(product.tags) ? product.tags : [];
          
          return name.includes(query) ||
                 description.includes(query) ||
                 brand.includes(query) ||
                 tags.some(tag => String(tag).toLowerCase().includes(query));
        });
      }

      if (filters.category) {
        filtered = filtered.filter(product => product?.category === filters.category);
      }

      if (filters.minPrice !== undefined) {
        filtered = filtered.filter(product => {
          const price = Number(product?.price) || 0;
          return price >= filters.minPrice!;
        });
      }

      if (filters.maxPrice !== undefined) {
        filtered = filtered.filter(product => {
          const price = Number(product?.price) || 0;
          return price <= filters.maxPrice!;
        });
      }

      if (filters.inStock !== undefined) {
        filtered = filtered.filter(product => product?.inStock === filters.inStock);
      }

      if (filters.sortBy) {
        filtered.sort((a, b) => {
          if (!a || !b) return 0;
          
          const sortKey = filters.sortBy as SortableProductKeys;
          let aValue: string | number | Date = a[sortKey] as string | number | Date;
          let bValue: string | number | Date = b[sortKey] as string | number | Date;

          if (filters.sortBy === 'price') {
            aValue = Number(aValue) || 0;
            bValue = Number(bValue) || 0;
          } else if (filters.sortBy === 'createdAt') {
            aValue = new Date(aValue || 0).getTime();
            bValue = new Date(bValue || 0).getTime();
          } else {
            aValue = String(aValue || '').toLowerCase();
            bValue = String(bValue || '').toLowerCase();
          }

          if (filters.sortOrder === 'desc') {
            return bValue > aValue ? 1 : bValue < aValue ? -1 : 0;
          }
          return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
        });
      }
    } catch (filterError) {
      console.error('Error filtering products:', filterError);
      return allProducts; 
    }

    return filtered;
  }, [allProducts, filters]);

  const products = useMemo(() => {
    if (!Array.isArray(filteredProducts)) return [];
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, page, limit]);

  const stats = useMemo((): ProductStats => {
    const productsArray = Array.isArray(allProducts) ? allProducts : [];
    const total = productsArray.length;
    const inStock = productsArray.filter(p => p?.inStock === true).length;
    const outOfStock = total - inStock;
    
    const categories: Record<ProductCategory, number> = {} as Record<ProductCategory, number>;
    Object.values(ProductCategory).forEach(category => {
      categories[category] = productsArray.filter(p => p?.category === category).length;
    });

    return {
      total,
      inStock,
      outOfStock,
      categories
    };
  }, [allProducts]);

  const totalPages = Math.ceil((Array.isArray(filteredProducts) ? filteredProducts.length : 0) / limit);

  const addProduct = useCallback(async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
    try {
      const newProduct: Product = {
        ...productData,
        id: `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const currentProducts = Array.isArray(allProducts) ? allProducts : [];
      const updatedProducts = [newProduct, ...currentProducts];
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
      const currentProducts = Array.isArray(allProducts) ? allProducts : [];
      const updatedProducts = currentProducts.map(product =>
        product?.id === id
          ? { ...product, ...updates, updatedAt: new Date().toISOString() }
          : product
      );

      const updatedProduct = updatedProducts.find(p => p?.id === id);
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
      const currentProducts = Array.isArray(allProducts) ? allProducts : [];
      const updatedProducts = currentProducts.filter(product => product?.id !== id);
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
    const currentProducts = Array.isArray(allProducts) ? allProducts : [];
    return currentProducts.find(product => product?.id === id);
  }, [allProducts]);

  const refetch = useCallback(async () => {
    await loadProducts();
  }, [loadProducts]);

  return {
    products: Array.isArray(products) ? products : [],
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