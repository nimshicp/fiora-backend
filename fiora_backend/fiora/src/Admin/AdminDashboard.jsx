import React, { useEffect, useState } from 'react'
import { 
  Users, 
  ShoppingBag, 
  IndianRupee, 
  Package
} from 'lucide-react'

import {
  PieChart as RePieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts'

const API_BASE = "http://localhost:8000/api/admin";

function AdminDashboard() {
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [categoryData, setCategoryData] = useState([])
  const [chartData, setChartData] = useState({
    monthlyRevenue: [],
    orderStatus: []
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)

        const token = localStorage.getItem("access")

        const [dashboard, revenue, orderStatusRes, categories] = await Promise.all([
          fetch(`${API_BASE}/dashboard/`, {
            headers: { Authorization: `Bearer ${token}` }
          }).then(res => res.json()),

          fetch(`${API_BASE}/revenue/`, {
            headers: { Authorization: `Bearer ${token}` }
          }).then(res => res.json()),

          fetch(`${API_BASE}/order-status/`, {
            headers: { Authorization: `Bearer ${token}` }
          }).then(res => res.json()),

          fetch(`${API_BASE}/categories/`, {
            headers: { Authorization: `Bearer ${token}` }
          }).then(res => res.json()),
        ])

        // Stats
        setStats({
          totalUsers: dashboard?.totalUsers || 0,
          totalOrders: dashboard?.totalOrders || 0,
          totalRevenue: dashboard?.totalRevenue || 0,
          totalProducts: dashboard?.totalProducts || 0,
        })

        // Order Status
        const orderStatus = (orderStatusRes || []).map(item => ({
          name: item.name,
          value: item.count
        }))

        // Revenue
        const monthlyRevenue = Array.isArray(revenue) ? revenue : []

        // Categories
        const formattedCategories = (categories || []).map(cat => ({
          name: cat.name,
          count: cat.count
        }))

        setChartData({
          monthlyRevenue,
          orderStatus
        })

        setCategoryData(formattedCategories)

      } catch (error) {
        console.error("Error fetching dashboard:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    )
  }

  const ORDER_COLORS = {
    pending: '#F59E0B',
    confirmed: '#10B981',
    shipped: '#06B6D4',
    delivered: '#8B5CF6',
    cancelled: '#EF4444'
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back! Here's your store performance.</p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <p className="text-gray-500 text-sm">Revenue</p>
          <div className="flex justify-between items-center mt-2">
            <h2 className="text-xl font-bold">
              ₹{stats.totalRevenue.toLocaleString("en-IN")}
            </h2>
            <IndianRupee className="text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <p className="text-gray-500 text-sm">Orders</p>
          <div className="flex justify-between items-center mt-2">
            <h2 className="text-xl font-bold">
              {stats.totalOrders.toLocaleString()}
            </h2>
            <ShoppingBag className="text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <p className="text-gray-500 text-sm">Users</p>
          <div className="flex justify-between items-center mt-2">
            <h2 className="text-xl font-bold">
              {stats.totalUsers.toLocaleString()}
            </h2>
            <Users className="text-purple-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <p className="text-gray-500 text-sm">Products</p>
          <div className="flex justify-between items-center mt-2">
            <h2 className="text-xl font-bold">
              {stats.totalProducts.toLocaleString()}
            </h2>
            <Package className="text-orange-500" />
          </div>
        </div>

      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Revenue */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">
            Revenue Overview
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.monthlyRevenue}>

              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />

              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Orders */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">
            Order Status
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <RePieChart>
              <Pie
                data={chartData.orderStatus}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={90}
              >
                {chartData.orderStatus.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={ORDER_COLORS[entry.name?.toLowerCase()] || '#888'}
                  />
                ))}
              </Pie>
              <Tooltip />
            </RePieChart>
          </ResponsiveContainer>
        </div>

        {/* Categories */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 lg:col-span-3">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">
            Top Categories
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />

              <Bar
                dataKey="count"
                fill="#8B5CF6"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

    </div>
  )
}

export default AdminDashboard