'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import { Dialog, Transition } from '@headlessui/react';
import { 
  XMarkIcon, 
  UserIcon, 
  ShoppingBagIcon, 
  HeartIcon, 
  CogIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';

interface UserDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const userMenuItems = [
  {
    name: 'Profile',
    href: '/profile',
    icon: UserIcon,
    description: 'Manage your account settings',
  },
  {
    name: 'Orders',
    href: '/orders',
    icon: ShoppingBagIcon,
    description: 'View your order history',
  },
  {
    name: 'Wishlist',
    href: '/wishlist',
    icon: HeartIcon,
    description: 'Your saved items',
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: CogIcon,
    description: 'Account preferences',
  },
];

export function UserDropdown({ isOpen, onClose }: UserDropdownProps) {
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
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
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col bg-white dark:bg-gray-900 shadow-xl">
                    {/* Header */}
                    <div className="px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white">
                          Account
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
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
                      {user && (
                        <div className="mt-6 flex items-center">
                          <div className="flex-shrink-0">
                            {user.avatar ? (
                              <img
                                className="h-12 w-12 rounded-full"
                                src={user.avatar}
                                alt={`${user.firstName} ${user.lastName}`}
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                                <UserIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-base font-medium text-gray-900 dark:text-white">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {user.email}
                            </div>
                            {user.role === 'ADMIN' && (
                              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 mt-1">
                                Admin
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Menu Items */}
                    <div className="flex-1 px-4 sm:px-6">
                      <nav className="space-y-1">
                        {userMenuItems.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={onClose}
                            className="group flex items-center px-3 py-3 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
                          >
                            <item.icon
                              className="flex-shrink-0 h-5 w-5 mr-3 text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300"
                              aria-hidden="true"
                            />
                            <div>
                              <div>{item.name}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {item.description}
                              </div>
                            </div>
                          </Link>
                        ))}

                        {/* Admin Link */}
                        {user?.role === 'ADMIN' && (
                          <Link
                            href="/admin"
                            onClick={onClose}
                            className="group flex items-center px-3 py-3 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
                          >
                            <CogIcon
                              className="flex-shrink-0 h-5 w-5 mr-3 text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300"
                              aria-hidden="true"
                            />
                            <div>
                              <div>Admin Dashboard</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                Manage store settings
                              </div>
                            </div>
                          </Link>
                        )}
                      </nav>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-6 sm:px-6">
                      <Button
                        variant="outline"
                        fullWidth
                        onClick={handleLogout}
                        leftIcon={<ArrowRightOnRectangleIcon className="h-4 w-4" />}
                      >
                        Sign out
                      </Button>
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
