import { ProductCategory } from '@/types/product';

export const STORAGE_KEYS = {
  PRODUCTS: 'ecommerce_products',
  FILTERS: 'ecommerce_filters',
  PREFERENCES: 'ecommerce_preferences'
} as const;

export const API_ENDPOINTS = {
  PRODUCTS: '/api/products',
  PRODUCT_BY_ID: (id: string) => `/api/products/${id}`
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 50
} as const;

export const PRICE_RANGES = [
  { label: 'Under $25', min: 0, max: 25 },
  { label: '$25 - $50', min: 25, max: 50 },
  { label: '$50 - $100', min: 50, max: 100 },
  { label: '$100 - $200', min: 100, max: 200 },
  { label: 'Over $200', min: 200, max: Infinity }
] as const;

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  [ProductCategory.ELECTRONICS]: 'Electronics',
  [ProductCategory.CLOTHING]: 'Clothing',
  [ProductCategory.HOME]: 'Home & Garden',
  [ProductCategory.BOOKS]: 'Books',
  [ProductCategory.SPORTS]: 'Sports & Outdoors',
  [ProductCategory.BEAUTY]: 'Beauty & Personal Care',
  [ProductCategory.TOYS]: 'Toys & Games',
  [ProductCategory.AUTOMOTIVE]: 'Automotive'
};

export const SORT_OPTIONS = [
  { value: 'name-asc', label: 'Name (A-Z)' },
  { value: 'name-desc', label: 'Name (Z-A)' },
  { value: 'price-asc', label: 'Price (Low to High)' },
  { value: 'price-desc', label: 'Price (High to Low)' },
  { value: 'createdAt-desc', label: 'Newest First' },
  { value: 'createdAt-asc', label: 'Oldest First' }
] as const;

export const VALIDATION_RULES = {
  PRODUCT_NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100
  },
  PRODUCT_DESCRIPTION: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 1000
  },
  PRODUCT_PRICE: {
    MIN: 0.01,
    MAX: 999999.99
  },
  SKU: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 20,
    PATTERN: /^[A-Z0-9-]+$/
  }
} as const;

export const DEFAULT_PRODUCT_IMAGE = '/images/placeholder.jpg';

export const SEO_DEFAULTS = {
  TITLE: 'gidi-e - Quality Products Online',
  DESCRIPTION: 'Discover a wide range of quality products across multiple categories. Electronics, clothing, home goods, and more.',
  KEYWORDS: ['ecommerce', 'online shopping', 'products', 'electronics', 'clothing', 'home goods'] as string[],
  SITE_NAME: 'gidi-e',
  TWITTER_HANDLE: '@ecommerce'
} as const;