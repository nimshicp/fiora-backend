import api from "./axios";

export const getProducts = (page = 1) => {
  return api.get(`products/?page=${page}`);
};

export const getProductsByCategory = (category, page = 1) => {
  return api.get(`products/?category=${category}&page=${page}`);
};

export const getProductDetails = (id) => {
  return api.get(`products/${id}/`);
};