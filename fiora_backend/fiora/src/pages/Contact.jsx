
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import toast from 'react-hot-toast';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Thanks for your message! We\'ll reply soon.');
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-2xl mx-auto px-4">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Us</h1>
          <p className="text-gray-600">We're here to help with any questions</p>
        </div>

        <div className="space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 border border-gray-200 rounded-lg">
              <Mail className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="font-medium">Email</p>
              <p className="text-gray-600 text-sm">Fiora@store.com</p>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg">
              <Phone className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="font-medium">Phone</p>
              <p className="text-gray-600 text-sm">+91 9895200514</p>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg">
              <MapPin className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <p className="font-medium">Location</p>
              <p className="text-gray-600 text-sm">India</p>
            </div>
          </div>

        
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Send Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className="p-3 border border-gray-300 rounded-lg w-full"
                  required
                />
                
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className="p-3 border border-gray-300 rounded-lg w-full"
                  required
                />
              </div>

              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your message..."
                rows="4"
                className="p-3 border border-gray-300 rounded-lg w-full"
                required
              ></textarea>

              <button
                type="submit"
                className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 flex items-center justify-center"
              >
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;