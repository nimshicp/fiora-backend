import React from "react";
import { useShop } from "../context/ShopContext";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowLeft,
} from "lucide-react";
import toast from "react-hot-toast";

function Cart() {
  const { user } = useUser();
  const {
    cart = [],
    cartTotal = 0,
    cartItemsCount = 0,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    createOrder,
  } = useShop();

  const navigate = useNavigate();

  const cartLength = cart?.length || 0;

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Login Required
          </h2>
          <p className="text-gray-600 mb-6">
            Please login in to view your shopping cart
          </p>
          <Link
            to="/login"
            className="inline-flex items-center justify-center bg-gray-800 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors w-full"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (cartLength === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm p-8 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Your cart is empty
          </h1>
          <p className="text-gray-600 mb-6">Add some items to get started</p>
          <Link
            to="/products"
            className="inline-flex items-center justify-center bg-gray-800 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-600 mt-1">
              {cartItemsCount} {cartItemsCount === 1 ? "item" : "items"}
            </p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="space-y-4">
            {cart?.map((item) => {
              const product = item.product;

              return (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:shadow-sm transition-shadow"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                    onClick={() =>
                      navigate(`/products/${product.id}`, {
                        state: { product },
                      })
                    }
                  />

                  <div
                    className="flex-1 min-w-0"
                    onClick={() =>
                      navigate(`/products/${product.id}`, {
                        state: { product },
                      })
                    }
                  >
                    <h3 className="font-semibold text-gray-900 truncate">
                      {product.name}
                    </h3>
                    <p className="text-gray-600">${product.price}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateCartQuantity(product.id, item.quantity - 1);
                        }}
                        className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>

                      <span className="w-8 text-center font-medium text-sm">
                        {item.quantity}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateCartQuantity(product.id, item.quantity + 1);
                        }}
                        className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="w-20 text-right font-semibold text-gray-900">
                      ${(product.price * item.quantity).toFixed(2)}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromCart(product.id);
                        toast.success(`${product.name} removed from cart`);
                      }}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <span className="text-lg font-semibold text-gray-900">
              Total Amount
            </span>
            <span className="text-2xl font-bold text-gray-900">
              ${cartTotal.toFixed(2)}
            </span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={clearCart}
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Clear All
            </button>

            <button
              onClick={() => navigate("/checkout")}
              className="flex-1 bg-gray-800 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center"
            >
              proceed to checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;