import React from 'react';
import { ShoppingBag, Menu } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
            <ShoppingBag className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-blue-600 hidden sm:block">宝宝库</span>
        </div>
        <Menu className="w-6 h-6 text-gray-600" />
      </div>
    </header>
  );
};

export default Header;