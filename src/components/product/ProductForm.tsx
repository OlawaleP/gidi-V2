'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Product, ProductFormData, ProductCategory } from '@/types/product';
import { 
  validateProductFormData, 
  convertFormDataToProduct, 
  convertProductToFormData 
} from '@/lib/validation';
import { CATEGORY_LABELS, DEFAULT_PRODUCT_IMAGE } from '@/lib/constants';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Select from '../ui/Select';
import Button from '../ui/Button';
import LoadingSpinner from '../ui/LoadingSpinner';
import { useToastActions } from '../ui/Toast';
import Image from 'next/image';

interface ProductFormProps {
  product?: Product;
  onSubmit: (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  submitButtonText?: string;
  mode?: 'create' | 'edit';
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
  submitButtonText,
  mode = 'create'
}: ProductFormProps) {
  const toast = useToastActions()
  const [formData, setFormData] = useState<ProductFormData>(
    product ? convertProductToFormData(product) : initialFormData
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageError, setImageError] = useState(false);

  const isEditMode = mode === 'edit' || !!product;
  const defaultSubmitText = isEditMode ? 'Update Product' : 'Create Product';

  useEffect(() => {
    if (product) {
      const newFormData = convertProductToFormData(product);
      setFormData(newFormData);
      setIsDirty(false);
      setHasUnsavedChanges(false);
      setErrors({});
    }
  }, [product]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const updateField = useCallback((field: keyof ProductFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
    setHasUnsavedChanges(true);
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  const handleImageUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, imageUrl: 'Please select a valid image file' }));
      toast.error('Invalid file type. Please select an image.');
      return;
    }

    if (file.size > parseInt(process.env.MAX_FILE_SIZE || '5242880')) {
      setErrors(prev => ({ ...prev, imageUrl: 'Image size must be less than 5MB' }));
      toast.error('Image size exceeds 5MB limit.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsUploading(true);
      const response = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const { fileUrl } = await response.json();
      updateField('imageUrl', fileUrl);
      setErrors(prev => ({ ...prev, imageUrl: '' }));
      toast.success('Image uploaded successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload image';
      setErrors(prev => ({ ...prev, imageUrl: errorMessage }));
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  }, [updateField, toast]);

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
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        const element = document.getElementById(firstErrorField);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element?.focus();
      }
      return;
    }

    try {
      setIsSubmitting(true);
      setErrors({}); 
      
      const productData = convertFormDataToProduct(formData);
      await onSubmit(productData);
      
      setIsDirty(false);
      setHasUnsavedChanges(false);
      
      if (!isEditMode) {
        setFormData(initialFormData);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save product';
      setErrors({ submit: errorMessage });
      toast.error(errorMessage);
      
      setTimeout(() => {
        const errorElement = document.querySelector('[data-error="submit"]');
        errorElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, onSubmit, isEditMode, toast, errors]);

  const handleReset = useCallback(() => {
    const resetData = product ? convertProductToFormData(product) : initialFormData;
    setFormData(resetData);
    setErrors({});
    setIsDirty(false);
    setHasUnsavedChanges(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [product]);

  const handleCancel = useCallback(() => {
    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm(
        'You have unsaved changes. Are you sure you want to leave without saving?'
      );
      if (!confirmLeave) return;
    }
    onCancel?.();
  }, [hasUnsavedChanges, onCancel]);

  const categoryOptions = Object.entries(CATEGORY_LABELS).map(([value, label]) => ({
    value,
    label
  }));

  const isFormLoading = isLoading || isSubmitting || isUploading;

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-shrink-0 mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          {isEditMode ? 'Edit Product' : 'Create New Product'}
        </h1>
        {isEditMode && product && (
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Editing: {product.name}
          </p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto max-h-[70vh]">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6 pb-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Product Image *
              </label>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    id="imageUrl"
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
                    {isUploading ? (
                      <>
                        <LoadingSpinner size="sm" />
                        <span className="ml-2">Uploading...</span>
                      </>
                    ) : (
                      'Upload Image'
                    )}
                  </Button>
                </div>
              </div>

{formData.imageUrl && (
  <div className="mt-2">
    <div className="relative w-32 h-32">
      <Image
        src={imageError ? DEFAULT_PRODUCT_IMAGE : formData.imageUrl}
        alt="Product preview"
        width={128}
        height={128}
        className="w-32 h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
        onError={() => setImageError(true)}
        unoptimized={formData.imageUrl.startsWith('/')} 
      />
    </div>
  </div>
)}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="sku" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                <label htmlFor="brand" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
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
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">In Stock</span>
              </label>
            </div>

            {errors.submit && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md" data-error="submit">
                <p className="text-sm text-red-600 dark:text-red-400">{errors.submit}</p>
              </div>
            )}

            {hasUnsavedChanges && !isSubmitting && (
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  You have unsaved changes. Don&apos;t forget to save your work!
                </p>
              </div>
            )}

            {isEditMode && product && (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-1 text-xs text-gray-500 dark:text-gray-400">
                <p>Created: {new Date(product.createdAt).toLocaleString()}</p>
                <p>Last updated: {new Date(product.updatedAt).toLocaleString()}</p>
                <p>Product ID: {product.id}</p>
              </div>
            )}
          </form>
        </div>
      </div>

      <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 pt-4 mt-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="submit"
              disabled={isFormLoading || (!isDirty && isEditMode)}
              className="flex-1 sm:flex-none"
              onClick={handleSubmit}
            >
              {isFormLoading ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span className="ml-2">
                    {isEditMode ? 'Updating...' : 'Creating...'}
                  </span>
                </>
              ) : (
                submitButtonText || defaultSubmitText
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
                onClick={handleCancel}
                disabled={isFormLoading}
                className="flex-1 sm:flex-none"
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}