'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/Button';

interface CartDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDropdown({ isOpen, onClose }: CartDropdownProps) {
  const { cart, removeFromCart, updateCartItem, isUpdating } = useCartStore();

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      await removeFromCart(itemId);
    } else {
      await updateCartItem(itemId, newQuantity);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    await removeFromCart(itemId);
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
                  <div className="flex h-full flex-col overflow-y-scroll bg-white dark:bg-gray-900 shadow-xl">
                    {/* Header */}
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white">
                          Shopping cart
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

                      {/* Cart Items */}
                      <div className="mt-8">
                        {!cart || cart.items.length === 0 ? (
                          <div className="text-center py-12">
                            <ShoppingBagIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                              Your cart is empty
                            </h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                              Start adding some items to your cart!
                            </p>
                            <div className="mt-6">
                              <Link href="/products">
                                <Button onClick={onClose}>
                                  Continue Shopping
                                </Button>
                              </Link>
                            </div>
                          </div>
                        ) : (
                          <div className="flow-root">
                            <ul role="list" className="-my-6 divide-y divide-gray-200 dark:divide-gray-700">
                              {cart.items.map((item) => (
                                <li key={item.id} className="flex py-6">
                                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                                    <Image
                                      src={item.product.images[0] || '/placeholder.jpg'}
                                      alt={item.product.name}
                                      width={96}
                                      height={96}
                                      className="h-full w-full object-cover object-center"
                                    />
                                  </div>

                                  <div className="ml-4 flex flex-1 flex-col">
                                    <div>
                                      <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white">
                                        <h3>
                                          <Link href={`/products/${item.product.id}`}>
                                            {item.product.name}
                                          </Link>
                                        </h3>
                                        <p className="ml-4">
                                          ${(item.product.price * item.quantity).toFixed(2)}
                                        </p>
                                      </div>
                                      {Object.keys(item.selectedVariant).length > 0 && (
                                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                          {Object.entries(item.selectedVariant).map(([key, value]) => (
                                            <span key={key} className="mr-2">
                                              {key}: {value}
                                            </span>
                                          ))}
                                        </p>
                                      )}
                                    </div>
                                    <div className="flex flex-1 items-end justify-between text-sm">
                                      <div className="flex items-center space-x-2">
                                        <button
                                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                          disabled={isUpdating}
                                          className="h-8 w-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
                                        >
                                          -
                                        </button>
                                        <span className="text-gray-500 dark:text-gray-400 min-w-[2rem] text-center">
                                          {item.quantity}
                                        </span>
                                        <button
                                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                          disabled={isUpdating || item.quantity >= item.product.inventory}
                                          className="h-8 w-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
                                        >
                                          +
                                        </button>
                                      </div>

                                      <div className="flex">
                                        <button
                                          type="button"
                                          onClick={() => handleRemoveItem(item.id)}
                                          disabled={isUpdating}
                                          className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 disabled:opacity-50"
                                        >
                                          Remove
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer */}
                    {cart && cart.items.length > 0 && (
                      <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-6 sm:px-6">
                        <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white">
                          <p>Subtotal</p>
                          <p>${cart.subtotal.toFixed(2)}</p>
                        </div>
                        <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                          Shipping and taxes calculated at checkout.
                        </p>
                        <div className="mt-6">
                          <Link href="/checkout">
                            <Button fullWidth size="lg" onClick={onClose}>
                              Checkout
                            </Button>
                          </Link>
                        </div>
                        <div className="mt-6 flex justify-center text-center text-sm text-gray-500 dark:text-gray-400">
                          <p>
                            or{' '}
                            <Link
                              href="/products"
                              className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
                              onClick={onClose}
                            >
                              Continue Shopping
                              <span aria-hidden="true"> &rarr;</span>
                            </Link>
                          </p>
                        </div>
                      </div>
                    )}
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
