import api from "./axios";

export const getWishlist = () => {
  return api.get("wishlist/");
};

export const toggleWishlist = (productId) => {
  return api.post(`/wishlist/toggle/${productId}/`);
};

export const removeWishlist = (productId) => {
  return api.delete(`wishlist/remove/${productId}/`);
};