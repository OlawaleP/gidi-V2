import { Product, ProductFormData, ProductCategory } from '@/types/product';
import { VALIDATION_RULES } from '@/lib/constants';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export class ProductValidator {
  static validateName(name: string): ValidationError | null {
    if (!name || name.trim().length === 0) {
      return { field: 'name', message: 'Product name is required' };
    }

    if (name.trim().length < VALIDATION_RULES.PRODUCT_NAME.MIN_LENGTH) {
      return {
        field: 'name',
        message: `Product name must be at least ${VALIDATION_RULES.PRODUCT_NAME.MIN_LENGTH} characters long`
      };
    }

    if (name.trim().length > VALIDATION_RULES.PRODUCT_NAME.MAX_LENGTH) {
      return {
        field: 'name',
        message: `Product name cannot exceed ${VALIDATION_RULES.PRODUCT_NAME.MAX_LENGTH} characters`
      };
    }

    return null;
  }

  static validateDescription(description: string): ValidationError | null {
    if (!description || description.trim().length === 0) {
      return { field: 'description', message: 'Product description is required' };
    }

    if (description.trim().length < VALIDATION_RULES.PRODUCT_DESCRIPTION.MIN_LENGTH) {
      return {
        field: 'description',
        message: `Description must be at least ${VALIDATION_RULES.PRODUCT_DESCRIPTION.MIN_LENGTH} characters long`
      };
    }

    if (description.trim().length > VALIDATION_RULES.PRODUCT_DESCRIPTION.MAX_LENGTH) {
      return {
        field: 'description',
        message: `Description cannot exceed ${VALIDATION_RULES.PRODUCT_DESCRIPTION.MAX_LENGTH} characters`
      };
    }

    return null;
  }

  static validatePrice(price: string | number): ValidationError | null {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;

    if (isNaN(numPrice)) {
      return { field: 'price', message: 'Price must be a valid number' };
    }

    if (numPrice < VALIDATION_RULES.PRODUCT_PRICE.MIN) {
      return {
        field: 'price',
        message: `Price must be at least $${VALIDATION_RULES.PRODUCT_PRICE.MIN}`
      };
    }

    if (numPrice > VALIDATION_RULES.PRODUCT_PRICE.MAX) {
      return {
        field: 'price',
        message: `Price cannot exceed $${VALIDATION_RULES.PRODUCT_PRICE.MAX.toLocaleString()}`
      };
    }

    return null;
  }

  static validateCategory(category: string): ValidationError | null {
    if (!category) {
      return { field: 'category', message: 'Product category is required' };
    }

    if (!Object.values(ProductCategory).includes(category as ProductCategory)) {
      return { field: 'category', message: 'Invalid product category' };
    }

    return null;
  }

  static validateImageUrl(imageUrl: string): ValidationError | null {
    if (!imageUrl || imageUrl.trim().length === 0) {
      return { field: 'imageUrl', message: 'Product image URL is required' };
    }

    if (imageUrl.startsWith('/uploads/')) {
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
      const hasImageExtension = imageExtensions.some(ext => 
        imageUrl.toLowerCase().endsWith(ext)
      );

      if (!hasImageExtension) {
        return {
          field: 'imageUrl',
          message: 'Local image must have a valid extension (jpg, jpeg, png, gif, webp, svg)'
        };
      }

      return null;
    }

    try {
      new URL(imageUrl);
    } catch {
      return { field: 'imageUrl', message: 'Please provide a valid image URL' };
    }

    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const hasImageExtension = imageExtensions.some(ext => 
      imageUrl.toLowerCase().includes(ext)
    );

    const isImageService = imageUrl.includes('unsplash.com') || 
                          imageUrl.includes('images.') ||
                          imageUrl.includes('img.') ||
                          hasImageExtension;

    if (!isImageService) {
      return { 
        field: 'imageUrl', 
        message: 'Please provide a valid image URL (jpg, png, gif, webp, or image service URL)' 
      };
    }

    return null;
  }

  static validateSKU(sku?: string): ValidationError | null {
    if (!sku) return null; 

    if (sku.length < VALIDATION_RULES.SKU.MIN_LENGTH) {
      return {
        field: 'sku',
        message: `SKU must be at least ${VALIDATION_RULES.SKU.MIN_LENGTH} characters long`
      };
    }

    if (sku.length > VALIDATION_RULES.SKU.MAX_LENGTH) {
      return {
        field: 'sku',
        message: `SKU cannot exceed ${VALIDATION_RULES.SKU.MAX_LENGTH} characters`
      };
    }

    if (!VALIDATION_RULES.SKU.PATTERN.test(sku)) {
      return {
        field: 'sku',
        message: 'SKU can only contain uppercase letters, numbers, and hyphens'
      };
    }

    return null;
  }

  static validateTags(tags: string): ValidationError | null {
    if (!tags.trim()) {
      return { field: 'tags', message: 'At least one tag is required' };
    }

    const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    
    if (tagArray.length === 0) {
      return { field: 'tags', message: 'At least one valid tag is required' };
    }

    if (tagArray.length > 10) {
      return { field: 'tags', message: 'Cannot have more than 10 tags' };
    }

    for (const tag of tagArray) {
      if (tag.length < 2) {
        return { field: 'tags', message: 'Each tag must be at least 2 characters long' };
      }
      if (tag.length > 20) {
        return { field: 'tags', message: 'Each tag cannot exceed 20 characters' };
      }
    }

    return null;
  }

  static validateBrand(brand?: string): ValidationError | null {
    if (!brand) return null; 

    if (brand.trim().length < 2) {
      return { field: 'brand', message: 'Brand must be at least 2 characters long' };
    }

    if (brand.trim().length > 50) {
      return { field: 'brand', message: 'Brand cannot exceed 50 characters' };
    }

    return null;
  }

  static validateFormData(formData: ProductFormData): ValidationResult {
    const errors: ValidationError[] = [];

    const nameError = this.validateName(formData.name);
    if (nameError) errors.push(nameError);

    const descriptionError = this.validateDescription(formData.description);
    if (descriptionError) errors.push(descriptionError);

    const priceError = this.validatePrice(formData.price);
    if (priceError) errors.push(priceError);

    const categoryError = this.validateCategory(formData.category);
    if (categoryError) errors.push(categoryError);

    const imageUrlError = this.validateImageUrl(formData.imageUrl);
    if (imageUrlError) errors.push(imageUrlError);

    const skuError = this.validateSKU(formData.sku);
    if (skuError) errors.push(skuError);

    const tagsError = this.validateTags(formData.tags);
    if (tagsError) errors.push(tagsError);

    const brandError = this.validateBrand(formData.brand);
    if (brandError) errors.push(brandError);

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateProduct(product: Partial<Product>): ValidationResult {
    const errors: ValidationError[] = [];

    if (product.name !== undefined) {
      const nameError = this.validateName(product.name);
      if (nameError) errors.push(nameError);
    }

    if (product.description !== undefined) {
      const descriptionError = this.validateDescription(product.description);
      if (descriptionError) errors.push(descriptionError);
    }

    if (product.price !== undefined) {
      const priceError = this.validatePrice(product.price);
      if (priceError) errors.push(priceError);
    }

    if (product.category !== undefined) {
      const categoryError = this.validateCategory(product.category);
      if (categoryError) errors.push(categoryError);
    }

    if (product.imageUrl !== undefined) {
      const imageUrlError = this.validateImageUrl(product.imageUrl);
      if (imageUrlError) errors.push(imageUrlError);
    }

    if (product.sku !== undefined) {
      const skuError = this.validateSKU(product.sku);
      if (skuError) errors.push(skuError);
    }

    if (product.brand !== undefined) {
      const brandError = this.validateBrand(product.brand);
      if (brandError) errors.push(brandError);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static formDataToProduct(formData: ProductFormData): Omit<Product, 'id' | 'createdAt' | 'updatedAt'> {
    const tags = formData.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    return {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: parseFloat(formData.price),
      category: formData.category,
      imageUrl: formData.imageUrl.trim(),
      inStock: formData.inStock,
      tags,
      sku: formData.sku?.trim() || undefined,
      brand: formData.brand?.trim() || undefined,
      rating: undefined,
      reviewCount: undefined
    };
  }

  static productToFormData(product: Product): ProductFormData {
    return {
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      imageUrl: product.imageUrl,
      inStock: product.inStock,
      tags: product.tags.join(', '),
      sku: product.sku || '',
      brand: product.brand || ''
    };
  }
}

export const validateProductFormData = (formData: ProductFormData): ValidationResult => {
  return ProductValidator.validateFormData(formData);
};

export const validateProduct = (product: Partial<Product>): ValidationResult => {
  return ProductValidator.validateProduct(product);
};

export const convertFormDataToProduct = (formData: ProductFormData): Omit<Product, 'id' | 'createdAt' | 'updatedAt'> => {
  return ProductValidator.formDataToProduct(formData);
};

export const convertProductToFormData = (product: Product): ProductFormData => {
  return ProductValidator.productToFormData(product);
};