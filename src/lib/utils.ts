import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Product, ProductCategory, ProductFilters } from '@/types/product';


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
}


export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(dateObj);
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function filterProducts(products: Product[], filters: ProductFilters): Product[] {
  return products.filter(product => {
    if (filters.category && product.category !== filters.category) {
      return false;
    }

    if (filters.minPrice !== undefined && product.price < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice !== undefined && product.price > filters.maxPrice) {
      return false;
    }

    if (filters.inStock !== undefined && product.inStock !== filters.inStock) {
      return false;
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const searchableText = [
        product.name,
        product.description,
        product.brand,
        ...product.tags
      ].join(' ').toLowerCase();
      
      if (!searchableText.includes(query)) {
        return false;
      }
    }

    return true;
  });
}

export function sortProducts(
  products: Product[],
  sortBy: 'name' | 'price' | 'createdAt' = 'createdAt',
  sortOrder: 'asc' | 'desc' = 'desc'
): Product[] {
  return [...products].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'price':
        comparison = a.price - b.price;
        break;
      case 'createdAt':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}


export function getCategoryLabel(category: ProductCategory): string {
  return category.split('-').map(capitalize).join(' ');
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

export function parseTags(tagsString: string): string[] {
  return tagsString
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0);
}

export function joinTags(tags: string[]): string {
  return tags.join(', ');
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function calculatePagination(total: number, page: number, limit: number) {
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;
  const startIndex = (page - 1) * limit;
  const endIndex = Math.min(startIndex + limit, total);

  return {
    totalPages,
    hasNextPage,
    hasPreviousPage,
    startIndex,
    endIndex,
    currentPage: page
  };
}

export interface IconConfig {
  path: string;
  viewBox?: string;
  strokeWidth?: number;
}

export function getCategoryIcon(category: ProductCategory): IconConfig {
  const defaultViewBox = '0 0 24 24';
  const defaultStrokeWidth = 2;

  switch (category) {
    case ProductCategory.ELECTRONICS:
      return {
        path: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
        viewBox: defaultViewBox,
        strokeWidth: defaultStrokeWidth,
      };
    case ProductCategory.CLOTHING:
      return {
        path: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4 4 4 0 004-4V5z',
        viewBox: defaultViewBox,
        strokeWidth: defaultStrokeWidth,
      };
    case ProductCategory.HOME:
      return {
        path: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
        viewBox: defaultViewBox,
        strokeWidth: defaultStrokeWidth,
      };
    case ProductCategory.BOOKS:
      return {
        path: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
        viewBox: defaultViewBox,
        strokeWidth: defaultStrokeWidth,
      };
    case ProductCategory.SPORTS:
      return {
        path: 'M3.055 11H5a2 2 0 012 2v1a2 2.0 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 104 0 2 2 0 2-2h1.064M15 20.488V18a2 0 012 2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
        viewBox: defaultViewBox,
        strokeWidth: defaultStrokeWidth,
      };
    case ProductCategory.BEAUTY:
      return {
        path: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
        viewBox: defaultViewBox,
        strokeWidth: defaultStrokeWidth,
      };
    case ProductCategory.TOYS:
      return {
        path: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h.098a2.5 2.5 0 000-5H9m4.5 5H15a2.5 2.5 0 000-5h-1.5m-5 0V9a2 2 0 012-2h2a2 2 0 012 2v.5',
        viewBox: defaultViewBox,
        strokeWidth: defaultStrokeWidth,
      };
    case ProductCategory.AUTOMOTIVE:
      return {
        path: 'M8 17l4 4 4-4m-4-5v9m-8-9h16',
        viewBox: defaultViewBox,
        strokeWidth: defaultStrokeWidth,
      };
    default:
      return {
        path: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
        viewBox: defaultViewBox,
        strokeWidth: defaultStrokeWidth,
      };
  }
}