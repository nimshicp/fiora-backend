import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useUser } from "./UserContext";
import toast from "react-hot-toast";

import {
  getCart,
  AddToCart,
  decreaseCart,
  removeCart,
  clearCartitem,
} from "../api/cartApi";

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const { user } = useUser();

  const [cart, setCart] = useState([]);
  const [error, setError] = useState("");

  /* FETCH CART */
  const fetchCart = async () => {
    if (!user) {
      setCart([]);
      return;
    }

    try {
      const res = await getCart();

      // Ensure cart is always an array
      const cartData = Array.isArray(res.data)
        ? res.data
        : res.data?.cart || res.data?.items || [];

      setCart(cartData);
    } catch (err) {
      console.error(err);
      setError("Failed to load cart");
      setCart([]);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  /* ADD TO CART */
  const addToCart = async (product) => {
    if (!user) {
      toast.error("Please login to add items to cart");
      return;
    }

    try {
      await AddToCart(product.id);
      toast.success(`${product.name} added to cart`);
      fetchCart();
    } catch (err) {
      toast.error("Failed to add item");
    }
  };

  /* UPDATE CART QUANTITY */
  const updateCartQuantity = async (productId, quantity) => {
    if (!user) return;

    const currentItem = cart.find((item) => item.product.id === productId);

    if (!currentItem) return;

    try {
      if (quantity < 1) {
        await removeCart(productId);
      } else if (quantity > currentItem.quantity) {
        await AddToCart(productId);
      } else {
        await decreaseCart(productId);
      }

      fetchCart();
    } catch {
      toast.error("Failed to update quantity");
    }
  };

  /* REMOVE ITEM */
  const removeFromCart = async (productId) => {
    if (!user) return;

    try {
      await removeCart(productId);

      setCart((prev) =>
        prev.filter((item) => item.product.id !== productId)
      );

      toast.success("Item removed");
    } catch {
      toast.error("Failed to remove item");
    }
  };

  /* CLEAR CART */
  const clearCart = async () => {
    if (!user) return;

    try {
      await clearCartitem();
      setCart([]);
    } catch {
      toast.error("Failed to clear cart");
    }
  };

  /* CART TOTAL */
  const cartTotal = useMemo(() => {
    if (!Array.isArray(cart)) return 0;

    return cart.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  }, [cart]);

  /* CART ITEMS COUNT */
  const cartItemsCount = useMemo(() => {
    if (!Array.isArray(cart)) return 0;

    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  return (
    <ShopContext.Provider
      value={{
        cart,
        error,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        cartItemsCount,
        fetchCart,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);