import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useShop } from "../context/ShopContext";
import { useUser } from "../context/UserContext";
import { useWishlist } from "../context/WishlistContext";
import toast from "react-hot-toast";

function Wishlist() {
  const { user } = useUser();
  const { addToCart } = useShop();
  const { wishlist, removeFromWishList } = useWishlist();

  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-gray-400" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Login Required
          </h2>

          <p className="text-gray-600 mb-6">
            Please login to view your wishlist
          </p>

          <Link
            to="/login"
            className="inline-flex items-center justify-center bg-gray-800 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-700 transition-colors w-full"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm p-8 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-10 h-10 text-gray-400" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Your wishlist is empty
          </h1>

          <p className="text-gray-600 mb-6">
            Add some items to get started
          </p>

          <Link
            to="/products"
            className="inline-flex items-center justify-center bg-gray-800 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-700 transition-colors w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">

      <h1 className="text-2xl font-bold mb-6">
        My Wishlist ({wishlist.length})
      </h1>

      <div className="space-y-4">

        {wishlist.map((item) => {
          console.log("Wishlist item:", item)

          const product = item.product;

          return (
            <div
              key={product.id}
              className="flex justify-between items-center p-4 border rounded-lg"
            >

              {/* Product info */}
              <div
                className="flex items-center space-x-4 cursor-pointer"
                onClick={() =>
                  navigate(`/products/${product.id}`, { state: { product } })
                }
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-12 h-12 object-cover rounded"
                />

                <div>
                  <h3 className="font-semibold">{product.name}</h3>
                  <p>${product.price}</p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex space-x-2">

                {/* Add to cart */}
                <button
                  className="flex items-center justify-center gap-3 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                  onClick={async () => {
                    await addToCart(product);
                    await removeFromWishList(product.id);

                    toast.success(`${product.name} added to cart`);
                  }}
                >
                  <ShoppingCart size={18} />
                  Add to Cart
                </button>

                {/* Remove */}
                <button
                  onClick={async () => {
                    await removeFromWishList(product.id);

                    toast.success("Item removed from wishlist");
                  }}
                  className="text-red-500 p-2"
                >
                  <Trash2 size={18} />
                </button>

              </div>

            </div>
          );
        })}

      </div>
    </div>
  );
}

export default Wishlist;