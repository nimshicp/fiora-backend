import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { Heart } from "lucide-react";
import { useShop } from "../context/ShopContext";
import { useWishlist } from "../context/WishlistContext";
import toast from "react-hot-toast";

function ProductCard({ product }) {
  const navigate = useNavigate();

  const { addToCart, cart } = useShop();
  const { user } = useUser();
  const { handleWishlist, isWishList } = useWishlist();

  const isWishListed = isWishList(product?.id);

  // Check if product already exists in cart
  const isInCart = cart.some((item) => item.product?.id === product?.id);

  const handleToggleWishlist = async (e) => {
    e.stopPropagation();

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

  const handleAddToCart = (e) => {
    e.stopPropagation();

    if (!user) {
      toast.error("Please login to add items to cart");
      return;
    }

    if (product?.stock === 0) {
      toast.error("Product is out of stock");
      return;
    }

    addToCart(product, 1);
    toast.success(`${product.name} added to cart`);
  };

  const handleGoToCart = (e) => {
    e.stopPropagation();
    navigate("/cart");
  };

  return (
    <div
      onClick={() => navigate(`/products/${product?.id}`)}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col cursor-pointer"
    >
      {" "}
      <div className="relative">
        {" "}
        <img
          src={product?.image}
          alt={product?.name}
          className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
        />
        {/* Wishlist */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-2 right-2 p-2 rounded-full z-10 ${
            isWishListed ? "bg-white text-pink-500" : "bg-white text-gray-600"
          }`}
        >
          <Heart size={20} fill={isWishListed ? "currentColor" : "none"} />
        </button>
        {/* Out of stock badge */}
        {product?.stock === 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            Out of Stock
          </span>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category */}
          <p className="text-sm text-gray-500 capitalize">
            {product?.category_name}
          </p>

          {/* Product Name */}
          <h3 className="font-semibold text-lg text-gray-800 mb-2">
            {product?.name}
          </h3>

          {/* Price */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-lg font-bold text-gray-900">
              ₹{product?.price}
            </span>
          </div>

          {/* Stock */}
          <p
            className={`text-sm ${
              product?.stock > 0 ? "text-green-600" : "text-red-500"
            }`}
          >
            {product?.stock > 0
              ? `In Stock (${product.stock})`
              : "Out of Stock"}
          </p>
        </div>

        {/* Cart Button */}
        <div className="mt-3">
          {isInCart ? (
            <button
              onClick={handleGoToCart}
              className="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-700"
            >
              Go to Cart
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={product?.stock === 0}
              className={`w-full py-2 rounded-lg ${
                product?.stock === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gray-800 text-white hover:bg-gray-700"
              }`}
            >
              {product?.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
