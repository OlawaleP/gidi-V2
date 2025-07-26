import { NextRequest, NextResponse } from 'next/server';
import { Product, ProductFilters, ProductCategory } from '@/types/product';
import { ApiResponse, ProductsResponse } from '@/types/api';
import { storage } from '@/lib/storage';
import { validateProductFormData, convertFormDataToProduct } from '@/lib/validation';
import { PAGINATION } from '@/lib/constants';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || PAGINATION.DEFAULT_LIMIT.toString());
    const category = searchParams.get('category') as ProductCategory;
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;
    const inStock = searchParams.get('inStock') ? searchParams.get('inStock') === 'true' : undefined;
    const searchQuery = searchParams.get('search') || undefined;
    const sortBy = searchParams.get('sortBy') as 'name' | 'price' | 'createdAt' || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') as 'asc' | 'desc' || 'desc';

    const filters: ProductFilters = {
      category,
      minPrice,
      maxPrice,
      inStock,
      searchQuery,
      sortBy,
      sortOrder
    };

    let products = storage.getProducts();

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      products = products.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.tags.some(tag => tag.toLowerCase().includes(query)) ||
        product.brand?.toLowerCase().includes(query)
      );
    }

    if (filters.category) {
      products = products.filter(product => product.category === filters.category);
    }

    if (filters.minPrice !== undefined) {
      products = products.filter(product => product.price >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      products = products.filter(product => product.price <= filters.maxPrice!);
    }

    if (filters.inStock !== undefined) {
      products = products.filter(product => product.inStock === filters.inStock);
    }

    products.sort((a, b) => {
      let aValue: string | number | Date = a[sortBy];
      let bValue: string | number | Date = b[sortBy];

      if (sortBy === 'price') {
        aValue = Number(aValue);
        bValue = Number(bValue);
      } else if (sortBy === 'createdAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else {
        aValue = String(aValue).toLowerCase();
        bValue = String(bValue).toLowerCase();
      }

      if (sortOrder === 'desc') {
        return bValue > aValue ? 1 : bValue < aValue ? -1 : 0;
      }
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    });

    const totalProducts = products.length;
    const totalPages = Math.ceil(totalProducts / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = products.slice(startIndex, endIndex);

    const allProducts = storage.getProducts();
    const stats = {
      total: allProducts.length,
      inStock: allProducts.filter(p => p.inStock).length,
      outOfStock: allProducts.filter(p => !p.inStock).length,
      categories: Object.values(ProductCategory).reduce((acc, category) => {
        acc[category] = allProducts.filter(p => p.category === category).length;
        return acc;
      }, {} as Record<ProductCategory, number>)
    };

    const response: ApiResponse<ProductsResponse> = {
      success: true,
      data: {
        products: paginatedProducts,
        pagination: {
          page,
          limit,
          totalPages,
          totalProducts,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1
        },
        filters: filters,
        stats
      },
      message: 'Products retrieved successfully'
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('GET /api/products error:', error);
    
    const errorResponse: ApiResponse<null> = {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Failed to retrieve products'
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validation = validateProductFormData(body);
    if (!validation.isValid) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        data: null,
        message: 'Validation failed',
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const productData = convertFormDataToProduct(body);

    const newProduct = storage.addProduct(productData);

    const response: ApiResponse<Product> = {
      success: true,
      data: newProduct,
      message: 'Product created successfully'
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('POST /api/products error:', error);
    
    const errorResponse: ApiResponse<null> = {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Failed to create product'
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const success = storage.clearProducts();
    
    if (!success) {
      throw new Error('Failed to clear products');
    }

    const response: ApiResponse<null> = {
      success: true,
      data: null,
      message: 'All products cleared successfully'
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('DELETE /api/products error:', error);
    
    const errorResponse: ApiResponse<null> = {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Failed to clear products'
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}