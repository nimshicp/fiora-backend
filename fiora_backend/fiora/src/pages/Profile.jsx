import React from "react";
import { User, Mail, Phone, MapPin, ShoppingBag, Heart, LogOut } from "lucide-react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { useOrder } from "../context/OrderContext";
import { useWishlist } from "../context/WishlistContext";

function Profile() {
  const { user, logout } = useUser();
  const { orders } = useOrder();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Please log in to view your profile.</p>
      </div>
    );
  }

  const latestOrder = orders && orders.length > 0 ? orders[orders.length - 1] : null;

  const phone = latestOrder?.customerInfo?.phone || user?.phone || "Not provided";
  const address = latestOrder?.shippingAddress || user?.address || "Not provided";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">

        <div className="text-center mb-16">

          <div className="relative inline-block">
            <h2 className="text-5xl font-thin text-gray-900 mb-6 tracking-widest font-serif">
              My Profile
            </h2>
          </div>

          <div className="flex items-center justify-center space-x-3">
            <div className="w-2 h-2 bg-pink-200 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-pink-300 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-4 h-4 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            <div className="w-3 h-3 bg-pink-300 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
            <div className="w-2 h-2 bg-pink-200 rounded-full animate-pulse" style={{ animationDelay: '0.8s' }}></div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          <div className="lg:col-span-1 space-y-6">

            <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User size={32} className="text-gray-700" />
              </div>

              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                {user?.username}
              </h2>

              <p className="text-gray-500 text-sm">Member since 2024</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Access</h3>

              <div className="space-y-3">

                <button
                  onClick={() => navigate("/orders")}
                  className="w-full flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <ShoppingBag size={20} />
                  <span>My Orders</span>
                </button>

                <button
                  onClick={() => navigate("/wishlist")}
                  className="w-full flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <Heart size={20} />
                  <span>Wishlist</span>
                </button>

                <button
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  className="w-full flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <LogOut size={20} />
                  <span>Log Out</span>
                </button>

              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">

            <div className="bg-white rounded-2xl shadow-sm p-8 space-y-6">
              <h2 className="text-2xl font-light text-gray-900">Personal Information</h2>

              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <User size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Full Name</p>
                  <p className="text-gray-900 text-lg">{user?.username}</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail size={20} className="text-pink-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Email Address</p>
                  <p className="text-gray-900 text-lg">{user?.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                  <p className="text-gray-900 text-lg">{phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin size={20} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Delivery Address</p>
                  <p className="text-gray-900 text-lg leading-relaxed">{address}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">

              <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
                <ShoppingBag size={24} className="text-gray-600 mx-auto mb-2" />
                <p className="text-2xl font-semibold text-gray-900">
                  {orders?.length || 0}
                </p>
                <p className="text-gray-500 text-sm">Orders</p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
                <Heart size={24} className="text-gray-600 mx-auto mb-2" />
                <p className="text-2xl font-semibold text-gray-900">
                  {wishlist?.length || 0}
                </p>
                <p className="text-gray-500 text-sm">Wishlisted</p>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;