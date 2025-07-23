import { useState, useCallback, useMemo } from 'react';
import { Product, ProductFilters, ProductCategory } from '@/types/product';
import { filterProducts, sortProducts } from '@/lib/utils';
import { useDebounce } from './useDebounce';

interface UseFiltersProps {
  products: Product[];
  initialFilters?: Partial<ProductFilters>;
}

interface UseFiltersReturn {
  filters: ProductFilters;
  
  filteredProducts: Product[];
  
  setSearchQuery: (query: string) => void;
  setCategory: (category: ProductCategory | undefined) => void;
  setPriceRange: (min?: number, max?: number) => void;
  setInStockFilter: (inStock?: boolean) => void;
  setSorting: (sortBy: 'name' | 'price' | 'createdAt', sortOrder: 'asc' | 'desc') => void;
  
  clearFilters: () => void;
  resetFilters: () => void;
  
  hasActiveFilters: boolean;
  resultCount: number;
}

const defaultFilters: ProductFilters = {
  searchQuery: '',
  category: undefined,
  minPrice: undefined,
  maxPrice: undefined,
  inStock: undefined,
  sortBy: 'createdAt',
  sortOrder: 'desc'
};

export function useFilters({ 
  products, 
  initialFilters = {} 
}: UseFiltersProps): UseFiltersReturn {
  const [filters, setFilters] = useState<ProductFilters>({
    ...defaultFilters,
    ...initialFilters
  });

  const debouncedSearchQuery = useDebounce(filters.searchQuery || '', 300);

  const debouncedFilters = useMemo(() => ({
    ...filters,
    searchQuery: debouncedSearchQuery
  }), [filters, debouncedSearchQuery]);

  const filteredProducts = useMemo(() => {
    let filtered = filterProducts(products, debouncedFilters);
    
    if (debouncedFilters.sortBy) {
      filtered = sortProducts(
        filtered,
        debouncedFilters.sortBy,
        debouncedFilters.sortOrder || 'desc'
      );
    }
    
    return filtered;
  }, [products, debouncedFilters]);

  const hasActiveFilters = useMemo(() => {
    return !!(
      debouncedFilters.searchQuery ||
      debouncedFilters.category ||
      debouncedFilters.minPrice !== undefined ||
      debouncedFilters.maxPrice !== undefined ||
      debouncedFilters.inStock !== undefined
    );
  }, [debouncedFilters]);

  const setSearchQuery = useCallback((query: string) => {
    setFilters(prev => ({
      ...prev,
      searchQuery: query
    }));
  }, []);

  const setCategory = useCallback((category: ProductCategory | undefined) => {
    setFilters(prev => ({
      ...prev,
      category
    }));
  }, []);

  const setPriceRange = useCallback((min?: number, max?: number) => {
    setFilters(prev => ({
      ...prev,
      minPrice: min,
      maxPrice: max
    }));
  }, []);

  const setInStockFilter = useCallback((inStock?: boolean) => {
    setFilters(prev => ({
      ...prev,
      inStock
    }));
  }, []);

  const setSorting = useCallback((
    sortBy: 'name' | 'price' | 'createdAt', 
    sortOrder: 'asc' | 'desc'
  ) => {
    setFilters(prev => ({
      ...prev,
      sortBy,
      sortOrder
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      ...defaultFilters,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder
    });
  }, [filters.sortBy, filters.sortOrder]);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  return {
    filters: debouncedFilters,
    filteredProducts,
    setSearchQuery,
    setCategory,
    setPriceRange,
    setInStockFilter,
    setSorting,
    clearFilters,
    resetFilters,
    hasActiveFilters,
    resultCount: filteredProducts.length
  };
}