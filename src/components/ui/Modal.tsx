import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { BaseComponent } from '@/types/common';
import Button from './Button';

export interface ModalProps extends BaseComponent {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
}

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  ({
    className,
    children,
    isOpen,
    onClose,
    title,
    size = 'md',
    closeOnOverlayClick = true,
    closeOnEscape = true,
    showCloseButton = true,
    ...props
  }, ref) => {
    useEffect(() => {
      if (!closeOnEscape) return;

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && isOpen) {
          onClose();
        }
      };

      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose, closeOnEscape]);

    useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'unset';
      }

      return () => {
        document.body.style.overflow = 'unset';
      };
    }, [isOpen]);

    if (!isOpen) return null;

    const sizeClasses = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      full: 'max-w-full mx-4'
    };

    const handleOverlayClick = (e: React.MouseEvent) => {
      if (e.target === e.currentTarget && closeOnOverlayClick) {
        onClose();
      }
    };

    const modalContent = (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={handleOverlayClick}
      >
        <div
          ref={ref}
          className={cn(
            'relative w-full bg-white rounded-lg shadow-xl transform transition-all duration-200 scale-100 opacity-100',
            sizeClasses[size],
            className
          )}
          {...props}
        >
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              {title && (
                <h2 className="text-lg font-semibold text-gray-900">
                  {title}
                </h2>
              )}
              {showCloseButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="ml-auto"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </Button>
              )}
            </div>
          )}
          
          <div className="p-4">
            {children}
          </div>
        </div>
      </div>
    );

    return createPortal(modalContent, document.body);
  }
);

Modal.displayName = 'Modal';

// Modal sub-components
export const ModalHeader = React.forwardRef<HTMLDivElement, BaseComponent>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('pb-3 border-b border-gray-200 mb-4', className)}
      {...props}
    >
      {children}
    </div>
  )
);

ModalHeader.displayName = 'ModalHeader';

export const ModalFooter = React.forwardRef<HTMLDivElement, BaseComponent>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('pt-4 border-t border-gray-200 mt-4 flex justify-end space-x-2', className)}
      {...props}
    >
      {children}
    </div>
  )
);

ModalFooter.displayName = 'ModalFooter';

export default Modal;