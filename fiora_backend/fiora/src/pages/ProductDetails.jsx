import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Heart,
  ShoppingCart,
  Minus,
  Plus,
  Truck,
  Shield,
  RotateCcw,
  CheckCircle,
  Award,
} from "lucide-react";

import { useShop } from "../context/ShopContext";
import { useUser } from "../context/UserContext";
import { useWishlist } from "../context/WishlistContext";

import toast from "react-hot-toast";
import { getProductDetails } from "../api/productApi";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const { addToCart, updateCartQuantity, cart } = useShop();
  const { user } = useUser();
  const { handleWishlist, isWishList } = useWishlist();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await getProductDetails(id);
      setProduct(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8 flex items-center justify-center">
        <div className="relative">
          <div className="w-12 h-12 border-2 border-gray-200 border-t-pink-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingCart size={24} className="text-pink-500" />
          </div>
          <h2 className="text-xl font-medium text-gray-900">Product not found</h2>
          <button 
            onClick={() => navigate("/shop")}
            className="mt-4 text-pink-500 hover:text-pink-600 text-sm font-medium"
          >
            Continue Shopping →
          </button>
        </div>
      </div>
    );
  }

  const cartItem = cart.find((item) => item.product?.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;
  const isInCart = !!cartItem;
  const isWishListed = isWishList(product.id);

  const handleToggleWishlist = async () => {
    if (!user) {
      toast.error("Please login to save items");
      return;
    }

    try {
      const res = await handleWishlist(product.id);
      if (res?.data?.status === "added") {
        toast.success(`${product.name} added to wishlist`);
      } else {
        toast.success(`${product.name} removed from wishlist`);
      }
    } catch {
      toast.error("Failed to update wishlist");
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login to add items to cart");
      return;
    }
    addToCart(product, 1);
    toast.success(`${product.name} added to cart`);
  };

  const handleIncrease = () => {
    updateCartQuantity(product.id, quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      updateCartQuantity(product.id, quantity - 1);
    } else {
      updateCartQuantity(product.id, 0);
    }
  };

  const handleGoToCart = () => {
    navigate("/cart");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 relative overflow-hidden">
          {/* Decorative corner accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-100 to-purple-100 rounded-bl-full -mr-8 -mt-8 opacity-50"></div>
          
          <div className="grid lg:grid-cols-2 gap-12 relative z-10">
            {/* Image Section */}
            <div className="flex justify-center">
              <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 group">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Wishlist Button - Updated to your exact style */}
                <button
                  onClick={handleToggleWishlist}
                  className={`absolute top-2 right-2 p-2 rounded-full z-10 ${
                    isWishListed ? "bg-white text-pink-500" : "bg-white text-gray-600"
                  }`}
                >
                  <Heart size={20} fill={isWishListed ? "currentColor" : "none"} />
                </button>

                {/* Stock Badge (if low stock) */}
                {product.stock > 0 && product.stock < 10 && (
                  <div className="absolute bottom-3 left-3 bg-amber-500 text-white text-xs px-2 py-1 rounded-full shadow-md">
                    Only {product.stock} left
                  </div>
                )}
              </div>
            </div>

            {/* Content Section */}
            <div className="space-y-5">
              {/* Category with icon */}
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-gradient-to-r from-pink-50 to-purple-50 text-pink-600 rounded-full text-sm font-medium inline-flex items-center gap-1 border border-pink-100">
                
                  {product.category_name || product.category?.name || product.category}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h1>

              {/* Price with elegant styling */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  ₹{product.price}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-sm text-gray-400 line-through">
                      ₹{product.originalPrice}
                    </span>
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                      Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </span>
                  </>
                )}
              </div>

              {/* Description with subtle styling */}
              <p className="text-gray-600 leading-relaxed border-l-2 border-pink-200 pl-4 italic">
                {product.description}
              </p>

              {/* Features with elegant cards */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="flex flex-col items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <Truck size={18} className="text-pink-500 mb-1" />
                  <span className="text-xs font-medium text-gray-700">Free Shipping</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <RotateCcw size={18} className="text-pink-500 mb-1" />
                  <span className="text-xs font-medium text-gray-700">30 Day Returns</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <Shield size={18} className="text-pink-500 mb-1" />
                  <span className="text-xs font-medium text-gray-700">Warranty</span>
                </div>
              </div>

              {/* Cart Controls */}
              {isInCart && (
                <div className="flex items-center gap-4 pt-2">
                  <div className="flex items-center bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                    <button
                      onClick={handleDecrease}
                      className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-all hover:text-pink-600"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-12 text-center font-semibold text-gray-900">
                      {quantity}
                    </span>
                    <button
                      onClick={handleIncrease}
                      className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-all hover:text-pink-600"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <CheckCircle size={14} />
                    <span>In cart</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4">
                {isInCart ? (
                  <button
                    onClick={handleGoToCart}
                    className="w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-3 rounded-xl font-medium hover:from-gray-900 hover:to-black transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
                  >
                    <ShoppingCart size={18} className="group-hover:rotate-6 transition-transform" />
                    Go To Cart
                  </button>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-pink-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
                  >
                    <ShoppingCart size={18} className="group-hover:rotate-6 transition-transform" />
                    Add To Cart
                  </button>
                )}
              </div>

              {/* Trust Badge */}
              <div className="flex items-center justify-center gap-1 text-xs text-gray-400 pt-2">
                <CheckCircle size={12} />
                <span>Secure checkout •</span>
                <CheckCircle size={12} />
                <span>Authentic products</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
