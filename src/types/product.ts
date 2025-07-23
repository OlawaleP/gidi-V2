export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: ProductCategory;
    imageUrl: string;
    inStock: boolean;
    tags: string[];
    createdAt: string;
    updatedAt: string;
    sku?: string;
    brand?: string;
    rating?: number;
    reviewCount?: number;
  }
  
  export enum ProductCategory {
    ELECTRONICS = 'electronics',
    CLOTHING = 'clothing',
    HOME = 'home',
    BOOKS = 'books',
    SPORTS = 'sports',
    BEAUTY = 'beauty',
    TOYS = 'toys',
    AUTOMOTIVE = 'automotive'
  }
  
  export interface ProductFormData {
    name: string;
    description: string;
    price: string;
    category: ProductCategory;
    imageUrl: string;
    inStock: boolean;
    tags: string;
    sku?: string;
    brand?: string;
  }
  
  export interface ProductFilters {
    category?: ProductCategory;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    searchQuery?: string;
    sortBy?: 'name' | 'price' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
  }
  
  export interface ProductStats {
    total: number;
    inStock: number;
    outOfStock: number;
    categories: Record<ProductCategory, number>;
  }