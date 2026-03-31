import api from "./axios";

export const getCart = () => {
  return api.get("/cart/");
};

export const AddToCart = (productId) => {
  return api.post(`/cart/add/${productId}/`);
};

export const decreaseCart = (productId) => {
  return api.post(`/cart/decrease/${productId}/`);
};

export const removeCart = (productId) => {
  return api.delete(`/cart/remove/${productId}/`);
};

export const clearCartitem = () => {
  return api.delete("/cart/clear/");
};