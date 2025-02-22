import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, List, UserCircle } from 'lucide-react';

export const BottomNavigation: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe">
      <div className="max-w-md mx-auto px-4">
        <div className="flex justify-around py-2">
          <Link
            to="/home"
            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
              isActive('/home') ? 'text-blue-500' : 'text-gray-600 hover:text-blue-500'
            }`}
          >
            <Calendar className="h-6 w-6" />
            <span className="text-xs mt-1">Book</span>
          </Link>
          <Link
            to="/manage"
            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
              isActive('/manage') ? 'text-blue-500' : 'text-gray-600 hover:text-blue-500'
            }`}
          >
            <List className="h-6 w-6" />
            <span className="text-xs mt-1">Manage</span>
          </Link>
          <Link
            to="/profile"
            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
              isActive('/profile') ? 'text-blue-500' : 'text-gray-600 hover:text-blue-500'
            }`}
          >
            <UserCircle className="h-6 w-6" />
            <span className="text-xs mt-1">Profile</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};