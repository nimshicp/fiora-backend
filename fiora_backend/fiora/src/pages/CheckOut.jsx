import React, { useState } from "react";
import { useOrder } from "../context/OrderContext";
import { useShop } from "../context/ShopContext";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function CheckOut() {
  const { createOrder } = useOrder();
  const { cart, cartTotal } = useShop();
  const { user } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.phone) {
      newErrors.phone = "Phone is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone must be 10 digits";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.pinCode) {
      newErrors.pinCode = "Pincode is required";
    } else if (!/^\d{6}$/.test(formData.pinCode)) {
      newErrors.pinCode = "Pincode must be 6 digits";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    address: "",
    city: "",
    pinCode: "",
    phone: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const order = await createOrder(formData, cart, cartTotal);

      if (order) {
        toast.success("Continue to payment");
        navigate(`/payment/${order.id}`);
      }
    } catch {
      toast.error("Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Your cart is empty
          </h2>
          <p>Add some items to proceed to checkout</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <h3 className="text-lg font-semibold mb-4">
                Shipping Information
              </h3>

              <div className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  required
                />{errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}



                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  required
                />{errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

                <input
                  type="text"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ""); // only numbers
                    setFormData({ ...formData, phone: value });
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  required
                />{errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}

                <input
                  type="text"
                  name="address"
                  placeholder="Street Address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  required
                />{errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="p-3 border border-gray-300 rounded-lg"
                    required
                  />{errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}

                  <input
                    type="text"
                    name="pinCode"
                    placeholder="pincode"
                    value={formData.pinCode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      setFormData({ ...formData, pinCode: value });
                    }}
                    className="p-3 border border-gray-300 rounded-lg"
                    required
                  />{errors.pinCode && <p className="text-red-500 text-sm">{errors.pinCode}</p>}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 disabled:opacity-50"
              >
                {loading
                  ? "Creating Order..."
                  : `Continue to Payment - ${cartTotal.toFixed(2)}`}
              </button>
            </form>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 h-fit">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.product?.image}
                      alt={item.product?.name}
                      className="w-12 h-12 object-cover rounded"
                    />

                    <div>
                      <p className="font-medium">{item.product?.name}</p>
                      <p className="text-gray-600">Qty: {item.quantity}</p>
                    </div>
                  </div>

                  <p className="font-semibold">
                    ₹{(item.product?.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}

              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckOut;
