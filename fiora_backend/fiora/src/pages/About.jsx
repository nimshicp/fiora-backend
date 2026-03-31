
import React from 'react';
import { ShoppingBag, Truck, Shield, Heart } from 'lucide-react';

function About() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Our Store</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We're passionate about bringing you the best products with exceptional service.
          </p>
        </div>

    
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Story</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              Founded with a simple mission: to make online shopping easy, reliable, and enjoyable. 
              We believe everyone deserves access to quality products at fair prices.
            </p>
            <p>
              What started as a small passion project has grown into a trusted destination 
              for thousands of customers who value quality and service.
            </p>
          </div>
        </div>

        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <ShoppingBag className="w-8 h-8 text-blue-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">Quality Products</h3>
            </div>
            <p className="text-gray-600">
              Carefully curated selection of products that meet our high standards for quality and value.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <Truck className="w-8 h-8 text-green-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">Fast Shipping</h3>
            </div>
            <p className="text-gray-600">
              Quick and reliable delivery to get your products to you as fast as possible.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <Shield className="w-8 h-8 text-purple-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">Secure Shopping</h3>
            </div>
            <p className="text-gray-600">
              Your privacy and security are our top priorities. Shop with confidence.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <Heart className="w-8 h-8 text-red-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">Customer First</h3>
            </div>
            <p className="text-gray-600">
              Dedicated customer support team ready to help you with any questions.
            </p>
          </div>
        </div>

    
        <div className="bg-gray-900 text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            To provide an exceptional shopping experience with quality products, 
            fair prices, and outstanding customer service.
          </p>
        </div>


        
      </div>
    </div>
  );
}

export default About;