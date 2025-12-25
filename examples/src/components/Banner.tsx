import React from 'react';
import { Star, Gift } from 'lucide-react';

const Banner: React.FC = () => {
  const handleBuyNow = () => {
    window.open('https://www.miaoda.cn', '_blank');
  };

  return (
    <section className="relative bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 text-white overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-10"></div>
      <div className="relative max-w-md mx-auto px-4 py-12 text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-4">
            <Gift className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black mb-2 text-yellow-300 drop-shadow-lg" style={{
            fontFamily: 'Comic Sans MS, Marker Felt, fantasy',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            letterSpacing: '1px'
          }}>开学季，迎巨惠！</h1>
          <p className="text-lg opacity-90">学生用品、儿童服装</p>
        </div>
        
        <div className="bg-white bg-opacity-20 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-center mb-3">
            <Star className="w-5 h-5 text-yellow-300 mr-1" />
            <Star className="w-5 h-5 text-yellow-300 mr-1" />
            <Star className="w-5 h-5 text-yellow-300 mr-1" />
            <Star className="w-5 h-5 text-yellow-300 mr-1" />
            <Star className="w-5 h-5 text-yellow-300" />
          </div>
          <div className="text-3xl font-bold mb-2">全场78折</div>
          <p className="text-sm opacity-90">优质商品，超值优惠</p>
        </div>
        
        <button 
          onClick={handleBuyNow}
          className="mt-6 bg-white text-blue-600 px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          立即抢购
        </button>
      </div>
      
      {/* 装饰元素 */}
      <div className="absolute top-4 left-4 w-8 h-8 bg-white bg-opacity-20 rounded-full animate-pulse"></div>
      <div className="absolute top-12 right-8 w-6 h-6 bg-white bg-opacity-20 rounded-full animate-pulse delay-1000"></div>
      <div className="absolute bottom-8 left-8 w-4 h-4 bg-white bg-opacity-20 rounded-full animate-pulse delay-500"></div>
    </section>
  );
};

export default Banner;