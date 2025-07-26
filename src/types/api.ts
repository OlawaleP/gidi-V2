import { ValidationError } from '@/lib/validation';
import { Product, ProductFilters, ProductStats } from './product';

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string | ValidationError[];
}

export interface PaginationInfo {
  page: number;
  limit: number;
  totalPages: number;
  totalProducts: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ProductsResponse {
  products: Product[];
  pagination: PaginationInfo;
  filters: ProductFilters;
  stats: ProductStats;
}

export interface SearchParams {
  q?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  inStock?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  inStock: boolean;
  tags: string[];
  sku?: string;
  brand?: string;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id: string;
}

export interface DeleteProductResponse {
  success: boolean;
  message: string;
}