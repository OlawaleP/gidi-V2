'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navigationItems = [
  { name: 'Home', href: '/' },
  { name: 'Products', href: '/products' },
  { name: 'Add Product', href: '/products/add' },
] as const

interface NavigationProps {
  className?: string
  onItemClick?: () => void
}

export function Navigation({ className, onItemClick }: NavigationProps) {
  const pathname = usePathname()

  return (
    <nav className={cn('flex space-x-8', className)}>
      {navigationItems.map((item) => {
        const isActive = pathname === item.href || 
          (item.href === '/products' && pathname.startsWith('/products') && pathname !== '/')

        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={onItemClick}
            className={cn(
              'text-sm font-medium transition-colors hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-sm px-1 py-1',
              isActive
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
            )}
          >
            {item.name}
          </Link>
        )
      })}
    </nav>
  )
}