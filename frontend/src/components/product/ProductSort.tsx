'use client';

import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface ProductSortProps {
  sortBy: string;
  sortOrder: string;
  onSortChange: (sortBy: string, sortOrder: string) => void;
}

const sortOptions = [
  { label: 'Newest First', sortBy: 'createdAt', sortOrder: 'desc' },
  { label: 'Oldest First', sortBy: 'createdAt', sortOrder: 'asc' },
  { label: 'Price: Low to High', sortBy: 'price', sortOrder: 'asc' },
  { label: 'Price: High to Low', sortBy: 'price', sortOrder: 'desc' },
  { label: 'Name: A to Z', sortBy: 'name', sortOrder: 'asc' },
  { label: 'Name: Z to A', sortBy: 'name', sortOrder: 'desc' },
  { label: 'Best Rating', sortBy: 'rating', sortOrder: 'desc' },
];

export function ProductSort({ sortBy, sortOrder, onSortChange }: ProductSortProps) {
  const currentSort = sortOptions.find(
    option => option.sortBy === sortBy && option.sortOrder === sortOrder
  );

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
          Sort: {currentSort?.label || 'Newest First'}
          <ChevronDownIcon
            className="flex-shrink-0 -mr-1 ml-1 h-5 w-5 text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300"
            aria-hidden="true"
          />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
          <div className="py-1">
            {sortOptions.map((option) => (
              <Menu.Item key={`${option.sortBy}-${option.sortOrder}`}>
                {({ active }) => (
                  <button
                    onClick={() => onSortChange(option.sortBy, option.sortOrder)}
                    className={`${
                      active
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                        : 'text-gray-700 dark:text-gray-300'
                    } ${
                      currentSort?.sortBy === option.sortBy && currentSort?.sortOrder === option.sortOrder
                        ? 'bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-400'
                        : ''
                    } block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700`}
                  >
                    {option.label}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
