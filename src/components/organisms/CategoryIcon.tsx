import React from 'react';
import { IconConfig } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface CategoryIconProps {
  config: IconConfig;
  className?: string;
}

export function CategoryIcon({ config, className }: CategoryIconProps) {
  return (
    <svg
      className={cn('w-full h-full', className)}
      fill="none"
      stroke="currentColor"
      viewBox={config.viewBox || '0 0 24 24'}
      strokeWidth={config.strokeWidth || 2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d={config.path} />
    </svg>
  );
}