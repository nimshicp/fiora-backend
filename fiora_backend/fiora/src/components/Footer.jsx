import React from "react";
import { Facebook, Instagram, Twitter, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-xl font-bold text-white mb-4">FIORA SCENTS</h2>

        <div className="flex justify-center space-x-4 mb-4">
          <a href="#" className="hover:text-white transition"><Facebook size={18} /></a>
          <a href="#" className="hover:text-white transition"><Instagram size={18} /></a>
          <a href="#" className="hover:text-white transition"><Twitter size={18} /></a>
          <a href="#" className="hover:text-white transition"><Mail size={18} /></a>
        </div>

        <div className="text-xs text-gray-500">
          © {new Date().getFullYear()} Fiora Scents. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
