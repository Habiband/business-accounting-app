'use client';

import { useState, useEffect } from 'react';
import { useProductStore } from '@/store/productStore';
import { Button } from '@/components/ui/Button';

interface ProductFiltersProps {
  filters: any;
  onFilterChange: (filters: any) => void;
  onClearFilters: () => void;
}

export function ProductFilters({ filters, onFilterChange, onClearFilters }: ProductFiltersProps) {
  const { categories, fetchCategories } = useProductStore();
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const numValue = value ? Number(value) : undefined;
    const key = type === 'min' ? 'minPrice' : 'maxPrice';
    handleFilterChange(key, numValue);
  };

  const mainCategories = categories.filter(cat => !cat.parentId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Filters</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="text-primary-600 hover:text-primary-700 dark:text-primary-400"
        >
          Clear all
        </Button>
      </div>

      {/* Categories */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Category</h4>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="category"
              value=""
              checked={!localFilters.category}
              onChange={() => handleFilterChange('category', undefined)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">All Categories</span>
          </label>
          {mainCategories.map((category) => (
            <label key={category.id} className="flex items-center">
              <input
                type="radio"
                name="category"
                value={category.id}
                checked={localFilters.category === category.id}
                onChange={() => handleFilterChange('category', category.id)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                {category.name}
                {category._count && (
                  <span className="text-gray-500 dark:text-gray-400 ml-1">
                    ({category._count.products})
                  </span>
                )}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Price Range</h4>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
              Min Price
            </label>
            <input
              type="number"
              placeholder="$0"
              value={localFilters.minPrice || ''}
              onChange={(e) => handlePriceChange('min', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
              Max Price
            </label>
            <input
              type="number"
              placeholder="$1000"
              value={localFilters.maxPrice || ''}
              onChange={(e) => handlePriceChange('max', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>

        {/* Quick Price Filters */}
        <div className="mt-3 space-y-2">
          <h5 className="text-xs font-medium text-gray-600 dark:text-gray-400">Quick Filters</h5>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Under $25', min: 0, max: 25 },
              { label: '$25 - $50', min: 25, max: 50 },
              { label: '$50 - $100', min: 50, max: 100 },
              { label: '$100 - $200', min: 100, max: 200 },
              { label: 'Over $200', min: 200, max: undefined },
            ].map((range) => (
              <button
                key={range.label}
                onClick={() => {
                  handleFilterChange('minPrice', range.min);
                  handleFilterChange('maxPrice', range.max);
                }}
                className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                  localFilters.minPrice === range.min && localFilters.maxPrice === range.max
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Availability */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Availability</h4>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={localFilters.inStock || false}
              onChange={(e) => handleFilterChange('inStock', e.target.checked || undefined)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">In Stock Only</span>
          </label>
        </div>
      </div>

      {/* Rating */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Customer Rating</h4>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <label key={rating} className="flex items-center">
              <input
                type="radio"
                name="rating"
                value={rating}
                checked={localFilters.minRating === rating}
                onChange={() => handleFilterChange('minRating', rating)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
              />
              <span className="ml-2 flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`h-4 w-4 ${
                      i < rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">& up</span>
              </span>
            </label>
          ))}
          <label className="flex items-center">
            <input
              type="radio"
              name="rating"
              value=""
              checked={!localFilters.minRating}
              onChange={() => handleFilterChange('minRating', undefined)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">All Ratings</span>
          </label>
        </div>
      </div>
    </div>
  );
}
