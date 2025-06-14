'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useProductStore } from '@/store/productStore';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductFilters } from '@/components/product/ProductFilters';
import { ProductSort } from '@/components/product/ProductSort';
import { Pagination } from '@/components/ui/Pagination';
import { Button } from '@/components/ui/Button';
import { FunnelIcon } from '@heroicons/react/24/outline';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const { 
    products, 
    isLoading, 
    pagination, 
    filters,
    fetchProducts,
    setFilters,
    clearFilters
  } = useProductStore();
  
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Get initial filters from URL
  useEffect(() => {
    const urlFilters: any = {};
    
    if (searchParams.get('category')) {
      urlFilters.category = searchParams.get('category');
    }
    if (searchParams.get('minPrice')) {
      urlFilters.minPrice = Number(searchParams.get('minPrice'));
    }
    if (searchParams.get('maxPrice')) {
      urlFilters.maxPrice = Number(searchParams.get('maxPrice'));
    }
    if (searchParams.get('sortBy')) {
      urlFilters.sortBy = searchParams.get('sortBy');
    }
    if (searchParams.get('sortOrder')) {
      urlFilters.sortOrder = searchParams.get('sortOrder');
    }
    if (searchParams.get('search')) {
      urlFilters.search = searchParams.get('search');
    }

    if (Object.keys(urlFilters).length > 0) {
      setFilters(urlFilters);
    }
  }, [searchParams, setFilters]);

  // Fetch products when filters or page changes
  useEffect(() => {
    fetchProducts({ page: currentPage, limit: 12 });
  }, [fetchProducts, filters, currentPage]);

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSortChange = (sortBy: string, sortOrder: string) => {
    setFilters({ sortBy, sortOrder });
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearFilters = () => {
    clearFilters();
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            All Products
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover our complete collection of products
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-4">
              <ProductFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="flex items-center space-x-4">
                {/* Mobile Filter Toggle */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(true)}
                  className="lg:hidden"
                  leftIcon={<FunnelIcon className="h-4 w-4" />}
                >
                  Filters
                </Button>

                {/* Results Count */}
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {pagination && (
                    <>
                      Showing {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} products
                    </>
                  )}
                </div>
              </div>

              {/* Sort */}
              <ProductSort
                sortBy={filters.sortBy || 'createdAt'}
                sortOrder={filters.sortOrder || 'desc'}
                onSortChange={handleSortChange}
              />
            </div>

            {/* Products Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(12)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.pages > 1 && (
                  <div className="flex justify-center">
                    <Pagination
                      currentPage={pagination.page}
                      totalPages={pagination.pages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 dark:text-gray-600 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1m8 0V4a1 1 0 00-1-1H9a1 1 0 00-1 1v1" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Try adjusting your filters or search terms.
                </p>
                <Button onClick={handleClearFilters} variant="outline">
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Filters Modal */}
        {showFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowFilters(false)} />
            <div className="fixed inset-y-0 left-0 w-full max-w-sm bg-white dark:bg-gray-900 shadow-xl">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Filters</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <ProductFilters
                  filters={filters}
                  onFilterChange={(newFilters) => {
                    handleFilterChange(newFilters);
                    setShowFilters(false);
                  }}
                  onClearFilters={() => {
                    handleClearFilters();
                    setShowFilters(false);
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
