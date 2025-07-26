import LoadingSpinner from '@/components/ui/LoadingSpinner';

export const LoadingStates = {
  ProductsPage: () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center items-center py-8">
        <LoadingSpinner size="lg" aria-label="Loading products" />
        <span className="ml-3 text-gray-600 dark:text-gray-400">Loading products...</span>
      </div>
    </div>
  ),

  ProductDetail: ({ productId, stage }: { productId: string; stage: string }) => (
    <div className="flex flex-col justify-center items-center py-16">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">{stage}</p>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">Product ID: {productId}</p>
    </div>
  ),
};