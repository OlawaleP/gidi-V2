import { ReactNode } from 'react';
import { Container } from '@/components/common/Container';

interface PageTemplateProps {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  showContainer?: boolean;
}

export function PageTemplate({ 
  children, 
  className = "min-h-screen bg-gray-50 dark:bg-gray-900",
  containerClassName = "py-8",
  showContainer = true 
}: PageTemplateProps) {
  if (!showContainer) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={className}>
      <Container className={containerClassName}>
        {children}
      </Container>
    </div>
  );
}