import React, { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "./UserContext";
import {
  getWishlist,
  toggleWishlist,
  removeWishlist,
} from "../api/wishlistApi";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useUser();

  const [wishlist, setWishlist] = useState([]);
  const [error, setError] = useState("");

  // Fetch wishlist from backend
  const fetchWishlist = async () => {
    if (!user) {
      setWishlist([]);
      return;
    }

    try {
      const res = await getWishlist();
      setWishlist(res.data.results || []);
    } catch (err) {
      setError("Failed to load wishlist");
    }
  };

  // Toggle wishlist
  const handleWishlist = async (productId) => {
    if (!user) return;

    try {
      const res = await toggleWishlist(productId);

      if (res.data.status === "added") {
        // instantly update UI
        setWishlist((prev) => [
          ...prev,
          { product: { id: productId } },
        ]);
      } else {
        // remove instantly
        setWishlist((prev) =>
          prev.filter((item) => item?.product?.id !== productId)
        );
      }

      return res;
    } catch (err) {
      setError("Wishlist update failed");
      throw err;
    }
  };

  // Remove from wishlist page
  const removeFromWishList = async (productId) => {
    try {
      await removeWishlist(productId);

      setWishlist((prev) =>
        prev.filter((item) => item?.product?.id !== productId)
      );
    } catch (err) {
      setError("Remove failed");
    }
  };

  // Check if item is wishlisted
  const isWishList = (productId) => {
    return wishlist.some((item) => item?.product?.id === productId);
  };

  // Fetch wishlist when user logs in
  useEffect(() => {
    fetchWishlist();
  }, [user]);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        handleWishlist,
        removeFromWishList,
        isWishList,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);