import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white mt-12">
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="text-center mb-6">
          <h3 className="text-lg font-bold mb-2">宝宝库</h3>
          <p className="text-sm text-gray-300">专业的母婴用品购物平台</p>
        </div>
        
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-center space-x-2 text-sm">
            <Phone className="w-4 h-4" />
            <span>400-123-4567</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-sm">
            <Mail className="w-4 h-4" />
            <span>xxxxx@163.com</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-sm">
            <MapPin className="w-4 h-4" />
            <span>北京市朝阳区</span>
          </div>
        </div>
        
        <div className="text-center text-xs text-gray-400 border-t border-gray-700 pt-4">
          <p>@2024 宝宝库</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;