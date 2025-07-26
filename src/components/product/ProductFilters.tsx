'use client'

import React, { useCallback, useMemo } from 'react'
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react'
import { ProductStats, type ProductCategory, type ProductFilters } from '@/types/product'; 
import { BaseComponent, SelectOption } from '@/types/common'
import { cn, formatPrice } from '@/lib/utils'
import { CATEGORY_LABELS, PRICE_RANGES, SORT_OPTIONS } from '@/lib/constants'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

export interface ProductFiltersProps extends BaseComponent {
  filters: ProductFilters
  onFiltersChange: (filters: ProductFilters) => void
  stats: ProductStats
  onClearFilters?: () => void
  isLoading?: boolean
  collapsible?: boolean
  defaultExpanded?: boolean
}

const ProductFilters = React.memo(React.forwardRef<HTMLDivElement, ProductFiltersProps>(
  (
    {
      className,
      filters,
      onFiltersChange,
      stats,
      onClearFilters,
      isLoading = false,
      collapsible = true,
      defaultExpanded = true,
      ...props
    },
    ref
  ) => {
    const [isExpanded, setIsExpanded] = React.useState(defaultExpanded)
    const [priceRange, setPriceRange] = React.useState({
      min: filters.minPrice?.toString() || '',
      max: filters.maxPrice?.toString() || '',
    })

    const categoryOptions = useMemo((): SelectOption[] => [
      { value: '', label: 'All Categories' },
      ...Object.entries(CATEGORY_LABELS).map(([value, label]) => ({
        value,
        label,
      })),
    ], []);

    const activeFiltersCount = useMemo(() => {
      let count = 0
      if (filters.category) count++
      if (filters.minPrice !== undefined || filters.maxPrice !== undefined) count++
      if (filters.inStock !== undefined) count++
      if (filters.searchQuery) count++
      return count
    }, [filters.category, filters.minPrice, filters.maxPrice, filters.inStock, filters.searchQuery]);

    // Memoize event handlers
    const handleCategoryChange = useCallback((category: string) => {
      onFiltersChange({
        ...filters,
        category: category as ProductCategory | undefined,
      })
    }, [filters, onFiltersChange]);

    const handleSortChange = useCallback((sortValue: string) => {
      if (!sortValue) {
        onFiltersChange({
          ...filters,
          sortBy: undefined,
          sortOrder: undefined,
        })
        return
      }

      const [sortBy, sortOrder] = sortValue.split('-') as ['name' | 'price' | 'createdAt', 'asc' | 'desc']
      onFiltersChange({
        ...filters,
        sortBy,
        sortOrder,
      })
    }, [filters, onFiltersChange]);

    const handleStockChange = useCallback((inStock: boolean | undefined) => {
      onFiltersChange({
        ...filters,
        inStock,
      })
    }, [filters, onFiltersChange]);

    const handlePriceRangeChange = useCallback((min?: number, max?: number) => {
      onFiltersChange({
        ...filters,
        minPrice: min,
        maxPrice: max,
      })
    }, [filters, onFiltersChange]);

    const applyCustomPriceRange = useCallback(() => {
      const min = priceRange.min ? parseFloat(priceRange.min) : undefined
      const max = priceRange.max ? parseFloat(priceRange.max) : undefined

      if (min !== undefined && (isNaN(min) || min < 0)) return
      if (max !== undefined && (isNaN(max) || max < 0)) return
      if (min !== undefined && max !== undefined && min > max) return

      handlePriceRangeChange(min, max)
    }, [priceRange.min, priceRange.max, handlePriceRangeChange]);

    const getCurrentSortValue = () => {
      if (!filters.sortBy || !filters.sortOrder) return ''
      return `${filters.sortBy}-${filters.sortOrder}`
    }

        const handleCustomPriceChange = (field: 'min' | 'max', value: string) => {
      setPriceRange((prev) => ({ ...prev, [field]: value }))
    }


    return (
      <Card ref={ref} className={cn('relative', className)} variant="outlined" padding="lg" {...props}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-600" aria-hidden="true" />
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
            {activeFiltersCount > 0 && (
              <Badge variant="primary" size="sm">
                {activeFiltersCount}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && onClearFilters && (
              <Button variant="ghost" size="sm" onClick={onClearFilters} disabled={isLoading}>
                Clear All
              </Button>
            )}
            {collapsible && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1"
                aria-label={isExpanded ? 'Collapse filters' : 'Expand filters'}
              >
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          {stats.total} product{stats.total !== 1 ? 's' : ''} found
        </p>

        <div className={cn('space-y-6 transition-all duration-300', !isExpanded && collapsible && 'hidden')}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <Select
              value={getCurrentSortValue()}
              onChange={handleSortChange}
              options={[{ value: '', label: 'Default' }, ...SORT_OPTIONS]}
              disabled={isLoading}
              aria-label="Sort products"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <Select
              value={filters.category || ''}
              onChange={handleCategoryChange}
              options={categoryOptions}
              disabled={isLoading}
              aria-label="Filter by category"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
            <div className="grid grid-cols-1 gap-2 mb-3">
              {PRICE_RANGES.map((range) => {
                const isActive =
                  filters.minPrice === range.min &&
                  (range.max === Infinity ? !filters.maxPrice : filters.maxPrice === range.max)
                return (
                  <Button
                    key={range.label}
                    variant={isActive ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => handlePriceRangeChange(range.min, range.max === Infinity ? undefined : range.max)}
                    disabled={isLoading}
                    className="justify-start text-left"
                  >
                    {range.label}
                  </Button>
                )
              })}
            </div>
            <div className="flex gap-2 items-center">
              <div className="flex-1">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => handleCustomPriceChange('min', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isLoading}
                  aria-label="Minimum price"
                />
              </div>
              <span className="text-gray-400">-</span>
              <div className="flex-1">
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => handleCustomPriceChange('max', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isLoading}
                  aria-label="Maximum price"
                />
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={applyCustomPriceRange}
                disabled={isLoading}
                className="px-3"
                aria-label="Apply custom price range"
              >
                Apply
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
            <div className="space-y-2">
              <Button
                variant={filters.inStock === undefined ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => handleStockChange(undefined)}
                disabled={isLoading}
                className="w-full justify-start"
                aria-label="Show all products"
              >
                All Products
              </Button>
              <Button
                variant={filters.inStock === true ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => handleStockChange(true)}
                disabled={isLoading}
                className="w-full justify-start"
                aria-label="Show in stock products only"
              >
                In Stock Only
              </Button>
              <Button
                variant={filters.inStock === false ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => handleStockChange(false)}
                disabled={isLoading}
                className="w-full justify-start"
                aria-label="Show out of stock products"
              >
                Out of Stock
              </Button>
            </div>
          </div>
        </div>

        {activeFiltersCount > 0 && isExpanded && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Active Filters</h4>
            <div className="flex flex-wrap gap-2">
              {filters.category && (
                <Badge variant="primary" className="flex items-center gap-1">
                  {CATEGORY_LABELS[filters.category]}
                  <button
                    onClick={() => handleCategoryChange('')}
                    className="ml-1 hover:bg-blue-700 rounded-full p-0.5"
                    aria-label={`Remove ${CATEGORY_LABELS[filters.category]} category filter`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {(filters.minPrice !== undefined || filters.maxPrice !== undefined) && (
                <Badge variant="primary" className="flex items-center gap-1">
                  {filters.minPrice !== undefined && filters.maxPrice !== undefined
                    ? `${formatPrice(filters.minPrice)} - ${formatPrice(filters.maxPrice)}`
                    : filters.minPrice !== undefined
                    ? `Over ${formatPrice(filters.minPrice)}`
                    : `Under ${formatPrice(filters.maxPrice!)}`}
                  <button
                    onClick={() => handlePriceRangeChange(undefined, undefined)}
                    className="ml-1 hover:bg-blue-700 rounded-full p-0.5"
                    aria-label="Remove price range filter"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {filters.inStock !== undefined && (
                <Badge variant="primary" className="flex items-center gap-1">
                  {filters.inStock ? 'In Stock' : 'Out of Stock'}
                  <button
                    onClick={() => handleStockChange(undefined)}
                    className="ml-1 hover:bg-blue-700 rounded-full p-0.5"
                    aria-label="Remove stock status filter"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          </div>
        )}

        {isLoading && (
          <div className="absolute inset-0 bg-white/50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Updating filters...</p>
            </div>
          </div>
        )}
      </Card>
    )
  }
))

ProductFilters.displayName = 'ProductFilters'

export default ProductFilters