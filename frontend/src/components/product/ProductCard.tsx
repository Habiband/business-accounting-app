'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HeartIcon, ShoppingCartIcon, EyeIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { StarIcon } from '@heroicons/react/24/solid';
import { Product } from '@/store/productStore';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/Button';
import { toast } from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  showQuickView?: boolean;
}

export function ProductCard({ product, showQuickView = true }: ProductCardProps) {
  const { isAuthenticated } = useAuthStore();
  const { addToCart, isUpdating } = useCartStore();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      await addToCart(product.id, 1);
    } catch (error) {
      // Error is handled by the store
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please login to add items to wishlist');
      return;
    }

    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement quick view modal
    toast.info('Quick view coming soon!');
  };

  const discountPercentage = product.comparePrice 
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <StarIcon
        key={index}
        className={`h-4 w-4 ${
          index < Math.floor(rating)
            ? 'text-yellow-400'
            : 'text-gray-300 dark:text-gray-600'
        }`}
      />
    ));
  };

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      {/* Product Image */}
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
          {product.images && product.images.length > 0 && (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className={`object-cover group-hover:scale-105 transition-transform duration-300 ${
                imageLoading ? 'opacity-0' : 'opacity-100'
              }`}
              onLoad={() => setImageLoading(false)}
            />
          )}
          
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          )}

          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              -{discountPercentage}%
            </div>
          )}

          {/* Stock Status */}
          {product.inventory === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-semibold">Out of Stock</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleWishlist}
              className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              {isWishlisted ? (
                <HeartSolidIcon className="h-5 w-5 text-red-500" />
              ) : (
                <HeartIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>
            
            {showQuickView && (
              <button
                onClick={handleQuickView}
                className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                aria-label="Quick view"
              >
                <EyeIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
            )}
          </div>

          {/* Quick Add to Cart */}
          <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              onClick={handleAddToCart}
              disabled={product.inventory === 0 || isUpdating}
              loading={isUpdating}
              fullWidth
              size="sm"
              className="bg-white text-gray-900 hover:bg-gray-100 shadow-md"
            >
              <ShoppingCartIcon className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        <Link href={`/products/${product.slug}`}>
          {/* Category */}
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
            {product.category.name}
          </p>

          {/* Product Name */}
          <h3 className="font-medium text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          {product.avgRating && product.avgRating > 0 && (
            <div className="flex items-center space-x-1 mb-2">
              <div className="flex">
                {renderStars(product.avgRating)}
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ({product.reviewCount || 0})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              ${product.price.toFixed(2)}
            </span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                ${product.comparePrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Inventory Status */}
          {product.inventory > 0 && product.inventory <= 10 && (
            <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
              Only {product.inventory} left in stock
            </p>
          )}
        </Link>
      </div>
    </div>
  );
}
