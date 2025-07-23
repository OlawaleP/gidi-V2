import { JSX, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ContainerProps {
  children: ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  as?: keyof JSX.IntrinsicElements
}

const sizeClasses = {
  sm: 'max-w-4xl',
  md: 'max-w-6xl',
  lg: 'max-w-7xl',
  xl: 'max-w-8xl',
  full: 'max-w-full'
}

export function Container({ 
  children, 
  className, 
  size = 'lg',
  as: Component = 'div'
}: ContainerProps) {
  return (
    <Component 
      className={cn(
        'mx-auto px-4 sm:px-6 lg:px-8',
        sizeClasses[size],
        className
      )}
    >
      {children}
    </Component>
  )
}