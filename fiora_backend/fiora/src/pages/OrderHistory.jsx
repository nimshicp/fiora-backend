import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useOrder } from "../context/OrderContext";
import { useUser } from "../context/UserContext";
import { updateAddressApi } from "../api/orderApi";
import {
  ShoppingBag,
  Calendar,
  MapPin,
  CreditCard,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import toast from "react-hot-toast";

function OrderHistory() {
  const { user } = useUser();

  const { orders, fetchOrders, cancelOrder } = useOrder();

  const [expandedOrder, setExpandedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [address, setAddress] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  function handleCancel(orderId) {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <p>Are you sure you want to cancel this order?</p>
        <div className="flex gap-2 justify-end">
          <button
            className="bg-red-500 text-white px-3 py-1 rounded"
            onClick={async () => {
              toast.dismiss(t.id);
              setLoading(true);
              await cancelOrder(orderId);
              setLoading(false);
              toast.success("Order canceled successfully!");
            }}
          >
            Yes
          </button>
          <button
            className="bg-gray-300 px-3 py-1 rounded"
            onClick={() => toast.dismiss(t.id)}
          >
            No
          </button>
        </div>
      </div>
    ));
  }

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            No orders yet
          </h2>
          <p className="text-gray-600 mb-6">
            Your order history will appear here
          </p>
          <Link
            to="/products"
            className="inline-block bg-gray-800 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Order History
          </h1>
          <p className="text-gray-600">
            {orders.length} {orders.length === 1 ? "order" : "orders"}
          </p>
        </div>

        <div className="space-y-4">
          {orders.map((order) => {
            const status = order.order_status || order.status;
            const canCancel =
              order.status === "pending" || order.status === "confirmed";

            const isExpanded = expandedOrder === order.id;

            return (
              <div
                key={order.id}
                className="bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
              >
                <div
                  className="p-6 cursor-pointer"
                  onClick={() => toggleOrderDetails(order.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        Order #{order.id}
                      </h3>

                      <p className="text-gray-600 text-sm flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-900">
                          ₹{Number(order.total).toFixed(2)}
                        </p>

                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                            order.status === "confirmed"
                              ? "bg-blue-100 text-blue-800"
                              : order.status === "cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>

                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-gray-200 p-6">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-4">
                          Order Items
                        </h4>

                        <div className="space-y-3">
                          {order.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                            >
                              <div className="flex items-center space-x-3">
                                <div>
                                  <p className="font-medium text-gray-900">
                                    Product #{item.product}
                                  </p>

                                  <p className="text-gray-600 text-sm">
                                    Qty: {item.quantity}
                                  </p>
                                </div>
                              </div>

                              <p className="font-semibold">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            Shipping Information
                          </h4>

                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-gray-700">
                              {order.shipping_address}
                            </p>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <CreditCard className="w-4 h-4 mr-2" />
                            Payment Information
                          </h4>

                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Method:</span>
                              <span className="font-medium capitalize">
                                {order.payment_method}
                              </span>
                            </div>

                            <div className="flex justify-between text-sm">
                              <span>Status:</span>
                              <span
                                className={`font-medium ${
                                  order.payment_status === "paid"
                                    ? "text-green-600"
                                    : order.payment_status === "refunded"
                                      ? "text-blue-600"
                                      : "text-yellow-600"
                                }`}
                              >
                                {order.payment_status}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex justify-between text-lg font-semibold">
                            <span>Total Amount</span>
                            <span>₹{Number(order.total).toFixed(2)}</span>
                          </div>
                        </div>

                        {order.status === "pending" && (
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setAddress(order.shipping_address); // pre-fill
                              setShowEditModal(true);
                            }}
                            className="bg-blue-600 text-white px-4 py-2 rounded mt-2 w-full"
                          >
                            Edit Address
                          </button>
                        )}

                        {order.payment_status === "pending" && (
                          <button
                            onClick={() => navigate(`/payment/${order.id}`)}
                            className="bg-green-600 text-white px-4 py-2 rounded mt-3 w-full"
                          >
                            Complete Payment
                          </button>
                        )}

                        {canCancel && (
                          <button
                            onClick={() => handleCancel(order.id)}
                            disabled={loading}
                            className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 flex items-center justify-center"
                          >
                            {loading ? "Cancelling..." : "Cancel Order"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {showEditModal && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    
    <div className="bg-white p-6 rounded-lg w-full max-w-md">
      
      <h2 className="text-xl font-bold mb-4">Edit Address</h2>

      <textarea
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="w-full border p-2 rounded mb-4"
        rows={4}
      />

      <div className="flex justify-end gap-2">
        
        <button
          onClick={() => setShowEditModal(false)}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Cancel
        </button>

        <button
          onClick={async () => {
            await updateAddressApi(selectedOrder.id, address);
            setShowEditModal(false);
            fetchOrders(); // refresh UI
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Save
        </button>

      </div>
    </div>
  </div>
)}
    </div>
  );
}

export default OrderHistory;
