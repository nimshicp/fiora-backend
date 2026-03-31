import React from "react";
import "./App.css";
import Home from "./pages/Home";
import {
  createBrowserRouter,
  Route,
  RouterProvider,
  Routes,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Footer from "./components/Footer";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Wishlist from "./pages/WishList";
import CheckOut from "./pages/CheckOut";
import PaymentPage from "./pages/PaymentPage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import OrderConfirmation from "./pages/OrderConfirmation";
import OrderHistory from "./pages/OrderHistory";
import Profile from "./pages/Profile";
import ScrollToTop from "./components/ScrollToTop";
import AdminLayout from "./Admin/AdminLayout";
import AdminDashboard from "./Admin/AdminDashboard";
import AdminProducts from "./Admin/AdminProducts";
import AdminOrders from "./Admin/AdminOrders";
import AdminUsers from "./Admin/AdminUsers";
import AdminRoute from "./Admin/AdminRoute";
import { useUser } from "./context/UserContext";
import { useOrder } from "./context/OrderContext";
import useNotifications from "./hooks/useNotifications";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {
  const location = useLocation();
  const { user } = useUser();
  const { fetchOrders } = useOrder();

  useNotifications(user?.id, fetchOrders);

  
  const hideNavbarFooter =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname.startsWith("/dashboard");
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
    

      {!hideNavbarFooter && <Navbar />}
    

      <div className="flex-grow">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/checkout" element={<CheckOut />} />
          <Route path="/payment/:orderId" element={<PaymentPage />} />
          

<Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
          <Route
            path="/order-confirmation/:orderId"
            element={<OrderConfirmation />}
          />
          <Route path="/orders" element={<OrderHistory />} />

          <Route
            path="/dashboard/*"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>
        </Routes>
      </div>
      {!hideNavbarFooter && <Footer />}
    </div>
  );
}

export default App;
