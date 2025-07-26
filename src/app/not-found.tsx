'use client'

import Link from 'next/link'
import { Container } from '@/components/common/Container'
import Button from '@/components/ui/Button'

export default function NotFound() {
  const handleGoBack = () => {
    window.history.back()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <Container className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <svg
                className="w-16 h-16 text-gray-400 dark:text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-6xl font-bold text-gray-200 dark:text-gray-700 mb-2">
              404
            </h1>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Page Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Sorry, we couldn&apos;t find the page you&apos;re looking for. 
              The page might have been moved, deleted, or you might have entered the wrong URL.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button size="lg">
                Go Home
              </Button>
            </Link>
            <Link href="/products">
              <Button variant="secondary" size="lg">
                Browse Products
              </Button>
            </Link>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Need help finding what you&apos;re looking for?
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link
                href="/products"
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
              >
                All Products
              </Link>
              <span className="text-gray-300 dark:text-gray-600">•</span>
              <Link
                href="/products/add"
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
              >
                Add Product
              </Link>
              <span className="text-gray-300 dark:text-gray-600">•</span>
              <button
                onClick={handleGoBack}
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors bg-transparent border-none cursor-pointer"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}