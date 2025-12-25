import React from 'react';
import ProductCard from './ProductCard';
import { BookOpen, Shirt } from 'lucide-react';

const ProductSection: React.FC = () => {
  const studyProducts = [
    {
      id: 1,
      name: '多功能文具盒',
      price: 39,
      originalPrice: 50,
      image: 'https://images.unsplash.com/photo-010-xxxxxxxx58-2c8b550f87b3?w=300&h=300&fit=crop'
    },
    {
      id: 2,
      name: '儿童护眼台灯',
      price: 156,
      originalPrice: 200,
      image: 'https://images.unsplash.com/photo-010-xxxxxxxx69-0a1dd7228f2d?w=300&h=300&fit=crop'
    },
    {
      id: 3,
      name: '学生书包套装',
      price: 117,
      originalPrice: 150,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop'
    },
    {
      id: 4,
      name: '彩色水彩笔套装',
      price: 23,
      originalPrice: 30,
      image: 'https://images.unsplash.com/photo-010-xxxxxxxx85-d06e58bcb0e0?w=300&h=300&fit=crop'
    }
  ];

  const clothingProducts = [
    {
      id: 5,
      name: '儿童校服套装',
      price: 78,
      originalPrice: 100,
      image: 'https://images.unsplash.com/photo-010-xxxxxxxx68-a28f7a7dc6a9?w=300&h=300&fit=crop'
    },
    {
      id: 6,
      name: '可爱卡通T恤',
      price: 39,
      originalPrice: 50,
      image: 'https://images.unsplash.com/photo-010-xxxxxxxx23-5a10305d93c0?w=300&h=300&fit=crop'
    },
    {
      id: 7,
      name: '儿童运动鞋',
      price: 117,
      originalPrice: 150,
      image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=300&h=300&fit=crop'
    },
    {
      id: 8,
      name: '学生外套',
      price: 94,
      originalPrice: 120,
      image: 'https://images.unsplash.com/photo-010-xxxxxxxx14-f87e34085b2c?w=300&h=300&fit=crop'
    }
  ];

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      {/* 学习用具版块 */}
      <section className="mb-12">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-3">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">学习用具</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {studyProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 儿童服装版块 */}
      <section>
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full flex items-center justify-center mr-3">
            <Shirt className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">儿童服装</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {clothingProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProductSection;