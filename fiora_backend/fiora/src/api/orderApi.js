import api from "./axios";



export const checkoutApi = async () => {
  const response = await api.post("orders/checkout/");
  return response.data;
};



export const createOrderApi = async (orderData) => {
  const response = await api.post("orders/create/", orderData);
  return response.data;
};


export const getMyOrdersApi = async () => {
  const response = await api.get("orders/my-orders/");
  return response.data;
};



export const getOrderDetailApi = async (orderId) => {
  const response = await api.get(`orders/${orderId}/`);
  return response.data;
};



export const cancelOrderApi = async (orderId) => {
  const response = await api.post("orders/cancel/", {
    order_id: orderId,
  });

  return response.data;
};

export const codPaymentApi = (orderId) =>
  api.post(`orders/${orderId}/pay-cod/`)

export const upiPaymentApi = (orderId, upiId) =>
  api.post(`orders/${orderId}/pay-upi/`, {
    upi_id: upiId
  })

export const createRazorpayOrder = (orderId) => {
  return api.post(`orders/payments/razorpay/${orderId}/`);
};

export const verifyPaymentApi = (data) => {
  return api.post(`orders/payments/verify/`, data);
};

export const updateAddressApi = (orderId, address) => {
  return api.patch(`orders/update-address/${orderId}/`, { address });
};
