import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productName: string;
  isDeleting: boolean;
  className?: string;
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  productName,
  isDeleting,
  className,
}: DeleteConfirmationModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Product" className={className}>
      <div className="space-y-4">
        <p className="text-gray-600 dark:text-gray-300">
          Are you sure you want to delete <strong>{productName}</strong>? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="primary" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={onConfirm}
            disabled={isDeleting}
            className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 dark:text-red-400 dark:border-red-700 dark:hover:bg-red-900/20"
          >
            {isDeleting ? (
              <>
                <LoadingSpinner size="sm" />
                <span className="ml-2">Deleting...</span>
              </>
            ) : (
              'Delete Product'
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}