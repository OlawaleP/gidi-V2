'use client';

import { useState, useCallback, useRef } from 'react';
import { Product, ProductFormData, ProductCategory } from '@/types/product';
import { 
  validateProductFormData, 
  convertFormDataToProduct, 
  convertProductToFormData 
} from '@/lib/validation';
import { CATEGORY_LABELS, DEFAULT_PRODUCT_IMAGE } from '@/lib/constants';
import Input from '../ui/Input';
import Button from '../ui/Button';
import LoadingSpinner from '../ui/LoadingSpinner';
import Select from '../ui/Select';
import Textarea from '../ui/Textarea';

interface ProductFormProps {
  product?: Product;
  onSubmit: (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  submitButtonText?: string;
}

const initialFormData: ProductFormData = {
  name: '',
  description: '',
  price: '',
  category: ProductCategory.ELECTRONICS,
  imageUrl: '',
  inStock: true,
  tags: '',
  sku: '',
  brand: ''
};

export function ProductForm({
  product,
  onSubmit,
  onCancel,
  isLoading = false,
  submitButtonText = 'Save Product'
}: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>(
    product ? convertProductToFormData(product) : initialFormData
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateField = useCallback((field: keyof ProductFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, imageUrl: 'Please select a valid image file' }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, imageUrl: 'Image size must be less than 5MB' }));
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    updateField('imageUrl', objectUrl);

    setErrors(prev => ({ ...prev, imageUrl: '' }));
  }, [updateField]);

  const validateForm = useCallback(() => {
    const validation = validateProductFormData(formData);
    
    if (!validation.isValid) {
      const fieldErrors: Record<string, string> = {};
      validation.errors.forEach(error => {
        fieldErrors[error.field] = error.message;
      });
      setErrors(fieldErrors);
      return false;
    }
    
    setErrors({});
    return true;
  }, [formData]);

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      const productData = convertFormDataToProduct(formData);
      await onSubmit(productData);
      setIsDirty(false);
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: error instanceof Error ? error.message : 'Failed to save product' });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, onSubmit]);

  const handleReset = useCallback(() => {
    setFormData(product ? convertProductToFormData(product) : initialFormData);
    setErrors({});
    setIsDirty(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [product]);

  const categoryOptions = Object.entries(CATEGORY_LABELS).map(([value, label]) => ({
    value,
    label
  }));

  const isFormLoading = isLoading || isSubmitting;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Product Name *
        </label>
        <Input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => updateField('name', e.target.value)}
          placeholder="Enter product name"
          error={errors.name}
          disabled={isFormLoading}
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description *
        </label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => updateField('description', e.target.value)}
          placeholder="Enter product description"
          rows={4}
          error={errors.description}
          disabled={isFormLoading}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
            Price ($) *
          </label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) => updateField('price', e.target.value)}
            placeholder="0.00"
            error={errors.price}
            disabled={isFormLoading}
            required
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>
          <Select
            id="category"
            value={formData.category}
            onChange={(value) => updateField('category', value as ProductCategory)}
            options={categoryOptions}
            error={errors.category}
            disabled={isFormLoading}
            required
          />
        </div>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Product Image *
        </label>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => updateField('imageUrl', e.target.value)}
              placeholder="Enter image URL or upload a file"
              error={errors.imageUrl}
              disabled={isFormLoading}
            />
          </div>
          
          <div className="sm:w-auto">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={isFormLoading}
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
              disabled={isFormLoading}
              className="w-full sm:w-auto"
            >
              Upload Image
            </Button>
          </div>
        </div>

        {formData.imageUrl && (
          <div className="mt-2">
            <img
              src={formData.imageUrl}
              alt="Product preview"
              className="w-32 h-32 object-cover rounded-lg border border-gray-200"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = DEFAULT_PRODUCT_IMAGE;
              }}
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-1">
            SKU
          </label>
          <Input
            id="sku"
            type="text"
            value={formData.sku || ''}
            onChange={(e) => updateField('sku', e.target.value)}
            placeholder="e.g., PROD-001"
            error={errors.sku}
            disabled={isFormLoading}
          />
        </div>

        <div>
          <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
            Brand
          </label>
          <Input
            id="brand"
            type="text"
            value={formData.brand || ''}
            onChange={(e) => updateField('brand', e.target.value)}
            placeholder="Enter brand name"
            error={errors.brand}
            disabled={isFormLoading}
          />
        </div>
      </div>

      {/* Tags */}
      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
          Tags *
        </label>
        <Input
          id="tags"
          type="text"
          value={formData.tags}
          onChange={(e) => updateField('tags', e.target.value)}
          placeholder="Enter tags separated by commas (e.g., electronics, mobile, smartphone)"
          error={errors.tags}
          disabled={isFormLoading}
          required
        />
        <p className="mt-1 text-xs text-gray-500">
          Separate multiple tags with commas
        </p>
      </div>

      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.inStock}
            onChange={(e) => updateField('inStock', e.target.checked)}
            disabled={isFormLoading}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-sm font-medium text-gray-700">In Stock</span>
        </label>
      </div>

      {errors.submit && (
        <div className="p-3 bg-error-50 border border-error-200 rounded-md">
          <p className="text-sm text-error-600">{errors.submit}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
        <Button
          type="submit"
          disabled={isFormLoading || !isDirty}
          className="flex-1 sm:flex-none"
        >
          {isFormLoading ? (
            <>
              <LoadingSpinner size="sm" />
              <span className="ml-2">Saving...</span>
            </>
          ) : (
            submitButtonText
          )}
        </Button>

        {isDirty && (
          <Button
            type="button"
            variant="secondary"
            onClick={handleReset}
            disabled={isFormLoading}
            className="flex-1 sm:flex-none"
          >
            Reset
          </Button>
        )}

        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={isFormLoading}
            className="flex-1 sm:flex-none"
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}