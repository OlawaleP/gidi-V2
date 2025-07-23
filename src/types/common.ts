import { ReactNode } from 'react';

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