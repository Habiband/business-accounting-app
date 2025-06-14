'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useProductStore } from '@/store/productStore';
import { useAuthStore } from '@/store/authStore';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { categories } = useProductStore();
  const { isAuthenticated, user } = useAuthStore();

  const mainCategories = categories.filter(cat => !cat.parentId);

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50 lg:hidden" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white dark:bg-gray-900 shadow-xl">
                    {/* Header */}
                    <div className="px-4 py-6 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="h-8 w-8 rounded-lg bg-primary-600 flex items-center justify-center">
                            <span className="text-white font-bold text-lg">E</span>
                          </div>
                          <span className="text-xl font-bold text-gray-900 dark:text-white">
                            E-Store
                          </span>
                        </div>
                        <button
                          type="button"
                          className="relative -m-2 p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                          onClick={onClose}
                        >
                          <span className="absolute -inset-0.5" />
                          <span className="sr-only">Close panel</span>
                          <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </div>

                    {/* User Info */}
                    {isAuthenticated && user && (
                      <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            {user.avatar ? (
                              <img
                                className="h-10 w-10 rounded-full"
                                src={user.avatar}
                                alt={`${user.firstName} ${user.lastName}`}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                                <span className="text-primary-600 dark:text-primary-400 font-medium">
                                  {user.firstName[0]}{user.lastName[0]}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-3">
                            <div className="text-base font-medium text-gray-900 dark:text-white">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Navigation */}
                    <div className="flex-1 px-4 py-6 sm:px-6">
                      <nav className="space-y-1">
                        {/* Main Navigation */}
                        <div className="space-y-1">
                          <Link
                            href="/products"
                            onClick={onClose}
                            className="group flex items-center justify-between px-3 py-3 text-base font-medium rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
                          >
                            All Products
                            <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                          </Link>

                          <Link
                            href="/deals"
                            onClick={onClose}
                            className="group flex items-center justify-between px-3 py-3 text-base font-medium rounded-lg text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          >
                            Deals & Offers
                            <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                          </Link>
                        </div>

                        {/* Categories */}
                        <div className="pt-6">
                          <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Categories
                          </h3>
                          <div className="mt-2 space-y-1">
                            {mainCategories.map((category) => (
                              <Link
                                key={category.id}
                                href={`/categories/${category.slug}`}
                                onClick={onClose}
                                className="group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
                              >
                                {category.name}
                                <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* User Menu */}
                        {isAuthenticated ? (
                          <div className="pt-6">
                            <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Account
                            </h3>
                            <div className="mt-2 space-y-1">
                              <Link
                                href="/profile"
                                onClick={onClose}
                                className="group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
                              >
                                Profile
                                <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                              </Link>
                              <Link
                                href="/orders"
                                onClick={onClose}
                                className="group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
                              >
                                Orders
                                <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                              </Link>
                              <Link
                                href="/wishlist"
                                onClick={onClose}
                                className="group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
                              >
                                Wishlist
                                <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                              </Link>
                              {user?.role === 'ADMIN' && (
                                <Link
                                  href="/admin"
                                  onClick={onClose}
                                  className="group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
                                >
                                  Admin Dashboard
                                  <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                                </Link>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="pt-6">
                            <div className="space-y-2">
                              <Link
                                href="/auth/login"
                                onClick={onClose}
                                className="block w-full text-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
                              >
                                Sign In
                              </Link>
                              <Link
                                href="/auth/register"
                                onClick={onClose}
                                className="block w-full text-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                              >
                                Create Account
                              </Link>
                            </div>
                          </div>
                        )}

                        {/* Support Links */}
                        <div className="pt-6">
                          <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Support
                          </h3>
                          <div className="mt-2 space-y-1">
                            <Link
                              href="/help"
                              onClick={onClose}
                              className="group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
                            >
                              Help Center
                              <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                            </Link>
                            <Link
                              href="/contact"
                              onClick={onClose}
                              className="group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
                            >
                              Contact Us
                              <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                            </Link>
                          </div>
                        </div>
                      </nav>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
