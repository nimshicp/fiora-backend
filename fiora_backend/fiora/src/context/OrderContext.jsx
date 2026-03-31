import React, { createContext, useContext, useState ,useEffect} from "react";
import { useShop } from "./ShopContext";
import { useUser } from "./UserContext";

import {
  checkoutApi,
  createOrderApi,
  getMyOrdersApi,
  getOrderDetailApi,
  cancelOrderApi,
  codPaymentApi,
  upiPaymentApi,
  createRazorpayOrder,
  verifyPaymentApi,
} from "../api/orderApi";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {

  const { user } = useUser();
  const { clearCart } = useShop();

  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");



  // Checkout → calculate total
  const checkout = async () => {

    try {

      const data = await checkoutApi();
      return data.amount;

    } catch (err) {

      setError("Checkout failed");
      return null;

    }

  };



  // Create Order
  const createOrder = async (formData, cart, cartTotal) => {

    if (!user) {
      setError("Please login first");
      return null;
    }

    try {

      const orderData = {

        total: cartTotal,

        shipping_address: `${formData.address}, ${formData.city}, ${formData.pinCode}`,

        // payment selected later
        payment_method: "pending",

        items: cart.map((item) => ({
          product: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
        })),

      };

      const order = await createOrderApi(orderData);

      clearCart();

      await fetchOrders();

      return order;

    } catch (err) {

      setError("Failed to create order");
      return null;

    }

  };



  // Fetch user orders
  const fetchOrders = async () => {

    if (!user) return;

    try {

      const data = await getMyOrdersApi();
      setOrders(data);

    } catch (err) {

      setError("Failed to fetch orders");

    }

  };

  useEffect(() => {
  if (user) {
    fetchOrders();
  }
}, [user])



  // Get single order
  const getOrderById = async (orderId) => {

    try {

      const order = await getOrderDetailApi(orderId);
      return order;

    } catch (err) {

      setError("Failed to fetch order");
      return null;

    }

  };



  // Cancel Order
  const cancelOrder = async (orderId) => {

    try {

      await cancelOrderApi(orderId);

      await fetchOrders();

    } catch (err) {

      setError("Failed to cancel order");

    }

  };



  // COD Payment
  const cashOnDelivery = async (orderId) => {

    try {

      const response = await codPaymentApi(orderId);

      await fetchOrders();

      return response;

    } catch (err) {

      setError("COD confirmation failed");
      return null;

    }

  };



  // UPI Payment
  const processUPIPayment = async (orderId, upiId) => {

    try {

      const response = await upiPaymentApi(orderId, upiId);

      await fetchOrders();

      return response;

    } catch (err) {

      setError("UPI payment failed");
      return null;

    }

  };



  // Razorpay Payment
const handleRazorpayPayment = async (orderId) => {

  try {
    const res = await createRazorpayOrder(orderId);
    const data = res.data;

    const options = {
      key: data.key,
      amount: data.amount,
      currency: "INR",
      order_id: data.razorpay_order_id,

      handler: async function (response) {

        await verifyPaymentApi(response);

        await fetchOrders(); // refresh UI
        window.location.href = `/order-confirmation/${orderId}`;


      },

      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

  } catch (err) {
    setError("Razorpay payment failed");
  }

};


  return (

    <OrderContext.Provider
      value={{

        checkout,
        createOrder,
        fetchOrders,
        getOrderById,
        cancelOrder,
        processUPIPayment,
        cashOnDelivery,
        handleRazorpayPayment,
        orders,
        error,
        

      }}
    >

      {children}

    </OrderContext.Provider>

  );

};

export const useOrder = () => useContext(OrderContext);