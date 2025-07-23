"use client";

import React, { useState } from 'react';
import { ProductFormData, ProductCategory } from '@/types/product';
import { BaseComponent } from '@/types/common';
import { cn } from '@/lib/utils';
import { CATEGORY_LABELS } from '@/lib/constants';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import { SelectOption } from '@/types/common';

export interface ProductFormProps extends BaseComponent {
  initialData?: ProductFormData;
  onSubmit: (formData: ProductFormData) => void;
  isLoading?: boolean;
}

const ProductForm = React.forwardRef<HTMLFormElement, ProductFormProps>(
  ({ className, initialData, onSubmit, isLoading = false }, ref) => {
    const [formData, setFormData] = useState<ProductFormData>(
      initialData || {
        name: '',
        description: '',
        price: '',
        category: ProductCategory.ELECTRONICS,
        imageUrl: '',
        inStock: true,
        tags: '',
        sku: '',
        brand: '',
      }
    );

    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
      const { name, value, type } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
      }));
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
    };

    const categoryOptions: SelectOption[] = [
      { value: '', label: 'Select Category' },
      ...Object.entries(CATEGORY_LABELS).map(([value, label]) => ({
        value,
        label,
      })),
    ];

    return (
      <form
        ref={ref}
        className={cn('space-y-6', className)}
        onSubmit={handleSubmit}
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <Select
            placeholder="category"
            value={formData.category}
            onChange={(value) => setFormData((prev) => ({ ...prev, category: value as ProductCategory }))}
            options={categoryOptions}
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image URL
          </label>
          <input
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              name="inStock"
              checked={formData.inStock}
              onChange={handleChange}
              disabled={isLoading}
            />
            In Stock
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            SKU
          </label>
          <input
            type="text"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Brand
          </label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            disabled={isLoading}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isLoading}
        >
          {isLoading ? 'Adding...' : 'Add Product'}
        </Button>
      </form>
    );
  }
);

ProductForm.displayName = 'ProductForm';

export default ProductForm;