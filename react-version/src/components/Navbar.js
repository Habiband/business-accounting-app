import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-600';
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div>
            <Link to="/" className="text-xl font-bold text-gray-900">
              Business Accounting
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/" className={isActive('/')}>
              Dashboard
            </Link>
            <Link to="/transactions" className={isActive('/transactions')}>
              Transactions
            </Link>
            <Link to="/reports" className={isActive('/reports')}>
              Reports
            </Link>
            {user?.role === 'admin' && (
              <Link to="/users" className={isActive('/users')}>
                Users
              </Link>
            )}
            <div className="flex items-center space-x-4 ml-6 pl-6 border-l">
              <span className="text-sm text-gray-500">
                {user?.name} ({user?.role})
              </span>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
