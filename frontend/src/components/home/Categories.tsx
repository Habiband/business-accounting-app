'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useProductStore } from '@/store/productStore';

const categoryImages = {
  electronics: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop',
  clothing: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop',
  home: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
  sports: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
  books: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
  beauty: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop',
};

export function Categories() {
  const { categories, fetchCategories, isLoadingCategories } = useProductStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  if (isLoadingCategories) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Shop by Category
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const mainCategories = categories.filter(cat => !cat.parentId).slice(0, 6);

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore our wide range of categories to find exactly what you're looking for.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {mainCategories.map((category) => {
            const imageKey = category.slug as keyof typeof categoryImages;
            const image = category.image || categoryImages[imageKey] || categoryImages.electronics;
            
            return (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group text-center"
              >
                <div className="relative aspect-square rounded-lg overflow-hidden mb-4 bg-white dark:bg-gray-700 shadow-sm group-hover:shadow-md transition-shadow">
                  <Image
                    src={image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-semibold text-lg drop-shadow-lg">
                      {category.name}
                    </span>
                  </div>
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {category.name}
                </h3>
                {category._count && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {category._count.products} products
                  </p>
                )}
              </Link>
            );
          })}
        </div>

        {/* View All Categories */}
        {categories.length > 6 && (
          <div className="text-center mt-12">
            <Link
              href="/categories"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
            >
              View All Categories
              <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
