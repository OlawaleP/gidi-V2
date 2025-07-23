import { useState, useEffect, useCallback, useMemo } from 'react';
import { Product, ProductFilters, ProductStats, ProductCategory } from '@/types/product';
import { ApiResponse, ProductsResponse } from '@/types/api';
import { STORAGE_KEYS, API_ENDPOINTS, PAGINATION } from '@/lib/constants';
import { getStoredProducts, saveProducts } from '@/lib/storage';

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
  
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load products from storage/API
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to load from localStorage first
      const storedProducts = getStoredProducts();
      
      if (storedProducts.length > 0) {
        setAllProducts(storedProducts);
      } else {
        // Fallback to API or initialize with mock data
        const response = await fetch(API_ENDPOINTS.PRODUCTS);
        if (response.ok) {
          const data: ApiResponse<Product[]> = await response.json();
          setAllProducts(data.data);
          saveProducts(data.data);
        } else {
          throw new Error('Failed to load products');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter and paginate products
  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts];

    // Apply filters
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

    // Apply sorting
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

  // Paginate filtered products
  const paginatedProducts = useMemo(() => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, page, limit]);

  // Calculate statistics
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

  // CRUD operations
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
      saveProducts(updatedProducts);
      
      return newProduct;
    } catch {
      throw new Error('Failed to add product');
    }
  }, [allProducts]);

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
      saveProducts(updatedProducts);
      
      return updatedProduct;
    } catch {
      throw new Error('Failed to update product');
    }
  }, [allProducts]);

  const deleteProduct = useCallback(async (id: string): Promise<void> => {
    try {
      const updatedProducts = allProducts.filter(product => product.id !== id);
      setAllProducts(updatedProducts);
      saveProducts(updatedProducts);
    } catch {
      throw new Error('Failed to delete product');
    }
  }, [allProducts]);

  const getProductById = useCallback((id: string): Product | undefined => {
    return allProducts.find(product => product.id === id);
  }, [allProducts]);

  const refetch = useCallback(async () => {
    await loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    setProducts(paginatedProducts);
  }, [paginatedProducts]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

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