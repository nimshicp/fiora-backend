import api from "./axios";

export const registerUser = (data) => {
  return api.post("users/register/", data);
};

export const loginUser = (data) => {
  return api.post("users/login/", data);
};

export const logoutUser = (data) => {
  return api.post("users/logout/");
};


export const getProfile = () => {
  return api.get("users/me/");
};

export const googleLogin = (token) => {
  return api.post("users/google-login/", {
    token: token,
  });
};

export const forgotPassword = (data) => {
  return api.post("users/forgot-password/", data);
};

export const resetPassword = (uid, token, data) => {
  return api.post(`users/reset-password/${uid}/${token}/`, data);
};