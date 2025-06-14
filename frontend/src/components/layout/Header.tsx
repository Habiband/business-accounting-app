'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  MagnifyingGlassIcon, 
  ShoppingCartIcon, 
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useProductStore } from '@/store/productStore';
import { SearchBar } from '@/components/ui/SearchBar';
import { CartDropdown } from '@/components/cart/CartDropdown';
import { UserDropdown } from '@/components/user/UserDropdown';
import { MobileMenu } from '@/components/layout/MobileMenu';

export function Header() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const { getItemCount } = useCartStore();
  const { categories, fetchCategories } = useProductStore();
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const itemCount = getItemCount();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm dark:bg-gray-900">
      {/* Top bar */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex h-10 items-center justify-between text-sm">
            <div className="hidden md:flex items-center space-x-4 text-gray-600 dark:text-gray-400">
              <span>Free shipping on orders over $100</span>
              <span>•</span>
              <span>24/7 Customer Support</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/contact" 
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              >
                Contact
              </Link>
              <Link 
                href="/help" 
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              >
                Help
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                E-Store
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link 
              href="/products" 
              className="text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 font-medium"
            >
              All Products
            </Link>
            {categories.slice(0, 4).map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 font-medium"
              >
                {category.name}
              </Link>
            ))}
            <Link 
              href="/deals" 
              className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium"
            >
              Deals
            </Link>
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Search - Mobile */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              <MagnifyingGlassIcon className="h-6 w-6" />
            </button>

            {/* Wishlist */}
            {isAuthenticated && (
              <Link
                href="/wishlist"
                className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              >
                <HeartIcon className="h-6 w-6" />
              </Link>
            )}

            {/* Cart */}
            <div className="relative">
              <button
                onClick={() => setIsCartOpen(true)}
                className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 relative"
              >
                <ShoppingCartIcon className="h-6 w-6" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary-600 text-xs text-white flex items-center justify-center">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </button>
            </div>

            {/* User Menu */}
            <div className="relative">
              {isAuthenticated ? (
                <button
                  onClick={() => setIsUserMenuOpen(true)}
                  className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.firstName}
                      className="h-6 w-6 rounded-full"
                    />
                  ) : (
                    <UserIcon className="h-6 w-6" />
                  )}
                  <span className="hidden sm:block text-sm font-medium">
                    {user?.firstName}
                  </span>
                </button>
              ) : (
                <Link
                  href="/auth/login"
                  className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                >
                  <UserIcon className="h-6 w-6" />
                  <span className="hidden sm:block text-sm font-medium">
                    Sign In
                  </span>
                </Link>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden">
          <div className="bg-white dark:bg-gray-900 p-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <SearchBar onSearch={handleSearch} autoFocus />
              </div>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Dropdown */}
      <CartDropdown 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />

      {/* User Dropdown */}
      <UserDropdown 
        isOpen={isUserMenuOpen} 
        onClose={() => setIsUserMenuOpen(false)} 
      />

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </header>
  );
}
