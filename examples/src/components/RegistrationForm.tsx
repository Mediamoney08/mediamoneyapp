import React, { useState } from 'react';
import { User, Phone, MapPin, Calendar, Gift, CheckCircle } from 'lucide-react';

const RegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    visitDate: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) {
      newErrors.name = '请输入姓名';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = '请输入手机号';
    } else if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = '请输入正确的手机号格式';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = '请输入地址';
    }
    
    if (!formData.visitDate) {
      newErrors.visitDate = '请选择到店时间';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitted(true);
      // 这里可以添加实际的提交逻辑
      console.log('表单提交:', formData);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // 清除该字段的错误信息
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 text-center">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-green-600 mb-2">预约成功！</h3>
        <p className="text-gray-600 mb-4">我们将在开业当天为您准备精美礼品</p>
        <div className="bg-white rounded-lg p-4 text-left">
          <div className="flex items-center mb-2">
            <Gift className="w-4 h-4 text-red-500 mr-2" />
            <span className="text-sm font-medium">礼品详情</span>
          </div>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• 价值100元购物券</li>
            <li>• 精美儿童文具套装</li>
            <li>• 宝宝库专属帆布袋</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
          <Gift className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">开业活动报名</h3>
        <p className="text-sm text-gray-600">预约到店即可免费领取百元礼品</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="relative">
            <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="请输入您的姓名"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        <div>
          <div className="relative">
            <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="tel"
              placeholder="请输入手机号"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        </div>

        <div>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="请输入详细地址"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.address ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>
          {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
        </div>

        <div>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="date"
              value={formData.visitDate}
              onChange={(e) => handleInputChange('visitDate', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.visitDate ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>
          {errors.visitDate && <p className="text-red-500 text-xs mt-1">{errors.visitDate}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
        >
          立即预约领取礼品
        </button>
      </form>

      <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <div className="flex items-start">
          <Gift className="w-4 h-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-yellow-700">
            <p className="font-medium mb-1">活动说明：</p>
            <p>1. 成功预约后到店即可领取价值100元礼品</p>
            <p>2. 礼品数量有限，先到先得</p>
            <p>3. 活动最终解释权归宝宝库所有</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;