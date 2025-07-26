import { NextRequest, NextResponse } from 'next/server';
import { Product } from '@/types/product';
import { ApiResponse } from '@/types/api';
import { storage } from '@/lib/storage';
import { validateProductFormData, convertFormDataToProduct } from '@/lib/validation';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, data: null, message: 'Product ID is required' },
        { status: 400 }
      );
    }

    const product = storage.getProduct(id);
    if (!product) {
      return NextResponse.json(
        { success: false, data: null, message: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
      message: 'Product retrieved successfully',
    });
  } catch (error) {
    console.error(`GET /api/products error:`, error);
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: error instanceof Error ? error.message : 'Failed to retrieve product',
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, data: null, message: 'Product ID is required' },
        { status: 400 }
      );
    }

    if (!storage.productExists(id)) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        data: null,
        message: 'Product not found'
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }

    const body = await request.json();
    
    const validation = validateProductFormData(body);
    if (!validation.isValid) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        data: null,
        message: 'Validation failed',
        error: validation.errors 
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const productData = convertFormDataToProduct(body);

    const updatedProduct = storage.updateProduct(id, productData);

    if (!updatedProduct) {
      throw new Error('Failed to update product');
    }

    const response: ApiResponse<Product> = {
      success: true,
      data: updatedProduct,
      message: 'Product updated successfully'
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error(`PUT /api/products error:`, error);
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: error instanceof Error ? error.message : 'Failed to update product',
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, data: null, message: 'Product ID is required' },
        { status: 400 }
      );
    }

    const existing = storage.getProduct(id);
    if (!existing) {
      return NextResponse.json(
        { success: false, data: null, message: 'Product not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const fieldsToUpdate = Object.keys(body);
    const allowedFields = [
      'name', 'description', 'price', 'category', 'imageUrl', 
      'inStock', 'tags', 'sku', 'brand', 'rating', 'reviewCount'
    ];
    
    const invalidFields = fieldsToUpdate.filter(field => !allowedFields.includes(field));
    if (invalidFields.length > 0) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        data: null,
        message: `Invalid fields: ${invalidFields.join(', ')}`
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const updates: Partial<Product> = {};
    
    if (body.name !== undefined) {
      if (typeof body.name !== 'string' || body.name.trim().length === 0) {
        const errorResponse: ApiResponse<null> = {
          success: false,
          data: null,
          message: 'Product name is required and must be a non-empty string'
        };
        return NextResponse.json(errorResponse, { status: 400 });
      }
      updates.name = body.name.trim();
    }

    if (body.description !== undefined) {
      if (typeof body.description !== 'string' || body.description.trim().length === 0) {
        const errorResponse: ApiResponse<null> = {
          success: false,
          data: null,
          message: 'Product description is required and must be a non-empty string'
        };
        return NextResponse.json(errorResponse, { status: 400 });
      }
      updates.description = body.description.trim();
    }

    if (body.price !== undefined) {
      const price = typeof body.price === 'string' ? parseFloat(body.price) : body.price;
      if (isNaN(price) || price < 0) {
        const errorResponse: ApiResponse<null> = {
          success: false,
          data: null,
          message: 'Price must be a valid positive number'
        };
        return NextResponse.json(errorResponse, { status: 400 });
      }
      updates.price = price;
    }

    if (body.category !== undefined) {
      updates.category = body.category;
    }

    if (body.imageUrl !== undefined) {
      updates.imageUrl = body.imageUrl;
    }

    if (body.inStock !== undefined) {
      updates.inStock = Boolean(body.inStock);
    }

    if (body.tags !== undefined) {
      if (typeof body.tags === 'string') {
        updates.tags = body.tags
          .split(',')
          .map((tag: string) => tag.trim())
          .filter((tag: string) => tag.length > 0);
      } else if (Array.isArray(body.tags)) {
        updates.tags = body.tags;
      }
    }

    if (body.sku !== undefined) {
      updates.sku = body.sku;
    }

    if (body.brand !== undefined) {
      updates.brand = body.brand;
    }

    if (body.rating !== undefined) {
      const rating = typeof body.rating === 'string' ? parseFloat(body.rating) : body.rating;
      if (!isNaN(rating) && rating >= 0 && rating <= 5) {
        updates.rating = rating;
      }
    }

    if (body.reviewCount !== undefined) {
      const reviewCount = typeof body.reviewCount === 'string' ? parseInt(body.reviewCount) : body.reviewCount;
      if (!isNaN(reviewCount) && reviewCount >= 0) {
        updates.reviewCount = reviewCount;
      }
    }

    const updated = storage.updateProduct(id, updates);

if (!updated) throw new Error('Failed to update product');

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Product updated successfully',
    });
  } catch (err) {
    console.error(`PATCH /api/products error:`, err);
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: err instanceof Error ? err.message : 'Failed to update product',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, data: null, message: 'Product ID is required' },
        { status: 400 }
      );
    }

    if (!storage.productExists(id)) {
      return NextResponse.json(
        { success: false, data: null, message: 'Product not found' },
        { status: 404 }
      );
    }

    const success = storage.deleteProduct(id);
    if (!success) throw new Error('Failed to delete product');

    return NextResponse.json(
      { success: true, data: null, message: 'Product deleted successfully' }
    );
  } catch (error) {
    console.error(`DELETE /api/products error:`, error);
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: error instanceof Error ? error.message : 'Failed to delete product',
      },
      { status: 500 }
    );
  }
}
