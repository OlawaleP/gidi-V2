import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/types/product';
import { useProducts } from '@/hooks/useProducts';

interface UseProductActionsOptions {
  onEditSuccess?: (product: Product) => void;
  onDeleteSuccess?: (productId: string) => void;
  onError?: (error: Error, action: 'edit' | 'delete') => void;
  redirectAfterDelete?: boolean;
}

interface UseProductActionsReturn {
  isEditing: boolean;
  isDeleting: boolean;
  editingProduct: Product | null;
  handleEdit: (product: Product) => void;
  handleEditSubmit: (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  handleEditCancel: () => void;
  handleDelete: (productId: string) => Promise<void>;
  error: string | null;
  clearError: () => void;
}

export const useProductActions = (
  options: UseProductActionsOptions = {}
): UseProductActionsReturn => {
  const {
    onEditSuccess,
    onDeleteSuccess,
    onError,
    redirectAfterDelete = true
  } = options;

  const router = useRouter();
  const { updateProduct, deleteProduct } = useProducts();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleEdit = useCallback((product: Product) => {
    setEditingProduct(product);
    setIsEditing(true);
    setError(null);
  }, []);

  const handleEditSubmit = useCallback(async (
    productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    if (!editingProduct) {
      throw new Error('No product selected for editing');
    }

    try {
      setError(null);
      const updatedProduct = await updateProduct(editingProduct.id, productData);
      
      setIsEditing(false);
      setEditingProduct(null);
      
      onEditSuccess?.(updatedProduct);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update product');
      setError(error.message);
      onError?.(error, 'edit');
      throw error; 
    }
  }, [editingProduct, updateProduct, onEditSuccess, onError]);

  const handleEditCancel = useCallback(() => {
    setIsEditing(false);
    setEditingProduct(null);
    setError(null);
  }, []);

  const handleDelete = useCallback(async (productId: string) => {
    try {
      setIsDeleting(true);
      setError(null);
      
      await deleteProduct(productId);
      
      onDeleteSuccess?.(productId);
      
      if (redirectAfterDelete) {
        router.push('/products');
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete product');
      setError(error.message);
      onError?.(error, 'delete');
      throw error; 
    } finally {
      setIsDeleting(false);
    }
  }, [deleteProduct, onDeleteSuccess, onError, redirectAfterDelete, router]);

  return {
    isEditing,
    isDeleting,
    editingProduct,
    handleEdit,
    handleEditSubmit,
    handleEditCancel,
    handleDelete,
    error,
    clearError
  };
};