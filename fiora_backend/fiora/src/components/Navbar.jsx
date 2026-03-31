import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  ShoppingCart,
  Heart,
  ShoppingBag,
  User,
} from "lucide-react";
import { useUser } from "../context/UserContext";
import { useShop } from "../context/ShopContext";
import { useWishlist } from "../context/WishlistContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartItemsCount } = useShop();
  const { wishlist } = useWishlist();

  // ✅ FIXED ADMIN CHECK (safe)
  const isAdmin = user?.role === "admin" || user?.role === "superadmin";

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="text-2xl font-bold text-gray-900 tracking-wider"
            >
              FIORA SCENTS.
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="hover:text-gray-900 text-gray-600">
              HOME
            </Link>
            <Link to="/products" className="hover:text-gray-900 text-gray-600">
              PRODUCTS
            </Link>
            <Link to="/about" className="hover:text-gray-900 text-gray-600">
              ABOUT
            </Link>
            <Link to="/contact" className="hover:text-gray-900 text-gray-600">
              CONTACT
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-5">
            
            <div className="relative cursor-pointer" onClick={() => navigate("/wishlist")}>
              <Heart size={22} className="text-gray-700 hover:text-gray-900" />
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </div>

            <div className="relative cursor-pointer" onClick={() => navigate("/orders")}>
              <ShoppingBag size={22} className="text-gray-700 hover:text-gray-900" />
            </div>

            <div className="relative cursor-pointer" onClick={() => navigate("/cart")}>
              <ShoppingCart size={22} className="text-gray-700 hover:text-gray-900" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </div>

            {user ? (
              <>
                <div
                  onClick={() => navigate("/profile")}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <User size={22} className="text-gray-700 hover:text-gray-900" />
                  <span className="text-gray-700 font-semibold">
                    {user.username}
                  </span>
                </div>

                {/* ✅ ADMIN BUTTON */}
                {isAdmin && (
                  <button
                    onClick={() => 
                      { console.log("clicked"); navigate("/dashboard")}}
                    className="bg-gray-800 text-white px-3 py-1 rounded-lg hover:bg-white transition hover:text-gray-900 hover:border-1 hover:border-gray-900"
                  >
                    Admin
                  </button>
                )}

                <button
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                  className="bg-white border-gray-600 border-1 text-gray-900 px-2 py-1 rounded-lg hover:bg-gray-800 transition hover:text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="bg-gray-900 text-white px-3 py-1 rounded-lg hover:bg-gray-800 transition"
              >
                Login
              </button>
            )}
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-800 hover:text-gray-900 focus:outline-none"
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white shadow-md px-4 pb-4 space-y-4">
          
          <Link to="/" onClick={() => setMenuOpen(false)} className="block text-gray-700 hover:text-gray-900">
            HOME
          </Link>
          <Link to="/products" onClick={() => setMenuOpen(false)} className="block text-gray-700 hover:text-gray-900">
            PRODUCTS
          </Link>
          <Link to="/about" onClick={() => setMenuOpen(false)} className="block text-gray-700 hover:text-gray-900">
            ABOUT
          </Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)} className="block text-gray-700 hover:text-gray-900">
            CONTACT
          </Link>

          <div className="border-t border-gray-200 my-3"></div>

          <div className="flex items-center justify-around text-gray-700">
            <Heart size={22} onClick={() => { navigate("/wishlist"); setMenuOpen(false); }} />
            <ShoppingBag size={22} onClick={() => { navigate("/orders"); setMenuOpen(false); }} />
            <ShoppingCart size={22} onClick={() => { navigate("/cart"); setMenuOpen(false); }} />
            <User size={22} onClick={() => { navigate("/profile"); setMenuOpen(false); }} />
          </div>

          <div className="border-t border-gray-200 my-3"></div>

          <div className="flex flex-col items-center gap-3">
            
            {/* ✅ ADMIN BUTTON MOBILE */}
            {isAdmin && (
              <button
                onClick={() => {
                  navigate("/dashboard");
                  setMenuOpen(false);
                }}
                className="w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition"
              >
                Admin
              </button>
            )}

            {user ? (
              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                  setMenuOpen(false);
                }}
                className="w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => {
                  navigate("/login");
                  setMenuOpen(false);
                }}
                className="w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition"
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;