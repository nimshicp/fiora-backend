import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Package,
  AlertTriangle,
  Users,
  ShoppingBag,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const API_PRODUCTS = "http://localhost:8000/api/products/";
const API_CATEGORIES = "http://localhost:8000/api/products/categories/";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [statsProducts, setStatsProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [stockFilter, setStockFilter] = useState("all");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;
  const [totalPages, setTotalPages] = useState(1);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    description: "",
    image: "",
  });

  const loadData = async (page = 1) => {
    try {
      setLoading(true);
      const queryParams = {
        page,
        search: searchTerm || undefined,
        stock: stockFilter !== "all" ? stockFilter : undefined,
      };

      const [prodRes, statsRes, catRes] = await Promise.all([
        axios.get(API_PRODUCTS, { params: queryParams }),
        axios.get(API_PRODUCTS, {
          params: {
            all: true,
            search: searchTerm || undefined,
            stock: stockFilter !== "all" ? stockFilter : undefined,
          },
        }),
        axios
          .get(API_CATEGORIES, { withCredentials: true })
          .catch(() => ({ data: [] })),
      ]);

      const pData = prodRes.data.results || prodRes.data;
      setProducts(Array.isArray(pData) ? pData : []);
      setTotalPages(
        Math.max(1, Math.ceil(((prodRes.data.count ?? pData.length) || 0) / productsPerPage))
      );

      const statsData = statsRes.data.results || statsRes.data;
      setStatsProducts(Array.isArray(statsData) ? statsData : []);

      const cData = catRes.data.results || catRes.data;
      setCategories(Array.isArray(cData) ? cData : []);

      if (cData.length > 0 && !formData.category) {
        setFormData((prev) => ({ ...prev, category: cData[0].id }));
      }
    } catch (error) {
      toast.error("Failed to sync with backend");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(currentPage);
  }, [currentPage, searchTerm, stockFilter]);

  // --- STATS LOGIC ---
  const stats = {
    total: statsProducts.length,
    outOfStock: statsProducts.filter((p) => parseInt(p.stock, 10) === 0).length,
    men: statsProducts.filter((p) => p.category_name?.toLowerCase() === "men").length,
    women: statsProducts.filter((p) => p.category_name?.toLowerCase() === "women").length,
    unisex: statsProducts.filter((p) => p.category_name?.toLowerCase() === "unisex").length,
  };
  const currentProducts = products;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      price: parseFloat(formData.price).toFixed(2),
      stock: parseInt(formData.stock, 10),
      category: parseInt(formData.category, 10),
    };

    try {
      const config = { withCredentials: true };
      if (editProduct) {
        await axios.patch(`${API_PRODUCTS}${editProduct.id}/`, payload, config);
        toast.success("Updated Successfully!");
      } else {
        await axios.post(API_PRODUCTS, payload, config);
        toast.success("Product Created!");
      }
      setShowModal(false);
      loadData(currentPage);
    } catch (err) {
      toast.error("Operation failed.");
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Permanently delete ${name}?`)) {
      try {
        await axios.delete(`${API_PRODUCTS}${id}/`, { withCredentials: true });
        toast.success("Deleted");
        loadData(currentPage);
      } catch (err) {
        toast.error("Delete failed");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header Area */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-600">Manage your store inventory and categories</p>
        </div>
        <button
          onClick={() => {
            setEditProduct(null);
            setFormData({
              name: "",
              price: "",
              stock: "",
              category: categories[0]?.id || "",
              description: "",
              image: "",
            });
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition shadow-sm"
        >
          <Plus size={20} /> Add Product
        </button>
      </div>

      {/* Stats Grid - Matching User Management Style */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <StatCard title="Total Products" value={stats.total} icon={<Package className="text-blue-600" />} />
        <StatCard title="Out of Stock" value={stats.outOfStock} icon={<AlertTriangle className="text-red-600" />} />
        <StatCard title="Men's" value={stats.men} icon={<Users className="text-indigo-600" />} />
        <StatCard title="Women's" value={stats.women} icon={<Users className="text-pink-600" />} />
        <StatCard title="Unisex" value={stats.unisex} icon={<Users className="text-teal-600" />} />
      </div>

      {/* Search and Filters - Matching User Management Style */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6 flex flex-col md:row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products by name..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <select
          className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
          value={stockFilter}
          onChange={(e) => {
            setStockFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="all">All Inventory</option>
          <option value="low">Low Stock (&lt; 10)</option>
          <option value="out">Out of Stock</option>
        </select>
      </div>

      {/* Table - Matching User Management Style */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded bg-blue-100 flex items-center justify-center mr-3">
                        <ShoppingBag className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="bg-gray-100 text-gray-800 px-2.5 py-0.5 rounded-full text-xs font-medium uppercase">
                      {product.category_name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600">
                    ₹{product.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          product.stock === 0 ? "bg-red-500" : product.stock < 10 ? "bg-orange-500" : "bg-green-500"
                        }`}
                      ></span>
                      <span className="text-sm text-gray-900 font-medium">{product.stock} Units</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditProduct(product);
                          setFormData({ ...product, category: product.category });
                          setShowModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 p-1"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        className="text-red-600 hover:text-red-900 p-1"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination - Matching Style */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center bg-white p-4 rounded-lg border border-gray-200">
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

      {/* Modal - Matching Admin Layout */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {editProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input
                    required
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg outline-none h-24 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition"
              >
                {editProduct ? "Update Product" : "Create Product"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Stats Card Sub-component - Matched to User Management UI
function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
      </div>
    </div>
  );
}

export default AdminProducts;
