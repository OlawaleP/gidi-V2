import { Container } from '@/components/common/Container';
import Button from '../ui/Button';

interface DeleteSuccessMessageProps {
  onBack: () => void;
  className?: string;
}

export function DeleteSuccessMessage({ onBack, className }: DeleteSuccessMessageProps) {
  return (
    <Container className={`py-16 ${className}`}>
      <div className="text-center">
        <p className="text-gray-600 mb-4">Product has been deleted.</p>
        <Button onClick={onBack}>Back to Products</Button>
      </div>
    </Container>
  );
}