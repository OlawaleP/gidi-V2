import { ReactNode } from 'react';
import { Product } from './product';

export interface BaseComponent {
  className?: string;
  children?: ReactNode;
}

export interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
}

export interface LoadingState {
  loading: boolean;
  error: string | null;
}

export interface FormValidation {
  isValid: boolean;
  errors: Record<string, string>;
}

export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type Variant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'ghost';
export type ButtonType = 'button' | 'submit' | 'reset';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface NotificationState {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  visible: boolean;
}

export interface ProductImageGalleryProps {
  product: Product;
  className?: string;
}

export interface BreadcrumbProps {
  product: Product;
  className?: string;
}

export interface ProductInfoProps {
  product: Product;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
  className?: string;
}

export interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productName: string;
  isDeleting: boolean;
  className?: string;
}

export interface DeleteSuccessMessageProps {
  onBack: () => void;
  className?: string;
}

export interface SuccessMessageProps {
  product: Product;
  isEdit: boolean;
  onAddNew: () => void;
  onViewProduct: () => void;
  onViewAll: () => void;
  className?: string;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export interface HeroSectionProps {
  className?: string;
}

export interface CategoriesSectionProps {
  className?: string;
}

export interface FeaturesSectionProps {
  className?: string;
}

export interface ErrorMessageProps {
  error: string;
  onRetry?: () => void;
  onGoBack?: () => void;
  className?: string;
}