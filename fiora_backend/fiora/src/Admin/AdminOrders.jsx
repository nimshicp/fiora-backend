import React, { useState, useEffect } from "react";
import {
  ShoppingBag,
  CheckCircle,
  XCircle,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

// ✅ UPDATED API
const API_BASE = "http://localhost:8000/api/admin";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    total_orders: 0,
    pending: 0,
    confirmed: 0,
    shipped: 0,
    delivered: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = async (page = 1) => {
    try {
      setLoading(true);

      const token = localStorage.getItem("access");

      const [ordersRes, statsRes] = await Promise.all([
        axios.get(`${API_BASE}/orders/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            page,
            search: searchTerm || undefined,
          },
        }),
        axios.get(`${API_BASE}/orders/stats/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      setOrders(ordersRes.data.results || []);
      setTotalPages(
        Math.max(1, Math.ceil(((ordersRes.data.count ?? 0) || 0) / 8))
      );
      setStats(statsRes.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage, searchTerm]);

  
  const updateOrderStatus = async (order, newStatus) => {
  try {
    const token = localStorage.getItem("access");

    await axios.patch(
      `${API_BASE}/orders/${order.id}/`,
      { status: newStatus },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

  
    await fetchOrders(currentPage);

    toast.success(`Order status updated to ${newStatus}!`);
  } catch (err) {
    console.error(err);
    toast.error("Failed to update order status");
  }
};

  // ✅ STATUS BADGE (UNCHANGED)
  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return {
          text: "Pending",
          color: "bg-yellow-100 text-yellow-800",
          icon: <XCircle className="w-4 h-4" />,
        };
      case "confirmed":
        return {
          text: "Confirmed",
          color: "bg-blue-100 text-blue-800",
          icon: <CheckCircle className="w-4 h-4" />,
        };
      case "shipped":
        return {
          text: "Shipped",
          color: "bg-purple-100 text-purple-800",
          icon: <ShoppingBag className="w-4 h-4" />,
        };
      case "delivered":
        return {
          text: "Delivered",
          color: "bg-green-100 text-green-800",
          icon: <CheckCircle className="w-4 h-4" />,
        };
      case "cancelled":
        return {
          text: "Cancelled",
          color: "bg-red-100 text-red-800",
          icon: <XCircle className="w-4 h-4" />,
        };
      default:
        return {
          text: status,
          color: "bg-gray-100 text-gray-800",
          icon: <ShoppingBag className="w-4 h-4" />,
        };
    }
  };

  // ✅ STATS (UNCHANGED)
  const totalOrders = stats.total_orders;
  const pendingOrders = stats.pending;
  const confirmedOrders = stats.confirmed;
  const shippedOrders = stats.shipped;
  const deliveredOrders = stats.delivered;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
        <p className="text-gray-600">Manage and track all customer orders</p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-gray-600 text-sm">Total Orders</p>
          <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-gray-600 text-sm">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{pendingOrders}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-gray-600 text-sm">Confirmed</p>
          <p className="text-2xl font-bold text-blue-600">{confirmedOrders}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-gray-600 text-sm">Shipped</p>
          <p className="text-2xl font-bold text-purple-600">{shippedOrders}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-gray-600 text-sm">Delivered</p>
          <p className="text-2xl font-bold text-green-600">{deliveredOrders}</p>
        </div>
      </div>

      {/* SEARCH */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <div className="relative max-w-md">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search orders by ID, user, or email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Ordered Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Order Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => {
                const statusInfo = getStatusBadge(order.status);

                return (
                  <tr key={order.id}>
                    <td className="px-6 py-4">{order.id}</td>

                    <td className="px-6 py-4">
                      {order.user_name}
                      <br />
                      <span className="text-gray-500 text-s">
                        {order.user_email}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-s">{order.ordered_date}</td>

                    <td className="px-6 py-4">₹{order.total}</td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${statusInfo.color}`}
                      >
                        {statusInfo.text}
                      </span>
                    </td>

                    <td className="px-6 py-4 space-x-2">
                      {order.status === "pending" && (
                        <>
                          <button
                            onClick={() =>
                              updateOrderStatus(order, "confirmed")
                            }
                            className="bg-blue-600 text-white px-2 py-1 text-xs rounded"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() =>
                              updateOrderStatus(order, "cancelled")
                            }
                            className="bg-red-600 text-white px-2 py-1 text-xs rounded"
                          >
                            Cancel
                          </button>
                        </>
                      )}

                      {order.status === "confirmed" && (
                        <>
                          <button
                            onClick={() => updateOrderStatus(order, "shipped")}
                            className="bg-purple-600 text-white px-2 py-1 text-xs rounded"
                          >
                            Ship
                          </button>
                          <button
                            onClick={() =>
                              updateOrderStatus(order, "cancelled")
                            }
                            className="bg-red-600 text-white px-2 py-1 text-xs rounded"
                          >
                            Cancel
                          </button>
                        </>
                      )}

                      {order.status === "shipped" && (
                        <>
                          <button
                            onClick={() =>
                              updateOrderStatus(order, "delivered")
                            }
                            className="bg-green-600 text-white px-2 py-1 text-xs rounded"
                          >
                            Deliver
                          </button>
                          <button
                            onClick={() =>
                              updateOrderStatus(order, "cancelled")
                            }
                            className="bg-red-600 text-white px-2 py-1 text-xs rounded"
                          >
                            Cancel
                          </button>
                        </>
                      )}

                      {(order.status === "delivered" ||
                        order.status === "cancelled") && (
                        <span className="text-gray-400 text-s">No action</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center bg-white p-4 rounded-lg border border-gray-200 mt-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="flex items-center gap-1 px-3 py-1 rounded text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
          >
            <ChevronLeft size={18} /> Previous
          </button>
          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 rounded text-sm font-medium ${
                  currentPage === i + 1 ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="flex items-center gap-1 px-3 py-1 rounded text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
          >
            Next <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;
