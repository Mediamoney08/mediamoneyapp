import React from 'react';
import { Heart, ShoppingCart } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const discount = Math.round((1 - product.price / product.originalPrice) * 100);

  const handleBuyNow = () => {
    window.open('https://www.miaoda.cn', '_blank');
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:scale-105">
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-32 object-cover"
          crossOrigin="anonymous"
        />
        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
          -{discount}%
        </div>
        <button className="absolute top-2 right-2 w-8 h-8 bg-white bg-opacity-80 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all">
          <Heart className="w-4 h-4 text-gray-600" />
        </button>
      </div>
      
      <div className="p-3">
        <h3 className="text-sm font-medium text-gray-800 mb-2 line-clamp-2">{product.name}</h3>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-red-500">¥{product.price}</span>
            <span className="text-sm text-gray-400 line-through">¥{product.originalPrice}</span>
          </div>
        </div>
        
        <button 
          onClick={handleBuyNow}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 rounded-lg flex items-center justify-center space-x-2 hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
        >
          <ShoppingCart className="w-4 h-4" />
          <span className="text-sm font-medium">立即购买</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;